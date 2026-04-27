// 茶底选项
export const TEA_OPTIONS = [
  { name: '红茶', color: '#C4956A' },
  { name: '绿茶', color: '#8BC34A' },
  { name: '乌龙', color: '#D4B896' },
  { name: '芋泥', color: '#B39DDB' },
  { name: '芒果', color: '#FFD54F' },
  { name: '黑糖', color: '#8D6E63' },
];

// 小料选项
export const TOPPING_OPTIONS = ['珍珠', '芋圆', '椰果', '红豆', '仙草', '布丁'];

// 甜度选项
export const SWEET_OPTIONS = ['全糖', '七分甜', '五分甜', '三分甜', '无糖'];

// 冰度选项
export const ICE_OPTIONS = ['全冰', '少冰', '去冰', '热饮'];

// 冰量映射
export const ICE_COUNT_MAP = {
  '全冰': 6,
  '少冰': 3,
  '去冰': 0,
  '热饮': 0,
};

// 预设配方
export const PRESETS = [
  {
    name: '经典珍珠奶茶',
    tea: '红茶',
    color: '#C4956A',
    toppings: ['珍珠'],
    sweet: '七分甜',
    ice: '少冰',
    cal: 380,
  },
  {
    name: '绿茶椰果',
    tea: '绿茶',
    color: '#8BC34A',
    toppings: ['椰果'],
    sweet: '五分甜',
    ice: '全冰',
    cal: 320,
  },
  {
    name: '芋泥波波',
    tea: '芋泥',
    color: '#B39DDB',
    toppings: ['芋圆', '珍珠'],
    sweet: '七分甜',
    ice: '少冰',
    cal: 450,
  },
  {
    name: '芒果布丁',
    tea: '芒果',
    color: '#FFD54F',
    toppings: ['布丁'],
    sweet: '全糖',
    ice: '全冰',
    cal: 420,
  },
  {
    name: '黑糖珍珠',
    tea: '黑糖',
    color: '#8D6E63',
    toppings: ['珍珠'],
    sweet: '全糖',
    ice: '少冰',
    cal: 480,
  },
];

// 情绪气泡文本
export const EMOTION_TEXTS = [
  '嗯~ 好满足！',
  '珍珠QQ的！',
  '快乐在冒泡~',
  '再来一口！',
  '太好喝了！',
  '幸福的味道！',
  '完美的搭配！',
  '瞬间治愈！',
];

// 结果卡心情标签
export const MOOD_TAGS = [
  '快乐加满',
  '心情愉悦',
  '满足感MAX',
  '幸福感爆棚',
  '治愈时刻',
  '快乐星球',
  '甜蜜时光',
  '美好瞬间',
];

// 结果卡个性化消息
export const PERSONAL_MESSAGES = [
  '今天的快乐是奶茶给的！',
  '生活需要一点甜~',
  '假装喝奶茶，快乐不打折！',
  '奶茶自由，心情自由！',
  '这一刻，我是最幸福的人！',
  '奶茶治愈一切不开心！',
  '生活很苦，奶茶很甜！',
  '奶茶时间，快乐时间！',
];