import { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers'

import NFT from "./NFT.json"

const NFTAddress = "0x24135Bc62fDfB8d4c084c1755A892Cb65A26f98B"
const WalletAddress = "0xAD00C05940c158b42c9033209837C18266fFd8DD"

function App() {
  const [images, setImages] = useState([])

  useEffect(() => {
    setImages([]);
    getNFTImages();
  }, [])

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleMint = async () => {
    if (typeof window.ethereum !== 'undefined') {
      requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      console.log(provider, signer)
      const contract = new ethers.Contract(NFTAddress, NFT.abi, signer)

      try {
        await contract.mintTo(WalletAddress, {
          value: ethers.utils.parseEther('0.001')
        });
        setImages([]);
        getNFTImages();
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function getNFTImages() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(NFTAddress, NFT.abi, provider)
      try {
        const count = await contract.getTokenCounts();

        for(let i = 0 ; i < parseInt(count); i++ ) {
          fetch(await contract.tokenURI(parseInt(i) + 1))
            .then((res) => res.json())
            .then((results) => {
              setImages((images) => [...images, results])
            })
        }
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  return (
    <div className="App">
      <button className="button" onClick={handleMint}>MINT</button>
      <div className="grid-container">
        {images.map((image, index) => <div key={index} className="d-flex justify-content-center">
          <span>
          <img src={image.image} alt={image.name} width="500"></img>
          <p>{image.description}</p>
          </span>
        </div>)}
      </div>
    </div>
  );
}

export default App;
