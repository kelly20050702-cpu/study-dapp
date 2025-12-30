import { ethers } from "ethers";

// 1. 貼上你在 Remix 複製的合約地址
const CONTRACT_ADDRESS = "0x2643641447FAE2f5617d535a75A06aF3a65e88Ef"; 

// 2. 貼上你在 Remix 複製的 ABI (這是一個 JSON 陣列)
const CONTRACT_ABI = [
  "function checkIn(uint256 taskId, string memory tokenURI) public",
  "function hasCompleted(address student, uint256 taskId) public view returns (bool)"
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("請先安裝 MetaMask");

  // A. 連接瀏覽器內的錢包
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // B. 取得簽署者 (當前登入的帳號)
  const signer = await provider.getSigner();
  
  // C. 初始化合約實例
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};