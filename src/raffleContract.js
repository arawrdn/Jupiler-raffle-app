import { ethers } from "ethers";

export const JupilerRaffleABI = [
  "function enterRaffle()",
  "function pickWinner()",
  "function fundRaffle() payable",
  "function getPlayers() view returns (address[])"
];

export const raffleAddress = "0x2A6b5204B83C7619c90c4EB6b5365AA0b7d912F7"; // Ganti dengan alamat kontrak

