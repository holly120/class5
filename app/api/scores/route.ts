import { NextResponse } from 'next/server';

// 定義排行榜資料的型別 (保持原本的欄位名稱以相容前端)
interface ScoreItem {
  id: string;
  name: string; // 學生名稱
  score: number; // 速度 WPM
  date: string;
}

// 建立打字速度排行榜的預設資料 (WPM)
// 使用 let 聲明，這樣我們才能對它進行過濾刪除與重新賦值！
let leaderboard: ScoreItem[] = [
  { id: '1', name: '王小明 ⌨️', score: 128, date: new Date().toISOString() },
  { id: '2', name: '李阿華 ⚡', score: 105, date: new Date().toISOString() },
  { id: '3', name: '打字機器人 🤖', score: 92, date: new Date().toISOString() },
];

// GET 方法：取得排行榜列表（依 WPM 由高到低排序）
export async function GET() {
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);
  return NextResponse.json(sortedLeaderboard);
}

// POST 方法：新增一筆分數資料到排行榜
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, score } = data;

    // 基本驗證
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: '學生名稱不能為空！' }, { status: 400 });
    }

    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 0) {
      return NextResponse.json({ error: 'WPM 速度必須是正整數！' }, { status: 400 });
    }

    // 建立新資料項目
    const newScoreEntry: ScoreItem = {
      id: Date.now().toString(),
      name: name.trim(),
      score: Math.floor(numericScore), // 確保是整數
      date: new Date().toISOString(),
    };

    leaderboard.push(newScoreEntry);

    return NextResponse.json(newScoreEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '請求格式錯誤！' }, { status: 400 });
  }
}

// DELETE 方法：刪除特定 ID 的資料
export async function DELETE(request: Request) {
  try {
    // 從網址的 Query Parameters 中取得要刪除的 id (例如: /api/scores?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少 id 參數！' }, { status: 400 });
    }

    // 檢查該 ID 是否存在
    const exists = leaderboard.some(item => item.id === id);
    if (!exists) {
      return NextResponse.json({ error: '找不到該筆資料！' }, { status: 404 });
    }

    // 過濾掉符合該 ID 的資料，重新賦值給 leaderboard 陣列
    leaderboard = leaderboard.filter(item => item.id !== id);

    return NextResponse.json({ success: true, message: '資料已成功刪除！' });
  } catch (error) {
    return NextResponse.json({ error: '刪除處理失敗！' }, { status: 500 });
  }
}
