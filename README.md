# The Dream Meme Team

![I Dreamed a dream](dream-team.png)

MemeFrames are permaweb pages with a DAO _inside_. It's kinda like Intel, except much cooler.

## Meme-ception

It's all a meme-within-a-meme. A meta-meme. 

![Meta Meme](meta-meme.jpeg)

## How to use this

1. Get `aos` with 
2. Run `aos` by simply typing `aos` in your terminal.
3. Store our community MemeFrame in your process' memory:

```lua
MEMEFRAME = "-a4T7XLMDGTcu8_preKXdUT6__4sJkMhYLEJZkXUYd0"
```

4. Get some CRED by completing [Quests on `ao`](https://cookbook_ao.g8way.io/tutorials/begin/index.html).
5. Send your CRED to us :)

```lua
Send({Target = CRED, Action = "Transfer", Quantity = "1000", Recipient = MEMEFRAME})
```

6. Stake the MEME tokens you receive when you send us CRED.

```lua
Send({Target = MEMEFRAME, Action = "Stake", Quantity = "1000", UnstakeDelay = "1000" })
```

7. Vote to change the frame

```lua
Send({ Target = MEMEFRAME, Action = "Vote", Side = "yay", TXID="..." })
```

## Join the community

You can find us chatting in super-shadowy, meme-lords only chats somewhere in `ao`. In order to do so:

1. Copy the [chat.lua file](/process/chat.lua) into the same directory you're running `aos` from.
2. Launch `aos`.
3. Run `.load chat.lua` in your interactive console and follow the instructions to find us.

## Run locally

1. Get the code:
```bash
git clone git@github.com:andytudhope/meme-ception.git
```
or
```bash
git clone https://github.com/andytudhope/meme-ception.git
```

2. Install dependencies (using node v20 or above):
```bash
npm i
```

3. Run the app:
```bash
npm run start
```

4. If you'd like to build your version and upload it to Arweave:
```bash
npm run build
```

5. I use an archived version of `arweave deploy`, it's prob better to use Irys etc.
```bash
arweave deploy-dir build/ --key-file <path_to_keyfile>
```
