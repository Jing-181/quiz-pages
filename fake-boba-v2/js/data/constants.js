// 茶选项
export const TEA_OPTIONS = [
  { value: 'black', label: '红茶', color: '#8B4513' },
  { value: 'green', label: '绿茶', color: '#90EE90' },
  { value: 'oolong', label: '乌龙茶', color: '#D2B48C' },
  { value: 'fruit', label: '果茶', color: '#FF6B6B' }
];

// 杯子类型
export const CUP_OPTIONS = [
  { value: 'small', label: '小杯', capacity: '300ml' },
  { value: 'medium', label: '中杯', capacity: '500ml' },
  { value: 'large', label: '大杯', capacity: '700ml' }
];

// 配料选项
export const TOPPING_OPTIONS = [
  { value: 'pearl', label: '珍珠', price: 2 },
  { value: 'pudding', label: '布丁', price: 3 },
  { value: 'coconut', label: '椰果', price: 2 },
  { value: 'jelly', label: '果冻', price: 2 },
  { value: 'cream', label: '奶盖', price: 4 }
];

// 甜度选项
export const SWEETNESS_OPTIONS = [
  { value: 0, label: '无糖' },
  { value: 25, label: '微糖' },
  { value: 50, label: '半糖' },
  { value: 75, label: '七分糖' },
  { value: 100, label: '全糖' }
];

// 冰量选项
export const ICE_OPTIONS = [
  { value: 0, label: '去冰' },
  { value: 25, label: '少冰' },
  { value: 50, label: '标准冰' },
  { value: 75, label: '多冰' },
  { value: 100, label: '满冰' }
];

// 预设配方
export const PRESET_RECIPES = [
  {
    name: '经典珍珠奶茶',
    cupType: 'medium',
    teaType: 'black',
    toppings: ['pearl'],
    sweetness: 50,
    iceLevel: 50
  },
  {
    name: '清爽绿茶',
    cupType: 'small',
    teaType: 'green',
    toppings: ['coconut'],
    sweetness: 25,
    iceLevel: 75
  },
  {
    name: '香浓乌龙茶',
    cupType: 'large',
    teaType: 'oolong',
    toppings: ['pudding', 'cream'],
    sweetness: 75,
    iceLevel: 25
  },
  {
    name: '活力果茶',
    cupType: 'medium',
    teaType: 'fruit',
    toppings: ['jelly', 'pearl'],
    sweetness: 100,
    iceLevel: 50
  }
];

// 情绪文本
export const EMOTION_TEXTS = [
  '太棒了！这杯奶茶让我心情愉悦',
  '味道不错，感觉很放松',
  '有点甜，但还可以接受',
  '冰量刚好，口感很清爽',
  '配料很多，很满足',
  '茶香浓郁，回味无穷',
  '甜度适中，非常好喝',
  '冰爽解渴，夏天的最爱'
];

// 心情标签
export const MOOD_TAGS = [
  '开心', '放松', '满足', '愉悦', '幸福', '清爽', '活力', '温暖'
];

// 个人留言
export const PERSONAL_MESSAGES = [
  '今天也要加油哦！',
  '享受每一刻的美好',
  '生活需要一点甜',
  '喝杯奶茶，心情变好',
  '忙碌的一天，给自己点奖励',
  '和朋友分享这份快乐',
  '每一口都是幸福的味道',
  '奶茶是最好的治愈'
];