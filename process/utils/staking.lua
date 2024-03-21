Stakers = Stakers or {}
local bint = require('.bint')(256)

-- Stake Action Handler
Handlers.stake = function(msg)
  local quantity = bint(msg.Tags.Quantity)
  assert(Balances[msg.From] and bint(Balances[msg.From]) >= quantity, "Insufficient balance to stake")
  Balances[msg.From] = tostring(bint(Balances[msg.From]) - quantity)
  Stakers[msg.From] = Stakers[msg.From] or {}
  Stakers[msg.From].amount = tostring(bint(Stakers[msg.From].amount or "0") + quantity)
  ao.send({Target = msg.From, Data = "Successfully Staked " .. msg.Quantity})
end

-- Unstake Action Handler
Handlers.unstake = function(msg)
  local quantity = bint(msg.Quantity)
  local stakerInfo = Stakers[msg.From]
  assert(stakerInfo and bint(stakerInfo.amount) >= quantity, "Insufficient staked amount")
  stakerInfo.amount = tostring(bint(stakerInfo.amount) - quantity)
  Balances[msg.From] = tostring(bint(Balances[msg.From] or "0") + quantity)
  ao.send({Target = msg.From, Data = "Successfully unstaked " .. msg.Quantity})
end

-- wrap function to continue handler flow
local function continue(fn)
  return function (msg)
    local result = fn(msg)
    if (result) == -1 then
      return "continue"
    end
    return result
  end
end

-- Registering Handlers
Handlers.add("stake",
  continue(Handlers.utils.hasMatchingTag("Action", "Stake")), Handlers.stake)
Handlers.add("unstake",
  continue(Handlers.utils.hasMatchingTag("Action", "Unstake")), Handlers.unstake)