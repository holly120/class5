"use client";

import { useState, useEffect } from "react";

// 定義資料型別介面 (name 為學生名稱，score 為打字速度 WPM)
interface ScoreItem {
  id: string;
  name: string;
  score: number;
  date: string;
}

export default function Home() {
  // 狀態管理：排行榜資料、表單輸入、載入狀態、提示訊息
  const [leaderboard, setLeaderboard] = useState<ScoreItem[]>([]);
  const [name, setName] = useState("");
  const [score, setScore] = useState(""); // 實際對應到 API 中的 score (即 WPM)
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. 取得排行榜資料的函式
  const fetchScores = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/scores");
      if (!res.ok) {
        throw new Error("無法連接至中央打字測速伺服器 🖥️");
      }
      const data = await res.json();
      setLeaderboard(data);
    } catch (err: any) {
      setErrorMsg(err.message || "網路模組故障，請檢查線路 📶");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 當網頁載入時，自動去撈取排行榜資料
  useEffect(() => {
    fetchScores();
  }, []);

  // 3. 送出表單的處理函式
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // 表單防呆驗證
    if (!name.trim()) {
      setErrorMsg("請輸入測速學生姓名！👤");
      return;
    }
    if (!score || Number(score) < 0) {
      setErrorMsg("WPM 速度值必須大於或等於 0！⚡");
      return;
    }

    setIsSubmitting(true);

    try {
      // 保持原本的 fetch('/api/scores') POST 功能，完全不破壞 API 介面
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          score: Number(score), // 這裡的 score 對應的就是 WPM 分數
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "登錄失敗，系統核心拒絕連線！🚨");
      }

      // 成功回饋
      setSuccessMsg(`🚀 紀錄成功！${name.trim()} 的打字速度為 ${score} WPM！`);
      setName("");
      setScore("");
      
      // 重新加載最新 WPM 排行榜
      await fetchScores();
    } catch (err: any) {
      setErrorMsg(err.message || "數據傳輸中斷，請重試！🔌");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. 刪除特定紀錄的處理函式
  const handleDelete = async (id: string, studentName: string) => {
    // 簡單的確認彈窗，以防手殘點錯 
    if (!confirm(`確定要將學生【${studentName}】的這筆成績從排行榜中刪除嗎？ 🗑️`)) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 呼叫 API DELETE 方法，利用 Query Parameter 帶入 ID
      const res = await fetch(`/api/scores?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "刪除動作失敗，無法聯絡太空伺服器！");
      }

      // 提示刪除成功
      setSuccessMsg(`🗑️ 成功刪除 ${studentName} 的歷史測速成績！`);
      
      // 重新整理資料，排行榜便會自動更新
      await fetchScores();
    } catch (err: any) {
      setErrorMsg(err.message || "刪除失敗，請檢查網路連線 📶");
    }
  };

  // 格式化日期，讓它看起來更乾淨
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen cyber-bg text-cyan-100 font-mono pb-16 transition-colors duration-300">
      
      {/* 雷達掃描線動畫 ( globals.css 中定義的科幻特效 ) */}
      <div className="radar-line"></div>
      
      {/* 街機/螢幕掃描線特效遮罩 */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-25"></div>

      {/* 頂部科幻感 Banner */}
      <header className="relative py-12 text-center overflow-hidden border-b-2 border-cyan-500/30 bg-slate-950/90 shadow-[0_4px_30px_rgba(6,182,212,0.15)]">
        
        {/* 背景科幻浮動裝飾 */}
        <div className="absolute top-4 left-10 text-cyan-500/10 text-5xl select-none animate-pulse">⌨️</div>
        <div className="absolute bottom-4 right-12 text-cyan-500/10 text-6xl select-none animate-pulse" style={{ animationDelay: '1s' }}>⚡</div>
        <div className="absolute top-8 right-16 text-cyan-500/5 text-4xl select-none">🤖</div>
        <div className="absolute bottom-6 left-16 text-cyan-500/5 text-3xl select-none">💻</div>

        <div className="inline-block px-4 py-1.5 border border-cyan-500/30 rounded-md mb-3 bg-cyan-950/30 animate-cyber-pulse">
          <span className="text-cyan-400 text-xs tracking-[0.4em] font-bold">TYPE TESTING DATABASE</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-cyan-400 neon-text-cyan uppercase">
          ⚡ CYBER TYPING ⚡
        </h1>
        <p className="mt-3 text-xs md:text-sm text-emerald-400 neon-text-green uppercase tracking-[0.25em] font-bold">
          學生打字速度挑戰排行榜 💻
        </p>
      </header>

      {/* 主體區塊 */}
      <main className="max-w-4xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* 左側：科幻控制面板輸入表單 (佔 5 欄) */}
        <section className="md:col-span-5 bg-slate-950/80 border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden cyber-panel-shadow">
          {/* 未來感狀態標籤 */}
          <div className="absolute top-0 right-0 bg-cyan-500/20 text-cyan-300 border-l border-b border-cyan-500/30 text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
            TERMINAL IN
          </div>

          <h2 className="text-lg font-bold text-cyan-400 mb-6 pb-2 border-b border-cyan-500/20 flex items-center gap-2">
            🤖 輸入測速數據
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 學生姓名 */}
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                👤 學生姓名 / STUDENT NAME
              </label>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如: 林大同..."
                className="w-full bg-slate-900/60 border border-cyan-500/30 text-cyan-200 placeholder-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-sm tracking-wider font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                maxLength={15}
              />
            </div>

            {/* 打字速度 WPM */}
            <div>
              <label htmlFor="wpm-input" className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                ⚡ 打字速度 / SPEED (WPM)
              </label>
              <input
                id="wpm-input"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="輸入單字數/分鐘 (例如: 85)"
                className="w-full bg-slate-900/60 border border-cyan-500/30 text-cyan-200 placeholder-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-sm tracking-wider font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                min="0"
                max="999"
              />
            </div>

            {/* 錯誤 & 成功回饋 */}
            {errorMsg && (
              <div className="text-red-400 text-xs border border-red-500/50 bg-red-950/40 p-3 rounded-xl font-bold">
                ❌ SYSTEM FAILURE: {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="text-emerald-400 text-xs border border-emerald-500/50 bg-emerald-950/40 p-3 rounded-xl font-bold animate-pulse">
                ✅ DATA SAVED: {successMsg}
              </div>
            )}

            {/* 未來科技感發光按鈕 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 px-5 rounded-xl text-center transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 text-sm"
            >
              {isSubmitting ? "正在寫入緩衝區..." : "上傳雲端數據 / TRANSMIT"}
            </button>
          </form>

          <div className="mt-8 text-center bg-slate-900/40 p-3 rounded-xl border border-cyan-950 text-[10px] text-slate-500">
            💻 提示：WPM (Words Per Minute) 代表每分鐘所能輸入的正確字數。
          </div>
        </section>

        {/* 右側：排行榜顯示區 (佔 7 欄) */}
        <section className="md:col-span-7 bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] relative cyber-panel-shadow">
          
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wide">
                🏆 終端高速處理榜
              </h2>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">SPEED DEMON DIRECTORY</span>
            </div>
            {/* 科技風格重整按鈕 */}
            <button
              onClick={fetchScores}
              className="bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold border border-cyan-500/30 hover:border-cyan-400 rounded-xl text-xs px-3.5 py-2 active:scale-95 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.05)]"
            >
              🔄 重整緩衝
            </button>
          </div>

          {/* 載入中狀態 */}
          {isLoading ? (
            <div className="text-center py-20 space-y-4">
              <div className="inline-block animate-spin text-4xl text-cyan-400">⚡</div>
              <p className="text-cyan-400 text-sm font-bold animate-pulse tracking-widest">下載遠端伺服器核心數據中...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
              無現存打字速記檔案。
              <br />
              <span className="block mt-2 text-cyan-500/80 font-bold text-xs">💻 請鍵入第一筆 WPM 指令！</span>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20">
              {/* 表頭 */}
              <div className="grid grid-cols-12 bg-slate-950/90 border-b border-slate-800 text-slate-500 text-[10px] py-3.5 px-4 font-black uppercase tracking-widest">
                <span className="col-span-2 text-center">排名</span>
                <span className="col-span-4">學生姓名</span>
                <span className="col-span-3 text-right text-emerald-400">速度 (WPM)</span>
                <span className="col-span-2 text-right">時間</span>
                <span className="col-span-1 text-center text-red-500">刪除</span>
              </div>

              {/* 名單 */}
              <div className="divide-y divide-slate-900 bg-slate-950/20">
                {leaderboard.map((item, index) => {
                  const rank = index + 1;
                  let rankBadge = `${rank}`;
                  let rowStyle = "grid grid-cols-12 items-center py-3.5 px-4 text-sm transition-all hover:bg-cyan-950/10 ";
                  let scoreStyle = "text-emerald-400 font-bold tracking-wider";

                  // 前三名科技感發光樣式
                  if (rank === 1) {
                    rankBadge = "🥇 1";
                    rowStyle += " bg-emerald-500/5 border-l-2 border-emerald-400 text-emerald-300 font-black shadow-[inset_0_1px_8px_rgba(52,211,153,0.1)]";
                    scoreStyle = "text-emerald-300 font-extrabold tracking-widest text-base neon-text-green";
                  } else if (rank === 2) {
                    rankBadge = "🥈 2";
                    rowStyle += " bg-sky-500/5 border-l-2 border-sky-400 text-sky-200 font-bold";
                    scoreStyle = "text-sky-300 font-bold tracking-wider text-base neon-text-cyan";
                  } else if (rank === 3) {
                    rankBadge = "🥉 3";
                    rowStyle += " bg-purple-500/5 border-l-2 border-purple-400 text-purple-200 font-semibold";
                    scoreStyle = "text-purple-300 font-semibold tracking-wider";
                  }

                  return (
                    <div 
                      key={item.id} 
                      className={rowStyle}
                    >
                      {/* 排名 */}
                      <span className="col-span-2 text-center text-xs font-black">{rankBadge}</span>
                      
                      {/* 學生姓名 */}
                      <span className="col-span-4 font-bold truncate flex items-center gap-1.5">
                        {item.name}
                        {rank === 1 && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-500/30">TOP</span>}
                      </span>
                      
                      {/* WPM 速度 */}
                      <span className={`col-span-3 text-right ${scoreStyle}`}>
                        {item.score} <span className="text-[9px] text-slate-500 font-medium">WPM</span>
                      </span>
                      
                      {/* 登錄時間 */}
                      <span className="col-span-2 text-right text-[10px] text-slate-600 font-medium">
                        {formatDate(item.date)}
                      </span>

                      {/* 刪除按鈕 */}
                      <span className="col-span-1 text-center">
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="刪除此紀錄"
                          className="text-red-500 hover:text-red-400 hover:scale-125 transition-all text-xs font-bold cursor-pointer inline-flex items-center justify-center p-1 rounded hover:bg-red-500/10 focus:outline-none"
                        >
                          ❌
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 底部小提示 */}
          <div className="mt-6 text-center text-[10px] text-slate-600 uppercase tracking-widest">
            * SESSION STATUS: ONLINE / MEMORY BUFFERED *
          </div>
        </section>
      </main>

      {/* 底部科幻裝飾 */}
      <footer className="mt-16 text-center text-xs text-slate-600 space-y-3">
        <div className="inline-flex gap-3 justify-center text-lg animate-pulse">
          <span>💻</span>
          <span>⚡</span>
          <span>🤖</span>
          <span>🌌</span>
        </div>
        <p className="tracking-widest uppercase">© 2026 終端速記控制中心 / CYBER KEYBOARD SYSTEM</p>
        <p className="text-[10px] text-cyan-500/40">NEXT.JS 15 & TAILWIND v4 INTEGRATED</p>
      </footer>
    </div>
  );
}
