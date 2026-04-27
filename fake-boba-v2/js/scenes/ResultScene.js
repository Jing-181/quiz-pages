import { ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { state, computedState } from '../store/state.js';
import { CUP_OPTIONS, TEA_OPTIONS, TOPPING_OPTIONS, SWEETNESS_OPTIONS, ICE_OPTIONS, MOOD_TAGS, PERSONAL_MESSAGES } from '../data/constants.js';
import useScene from '../composables/useScene.js';

const ResultScene = {
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
        
        <div class="mood-tag">
          {{ state.moodTag }}
        </div>
        
        <p class="personal-message">
          {{ state.personalMessage }}
        </p>
      </div>
      
      <div class="button-group">
        <button @click="shareRecipe" class="share-button">
          分享配方
        </button>
        <button @click="saveRecipe">
          保存配方
        </button>
        <button @click="goToHome">
          制作新奶茶
        </button>
      </div>
    </div>
  `,
  
  setup() {
    const { goToHome } = useScene();
    
    // 获取选项标签
    const getOptionLabel = (options, value) => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : '';
    };
    
    // 获取配料标签
    const getToppingLabels = (toppingValues) => {
      return toppingValues.map(value => {
        const topping = TOPPING_OPTIONS.find(opt => opt.value === value);
        return topping ? topping.label : '';
      });
    };
    
    // 分享配方
    const shareRecipe = () => {
      // 生成分享链接（这里使用简化的实现）
      const recipe = state.recipe;
      const shareUrl = `${window.location.origin}${window.location.pathname}?recipe=${JSON.stringify(recipe)}`;
      
      // 尝试使用 navigator.share API
      if (navigator.share) {
        navigator.share({
          title: '我的奶茶配方',
          text: '来看看我制作的奶茶配方！',
          url: shareUrl
        }).catch(err => {
          console.error('分享失败:', err);
          //  fallback to copy to clipboard
          copyToClipboard(shareUrl);
        });
      } else {
        //  fallback to copy to clipboard
        copyToClipboard(shareUrl);
      }
    };
    
    // 复制到剪贴板
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert('分享链接已复制到剪贴板！');
      }).catch(err => {
        console.error('复制失败:', err);
        alert('分享链接：' + text);
      });
    };
    
    // 保存配方
    const saveRecipe = () => {
      // 这里可以实现保存到本地存储的逻辑
      const recipe = {
        ...state.recipe,
        moodTag: state.moodTag,
        personalMessage: state.personalMessage,
        timestamp: new Date().toISOString()
      };
      
      // 从本地存储获取现有配方
      const savedRecipes = JSON.parse(localStorage.getItem('fakeBobaRecipes') || '[]');
      
      // 添加新配方
      savedRecipes.push(recipe);
      
      // 保存回本地存储
      localStorage.setItem('fakeBobaRecipes', JSON.stringify(savedRecipes));
      
      alert('配方已保存！');
    };
    
    // 组件挂载时生成随机心情标签和个人留言
    onMounted(() => {
      // 生成随机心情标签
      const randomMoodIndex = Math.floor(Math.random() * MOOD_TAGS.length);
      state.moodTag = MOOD_TAGS[randomMoodIndex];
      
      // 生成随机个人留言
      const randomMessageIndex = Math.floor(Math.random() * PERSONAL_MESSAGES.length);
      state.personalMessage = PERSONAL_MESSAGES[randomMessageIndex];
    });
    
    return {
      state,
      CUP_OPTIONS,
      TEA_OPTIONS,
      TOPPING_OPTIONS,
      SWEETNESS_OPTIONS,
      ICE_OPTIONS,
      getOptionLabel,
      getToppingLabels,
      shareRecipe,
      saveRecipe,
      goToHome
    };
  }
};

export default ResultScene;