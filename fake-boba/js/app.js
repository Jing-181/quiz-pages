const { createApp, reactive, computed, provide, ref } = Vue;
import { state } from './store/state.js';

// Components
import CupComponent from './components/CupComponent.js';
import EmotionBubble from './components/EmotionBubble.js';

// Scenes
import HomeScene from './scenes/HomeScene.js';
import RecipeScene from './scenes/RecipeScene.js';
import MakingScene from './scenes/MakingScene.js';
import TastingScene from './scenes/TastingScene.js';
import ResultScene from './scenes/ResultScene.js';

const app = createApp({
  components: {
    CupComponent,
    EmotionBubble,
    HomeScene,
    RecipeScene,
    MakingScene,
    TastingScene,
    ResultScene,
  },
  template: `
    <!-- Background blobs -->
    <div class="bg-blob bg-blob-1"></div>
    <div class="bg-blob bg-blob-2"></div>
    <div class="bg-blob bg-blob-3"></div>

    <!-- Warm overlay -->
    <div class="warm-overlay" :class="{ active: state.currentScene === 'tasting' && state.sipCount >= 3 }"></div>

    <!-- Scenes -->
    <home-scene v-if="state.currentScene === 'home' />
    <recipe-scene v-if="state.currentScene === 'recipe' />
    <making-scene v-if="state.currentScene === 'making' />
    <tasting-scene v-if="state.currentScene === 'tasting' />
    <result-scene v-if="state.currentScene === 'result' />
  `,
  setup() {
    // 解析分享链接
    function parseShareLink() {
      const urlParams = new URLSearchParams(window.location.search);
      const recipeParam = urlParams.get('recipe');
      if (recipeParam) {
        try {
          const recipeData = JSON.parse(decodeURIComponent(recipeParam));
          // 设置配方数据
          state.cup = recipeData.cup || 'classic';
          state.tea = recipeData.tea || '';
          state.teaColor = recipeData.teaColor || '#C4956A';
          state.toppings = recipeData.toppings || [];
          state.sweet = recipeData.sweet || '';
          state.ice = recipeData.ice || '';
          state.iceLevel = recipeData.ice || '';
          state.recipeName = recipeData.recipeName || '';
          state.recipeCal = recipeData.recipeCal || 0;
          state.liquidColor = recipeData.teaColor || '#C4956A';
          state.sipCount = 0;
          state.shakeProgress = 0;
          // 直接进入制作场景
          state.currentScene = 'making';
        } catch (error) {
          console.log('解析分享链接失败:', error);
        }
      }
    }

    // 初始化时解析分享链接
    parseShareLink();

    provide('state', state);
    return { state };
  }
});

app.mount('#app');
