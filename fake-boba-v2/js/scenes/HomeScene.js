import { ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { state } from '../store/state.js';
import { PRESET_RECIPES } from '../data/constants.js';
import useScene from '../composables/useScene.js';

const HomeScene = {
  template: `
    <div class="scene">
      <h1>假装喝奶茶</h1>
      <p>选择一种方式开始你的奶茶之旅</p>
      
      <div class="cup-container">
        <div class="cup">
          <div class="cup-lid"></div>
          <div class="cup-straw"></div>
          <div class="drink"></div>
        </div>
        <div class="steam">
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
      
      <div class="drink-count">
        <h3>已制作 {{ displayCount }} 杯奶茶</h3>
      </div>
      
      <div class="button-group">
        <button @click="generateRandomRecipe">随机配方</button>
        <button @click="goToRecipe">自定义配方</button>
      </div>
    </div>
  `,
  
  setup() {
    const { goToRecipe, goToMaking } = useScene();
    const displayCount = ref(0);
    
    // 生成随机配方
    const generateRandomRecipe = () => {
      const randomIndex = Math.floor(Math.random() * PRESET_RECIPES.length);
      const randomRecipe = PRESET_RECIPES[randomIndex];
      
      // 更新状态
      state.recipe = {
        cupType: randomRecipe.cupType,
        teaType: randomRecipe.teaType,
        toppings: randomRecipe.toppings,
        sweetness: randomRecipe.sweetness,
        iceLevel: randomRecipe.iceLevel
      };
      
      // 增加饮品数量
      state.drinkCount++;
      
      // 导航到制作场景
      goToMaking();
    };
    
    // 动画显示饮品数量
    onMounted(() => {
      const animateCount = () => {
        if (displayCount.value < state.drinkCount) {
          displayCount.value++;
          setTimeout(animateCount, 50);
        }
      };
      animateCount();
    });
    
    return {
      displayCount,
      generateRandomRecipe,
      goToRecipe
    };
  }
};

export default HomeScene;