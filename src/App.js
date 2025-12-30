import { useState } from "react";
import { getContract } from "./contractHelper"; // 這是引用同資料夾下的檔案
import "./App.css"; 

function App() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // 連接錢包函式 (照舊)
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
    }
  };

  // 打卡函式 (照舊)
  const handleCheckIn = async (taskId) => {
    setLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.checkIn(taskId, "Achievement");
      await tx.wait();
      alert("成功！");
    } catch (e) { alert("失敗"); }
    setLoading(false);
  };

  return (
    <div className="App" style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      <h1>去中心化學習打卡</h1>
      <button onClick={connectWallet}>{address ? "已連線" : "連接錢包"}</button>
      <button onClick={() => handleCheckIn(1)}>任務 1 打卡</button>
    </div>
  );
}
export default App;