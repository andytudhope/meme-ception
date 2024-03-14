# The Dream Meme Team

![I Dreamed a dream](dream-team.png)

MemeFrames are permaweb pages with a DAO _inside_. It's kinda like Intel, except much cooler.

## Meme-ception

This particular implementation begins with a meme-within-a-meme. A meta-meme. 

![Meta Meme](meta-meme.jpeg)

Andy created a different way to stake/vote with your CRED on what code actually gets run within the community DAO/token process itself, rather than just what appears on a website. The website which explains that work and how to add code a level deeper into the `ao` matrix is the first MemeFrame here. 

The first proposal which, at the time of writing, has 1000 votes in favour, is for a page of a poetry book stored permanently on Arweave.

Contribute to our DAO by forking this repo and running it yourself, or simply by hyping up Meme-ception across all available channels. 

## Staking and voting

1. Get `aos` with 
2. Run `aos` by simply typing `aos` in your terminal.
3. Store our community MemeFrame in your process' memory:

```lua
MEMEFRAME = "uoUzWqDrlqmoNCxR2ul-OXm7idb1tghYst3HVIT3L8U"
```

4. Get some CRED by completing [Quests on `ao`](https://cookbook_ao.g8way.io/tutorials/begin/index.html).
5. Send your CRED to us :)

```lua
Send({Target = CRED, Action = "Transfer", Quantity = "1000", Recipient = MEMEFRAME})
```

6. Stake the MEME tokesn you receive when you send us CRED.

```lua
Send({Target = MEMEFRAME, Action = "Stake", Quantity = "1000", UnstakeDelay = "1000" })
```

7. Vote to change the frame

```lua
Send({ Target = MEMEFRAME, Action = "Vote", Side = "yay", TXID="..." })
```

## Need Help

[Support channel in AO Discord](https://discord.gg/J6kQXpdPG3)
[Cookbook](https://cookbook_ao.g8way.io)
