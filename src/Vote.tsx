import { useEffect, useState } from 'react';
import { dryrun } from '@permaweb/aoconnect/browser';

import Footer from './Footer';

const MEME = "uoUzWqDrlqmoNCxR2ul-OXm7idb1tghYst3HVIT3L8U"

interface VoteItem {
    tx: string;
    yay: number;
    nay: number;
    deadline: number;
}

const Vote = () => {
    const [voteData, setVoteData] = useState<VoteItem[]>([]);

    const getVotes = async () => {
        try {
            const result = await dryrun({
                process: MEME,
                tags: [
                    { name: 'Action', value: "Get-Votes" }
                ]
            });
            console.log("Result: ", result)
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

    useEffect(() => {
        const fetchVotes = async () => {
            const votes = await getVotes();
            if (typeof votes !== 'string') { 
                setVoteData(votes);
            }
        };

        fetchVotes();
    }, []);

    return (
        <div>
            <div className='flex flex-wrap justify-center h-100 my-40'>
            {voteData.map((item, index) => (
                <div key={index} className='p-4 border border-gray rounded shadow-md max-w-md lg:max-w-xs sm:max-w-sm w-full md:w-1/2 lg:w-1/4 sm:w-full md:mr-2'>
                    <p className='text-2xl mb-4'>Candidate #{index}</p>
                    <a className='font-bold underline' href={`https://arweave.net/${item.tx}`} target="_blank" rel="noopener noreferrer">Memeframe URL</a>
                    <p className='mt-4'>Yay: {item.yay / 1000}, Nay: {item.nay / 1000}</p>
                    <p>Decided at block: {item.deadline}</p>
                </div>
            ))}
            </div>
            
            <Footer />
        </div>
    );
};

export default Vote;
  