import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dryrun, message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect'

import Footer from './Footer';

const MEME = "-a4T7XLMDGTcu8_preKXdUT6__4sJkMhYLEJZkXUYd0"
const CRED = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc"

const permissions: PermissionType[] = [
  'ACCESS_ADDRESS',
  'SIGNATURE',
  'SIGN_TRANSACTION',
  'DISPATCH'
]

interface Tag {
    name: string;
    value: string;
}

function Meme() {
    const [address, setAddress] = useState('')
    const [memeBalance, setMemeBalance] = useState(0)
    const [credBalance, setCredBalance] = useState(0)
    const [credValue, setCredValue] = useState('')
    const [stakeValue, setStakeValue] = useState('')
    const [swapSuccess, setSwapSuccess] = useState(false)
    const [stakeSuccess, setStakeSuccess] = useState(false)
    const [staker, setStaker] = useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "stake":
                setStakeValue(value);
                break;
            case "swap":
                setCredValue(value);
                break;
            default:
                break;
        }
    };

    const fetchAddress =  async () => {
        await window.arweaveWallet.connect(
            permissions,
            {
                name: "MEME-CEPTION",
                logo: "OVJ2EyD3dKFctzANd0KX_PCgg8IQvk0zYqkWIj-aeaU"
            }
        )
        try {
            const address = await window.arweaveWallet.getActiveAddress()
            setAddress(address)
        } catch(error) {
            console.error(error)
        }
    }

    const swap = async () => {
        var value = parseInt(credValue)
        var units = value * 1000
        var credUnits = units.toString()
        try {
            const getSwapMessage = await message({
                process: CRED,
                tags: [
                    { name: 'Action', value: 'Transfer' },
                    { name: 'Recipient', value: MEME },
                    { name: 'Quantity', value: credUnits }
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            try {
                let { Messages, Error } = await result({
                    message: getSwapMessage,
                    process: CRED,
                });
                if (Error) {
                    alert("Error handling swap:" + Error);
                    return;
                }
                if (!Messages || Messages.length === 0) {
                    alert("No messages were returned from ao. Please try later.");
                    return; 
                }
                const actionTag = Messages[0].Tags.find((tag: Tag) => tag.name === 'Action')
                if (actionTag.value === "Debit-Notice") {
                    setSwapSuccess(true)
                }
            } catch (error) {
                alert("There was an error when swapping CRED for MEME: " + error)
            }
        } catch (error) {
            alert('There was an error swapping: ' + error)
        }
    }

    const stake = async () => {
        var value = parseInt(stakeValue)
        var units = value * 1000
        var memeUnits = units.toString()
        try {
            const getStakeMessage = await message({
                process: MEME,
                tags: [
                    { name: 'Action', value: 'Stake' },
                    { name: 'Quantity', value: memeUnits },
                    { name: 'UnstakeDelay', value: '1000' },
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            try {
                let { Messages, Error } = await result({
                    message: getStakeMessage,
                    process: MEME,
                });
                if (Error) {
                    alert("Error handling staking:" + Error);
                    return;
                }
                if (!Messages || Messages.length === 0) {
                    alert("No messages were returned from ao. Please try later.");
                    return; 
                }
                setStakeSuccess(true)
            } catch (error) {
                alert("There was an error when staking MEME: " + error)
            }
        } catch (error) {
            alert('There was an error staking: ' + error)
        }
    }

    useEffect(() => {
        const fetchBalance = async (process: string) => {
            if (address) {
                try {
                    if (process === MEME) {
                        const messageResponse = await dryrun({
                            process,
                            tags: [
                                { name: 'Action', value: 'Balance' },
                                { name: 'Recipient', value: address },
                            ],
                        });
                        const balanceTag = messageResponse.Messages[0].Tags.find((tag: Tag) => tag.name === 'Balance')
                        const balance = balanceTag ? parseFloat((balanceTag.value / 1000).toFixed(4)) : 0;
                        setMemeBalance(balance)
                    } else {
                        const messageResponse = await dryrun({
                            process,
                            tags: [
                                { name: 'Action', value: 'Balance' },
                                { name: 'Target', value: address },
                            ],
                        });
                        const balanceTag = messageResponse.Messages[0].Tags.find((tag: Tag) => tag.name === 'Balance')
                        const balance = balanceTag ? parseFloat((balanceTag.value / 1000).toFixed(4)) : 0;
                        setCredBalance(balance)
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };

        const fetchStakers = async () => {
            if (address) {
                try {
                    const messageResponse = await dryrun({
                        process: MEME,
                        tags: [
                            { name: 'Action', value: 'Get-Stakers' },
                        ],
                    });
                    const stakers = JSON.parse(messageResponse.Messages[0].Data)
                    const stakerAddresses = Object.keys(stakers)
                    const isStaker = stakerAddresses.includes(address)
                    if (isStaker) {
                        setStaker(true)
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        fetchBalance(MEME)
        fetchBalance(CRED)
        fetchStakers()
    }, [address, swapSuccess])

	return (
        <div>
            <div className='md:w-1/3 h-[450px] my-20 md:my-40 mx-8 md:mx-auto border border-gray rounded'>
                {address ?
                    (
                        <div>
                            <p className='text-center mt-4'>
                                Address: <span className='font-bold'>{`${address.slice(0, 5)}...${address.slice(-3)}`}</span>
                            </p>
                            <div className='grid grid-cols-2 gap-2 my-8'>
                                <div className='border-r border-black'>
                                    <p className='text-lg text-center'>
                                        CRED: <span className='font-bold'>{credBalance}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className='text-lg text-center'>
                                        MEME: <span className='font-bold'>{memeBalance}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) :
                    (
                        <p className='text-center mt-44'>
                            <button onClick={fetchAddress} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                Connect 
                            </button>
                        </p>
                    )
                }
                { address && credBalance > 0 ? 
                    (
                        <div>
                            <div className="flex flex-col space-y-2 items-center justify-center mt-8">
                            <input
                                type="text"
                                name="swap"
                                placeholder="Enter value of CRED to swap"
                                value={credValue}
                                onChange={handleInputChange}
                                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                className="py-2 px-4 bg-black text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                onClick={swap}
                            >
                                Swap
                            </button>
                            </div>
                        </div>
                    ) : 
                    (
                        <div></div>
                    )
                }
                {address && credBalance === 0 ? 
                    (
                        <div>
                            <p className='text-sm text-center'>Get CRED by completing <a href="https://cookbook_ao.g8way.io/tutorials/begin/index.html" target="_blank" rel="noopener noreferrer" className='font-bold underline'>quests on ao</a>.</p>
                        </div>
                    ) :
                    (
                        <div></div>
                    )
                }
                { swapSuccess || memeBalance > 0 ?
                    (
                        <div>
                            <div className="flex flex-col space-y-2 items-center justify-center mt-8">
                            <input
                                type="text"
                                name="stake"
                                placeholder="Enter value of MEME to stake"
                                value={stakeValue}
                                onChange={handleInputChange}
                                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                className="py-2 px-4 bg-black text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                onClick={stake}
                            >
                                Stake MEME
                            </button>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div></div>
                    )  
                }
                { stakeSuccess ? <div><p className='text-sm text-center my-2'>You have staked MEME successfully. Please visit the <Link className='font-bold underline' to={"/vote/"}>vote page</Link> to cast votes on different memeframes!</p></div> : <div></div>}
                { staker ? <p className='text-sm text-center my-2'>You are already staking!<br/>Please visit the <Link className='font-bold underline' to={"/vote/"}>vote page</Link> to cast your vote.</p> : <div></div>}
            </div>
            <Footer />
        </div>
		
	);
}

export default Meme;
