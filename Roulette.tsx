import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCw } from 'lucide-react';

// ルーレットの初期項目
const defaultItems = [
  { label: '大吉', color: '#FF6B6B' },
  { label: '中吉', color: '#4ECDC4' },
  { label: '小吉', color: '#FFE66D' },
  { label: '吉', color: '#95E1D3' },
  { label: '末吉', color: '#F38181' },
  { label: '凶', color: '#AA96DA' },
  { label: '大凶', color: '#FCBAD3' },
  { label: 'ラッキー', color: '#A8E6CF' },
];

export function Roulette() {
  // 状態管理
  const [items, setItems] = useState(defaultItems);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');

 // ルーレットを回す関数
  const spin = () => {
    if (isSpinning || items.length === 0) return;
    
    setIsSpinning(true);
    setResult(null);

    // 最低5回転 + ランダムな角度
    const minRotation = 360 * 5;
    const randomRotation = Math.random() * 360;
    const totalRotation = rotation + minRotation + randomRotation;

    setRotation(totalRotation);

    // 4秒後に結果を判定
    setTimeout(() => {
      const segmentAngle = 360 / items.length;
      const normalizedRotation = totalRotation % 360;
      const selectedIndex = Math.floor(
        (360 - normalizedRotation + segmentAngle / 2) / segmentAngle
      ) % items.length;
      
      setResult(items[selectedIndex].label);
      setIsSpinning(false);
    }, 4000);
  };
   // リセット関数
  const reset = () => {
    setRotation(0);
    setResult(null);
  };

  // 項目追加関数
  const addItem = () => {
    if (newItem.trim() && items.length < 12) {
      const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setItems([...items, { label: newItem.trim(), color: randomColor }]);
      setNewItem('');
    }
  };

  // 項目削除関数
  const removeItem = (index: number) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
    }
  };
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
      <h1 className="text-center mb-8">ルーレット</h1>
      
      <div className="relative flex items-center justify-center mb-8">
        {/* ポインター */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg"></div>
        </div>

        {/* ルーレット円盤 */}
        <div className="relative w-80 h-80">
          <motion.div
            className="w-full h-full rounded-full relative overflow-hidden shadow-xl"
            animate={{ rotate: rotation }}
            transition={{
              duration: 4,
              ease: [0.17, 0.67, 0.35, 0.96],
            }}
          >
            {items.map((item, index) => {
              const segmentAngle = 360 / items.length;
              const startAngle = index * segmentAngle;
              
              return (
                <div
                  key={index}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                  }}
                >
                  <div
                    className="absolute left-1/2 top-0 origin-bottom"
                    style={{
                      width: '200px',
                      height: '160px',
                      marginLeft: '-100px',
                      clipPath: `polygon(50% 100%, ${50 - Math.tan((segmentAngle * Math.PI) / 360) * 100}% 0%, ${50 + Math.tan((segmentAngle * Math.PI) / 360) * 100}% 0%)`,
                      backgroundColor: item.color,
                      borderRight: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    <div
                      className="absolute top-4 left-1/2 -translate-x-1/2 font-bold text-white text-sm whitespace-nowrap"
                      style={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* 中央の円 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-gray-200 flex items-center justify-center z-10">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
          </div>
        </div>
      </div>
      {/* 結果表示 */}
      {result && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 shadow-lg"
        >
          <p className="text-gray-700 text-lg mb-2">結果</p>
          <p className="text-4xl font-bold text-white">{result}</p>
        </motion.div>
      )}

      {/* コントロールボタン */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={spin}
          disabled={isSpinning || items.length === 0}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Play className="w-6 h-6" />
          スタート
        </button>
        <button
          onClick={reset}
          disabled={isSpinning}
          className="bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <RotateCw className="w-5 h-5" />
          リセット
        </button>
      </div>
      {/* アイテム編集 */}
      <div className="border-t pt-6">
        <h3 className="font-bold text-gray-700 mb-3">項目を編集</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="新しい項目を追加..."
            maxLength={12}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim() || items.length >= 12}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            追加
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white shadow-md"
              style={{ backgroundColor: item.color }}
            >
              <span>{item.label}</span>
              <button
                onClick={() => removeItem(index)}
                disabled={items.length <= 2}
                className="hover:bg-white/20 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {items.length <= 2 && (
          <p className="text-xs text-gray-500 mt-2">※最低2つの項目が必要です</p>
        )}
      </div>
    </div>
  );
}
