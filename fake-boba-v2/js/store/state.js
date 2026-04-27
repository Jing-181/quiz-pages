import { reactive, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const state = reactive({
  // 当前场景
  currentScene: 'home',
  
  // 饮品配方
  recipe: {
    cupType: 'medium', // small, medium, large
    teaType: 'black',   // black, green, oolong, fruit
    toppings: [],       // 可选配料数组
    sweetness: 50,      // 甜度 0-100
    iceLevel: 50        // 冰量 0-100
  },
  
  // 制作进度
  makingProgress: 0,
  
  // 品尝进度
  tastingProgress: 0,
  
  // 情绪标签
  moodTag: '',
  
  // 个人留言
  personalMessage: '',
  
  // 饮品数量（用于随机配方）
  drinkCount: 0
});

// 计算属性
const computedState = {
  // 检查配方是否完整
  isRecipeComplete: computed(() => {
    return state.recipe.cupType && state.recipe.teaType && state.recipe.toppings.length > 0;
  }),
  
  // 检查制作是否完成
  isMakingComplete: computed(() => {
    return state.makingProgress >= 100;
  }),
  
  // 检查品尝是否完成
  isTastingComplete: computed(() => {
    return state.tastingProgress >= 100;
  })
};

export { state, computedState };