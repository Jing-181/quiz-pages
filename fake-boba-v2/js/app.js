import { createApp, ref, reactive, computed, onMounted, watch } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 常量
const CUP_OPTIONS = [
  { value: 'small', label: '小杯', capacity: '300ml' },
  { value: 'medium', label: '中杯', capacity: '500ml' },
  { value: 'large', label: '大杯', capacity: '700ml' }
];

const TEA_OPTIONS = [
  { value: 'black', label: '红茶', color: '#8B4513' },
  { value: 'green', label: '绿茶', color: '#90EE90' },
  { value: 'oolong', label: '乌龙茶', color: '#D2B48C' },
  { value: 'fruit', label: '果茶', color: '#FF6B6B' }
];

const TOPPING_OPTIONS = [
  { value: 'pearl', label: '珍珠', price: 2 },
  { value: 'pudding', label: '布丁', price: 3 },
  { value: 'coconut', label: '椰果', price: 2 },
  { value: 'jelly', label: '果冻', price: 2 },
  { value: 'cream', label: '奶盖', price: 4 }
];

const SWEETNESS_OPTIONS = [
  { value: 0, label: '无糖' },
  { value: 25, label: '微糖' },
  { value: 50, label: '半糖' },
  { value: 75, label: '七分糖' },
  { value: 100, label: '全糖' }
];

const ICE_OPTIONS = [
  { value: 0, label: '去冰' },
  { value: 25, label: '少冰' },
  { value: 50, label: '标准冰' },
  { value: 75, label: '多冰' },
  { value: 100, label: '满冰' }
];

const PRESET_RECIPES = [
  { name: '经典珍珠奶茶', cupType: 'medium', teaType: 'black', toppings: ['pearl'], sweetness: 50, iceLevel: 50 },
  { name: '清爽绿茶', cupType: 'small', teaType: 'green', toppings: ['coconut'], sweetness: 25, iceLevel: 75 },
  { name: '香浓乌龙茶', cupType: 'large', teaType: 'oolong', toppings: ['pudding', 'cream'], sweetness: 75, iceLevel: 25 },
  { name: '活力果茶', cupType: 'medium', teaType: 'fruit', toppings: ['jelly', 'pearl'], sweetness: 100, iceLevel: 50 }
];

const EMOTION_TEXTS = [
  '太棒了！这杯奶茶让我心情愉悦',
  '味道不错，感觉很放松',
  '有点甜，但还可以接受',
  '冰量刚好，口感很清爽',
  '配料很多，很满足',
  '茶香浓郁，回味无穷',
  '甜度适中，非常好喝',
  '冰爽解渴，夏天的最爱'
];

const MOOD_TAGS = ['开心', '放松', '满足', '愉悦', '幸福', '清爽', '活力', '温暖'];
const PERSONAL_MESSAGES = [
  '今天也要加油哦！',
  '享受每一刻的美好',
  '生活需要一点甜',
  '喝杯奶茶，心情变好',
  '忙碌的一天，给自己点奖励',
  '和朋友分享这份快乐',
  '每一口都是幸福的味道',
  '奶茶是最好的治愈'
];

// 主页组件
const HomeScene = {
  setup() {
    const state = appState;
    const displayCount = ref(0);
    
    const generateRandomRecipe = () => {
      const randomIndex = Math.floor(Math.random() * PRESET_RECIPES.length);
      const randomRecipe = PRESET_RECIPES[randomIndex];
      state.recipe = {
        cupType: randomRecipe.cupType,
        teaType: randomRecipe.teaType,
        toppings: randomRecipe.toppings,
        sweetness: randomRecipe.sweetness,
        iceLevel: randomRecipe.iceLevel
      };
      state.drinkCount++;
      state.currentScene = 'making';
    };
    
    const goToRecipe = () => {
      state.currentScene = 'recipe';
    };
    
    onMounted(() => {
      const animateCount = () => {
        if (displayCount.value < state.drinkCount) {
          displayCount.value++;
          setTimeout(animateCount, 50);
        }
      };
      animateCount();
    });
    
    return { displayCount, generateRandomRecipe, goToRecipe };
  },
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
          <p></p><p></p><p></p>
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
  `
};

// 配方选择组件
const RecipeScene = {
  setup() {
    const state = appState;
    const currentStep = ref(1);
    const selectedCup = ref(state.recipe.cupType || 'medium');
    const selectedTea = ref(state.recipe.teaType || 'black');
    const selectedToppings = ref(state.recipe.toppings || []);
    const selectedSweetness = ref(state.recipe.sweetness || 50);
    const selectedIceLevel = ref(state.recipe.iceLevel || 50);
    
    const toggleTopping = (value) => {
      const index = selectedToppings.value.indexOf(value);
      if (index > -1) {
        selectedToppings.value.splice(index, 1);
      } else {
        selectedToppings.value.push(value);
      }
    };
    
    const getOptionLabel = (options, value) => {
      const opt = options.find(o => o.value === value);
      return opt ? opt.label : '';
    };
    
    const isCurrentStepValid = computed(() => {
      switch (currentStep.value) {
        case 1: return !!selectedCup.value;
        case 2: return !!selectedTea.value;
        case 3: return selectedToppings.value.length > 0;
        default: return true;
      }
    });
    
    const previousStep = () => {
      if (currentStep.value > 1) currentStep.value--;
    };
    
    const nextStep = () => {
      if (currentStep.value < 5 && isCurrentStepValid.value) currentStep.value++;
    };
    
    const completeRecipe = () => {
      state.recipe = {
        cupType: selectedCup.value,
        teaType: selectedTea.value,
        toppings: selectedToppings.value,
        sweetness: selectedSweetness.value,
        iceLevel: selectedIceLevel.value
      };
      state.drinkCount++;
      state.currentScene = 'making';
    };
    
    const goToHome = () => {
      state.currentScene = 'home';
    };
    
    return {
      currentStep, selectedCup, selectedTea, selectedToppings, selectedSweetness, selectedIceLevel,
      CUP_OPTIONS, TEA_OPTIONS, TOPPING_OPTIONS, SWEETNESS_OPTIONS, ICE_OPTIONS,
      toggleTopping, getOptionLabel, isCurrentStepValid,
      previousStep, nextStep, completeRecipe, goToHome
    };
  },
  template: `
    <div class="scene">
      <h1>自定义配方</h1>
      
      <div class="steps">
        <div :class="['step', { active: currentStep === 1, completed: currentStep > 1 }]">1</div>
        <div :class="['step', { active: currentStep === 2, completed: currentStep > 2 }]">2</div>
        <div :class="['step', { active: currentStep === 3, completed: currentStep > 3 }]">3</div>
        <div :class="['step', { active: currentStep === 4, completed: currentStep > 4 }]">4</div>
        <div :class="['step', { active: currentStep === 5, completed: currentStep > 5 }]">5</div>
      </div>
      
      <div v-if="currentStep === 1">
        <h2>选择杯子类型</h2>
        <div class="selector">
          <div v-for="cup in CUP_OPTIONS" :key="cup.value"
               :class="['selector-item', { selected: selectedCup === cup.value }]"
               @click="selectedCup = cup.value">
            {{ cup.label }} ({{ cup.capacity }})
          </div>
        </div>
      </div>
      
      <div v-else-if="currentStep === 2">
        <h2>选择茶底</h2>
        <div class="selector">
          <div v-for="tea in TEA_OPTIONS" :key="tea.value"
               :class="['selector-item', { selected: selectedTea === tea.value }]"
               @click="selectedTea = tea.value">
            {{ tea.label }}
          </div>
        </div>
      </div>
      
      <div v-else-if="currentStep === 3">
        <h2>选择配料</h2>
        <div class="selector">
          <div v-for="topping in TOPPING_OPTIONS" :key="topping.value"
               :class="['selector-item', { selected: selectedToppings.includes(topping.value) }]"
               @click="toggleTopping(topping.value)">
            {{ topping.label }}
          </div>
        </div>
        <p>请至少选择一种配料</p>
      </div>
      
      <div v-else-if="currentStep === 4">
        <h2>选择甜度</h2>
        <input type="range" min="0" max="100" step="25" v-model="selectedSweetness">
        <p>{{ getOptionLabel(SWEETNESS_OPTIONS, selectedSweetness) }}</p>
      </div>
      
      <div v-else-if="currentStep === 5">
        <h2>选择冰量</h2>
        <input type="range" min="0" max="100" step="25" v-model="selectedIceLevel">
        <p>{{ getOptionLabel(ICE_OPTIONS, selectedIceLevel) }}</p>
      </div>
      
      <div class="button-group">
        <button v-if="currentStep > 1" @click="previousStep" class="secondary">上一步</button>
        <button v-if="currentStep < 5" @click="nextStep" :disabled="!isCurrentStepValid">下一步</button>
        <button v-if="currentStep === 5" @click="completeRecipe">完成配方</button>
        <button @click="goToHome" class="secondary">返回首页</button>
      </div>
    </div>
  `
};

// 制作场景组件
const MakingScene = {
  setup() {
    const state = appState;
    const isShaking = ref(false);
    const shakeInterval = ref(null);
    
    const circumference = 2 * Math.PI * 65;
    const dashOffset = computed(() => circumference * (1 - state.makingProgress / 100));
    
    const isComplete = computed(() => state.makingProgress >= 100);
    
    const toggleShake = () => {
      if (isShaking.value) stopShake();
      else startShake();
    };
    
    const startShake = () => {
      isShaking.value = true;
      shakeInterval.value = setInterval(() => {
        if (state.makingProgress < 100) state.makingProgress += 1;
        else stopShake();
      }, 100);
    };
    
    const stopShake = () => {
      isShaking.value = false;
      if (shakeInterval.value) {
        clearInterval(shakeInterval.value);
        shakeInterval.value = null;
      }
    };
    
    const goToTasting = () => {
      state.currentScene = 'tasting';
    };
    
    const goToHome = () => {
      state.currentScene = 'home';
    };
    
    onMounted(() => {
      startShake();
    });
    
    return {
      state, isShaking, circumference, dashOffset, isComplete,
      toggleShake, goToTasting, goToHome
    };
  },
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
        <div class="steam"><p></p><p></p><p></p></div>
      </div>
      
      <div class="progress-ring">
        <svg width="150" height="150">
          <circle class="bg" cx="75" cy="75" r="65"></circle>
          <circle class="progress" cx="75" cy="75" r="65"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"></circle>
        </svg>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;font-weight:600;">
          {{ Math.round(state.makingProgress) }}%
        </div>
      </div>
      
      <button @click="toggleShake" :disabled="isComplete">
        {{ isShaking ? '停止摇晃' : '开始摇晃' }}
      </button>
      
      <button v-if="isComplete" @click="goToTasting">开始品尝</button>
      <button @click="goToHome" class="secondary">返回首页</button>
    </div>
  `
};

// 品尝场景组件
const TastingScene = {
  setup() {
    const state = appState;
    const currentEmotion = ref('');
    const emotionTimeout = ref(null);
    
    const drinkHeight = computed(() => 80 - (state.tastingProgress * 0.8));
    const isComplete = computed(() => state.tastingProgress >= 100);
    
    const sip = () => {
      state.tastingProgress += 20;
      const randomIndex = Math.floor(Math.random() * EMOTION_TEXTS.length);
      currentEmotion.value = EMOTION_TEXTS[randomIndex];
      
      if (emotionTimeout.value) clearTimeout(emotionTimeout.value);
      emotionTimeout.value = setTimeout(() => currentEmotion.value = '', 3000);
    };
    
    const goToResult = () => {
      state.currentScene = 'result';
    };
    
    const goToHome = () => {
      state.currentScene = 'home';
    };
    
    return {
      state, currentEmotion, drinkHeight, isComplete, sip, goToResult, goToHome
    };
  },
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
        <div class="steam"><p></p><p></p><p></p></div>
      </div>
      
      <div v-if="currentEmotion" class="emotion-bubble">
        <p>{{ currentEmotion }}</p>
      </div>
      
      <div class="progress-bar">
        <div class="progress" :style="{ width: state.tastingProgress + '%' }"></div>
      </div>
      <p>剩余 {{ 100 - Math.round(state.tastingProgress) }}%</p>
      
      <button @click="sip" :disabled="isComplete">啜饮一口</button>
      <button v-if="isComplete" @click="goToResult">查看结果</button>
      <button @click="goToHome" class="secondary">返回首页</button>
    </div>
  `
};

// 结果场景组件
const ResultScene = {
  setup() {
    const state = appState;
    
    const getOptionLabel = (options, value) => {
      const opt = options.find(o => o.value === value);
      return opt ? opt.label : '';
    };
    
    const getToppingLabels = (toppings) => {
      return toppings.map(v => {
        const t = TOPPING_OPTIONS.find(o => o.value === v);
        return t ? t.label : '';
      });
    };
    
    const shareRecipe = () => {
      const recipe = state.recipe;
      const shareUrl = window.location.origin + window.location.pathname + '?recipe=' + encodeURIComponent(JSON.stringify(recipe));
      
      if (navigator.share) {
        navigator.share({ title: '我的奶茶配方', text: '来看看我制作的奶茶配方！', url: shareUrl });
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => alert('分享链接已复制到剪贴板！'));
      }
    };
    
    const saveRecipe = () => {
      const recipe = {
        ...state.recipe,
        moodTag: state.moodTag,
        personalMessage: state.personalMessage,
        timestamp: new Date().toISOString()
      };
      
      const savedRecipes = JSON.parse(localStorage.getItem('fakeBobaRecipes') || '[]');
      savedRecipes.push(recipe);
      localStorage.setItem('fakeBobaRecipes', JSON.stringify(savedRecipes));
      alert('配方已保存！');
    };
    
    const goToHome = () => {
      state.currentScene = 'home';
    };
    
    onMounted(() => {
      state.moodTag = MOOD_TAGS[Math.floor(Math.random() * MOOD_TAGS.length)];
      state.personalMessage = PERSONAL_MESSAGES[Math.floor(Math.random() * PERSONAL_MESSAGES.length)];
    });
    
    return {
      state, CUP_OPTIONS, TEA_OPTIONS, TOPPING_OPTIONS, SWEETNESS_OPTIONS, ICE_OPTIONS,
      getOptionLabel, getToppingLabels, shareRecipe, saveRecipe, goToHome
    };
  },
  template: `
    <div class="scene">
      <h1>品尝完成</h1>
      
      <div class="result-card">
        <h2>你的奶茶配方</h2>
        <div class="recipe-details">
          <p><strong>杯子类型：</strong>{{ getOptionLabel(CUP_OPTIONS, state.recipe.cupType) }}</p>
          <p><strong>茶底：</strong>{{ getOptionLabel(TEA_OPTIONS, state.recipe.teaType) }}</p>
          <p><strong>配料：</strong>{{ getToppingLabels(state.recipe.toppings).join('、') }}</p>
          <p><strong>甜度：</strong>{{ getOptionLabel(SWEETNESS_OPTIONS, state.recipe.sweetness) }}</p>
          <p><strong>冰量：</strong>{{ getOptionLabel(ICE_OPTIONS, state.recipe.iceLevel) }}</p>
        </div>
        
        <div class="mood-tag">{{ state.moodTag }}</div>
        <p class="personal-message">{{ state.personalMessage }}</p>
      </div>
      
      <div class="button-group">
        <button @click="shareRecipe" class="share-button">分享配方</button>
        <button @click="saveRecipe">保存配方</button>
        <button @click="goToHome">制作新奶茶</button>
      </div>
    </div>
  `
};

// 全局状态
const appState = reactive({
  currentScene: 'home',
  recipe: { cupType: 'medium', teaType: 'black', toppings: [], sweetness: 50, iceLevel: 50 },
  makingProgress: 0,
  tastingProgress: 0,
  moodTag: '',
  personalMessage: '',
  drinkCount: 0
});

// 监听场景变化，重置相应的状态
watch(() => appState.currentScene, (newScene) => {
  if (newScene === 'making') {
    appState.makingProgress = 0;
  } else if (newScene === 'tasting') {
    appState.tastingProgress = 0;
  }
});

// 检查 URL 参数
const urlParams = new URLSearchParams(window.location.search);
const recipeParam = urlParams.get('recipe');

if (recipeParam) {
  try {
    const recipe = JSON.parse(decodeURIComponent(recipeParam));
    appState.recipe = recipe;
    appState.currentScene = 'making';
  } catch (e) {
    console.error('解析配方参数失败:', e);
  }
}

// 创建应用
const app = createApp({
  setup() {
    return { state: appState };
  },
  components: { HomeScene, RecipeScene, MakingScene, TastingScene, ResultScene },
  template: `
    <home-scene v-if="state.currentScene === 'home'" />
    <recipe-scene v-else-if="state.currentScene === 'recipe'" />
    <making-scene v-else-if="state.currentScene === 'making'" />
    <tasting-scene v-else-if="state.currentScene === 'tasting'" />
    <result-scene v-else-if="state.currentScene === 'result'" />
  `
});

app.mount('#app');
