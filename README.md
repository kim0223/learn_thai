# 泰語學習卡 v3 - 模組化版本

## 📁 檔案結構

```
thai-learning/
├── index.html          # 主目錄頁面 (入口)
├── shared.js           # 共享JavaScript邏輯 (所有主題通用)
├── topic-template.html # 主題頁面模板 (創建新主題時複製此檔)
└── topics/             # 各個主題的獨立頁面
    ├── G0-1.html       # 數字
    ├── G0-2.html       # ที่ + 數字
    ├── G1.html         # 量詞 + ที่ + 數字
    ├── G2.html         # กี่ + 量詞
    ├── ...             # 其他主題
    └── G22.html        # 路邊攤點餐對話
```

## 🎯 設計理念

### 模組化架構的優點：

1. **獨立編輯** - 每個主題獨立一個文件，互不影響
2. **易於維護** - 只需修改對應主題的文件
3. **擴展簡單** - 新增主題只需：
   - 複製模板
   - 修改數據配置
   - 在主目錄添加索引
4. **快速載入** - 只載入當前主題，不需要載入所有內容

---

## 📝 如何編輯現有主題

### 範例：編輯 G0-1 數字

打開 `topics/G0-1.html`，找到這段代碼：

```javascript
const topicData = {
  id: 'G0-1',
  title: '數字',
  subtitle: '基本數字單位',
  color: '#d4a843',
  type: 'number',
  concept: {
    formula: '<span class="hl">數字</span> + <span class="hl2">單位</span>',
    zh: '數字＋單位'
  },
  cards: [
    {th:'สิบ',phonetic:'sìp',zh:'十',bk:[{t:'สิบ',z:'十'}]},
    // ... 更多卡片
  ]
};
```

### 修改內容：

- `id`: 主題編號
- `title`: 主題標題
- `subtitle`: 副標題
- `color`: 主題顏色 (十六進制)
- `type`: 主題類型 (number, ordinal, question, grammar, phrase, vocab, dialogue)
- `concept`: 句型公式（選填）
- `cards`: 卡片數據陣列

### 卡片格式：

```javascript
{
  th: '泰文',           // 泰語文字
  phonetic: '拼音',     // 拼音標註
  zh: '中文',          // 中文意思
  icon: '🔢',          // 圖標（選填）
  bk: [                // 拆解資料
    {t:'泰文',z:'中文',c:'分類'} // c: 顏色分類 (s/v/o/k/t/n/p/l)
  ]
}
```

---

## ✨ 如何新增主題

### 步驟 1: 複製模板

```bash
cp topic-template.html topics/G新編號.html
```

### 步驟 2: 修改主題數據

打開新文件，修改 `topicData` 物件：

```javascript
const topicData = {
  id: 'G23',
  title: '新主題名稱',
  subtitle: '副標題',
  color: '#顏色代碼',
  type: '主題類型',
  concept: {  // 如果需要句型公式
    formula: '...',
    zh: '...'
  },
  legend: [  // 如果需要圖例
    {label:'標籤',color:'#顏色'}
  ],
  cards: [
    // 卡片數據
  ]
};
```

### 步驟 3: 更新主目錄

打開 `index.html`，在 `topics` 陣列中添加：

```javascript
{
  id:'G23',
  title:'新主題名稱',
  subtitle:'副標題',
  cards:10,  // 卡片數量
  icon:'🎯',  // 圖標
  color:'#顏色',
  file:'topics/G23.html'
}
```

放在對應的 section 中（數字應用/文法句型/常用語/單字學習/對話練習）

---

## 🎨 主題類型說明

| 類型 | 說明 | 範例 |
|------|------|------|
| `number` | 數字 | G0-1 |
| `ordinal` | 序數詞 | G0-2, G1 |
| `question` | 疑問句 | G2, G3, G4 |
| `grammar` | 文法句型 | G5-G14 |
| `phrase` | 常用語 | G15 |
| `vocab` | 單字 | G16-G19 |
| `dialogue` | 對話 | G20, G22 |

---

## 🔧 顏色分類代碼 (bk中的c)

用於句型拆解的顏色標記：

- `s` - 主詞 (Subject) - 藍色
- `v` - 動詞 (Verb) - 青綠色
- `o` - 受詞 (Object) - 玫瑰色
- `k` - 關鍵詞 (Key) - 金色
- `t` - 語尾 (Tail) - 紫色
- `n` - 否定 (Negative) - 紅色
- `p` - 進行 (Progressive) - 青色
- `l` - 地點 (Location) - 粉色

---

## 💡 實用技巧

### 1. 快速複製卡片

如果有多張相似的卡片，可以複製修改：

```javascript
{th:'สิบ',phonetic:'sìp',zh:'十',bk:[{t:'สิบ',z:'十'}]},
{th:'ยี่สิบ',phonetic:'yîi-sìp',zh:'二十',bk:[{t:'ยี่สิบ',z:'二十'}]},
{th:'สามสิบ',phonetic:'sǎam-sìp',zh:'三十',bk:[{t:'สาม',z:'三'},{t:'สิบ',z:'十'}]},
```

### 2. 測試主題

修改完成後：
1. 打開 `index.html`
2. 點擊新主題
3. 檢查顯示是否正確

### 3. 備份重要數據

在大量修改前，建議備份 `topics/` 目錄

---

## 📊 目前內容統計

- **數字應用**: 6組 (G0-1 至 G4)
- **文法句型**: 10組 (G5 至 G14)
- **常用語**: 1組 (G15)
- **單字學習**: 4組 (G16 至 G19)
- **對話練習**: 2組 (G20, G22)

**總計**: 23個主題，160+ 張卡片

---

## ⚠️ 注意事項

1. **不要修改 `shared.js`** - 這是所有主題共用的邏輯
2. **保持 topicData 格式一致** - 確保程式能正確讀取
3. **測試瀏覽器兼容性** - 建議使用 Chrome/Edge/Safari
4. **拼音符號檢查** - 確保使用正確的聲調符號

---

## 🚀 未來擴展建議

- [ ] 添加更多對話場景 (餐廳、購物、問路等)
- [ ] 增加單字主題 (動物、顏色、時間等)
- [ ] 建立進階文法組
- [ ] 加入練習模式
- [ ] 添加成就系統

---

## 📞 技術支援

如有問題，請檢查：
1. 瀏覽器控制台錯誤訊息
2. topicData 格式是否正確
3. 檔案路徑是否正確
4. shared.js 是否正確載入

---

**版本**: 3.0 模組化版  
**更新日期**: 2026-05-12
