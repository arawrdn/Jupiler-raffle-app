import React, { useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ReownAppKitProvider } from "@reown/appkit";
import { raffleAddress, JupilerRaffleABI } from "./raffleContract";

function App() {
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [players, setPlayers] = useState([]);

  const connectWallet = async () => {
    const provider = new WalletConnectProvider({
      rpc: { 8453: "https://base-mainnet.rpc.url" }
    });
    await provider.enable();

    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    setSigner(signer);
    setWalletAddress(address);
  };

  const enterRaffle = async () => {
    if (!signer) return alert("Connect wallet first");
    const raffle = new ethers.Contract(raffleAddress, JupilerRaffleABI, signer);
    try {
      const tx = await raffle.enterRaffle();
      await tx.wait();
      alert("Entered raffle!");
      getPlayers();
    } catch (err) {
      alert(err.reason || "Raffle full (max 15 pemain)");
    }
  };

  const fundRaffle = async () => {
    if (!signer) return alert("Connect wallet first");
    const raffle = new ethers.Contract(raffleAddress, JupilerRaffleABI, signer);
    const amount = prompt("Enter fund amount in ETH (small, e.g., 0.00001)");
    if (!amount) return;
    const tx = await raffle.fundRaffle({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert("Funded raffle!");
  };

  const pickWinner = async () => {
    if (!signer) return alert("Connect wallet first");
    const raffle = new ethers.Contract(raffleAddress, JupilerRaffleABI, signer);
    const tx = await raffle.pickWinner();
    await tx.wait();
    alert("Winner picked!");
    getPlayers();
  };

  const getPlayers = async () => {
    if (!signer) return;
    const raffle = new ethers.Contract(raffleAddress, JupilerRaffleABI, signer);
    const list = await raffle.getPlayers();
    setPlayers(list);
  };

  return (
    <ReownAppKitProvider>
      <div style={{ padding: 30 }}>
        <h1>JupilerRaffle</h1>
        {walletAddress ? (
          <p>Connected: {walletAddress}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}

        <div style={{ margin: "20px 0" }}>
          <button onClick={enterRaffle} style={{ marginRight: 10 }}>
            Enter Raffle (Gratis)
          </button>
          <button onClick={fundRaffle} style={{ marginRight: 10 }}>
            Fund Raffle (Owner)
          </button>
          <button onClick={pickWinner}>Pick Winner (Owner)</button>
        </div>

        <h3>Players ({players.length}/15):</h3>
        <ul>
          {players.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </ReownAppKitProvider>
  );
}

export default App;
