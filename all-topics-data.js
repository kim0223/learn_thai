// 所有主題的數據配置
// 可以從這裡複製到對應的主題文件中

const allTopicsData = {
  'G1': {
    id: 'G1',
    title: '量詞 + ที่ + 數字',
    subtitle: '第幾年/天/人',
    color: '#2a9d8f',
    type: 'ordinal',
    concept: {
      formula: '<span class="hl3">量詞</span> + <span class="hl">ที่</span> + <span class="hl2">數字</span>',
      zh: '量詞＋第＋數字'
    },
    legend: [{label:'量詞',color:'#2a9d8f'},{label:'ที่',color:'#d4a843'},{label:'數字',color:'#e07b6a'}],
    cards: [
      {th:'ปี ที่ หนึ่ง',phonetic:'bpii-thîi-nèung',zh:'第一年',bk:[{t:'ปี',z:'年',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'หนึ่ง',z:'一',c:'s'}]},
      {th:'อัน ที่ สอง',phonetic:'an-thîi-sǒong',zh:'第二個',bk:[{t:'อัน',z:'個',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'สอง',z:'二',c:'s'}]},
      {th:'วัน ที่ สาม',phonetic:'wan-thîi-sǎam',zh:'第三天',bk:[{t:'วัน',z:'天',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'สาม',z:'三',c:'s'}]},
      {th:'คน ที่ สี่',phonetic:'khon-thîi-sìi',zh:'第四個人',bk:[{t:'คน',z:'人',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'สี่',z:'四',c:'s'}]},
      {th:'แก้ว ที่ ห้า',phonetic:'gâeo-thîi-hâa',zh:'第五杯',bk:[{t:'แก้ว',z:'杯',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'ห้า',z:'五',c:'s'}]},
      {th:'จาน ที่ หก',phonetic:'jaan-thîi-hòk',zh:'第六盤',bk:[{t:'จาน',z:'盤',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'หก',z:'六',c:'s'}]},
      {th:'เดือน ที่ เท่าไหร่',phonetic:'duean-thîi-thâo-rài?',zh:'第幾個月?',bk:[{t:'เดือน',z:'月',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'เท่าไหร่',z:'幾',c:'s'}]},
      {th:'อัน ที่ แปด',phonetic:'an-thîi-bpàet',zh:'第八個',bk:[{t:'อัน',z:'個',c:'v'},{t:'ที่',z:'第',c:'k'},{t:'แปด',z:'八',c:'s'}]}
    ]
  },
  
  'G2': {
    id: 'G2',
    title: 'กี่ + 量詞',
    subtitle: '問數量',
    color: '#58a6ff',
    type: 'question',
    concept: {
      formula: '<span class="hl4">กี่</span> + <span class="hl3">量詞</span>',
      zh: '幾＋量詞（問數量）'
    },
    cards: [
      {icon:'👤',th:'กี่ คน',phonetic:'kìi-khon',zh:'幾個人?',bk:[{t:'กี่',z:'幾',c:'k'},{t:'คน',z:'人',c:'v'}]},
      {icon:'📅',th:'กี่ วัน',phonetic:'kìi-wan',zh:'幾天?',bk:[{t:'กี่',z:'幾',c:'k'},{t:'วัน',z:'天',c:'v'}]},
      {icon:'🛍️',th:'กี่ ถุง',phonetic:'kìi-thǔng',zh:'幾袋?',bk:[{t:'กี่',z:'幾',c:'k'},{t:'ถุง',z:'袋',c:'v'}]},
      {icon:'🍽️',th:'กี่ จาน',phonetic:'kìi-jaan',zh:'幾盤?',bk:[{t:'กี่',z:'幾',c:'k'},{t:'จาน',z:'盤',c:'v'}]},
      {icon:'💰',th:'กี่ บาท',phonetic:'kìi-bàat',zh:'幾銖?',bk:[{t:'กี่',z:'幾',c:'k'},{t:'บาท',z:'銖',c:'v'}]},
      {icon:'📦',th:'กี่ กล่อง',phonetic:'kìi-glòong',zh:'幾盒?',bk:[{t:'กี่',z:'幾',c:'k'},{t:'กล่อง',z:'盒',c:'v'}]},
      {icon:'📆',th:'กี่ สัปดาห์',phonetic:'kìi-sàp-daa',zh:'幾週?',bk:[{t:'กี่',z:'幾',c:'k'},{t:'สัปดาห์',z:'週',c:'v'}]}
    ]
  },

  // 由於篇幅限制，我會創建一個Python腳本來生成所有文件
};
