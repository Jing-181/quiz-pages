import { ref, computed, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { state, computedState } from '../store/state.js';
import useScene from '../composables/useScene.js';

const MakingScene = {
  template: `
    <div class="scene">
      <h1>制作中</h1>
      <p>摇晃奶茶，使其充分混合</p>
      
      <div :class="['cup-container', { shaking: isShaking }]">
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
      
      <!-- 进度环 -->
      <div class="progress-ring">
        <svg width="150" height="150">
          <circle 
            class="bg" 
            cx="75" 
            cy="75" 
            r="65"
          />
          <circle 
            class="progress" 
            cx="75" 
            cy="75" 
            r="65"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; font-weight: 600;">
          {{ Math.round(state.makingProgress) }}%
        </div>
      </div>
      
      <button 
        @click="toggleShake"
        :disabled="isComplete"
      >
        {{ isShaking ? '停止摇晃' : '开始摇晃' }}
      </button>
      
      <button 
        v-if="isComplete" 
        @click="goToTasting"
      >
        开始品尝
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
    const { goToHome, goToTasting } = useScene();
    const isShaking = ref(false);
    const shakeInterval = ref(null);
    
    // 计算进度环参数
    const circumference = 2 * Math.PI * 65;
    const dashOffset = computed(() => {
      const progress = state.makingProgress / 100;
      return circumference * (1 - progress);
    });
    
    // 检查是否完成
    const isComplete = computed(() => {
      return state.makingProgress >= 100;
    });
    
    // 开始/停止摇晃
    const toggleShake = () => {
      if (isShaking.value) {
        stopShake();
      } else {
        startShake();
      }
    };
    
    // 开始摇晃
    const startShake = () => {
      isShaking.value = true;
      
      // 每100毫秒增加1%的进度
      shakeInterval.value = setInterval(() => {
        if (state.makingProgress < 100) {
          state.makingProgress += 1;
        } else {
          stopShake();
        }
      }, 100);
    };
    
    // 停止摇晃
    const stopShake = () => {
      isShaking.value = false;
      if (shakeInterval.value) {
        clearInterval(shakeInterval.value);
        shakeInterval.value = null;
      }
    };
    
    // 组件挂载时自动开始摇晃
    onMounted(() => {
      startShake();
    });
    
    return {
      state,
      isShaking,
      circumference,
      dashOffset,
      isComplete,
      toggleShake,
      goToTasting,
      goToHome
    };
  }
};

export default MakingScene;