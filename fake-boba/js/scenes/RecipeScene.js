import { state } from '../store/state.js';
import { TEA_OPTIONS, TOPPING_OPTIONS, SWEET_OPTIONS, ICE_OPTIONS, ICE_COUNT_MAP, PRESETS } from '../data/constants.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'RecipeScene',
  data: function () {
    return {
      recipeStep: 0,
      stepLabels: ['选配方', '选杯型', '选茶底', '选小料', '甜度 & 冰度'],
      cupTypes: [
        { value: 'classic', label: '经典杯', iconClass: '' },
        { value: 'fat', label: '胖胖杯', iconClass: 'fat' },
        { value: 'tall', label: '高瘦杯', iconClass: 'tall' },
      ],
      teaOptions: TEA_OPTIONS,
      toppingOptions: TOPPING_OPTIONS,
      sweetOptions: SWEET_OPTIONS,
      iceOptions: ICE_OPTIONS,
      presets: PRESETS,
      selectedPreset: null,
    };
  },
  computed: {
    // 直接在 computed 中访问全局 state
    selectedCup: function() { return state.cup; },
    selectedTea: function() { return state.tea; },
    teaColor: function() { return state.teaColor; },
    toppings: function() { return state.toppings; },
    selectedSweet: function() { return state.sweet; },
    selectedIce: function() { return state.ice; },
    iceLevel: function() { return state.iceLevel; },
    iceCount: function() { return state.iceCount; },
    
    progressPct: function () {
      return ((this.recipeStep + 1) / 5) * 100;
    },
    stepLabelText: function () {
      return '第 ' + (this.recipeStep + 1) + ' 步 / 共 5 步 · ' + this.stepLabels[this.recipeStep];
    },
    isPrevHidden: function () {
      return this.recipeStep === 0;
    },
    isNextDisabled: function () {
      return !this.isStepValid(this.recipeStep);
    },
    nextButtonText: function () {
      return this.recipeStep === 4 ? '开始制作！' : '下一步';
    },
    toppingCountText: function () {
      return '已选 ' + this.toppings.length + '/3 个小料';
    },
  },
  methods: {
    isStepValid: function (step) {
      if (step === 0) return true; // 配方选择是可选的
      if (step === 1) return this.selectedCup !== '';
      if (step === 2) return this.selectedTea !== '';
      if (step === 3) return this.toppings.length > 0;
      if (step === 4) return this.selectedSweet !== '' && this.selectedIce !== '';
      return false;
    },

    selectPreset: function (preset) {
      this.selectedPreset = preset;
      state.cup = 'classic';
      state.tea = preset.tea;
      state.teaColor = preset.color;
      state.toppings = preset.toppings.slice();
      state.sweet = preset.sweet;
      state.ice = preset.ice;
      state.iceLevel = preset.ice;
      state.iceCount = ICE_COUNT_MAP[preset.ice] || 0;
      state.recipeName = preset.name;
      state.recipeCal = preset.cal;
      state.liquidColor = preset.color;
    },

    selectCup: function (type) {
      state.cup = type;
    },

    selectTea: function (tea) {
      state.tea = tea.name;
      state.teaColor = tea.color;
    },

    toggleTopping: function (name) {
      var idx = this.toppings.indexOf(name);
      if (idx >= 0) {
        this.toppings.splice(idx, 1);
      } else {
        if (this.toppings.length >= 3) return;
        this.toppings.push(name);
      }
    },

    selectSweet: function (val) {
      state.sweet = val;
    },

    selectIce: function (val) {
      state.ice = val;
      state.iceLevel = val;
      state.iceCount = ICE_COUNT_MAP[val] || 0;
    },

    nextStep: function () {
      if (!this.isStepValid(this.recipeStep)) return;
      if (this.recipeStep < 4) {
        this.recipeStep++;
      } else {
        if (!this.selectedPreset) {
          this.buildCustomRecipe();
        }
        var scene = useScene();
        scene.goToScene('making');
      }
    },

    prevStep: function () {
      if (this.recipeStep > 0) {
        this.recipeStep--;
      }
    },

    goHome: function () {
      var scene = useScene();
      scene.goToScene('home');
    },

    buildCustomRecipe: function () {
      var teaName = this.selectedTea;
      var toppingStr = this.toppings.length > 0 ? this.toppings[0] : '';
      state.recipeName = teaName + (toppingStr ? toppingStr : '奶茶');
      state.liquidColor = this.teaColor;
      state.iceLevel = this.selectedIce;
      state.iceCount = ICE_COUNT_MAP[this.selectedIce] || 0;
      state.recipeCal = 300 + this.toppings.length * 60;
      if (this.selectedSweet === '全糖') state.recipeCal += 80;
      if (this.selectedSweet === '七分甜') state.recipeCal += 50;
      if (this.selectedSweet === '五分甜') state.recipeCal += 30;
      state.sipCount = 0;
      state.shakeProgress = 0;
    },
  },
  template: `
    <div id="scene-recipe" class="scene">
      <div class="recipe-header">
        <button class="btn-back" @click="goHome">←</button>
        <h2 class="brand-title">选配方法</h2>
      </div>
      <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPct + '%' }"></div></div>
      <p class="step-label">{{ stepLabelText }}</p>

      <!-- Step 1: Preset recipes -->
      <div class="step-panel" v-show="recipeStep === 0">
        <div class="topping-pills">
          <div v-for="preset in presets" :key="preset.name"
               class="topping-pill"
               :class="{ selected: selectedPreset && selectedPreset.name === preset.name }"
               @click="selectPreset(preset)">
            {{ preset.name }}
          </div>
        </div>
        <p class="topping-count">选择一个配方，或直接下一步自定义</p>
      </div>

      <!-- Step 2: Cup type -->
      <div class="step-panel" v-show="recipeStep === 1">
        <div class="cup-options">
          <div v-for="cup in cupTypes" :key="cup.value"
               class="cup-card"
               :class="{ selected: selectedCup === cup.value }"
               @click="selectCup(cup.value)">
            <div class="cup-card-icon" :class="cup.iconClass"></div>
            <span>{{ cup.label }}</span>
          </div>
        </div>
      </div>

      <!-- Step 3: Tea -->
      <div class="step-panel" v-show="recipeStep === 2">
        <div class="tea-grid">
          <div v-for="tea in teaOptions" :key="tea.name"
               class="tea-item"
               :class="{ selected: selectedTea === tea.name }"
               @click="selectTea(tea)">
            <div class="tea-color" :style="{ background: tea.color }"></div>
            <span>{{ tea.name }}</span>
          </div>
        </div>
      </div>

      <!-- Step 4: Toppings -->
      <div class="step-panel" v-show="recipeStep === 3">
        <div class="topping-pills">
          <div v-for="name in toppingOptions" :key="name"
               class="topping-pill"
               :class="{ selected: toppings.indexOf(name) >= 0 }"
               @click="toggleTopping(name)">
            {{ name }}
          </div>
        </div>
        <p class="topping-count">{{ toppingCountText }}</p>
      </div>

      <!-- Step 5: Sweetness & Ice -->
      <div class="step-panel" v-show="recipeStep === 4">
        <div class="slider-group">
          <p class="slider-label">甜度</p>
          <div class="segment-control">
            <button v-for="s in sweetOptions" :key="s"
                    class="segment-btn"
                    :class="{ active: selectedSweet === s }"
                    @click="selectSweet(s)">
              {{ s }}
            </button>
          </div>
          <p class="slider-label">冰度</p>
          <div class="segment-control">
            <button v-for="ic in iceOptions" :key="ic"
                    class="segment-btn"
                    :class="{ active: selectedIce === ic }"
                    @click="selectIce(ic)">
              {{ ic }}
            </button>
          </div>
        </div>
      </div>

      <div class="recipe-nav">
        <button class="btn-prev" :class="{ hidden: isPrevHidden }" @click="prevStep">上一步</button>
        <button class="btn-next" :disabled="isNextDisabled" @click="nextStep">{{ nextButtonText }}</button>
      </div>
    </div>`,
};