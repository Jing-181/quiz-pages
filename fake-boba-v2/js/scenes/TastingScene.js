import { ref, computed, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { state, computedState } from '../store/state.js';
import { EMOTION_TEXTS } from '../data/constants.js';
import useScene from '../composables/useScene.js';

const TastingScene = {
  template: `
    <div class="scene">
      <h1>品尝中</h1>
      <p>享受你的奶茶，每一口都是幸福的味道</p>
      
      <div class="cup-container">
        <div class="cup">
          <div class="cup-lid"></div>
          <div class="cup-straw"></div>
          <div class="drink" :style="{ height: drinkHeight + '%' }"></div>
        </div>
        <div class="steam">
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
      
      <!-- 情绪气泡 -->
      <div v-if="currentEmotion" class="emotion-bubble">
        <p>{{ currentEmotion }}</p>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: state.tastingProgress + '%' }"></div>
      </div>
      <p>剩余 {{ 100 - Math.round(state.tastingProgress) }}%</p>
      
      <button 
        @click="sip"
        :disabled="isComplete"
      >
        啜饮一口
      </button>
      
      <button 
        v-if="isComplete" 
        @click="goToResult"
      >
        查看结果
      </button>
      
      <button 
        @click="goToHome"
        class="secondary"
      >
        返回首页
      </button>
    </div>
  `,
  
  setup() {
    const { goToHome, goToResult } = useScene();
    const currentEmotion = ref('');
    const emotionTimeout = ref(null);
    
    // 计算饮品高度（随着品尝减少）
    const drinkHeight = computed(() => {
      return 80 - (state.tastingProgress * 0.8); // 从80%减少到0%
    });
    
    // 检查是否完成
    const isComplete = computed(() => {
      return state.tastingProgress >= 100;
    });
    
    // 啜饮一口
    const sip = () => {
      // 增加品尝进度
      state.tastingProgress += 20; // 每次啜饮增加20%
      
      // 显示随机情绪文本
      showRandomEmotion();
      
      // 如果完成品尝，导航到结果场景
      if (state.tastingProgress >= 100) {
        state.tastingProgress = 100;
      }
    };
    
    // 显示随机情绪文本
    const showRandomEmotion = () => {
      const randomIndex = Math.floor(Math.random() * EMOTION_TEXTS.length);
      currentEmotion.value = EMOTION_TEXTS[randomIndex];
      
      // 3秒后清除情绪文本
      if (emotionTimeout.value) {
        clearTimeout(emotionTimeout.value);
      }
      emotionTimeout.value = setTimeout(() => {
        currentEmotion.value = '';
      }, 3000);
    };
    
    return {
      state,
      currentEmotion,
      drinkHeight,
      isComplete,
      sip,
      goToResult,
      goToHome
    };
  }
};

export default TastingScene;