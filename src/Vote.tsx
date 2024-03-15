import { useEffect, useState } from 'react';
import { dryrun, message, createDataItemSigner, result } from '@permaweb/aoconnect/browser';
import { PermissionType } from 'arconnect'

import Footer from './Footer';

const MEME = "-a4T7XLMDGTcu8_preKXdUT6__4sJkMhYLEJZkXUYd0"

const permissions: PermissionType[] = [
    'ACCESS_ADDRESS',
    'SIGNATURE',
    'SIGN_TRANSACTION',
    'DISPATCH'
  ]

interface VoteItem {
    tx: string;
    yay: number;
    nay: number;
    deadline: number;
}

const Vote = () => {
    const [address, setAddress] = useState('')
    const [voteData, setVoteData] = useState<VoteItem[]>([]);

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

    const getVotes = async () => {
        try {
            const result = await dryrun({
                process: MEME,
                tags: [
                    { name: 'Action', value: "Get-Votes" }
                ]
            });
            if (result && result.Messages[0]) {
                return JSON.parse(result.Messages[0].Data);
            } else {
                console.log("No readable data from dryrun!")
                return "";
            }
        } catch (e) {
            console.log(e);
            return "";
        }
    };

    const vote = async (id: string, side: string) => {
        console.log(id, side)
        try {
            const getVoteMessage = await message({
                process: MEME,
                tags: [
                    { name: 'Action', value: 'Vote' },
                    { name: 'Side', value: side.toString() },
                    { name: 'TXID', value: id.toString() },
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            try {
                let { Messages, Error } = await result({
                    message: getVoteMessage,
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
                alert("Vote successful!")
            } catch (e) {
                console.log(e)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const fetchVotes = async () => {
            const votes = await getVotes();
            if (typeof votes !== 'string') { 
                setVoteData(votes);
            }
        };

        fetchVotes();
    }, [address]);

    return (
        <div>
            <div className='flex flex-wrap justify-center h-100 my-40'>
            {voteData.map((item, index) => (
                <div key={index} className='p-4 border border-gray rounded shadow-md max-w-md lg:max-w-xs sm:max-w-sm w-full md:w-1/2 lg:w-1/4 sm:w-full md:mr-2'>
                    <p className='text-2xl mb-4'>Candidate #{index}</p>
                    <a className='font-bold underline' href={`https://arweave.net/${item.tx}`} target="_blank" rel="noopener noreferrer">Memeframe URL</a>
                    <p className='mt-4'>Yay: {item.yay / 1000}, Nay: {item.nay / 1000}</p>
                    <p>Decided at block: {item.deadline}</p>
                    {address ? 
                        (
                            <div className='text-center mt-4'>
                                <button onClick={() => vote(item.tx, "yay")} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4">
                                    Yes 
                                </button>
                                <button onClick={() => vote(item.tx, "nay")} className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
                                    No 
                                </button>
                                <p className='text-sm my-2'>Your vote is cast with all the MEME you currently have staked.</p>
                            </div>
                        ) :
                        (
                            <div>
                                <p className='text-center my-4'>
                                    <button onClick={fetchAddress} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                        Connect 
                                    </button>
                                </p>
                            </div>
                        )
                    }
                </div>
            ))}
            </div>
            
            <Footer />
        </div>
    );
};

export default Vote;
  