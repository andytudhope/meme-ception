import { useEffect, useState } from 'react';
import { dryrun } from "@permaweb/aoconnect";

import Footer from './Footer';

const MEME = "uoUzWqDrlqmoNCxR2ul-OXm7idb1tghYst3HVIT3L8U"
const INITIAL_FRAME = "J_6eJSA-NZ8BnmdZVtb3vTTd1_LDVBi4_c4grV7mWGc"

function Home () {
    const [iframeSrc, setIframeSrc] = useState(`https://arweave.net/${INITIAL_FRAME}`);

    useEffect(() => {
        const getWebsite = async () => {
          try {
            const result = await dryrun({
              process: MEME,
              tags: [{ name: 'Action', value: "Get-Frame" }]
            });
            if (result) {
              return result.Messages[0].Data;
            } else {
              console.log("Got no response from dryrun!")
              return INITIAL_FRAME
            }
          } catch (e) {
            console.log(e);
          }
        };
    
        const setupIframe = async () => {
          const processResponse = await getWebsite();
          const url = `https://arweave.net/${processResponse}`;
          setIframeSrc(url);
        };
    
        setupIframe();
      }, []);
    return (
        <div>
            <div>
                <iframe title="Meme-Ception" className="w-full h-screen" src={iframeSrc} />
            </div>
            <Footer />
        </div>
	);
}

export default Home;
