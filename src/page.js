"use client";
import { useState, useEffect } from "react";
import { getContract } from "./contractHelper"; // 確保 contractHelper.js 也在 src/app/ 資料夾下

export default function Home() {
  const [address, setAddress] = useState(""); // 儲存錢包地址
  const [loading, setLoading] = useState(false); // 處理按鈕讀取狀態

  // 1. 連接錢包的函式
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
      } catch (error) {
        console.error("連接取消", error);
      }
    } else {
      alert("請先安裝 MetaMask！");
    }
  };

  // 2. 核心打卡邏輯
  const handleCheckIn = async (taskId) => {
    if (!address) {
      alert("請先連接錢包！");
      return;
    }

    setLoading(true);
    try {
      const contract = await getContract();
      
      // 呼叫合約的 checkIn 函式
      // 參數 1: 任務 ID
      // 參數 2: 證明的內容（這裡我們簡單寫成 Achievement 訊息）
      const tx = await contract.checkIn(taskId, `Achievement for Task ${taskId}`);
      
      console.log("交易已送出，Hash:", tx.hash);
      
      // 等待區塊鏈確認交易
      await tx.wait(); 
      
      alert(`🎉 恭喜！任務 ${taskId} 打卡成功，紀錄已上鏈！`);
    } catch (error) {
      console.error("呼叫失敗:", error);
      // 處理合約中 require 的報錯訊息
      if (error.reason && error.reason.includes("Task already completed")) {
        alert("這項任務你已經打過卡囉，不能重複領取！");
      } else {
        alert("交易失敗，請檢查 Sepolia 測試幣是否足夠或連線是否正常。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10 font-sans">
      {/* 標題區域 */}
      <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        去中心化學習任務打卡
      </h1>
      <p className="text-gray-400 mb-10">基於 Ethereum Sepolia 測試網的學習證明系統</p>

      {/* 錢包連接區域 */}
      <div className="mb-12">
        {!address ? (
          <button 
            onClick={connectWallet}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30"
          >
            連接 MetaMask 錢包
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">已連線錢包地址</p>
            <p className="text-green-400 font-mono bg-gray-800 px-6 py-2 rounded-full border border-gray-700 shadow-inner">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        )}
      </div>

      {/* 任務卡片區域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {[1, 2].map((id) => (
          <div key={id} className="bg-gray-800 p-8 rounded-3xl border border-gray-700 hover:border-blue-500/50 transition-all shadow-xl group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">任務 #{id}</h3>
              <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">NFT 獎勵</span>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed">
              完成本階段學習並提交證明，系統將自動在區塊鏈上標記您的進度。
            </p>
            
            <button 
              onClick={() => handleCheckIn(id)}
              disabled={loading || !address}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                loading 
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/20 active:scale-95"
              } ${!address && "opacity-40 cursor-not-allowed"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中...
                </span>
              ) : "提交打卡"}
            </button>
          </div>
        ))}
      </div>

      {/* 頁尾提示 */}
      <footer className="mt-20 text-gray-600 text-sm">
        請確保您的 MetaMask 已切換至 Sepolia 網路
      </footer>
    </main>
  );
}