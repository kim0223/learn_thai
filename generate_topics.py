#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成泰語學習卡主題文件
"""

import json
import os

# HTML模板
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title_full} - 泰語學習卡</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;600;700&family=Sarabun:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
:root {{
  --bg:#0d1117;--surface:#161b22;--card:#1c2128;--border:#30363d;
  --gold:#d4a843;--teal:#2a9d8f;--rose:#e07b6a;--blue:#58a6ff;
  --violet:#bc8cff;--green:#3fb950;--cyan:#39d0d8;--orange:#f0883e;--pink:#f778ba;
  --text:#e6edf3;--text-mid:#adbac7;--text-dim:#7d8590;
}}
body{{min-height:100vh;background:var(--bg);display:flex;flex-direction:column;align-items:center;font-family:'Noto Serif TC',serif;padding:24px 16px 60px;}}
.back-btn{{width:100%;max-width:560px;margin-bottom:14px;display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--text-mid);font-family:'DM Mono',monospace;font-size:0.85rem;cursor:pointer;transition:all 0.2s;text-decoration:none;}}
.back-btn:hover{{border-color:var(--gold);color:var(--text);}}
.header-row{{width:100%;max-width:560px;text-align:center;margin-bottom:14px;}}
.header-eyebrow{{font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:0.35em;color:var(--text-dim);text-transform:uppercase;margin-bottom:4px;}}
.header-title{{font-size:1.4rem;color:var(--gold);font-weight:700;}}
.topic-chip{{width:100%;max-width:560px;margin-bottom:11px;display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:100px;background:var(--surface);border:1px solid var(--border);}}
.topic-dot{{width:8px;height:8px;border-radius:50%;flex-shrink:0;}}
.topic-text{{font-family:'DM Mono',monospace;font-size:0.8rem;color:var(--text-mid);flex:1;}}
.concept-box{{width:100%;max-width:560px;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--gold);border-radius:10px;padding:12px 15px;margin-bottom:11px;}}
.concept-label{{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.2em;color:var(--text-dim);text-transform:uppercase;margin-bottom:5px;}}
.concept-formula{{font-family:'Sarabun',sans-serif;font-size:1.35rem;font-weight:600;color:var(--text);line-height:1.8;margin-bottom:2px;}}
.concept-formula .hl{{color:var(--gold);}}.concept-formula .hl2{{color:var(--rose);}}.concept-formula .hl3{{color:var(--teal);}}.concept-formula .hl4{{color:var(--blue);}}
.concept-zh{{font-size:1.0rem;color:var(--text-dim);font-family:'DM Mono',monospace;}}
.progress-wrap{{width:100%;max-width:560px;display:flex;align-items:center;gap:12px;margin-bottom:10px;}}
.progress-bar{{flex:1;height:3px;background:var(--border);border-radius:2px;overflow:hidden;}}
.progress-fill{{height:100%;border-radius:2px;transition:width 0.4s,background 0.3s;}}
.progress-label{{font-family:'DM Mono',monospace;font-size:0.75rem;color:var(--text-dim);min-width:48px;text-align:right;}}
.card-wrap{{width:100%;max-width:560px;}}
.card{{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px 20px 20px;position:relative;overflow:hidden;animation:slideIn 0.27s ease;}}
@keyframes slideIn{{from{{opacity:0;transform:translateY(8px)}}to{{opacity:1;transform:translateY(0)}}}}
.card-stripe{{position:absolute;top:0;left:0;right:0;height:2px;}}
.card-num{{position:absolute;top:14px;right:16px;font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--text-dim);}}
.card-top{{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;}}
.num-badge{{width:48px;height:48px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:1.05rem;font-weight:600;background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.2);color:var(--gold);}}
.card-icon{{width:48px;height:48px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:rgba(212,168,67,0.06);border:1px solid var(--border);}}
.card-main{{flex:1;}}
.thai-expr{{font-family:'Sarabun',sans-serif;font-size:2.5rem;font-weight:700;color:var(--text);line-height:1.35;margin-bottom:8px;}}
.thai-expr .part-classifier{{color:var(--teal);}}.thai-expr .part-thii{{color:var(--gold);}}.thai-expr .part-num{{color:var(--rose);}}
.thai-sentence{{font-family:'Sarabun',sans-serif;font-size:2.3rem;font-weight:700;color:var(--text);line-height:1.45;margin-bottom:10px;}}
.thai-sentence .p-s{{color:var(--blue);}}.thai-sentence .p-v{{color:var(--teal);}}.thai-sentence .p-o{{color:var(--rose);}}.thai-sentence .p-key{{color:var(--gold);}}.thai-sentence .p-tail{{color:var(--violet);}}.thai-sentence .p-neg{{color:#ff6b6b;}}.thai-sentence .p-prog{{color:var(--cyan);}}.thai-sentence .p-loc{{color:var(--pink);}}
.phonetic{{font-family:'DM Mono',monospace;font-size:1.1rem;color:var(--gold);margin-bottom:5px;line-height:1.5;}}
.zh-meaning{{font-size:1.25rem;color:var(--text-mid);margin-bottom:14px;line-height:1.6;}}
.speak-row{{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px;}}
.btn-speak{{display:inline-flex;align-items:center;gap:5px;padding:7px 15px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-mid);font-family:'DM Mono',monospace;font-size:0.88rem;cursor:pointer;transition:all 0.2s;}}
.btn-speak.th:hover{{border-color:var(--teal);color:var(--teal);}}.btn-speak.zh:hover{{border-color:var(--blue);color:var(--blue);}}
.btn-speak.playing{{animation:blink 0.7s infinite;}}.btn-speak.th.playing{{border-color:var(--teal);color:var(--teal);}}.btn-speak.zh.playing{{border-color:var(--blue);color:var(--blue);}}
@keyframes blink{{0%,100%{{opacity:1}}50%{{opacity:0.3}}}}
.breakdown{{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;}}
.breakdown-title{{font-family:'DM Mono',monospace;font-size:0.8rem;letter-spacing:0.2em;color:var(--text-dim);text-transform:uppercase;margin-bottom:7px;}}
.breakdown-row{{display:flex;gap:5px;flex-wrap:wrap;align-items:center;}}
.bk-item{{display:flex;flex-direction:column;align-items:center;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:5px 9px;gap:2px;cursor:pointer;transition:all 0.18s;user-select:none;}}
.bk-item:hover{{border-color:var(--teal);transform:translateY(-1px);}}
.bk-item.word-playing{{animation:blink 0.7s infinite;border-color:var(--teal);}}
.bk-thai{{font-family:'Sarabun',sans-serif;font-size:1.1rem;font-weight:600;color:var(--text);}}
.bk-zh{{font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--text-dim);}}
.bk-plus{{font-size:1.1rem;color:var(--text-dim);align-self:center;}}
.legend{{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;padding-top:8px;border-top:1px solid var(--border);}}
.legend-item{{display:flex;align-items:center;gap:5px;font-family:'DM Mono',monospace;font-size:0.75rem;color:var(--text-dim);}}
.legend-dot{{width:8px;height:8px;border-radius:50%;}}
.dialogue-bubble{{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:14px;display:flex;gap:12px;}}
.dialogue-bubble.a{{border-left:3px solid var(--blue);}}
.dialogue-bubble.b{{border-left:3px solid var(--rose);}}
.dialogue-icon{{width:40px;height:40px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem;background:var(--card);border:1px solid var(--border);}}
.dialogue-body{{flex:1;}}
.dialogue-name{{font-family:'DM Mono',monospace;font-size:0.75rem;letter-spacing:0.05em;color:var(--text-dim);margin-bottom:4px;text-transform:uppercase;}}
.dialogue-thai{{font-family:'Sarabun',sans-serif;font-size:1.5rem;font-weight:600;color:var(--text);line-height:1.5;margin-bottom:4px;}}
.dialogue-zh{{font-size:1.05rem;color:var(--text-mid);line-height:1.5;}}
.nav-row{{width:100%;max-width:560px;display:flex;gap:8px;margin-top:14px;}}
.btn-nav{{flex:1;padding:12px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-mid);font-family:'DM Mono',monospace;font-size:0.9rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;}}
.btn-nav:hover{{border-color:var(--gold);color:var(--text);}}
.btn-nav:active{{transform:scale(0.97);}}
.loop-controls{{width:100%;max-width:560px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-top:14px;}}
.loop-header{{font-family:'DM Mono',monospace;font-size:0.75rem;letter-spacing:0.2em;color:var(--text-dim);text-transform:uppercase;margin-bottom:10px;}}
.loop-buttons{{display:flex;gap:7px;margin-bottom:10px;}}
.btn-loop{{flex:1;padding:9px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--text-mid);font-family:'DM Mono',monospace;font-size:0.85rem;cursor:pointer;transition:all 0.2s;}}
.btn-loop:hover{{border-color:var(--teal);color:var(--teal);}}
.btn-loop.active-loop{{border-color:var(--teal);color:var(--teal);background:rgba(42,157,143,0.08);}}
.speed-control{{display:flex;align-items:center;gap:10px;}}
.speed-label{{font-family:'DM Mono',monospace;font-size:0.8rem;color:var(--text-dim);}}
.speed-slider{{flex:1;height:4px;-webkit-appearance:none;appearance:none;background:var(--border);border-radius:2px;outline:none;}}
.speed-slider::-webkit-slider-thumb{{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:var(--teal);border-radius:50%;cursor:pointer;}}
.speed-slider::-moz-range-thumb{{width:16px;height:16px;background:var(--teal);border-radius:50%;cursor:pointer;border:none;}}
.speed-value{{font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);min-width:32px;text-align:right;}}
.loop-status{{margin-top:10px;padding:8px 10px;background:var(--card);border:1px solid var(--border);border-radius:6px;display:none;}}
.loop-status-text{{font-family:'DM Mono',monospace;font-size:0.8rem;color:var(--text-mid);text-align:center;}}
</style>
</head>
<body>

<a href="../index.html" class="back-btn">← 返回主目錄</a>

<div class="header-row">
  <div class="header-eyebrow">Thai Learning Cards</div>
  <div class="header-title">泰語學習卡 v3</div>
</div>

<div class="topic-chip" id="topicChip"></div>
<div class="concept-box" id="conceptBox" style="display:none;"></div>
<div class="progress-wrap">
  <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
  <div class="progress-label" id="progressLabel"></div>
</div>
<div class="card-wrap"><div class="card" id="card"></div></div>
<div class="nav-row">
  <button class="btn-nav" onclick="navigate(-1)">← 上一張</button>
  <button class="btn-nav" onclick="navigate(1)">下一張 →</button>
</div>

<div class="loop-controls">
  <div class="loop-header">自動播放</div>
  <div class="loop-buttons">
    <button class="btn-loop" id="btnLoopSingle" onclick="startLoop('single')">單卡循環</button>
    <button class="btn-loop" id="btnLoopAll" onclick="startLoop('all')">全部循環</button>
    <button class="btn-loop" id="btnLoopStop" onclick="stopLoop()" style="display:none;">⏹ 停止</button>
  </div>
  <div class="speed-control">
    <span class="speed-label">間隔</span>
    <input type="range" class="speed-slider" min="2" max="8" step="0.5" value="4" id="speedSlider" oninput="updateSpeed(this.value)">
    <span class="speed-value" id="speedVal">4s</span>
  </div>
  <div class="loop-status" id="loopStatus">
    <div class="loop-status-text" id="loopStatusText"></div>
  </div>
</div>

<script src="../shared.js"></script>
<script>
const topicData = {topic_data_json};

initTopic(topicData);
</script>

</body>
</html>'''

# 主題數據（從完整版學習卡中提取）
TOPICS_DATA = {
    'G1': {
        'id': 'G1',
        'title': '量詞 + ที่ + 數字',
        'subtitle': '第幾年/天/人',
        'color': '#2a9d8f',
        'type': 'ordinal',
        'concept': {
            'formula': '<span class="hl3">量詞</span> + <span class="hl">ที่</span> + <span class="hl2">數字</span>',
            'zh': '量詞＋第＋數字'
        },
        'legend': [
            {'label':'量詞','color':'#2a9d8f'},
            {'label':'ที่','color':'#d4a843'},
            {'label':'數字','color':'#e07b6a'}
        ],
        'cards': [
            {'th':'ปี ที่ หนึ่ง','phonetic':'bpii-thîi-nèung','zh':'第一年','bk':[{'t':'ปี','z':'年','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'หนึ่ง','z':'一','c':'s'}]},
            {'th':'อัน ที่ สอง','phonetic':'an-thîi-sǒong','zh':'第二個','bk':[{'t':'อัน','z':'個','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'สอง','z':'二','c':'s'}]},
            {'th':'วัน ที่ สาม','phonetic':'wan-thîi-sǎam','zh':'第三天','bk':[{'t':'วัน','z':'天','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'สาม','z':'三','c':'s'}]},
            {'th':'คน ที่ สี่','phonetic':'khon-thîi-sìi','zh':'第四個人','bk':[{'t':'คน','z':'人','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'สี่','z':'四','c':'s'}]},
            {'th':'แก้ว ที่ ห้า','phonetic':'gâeo-thîi-hâa','zh':'第五杯','bk':[{'t':'แก้ว','z':'杯','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'ห้า','z':'五','c':'s'}]},
            {'th':'จาน ที่ หก','phonetic':'jaan-thîi-hòk','zh':'第六盤','bk':[{'t':'จาน','z':'盤','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'หก','z':'六','c':'s'}]},
            {'th':'เดือน ที่ เท่าไหร่','phonetic':'duean-thîi-thâo-rài?','zh':'第幾個月?','bk':[{'t':'เดือน','z':'月','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'เท่าไหร่','z':'幾','c':'s'}]},
            {'th':'อัน ที่ แปด','phonetic':'an-thîi-bpàet','zh':'第八個','bk':[{'t':'อัน','z':'個','c':'v'},{'t':'ที่','z':'第','c':'k'},{'t':'แปด','z':'八','c':'s'}]}
        ]
    },
    # ... 這裡會包含所有23個主題的數據
}

def generate_topic_file(topic_id, topic_data, output_dir='topics'):
    """生成單個主題的HTML文件"""
    
    # 確保輸出目錄存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 生成完整標題
    title_full = f"{topic_data['id']} {topic_data['title']}"
    
    # 將topic_data轉換為JSON字符串
    topic_data_json = json.dumps(topic_data, ensure_ascii=False, indent=2)
    
    # 填充模板
    html_content = HTML_TEMPLATE.format(
        title_full=title_full,
        topic_data_json=topic_data_json
    )
    
    # 寫入文件
    output_file = os.path.join(output_dir, f'{topic_id}.html')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f'✓ 已生成: {output_file}')

def main():
    """主函數"""
    print('開始生成主題文件...\n')
    
    for topic_id, topic_data in TOPICS_DATA.items():
        generate_topic_file(topic_id, topic_data)
    
    print(f'\n完成！共生成 {len(TOPICS_DATA)} 個主題文件')

if __name__ == '__main__':
    main()
