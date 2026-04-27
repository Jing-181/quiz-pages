import { ref, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { state, computedState } from '../store/state.js';
import { CUP_OPTIONS, TEA_OPTIONS, TOPPING_OPTIONS, SWEETNESS_OPTIONS, ICE_OPTIONS } from '../data/constants.js';
import useScene from '../composables/useScene.js';

const RecipeScene = {
  template: `
    <div class="scene">
      <h1>自定义配方</h1>
      
      <!-- 步骤指示器 -->
      <div class="steps">
        <div :class="['step', { active: currentStep === 1, completed: currentStep > 1 }]">1</div>
        <div :class="['step', { active: currentStep === 2, completed: currentStep > 2 }]">2</div>
        <div :class="['step', { active: currentStep === 3, completed: currentStep > 3 }]">3</div>
        <div :class="['step', { active: currentStep === 4, completed: currentStep > 4 }]">4</div>
        <div :class="['step', { active: currentStep === 5, completed: currentStep > 5 }]">5</div>
      </div>
      
      <!-- 步骤内容 -->
      <div v-if="currentStep === 1">
        <h2>选择杯子类型</h2>
        <div class="selector">
          <div 
            v-for="cup in cupOptions" 
            :key="cup.value"
            :class="['selector-item', { selected: selectedCup === cup.value }]"
            @click="selectCup(cup.value)"
          >
            {{ cup.label }} ({{ cup.capacity }})
          </div>
        </div>
      </div>
      
      <div v-else-if="currentStep === 2">
        <h2>选择茶底</h2>
        <div class="selector">
          <div 
            v-for="tea in teaOptions" 
            :key="tea.value"
            :class="['selector-item', { selected: selectedTea === tea.value }]"
            @click="selectTea(tea.value)"
          >
            {{ tea.label }}
          </div>
        </div>
      </div>
      
      <div v-else-if="currentStep === 3">
        <h2>选择配料</h2>
        <div class="selector">
          <div 
            v-for="topping in toppingOptions" 
            :key="topping.value"
            :class="['selector-item', { selected: selectedToppings.includes(topping.value) }]"
            @click="toggleTopping(topping.value)"
          >
            {{ topping.label }}
          </div>
        </div>
        <p>请至少选择一种配料</p>
      </div>
      
      <div v-else-if="currentStep === 4">
        <h2>选择甜度</h2>
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="25" 
          v-model="selectedSweetness"
        >
        <p>{{ getOptionLabel(SWEETNESS_OPTIONS, selectedSweetness) }}</p>
      </div>
      
      <div v-else-if="currentStep === 5">
        <h2>选择冰量</h2>
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="25" 
          v-model="selectedIceLevel"
        >
        <p>{{ getOptionLabel(ICE_OPTIONS, selectedIceLevel) }}</p>
      </div>
      
      <!-- 导航按钮 -->
      <div class="button-group">
        <button 
          v-if="currentStep > 1" 
          @click="previousStep"
          class="secondary"
        >
          上一步
        </button>
        <button 
          v-if="currentStep < 5" 
          @click="nextStep"
          :disabled="!isCurrentStepValid"
        >
          下一步
        </button>
        <button 
          v-if="currentStep === 5" 
          @click="completeRecipe"
        >
          完成配方
        </button>
        <button 
          @click="goToHome"
          class="secondary"
        >
          返回首页
        </button>
      </div>
    </div>
  `,
  
  setup() {
    const { goToHome, goToMaking } = useScene();
    const currentStep = ref(1);
    
    // 本地状态
    const selectedCup = ref(state.recipe.cupType);
    const selectedTea = ref(state.recipe.teaType);
    const selectedToppings = ref([...state.recipe.toppings]);
    const selectedSweetness = ref(state.recipe.sweetness);
    const selectedIceLevel = ref(state.recipe.iceLevel);
    
    // 选项数据
    const cupOptions = CUP_OPTIONS;
    const teaOptions = TEA_OPTIONS;
    const toppingOptions = TOPPING_OPTIONS;
    
    // 检查当前步骤是否有效
    const isCurrentStepValid = computed(() => {
      switch (currentStep.value) {
        case 1:
          return !!selectedCup.value;
        case 2:
          return !!selectedTea.value;
        case 3:
          return selectedToppings.value.length > 0;
        case 4:
          return selectedSweetness.value !== undefined;
        case 5:
          return selectedIceLevel.value !== undefined;
        default:
          return false;
      }
    });
    
    // 选择杯子类型
    const selectCup = (value) => {
      selectedCup.value = value;
    };
    
    // 选择茶底
    const selectTea = (value) => {
      selectedTea.value = value;
    };
    
    // 切换配料
    const toggleTopping = (value) => {
      const index = selectedToppings.value.indexOf(value);
      if (index > -1) {
        selectedToppings.value.splice(index, 1);
      } else {
        selectedToppings.value.push(value);
      }
    };
    
    // 获取选项标签
    const getOptionLabel = (options, value) => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : '';
    };
    
    // 上一步
    const previousStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
      }
    };
    
    // 下一步
    const nextStep = () => {
      if (currentStep.value < 5 && isCurrentStepValid.value) {
        currentStep.value++;
      }
    };
    
    // 完成配方
    const completeRecipe = () => {
      // 更新状态
      state.recipe = {
        cupType: selectedCup.value,
        teaType: selectedTea.value,
        toppings: selectedToppings.value,
        sweetness: selectedSweetness.value,
        iceLevel: selectedIceLevel.value
      };
      
      // 增加饮品数量
      state.drinkCount++;
      
      // 导航到制作场景
      goToMaking();
    };
    
    return {
      currentStep,
      selectedCup,
      selectedTea,
      selectedToppings,
      selectedSweetness,
      selectedIceLevel,
      cupOptions,
      teaOptions,
      toppingOptions,
      SWEETNESS_OPTIONS,
      ICE_OPTIONS,
      isCurrentStepValid,
      selectCup,
      selectTea,
      toggleTopping,
      getOptionLabel,
      previousStep,
      nextStep,
      completeRecipe,
      goToHome
    };
  }
};

export default RecipeScene;