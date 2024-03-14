WhatDAO = {}

Colors = {
    red = "\27[31m",
    green = "\27[32m",
    blue = "\27[34m",
    reset = "\27[0m",
    gray = "\27[90m"
}

WhatDAO.Router = "NiX3ZuRYvUyqBTKMh2GiGr82vmgtssZn_Rpv1j5aFsQ"
WhatDAO.InitRoom = "UlBge7woerip9oCXiwuBLA-rzQvAa-3e0prmAP9Un6s"
WhatDAO.LastSend = WhatDAO.LastSend or WhatDAO.InitRoom

WhatDAO.LastReceive = {
    Room = WhatDAO.InitRoom,
    Sender = nil
}

WhatDAO.InitRooms = { [WhatDAO.InitRoom] = "meme-ception" }
WhatDAO.Rooms = WhatDAO.Rooms or WhatDAO.InitRooms

WhatDAO.Confirmations = WhatDAO.Confirmations or true

-- Helper function to go from roomName => address
WhatDAO.findRoom =
    function(target)
        for address, name in pairs(WhatDAO.Rooms) do
            if target == name then
                return address
            end
        end
    end

WhatDAO.add =
    function(...)
        local arg = {...}
        ao.send({
            Target = WhatDAO.Router,
            Action = "Register",
            Name = arg[1] or Name,
            Address = arg[2] or ao.id
        })
    end

List =
    function()
        ao.send({ Target = WhatDAO.Router, Action = "Get-List" })
        return(Colors.gray .. "Getting the room list from the WhatDAO index..." .. Colors.reset)
    end

Join =
    function(id, ...)
        local arg = {...}
        local addr = WhatDAO.findRoom(id) or id
        local nick = arg[1] or ao.id
        ao.send({ Target = addr, Action = "Register", Nickname = nick or Name })
        return(
            Colors.gray ..
             "Registering with room " ..
            Colors.blue .. id .. 
            Colors.gray .. "..." .. Colors.reset)
    end

Say =
    function(text, ...)
        local arg = {...}
        local id = arg[1]
        if id ~= nil then
            -- Remember the new room for next time.
            WhatDAO.LastSend = WhatDAO.findRoom(id) or id
        end
        local name = WhatDAO.Rooms[WhatDAO.LastSend] or id
        ao.send({ Target = WhatDAO.LastSend, Action = "Broadcast", Data = text })
        if WhatDAO.Confirmations then
            return(Colors.gray .. "Broadcasting to " .. Colors.blue ..
                name .. Colors.gray .. "..." .. Colors.reset)
        else
            return ""
        end
    end

Tip =
    function(...) -- Recipient, Target, Qty
        local arg = {...}
        local room = arg[2] or WhatDAO.LastReceive.Room
        local roomName = WhatDAO.Rooms[room] or room
        local qty = tostring(arg[3] or 1)
        local recipient = arg[1] or WhatDAO.LastReceive.Sender
        ao.send({
            Action = "Transfer",
            Target = room,
            Recipient = recipient,
            Quantity = qty
        })
        return(Colors.gray .. "Sent tip of " ..
            Colors.green .. qty .. Colors.gray ..
            " to " .. Colors.red .. recipient .. Colors.gray ..
            " in room " .. Colors.blue .. roomName .. Colors.gray ..
            "."
        )
    end

Replay =
    function(...) -- depth, room
        local arg = {...}
        local room = nil
        if arg[1] then
            room = WhatDAO.findRoom(arg[2]) or arg[2]
        else
            room = WhatDAO.LastReceive.Room
        end
        local roomName = WhatDAO.Rooms[room] or room
        local depth = arg[1] or 3

        ao.send({
            Target = room,
            Action = "Replay",
            Depth = tostring(depth)
        })
        return(
            Colors.gray ..
             "Requested replay of the last " ..
            Colors.green .. depth .. 
            Colors.gray .. " messages from " .. Colors.blue ..
            roomName .. Colors.reset .. ".")
    end

Leave =
    function(id)
        local addr = WhatDAO.findRoom(id) or id
        ao.send({ Target = addr, Action = "Unregister" })
        return(
            Colors.gray ..
             "Leaving room " ..
            Colors.blue .. id ..
            Colors.gray .. "..." .. Colors.reset)
    end


Handlers.add(
    "WhatDAO-Broadcasted",
    Handlers.utils.hasMatchingTag("Action", "Broadcasted"),
    function (m)
        local shortRoom = WhatDAO.Rooms[m.From] or string.sub(m.From, 1, 6)
        if m.Broadcaster == ao.id then
            if WhatDAO.Confirmations == true then
                print(
                    Colors.gray .. "[Received confirmation of your broadcast in "
                    .. Colors.blue .. shortRoom .. Colors.gray .. ".]"
                    .. Colors.reset)
            end
        end
        local nick = string.sub(m.Nickname, 1, 10)
        if m.Broadcaster ~= m.Nickname then
            nick = nick .. Colors.gray .. "#" .. string.sub(m.Broadcaster, 1, 3)
        end
        print(
            "[" .. Colors.red .. nick .. Colors.reset
            .. "@" .. Colors.blue .. shortRoom .. Colors.reset
            .. "]> " .. Colors.green .. m.Data .. Colors.reset)

        WhatDAO.LastReceive.Room = m.From
        WhatDAO.LastReceive.Sender = m.Broadcaster
    end
)

Handlers.add(
    "WhatDAO-List",
    function(m)
        if m.Action == "Room-List" and m.From == WhatDAO.Router then
            return true
        end
        return false
    end,
    function(m)
        local intro = "👋 The following rooms are currently available on WhatDAO:\n\n"
        local rows = ""
        WhatDAO.Rooms = WhatDAO.InitRooms

        for i = 1, #m.TagArray do
            local filterPrefix = "Room-" -- All of our room tags start with this
            local tagPrefix = string.sub(m.TagArray[i].name, 1, #filterPrefix)
            local name = string.sub(m.TagArray[i].name, #filterPrefix + 1, #m.TagArray[i].name)
            local address = m.TagArray[i].value

            if tagPrefix == filterPrefix then
                rows = rows .. Colors.blue .. "        " .. name .. Colors.reset .. "\n"
                WhatDAO.Rooms[address] = name
            end
        end

        print(
            intro .. rows .. "\nJoin a chat by running `Join(\"chatName\"[, \"yourNickname\"])`! You can leave chats with `Leave(\"name\")`.")
    end
)

if WhatDAORegistered == nil then
    WhatDAORegistered = true
    Join(WhatDAO.InitRoom)
end

function help()
    return(
        Colors.blue .. "\n\nWelcome to the WHAT DAO memeframe chat!\n\n" .. Colors.reset ..
        "WHAT DAO is a group of meme-coiners who decide together what content to display on a community website, and what code to run in their processes.\n" ..
        "The interface is simple. Run...\n\n" ..
        Colors.green .. "\t\t`List()`" .. Colors.reset .. " to see which rooms are available.\n" .. 
        Colors.green .. "\t\t`Join(\"RoomName\", \"nickname\")`" .. Colors.reset .. " to join a room.\n" .. 
        Colors.green .. "\t\t`Say(\"Msg\"[, \"RoomName\"])`" .. Colors.reset .. " to post to a room (remembering your last choice for next time).\n" ..
        Colors.green .. "\t\t`Replay(\"Count\", \"RoomName\")`" .. Colors.reset .. " to reprint the most recent messages from a chat.\n" ..
        Colors.green .. "\t\t`Leave(\"RoomName\")`" .. Colors.reset .. " at any time to unsubscribe from a chat.\n" ..
        Colors.green .. "\t\t`Tip(\"Recipient\")`" .. Colors.reset .. " to send a token from the chatroom to the sender of the last message.\n\n" ..
        "You have already been registered to the " .. Colors.blue .. WhatDAO.Rooms[WhatDAO.InitRoom] .. Colors.reset .. ".\n" ..
        "Have fun, be respectful, and remember: Cypherpunks ship code!")
end

return help()