import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { state } from './store/state.js';

// 导入场景组件
import HomeScene from './scenes/HomeScene.js';
import RecipeScene from './scenes/RecipeScene.js';
import MakingScene from './scenes/MakingScene.js';
import TastingScene from './scenes/TastingScene.js';
import ResultScene from './scenes/ResultScene.js';

// 创建 Vue 应用
const app = createApp({
  data() {
    return {
      state
    };
  }
});

// 注册组件
app.component('home-scene', HomeScene);
app.component('recipe-scene', RecipeScene);
app.component('making-scene', MakingScene);
app.component('tasting-scene', TastingScene);
app.component('result-scene', ResultScene);

// 挂载应用
app.mount('#app');

// 检查 URL 参数是否包含配方信息
const urlParams = new URLSearchParams(window.location.search);
const recipeParam = urlParams.get('recipe');

if (recipeParam) {
  try {
    const recipe = JSON.parse(recipeParam);
    // 更新状态
    state.recipe = recipe;
    // 导航到制作场景
    state.currentScene = 'making';
  } catch (error) {
    console.error('解析配方参数失败:', error);
  }
}