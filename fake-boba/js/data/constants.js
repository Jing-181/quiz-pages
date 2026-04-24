/* ===== PRESETS ===== */
export const PRESETS = [
  { name:'经典珍珠奶茶', tea:'红茶', toppings:['珍珠'], sweet:'七分甜', ice:'正常冰', color:'#C4956A', cal:450 },
  { name:'芋泥波波', tea:'芋泥', toppings:['芋圆','珍珠'], sweet:'七分甜', ice:'少冰', color:'#B39DDB', cal:520 },
  { name:'杨枝甘露', tea:'芒果', toppings:['椰果'], sweet:'五分甜', ice:'正常冰', color:'#FFD54F', cal:380 },
  { name:'黑糖鲜奶', tea:'黑糖', toppings:['珍珠'], sweet:'七分甜', ice:'少冰', color:'#8D6E63', cal:480 },
  { name:'抹茶拿铁', tea:'抹茶', toppings:['红豆'], sweet:'三分甜', ice:'去冰', color:'#8BC34A', cal:320 },
  { name:'芝士奶盖乌龙', tea:'乌龙', toppings:['芝士奶盖'], sweet:'五分甜', ice:'少冰', color:'#D4B896', cal:400 }
];

/* ===== TEA OPTIONS ===== */
export const TEA_OPTIONS = [
  { name:'红茶', color:'#C4956A' },
  { name:'绿茶', color:'#8BC34A' },
  { name:'乌龙', color:'#D4B896' },
  { name:'芋泥', color:'#B39DDB' },
  { name:'芒果', color:'#FFD54F' },
  { name:'黑糖', color:'#8D6E63' }
];

/* ===== TOPPING / SWEET / ICE OPTIONS ===== */
export const TOPPING_OPTIONS = ['珍珠','芋圆','椰果','红豆','仙草','布丁','芝士奶盖','奥利奥碎'];
export const SWEET_OPTIONS = ['无糖','三分甜','五分甜','七分甜','全糖'];
export const ICE_OPTIONS = ['去冰','少冰','正常冰','多冰','热饮'];

/* ===== SIP / RESULT MESSAGES ===== */
export const SIP_MESSAGES = [
  '嗯~ 好满足！','珍珠QQ的！','奶味刚刚好~','再来一口！',
  '快乐在冒泡~','这个甜度绝了','假装喝到了！','灵魂被治愈了',
  '今天也是幸福的一天','热量？不存在的！'
];

export const RESULT_MESSAGES = [
  '恭喜你成功假装喝了一杯奶茶！虽然没有真的喝到，但快乐是真的！',
  '这杯假装奶茶的热量为零，但幸福感是百分之百的！',
  '你是一个懂得自我满足的人，假装喝奶茶也能这么开心！',
  '今天的奶茶虽然不存在，但你认真对待生活的态度值得点赞！',
  '假装喝奶茶，真实地快乐。这就是生活的艺术！'
];

/* ===== TOPPING VISUAL CONFIG ===== */
export const TOPPING_STYLES = {
  '珍珠': { shape:'circle', size:14, color:'#2D1B0E', extra:'box-shadow:inset -3px -3px 4px rgba(255,255,255,0.3)' },
  '芋圆': { shape:'circle', size:14, color:'#B39DDB', extra:'background:repeating-linear-gradient(45deg,#B39DDB,#B39DDB 3px,#9C7CCD 3px,#9C7CCD 6px)' },
  '椰果': { shape:'square', size:12, color:'rgba(245,245,220,0.7)', extra:'border-radius:3px' },
  '红豆': { shape:'circle', size:10, color:'#8B4513', extra:'background:radial-gradient(circle at 35% 35%,#A0522D,#6B3410)' },
  '仙草': { shape:'rect', size:14, color:'rgba(30,30,30,0.7)', extra:'border-radius:2px;width:14px;height:10px' },
  '布丁': { shape:'ellipse', size:16, color:'#FFD700', extra:'border-radius:50%;transform:scaleY(0.65)' },
  '芝士奶盖': { shape:'layer', size:0, color:'#FFFDD0', extra:'special-cream-layer' },
  '奥利奥碎': { shape:'square', size:8, color:'', extra:'background:linear-gradient(180deg,#1a1a1a 50%,#F5F5F5 50%);border-radius:2px' }
};

/* ===== TOPPING FUN TEXT ===== */
export const TOPPING_FUN_TEXT = {
  '珍珠': '珍珠Q弹登场！',
  '芋圆': '芋圆紫紫的～',
  '椰果': '椰果清爽加持！',
  '红豆': '红豆甜蜜甜蜜～',
  '仙草': '仙草滑滑的！',
  '布丁': '布丁软软登场！',
  '芝士奶盖': '奶盖缓缓铺上～',
  '奥利奥碎': '奥利奥碎撒上去！'
};

/* ===== ICE COUNT MAP ===== */
export const ICE_COUNT_MAP = { '去冰':0, '少冰':2, '正常冰':4, '多冰':6, '热饮':0 };
