import { state } from '../store/state.js';
import { TEA_OPTIONS, TOPPING_OPTIONS, SWEET_OPTIONS, ICE_OPTIONS, ICE_COUNT_MAP } from '../data/constants.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'RecipeScene',
  data: function () {
    return {
      state: state,
      recipeStep: 0,
      stepLabels: ['\u9009\u676F\u578B', '\u9009\u8336\u5E95', '\u9009\u5C0F\u6599', '\u751C\u5EA6 & \u51B0\u5EA6'],
      cupTypes: [
        { value: 'classic', label: '\u7ECF\u5178\u676F', iconClass: '' },
        { value: 'fat', label: '\u80D6\u80D6\u676F', iconClass: 'fat' },
        { value: 'tall', label: '\u9AD8\u7626\u676F', iconClass: 'tall' },
      ],
      teaOptions: TEA_OPTIONS,
      toppingOptions: TOPPING_OPTIONS,
      sweetOptions: SWEET_OPTIONS,
      iceOptions: ICE_OPTIONS,
    };
  },
  computed: {
    progressPct: function () {
      return ((this.recipeStep + 1) / 4) * 100;
    },
    stepLabelText: function () {
      return '\u7B2C ' + (this.recipeStep + 1) + ' \u6B65 / \u5171 4 \u6B65 \u00B7 ' + this.stepLabels[this.recipeStep];
    },
    isPrevHidden: function () {
      return this.recipeStep === 0;
    },
    isNextDisabled: function () {
      return !this.isStepValid(this.recipeStep);
    },
    nextButtonText: function () {
      return this.recipeStep === 3 ? '\u5F00\u59CB\u5236\u4F5C\uFF01' : '\u4E0B\u4E00\u6B65';
    },
    toppingCountText: function () {
      return '\u5DF2\u9009 ' + this.state.toppings.length + '/3 \u4E2A\u5C0F\u6599';
    },
  },
  methods: {
    isStepValid: function (step) {
      if (step === 0) return this.state.cup !== '';
      if (step === 1) return this.state.tea !== '';
      if (step === 2) return this.state.toppings.length > 0;
      if (step === 3) return this.state.sweet !== '' && this.state.ice !== '';
      return false;
    },

    selectCup: function (type) {
      this.state.cup = type;
    },

    selectTea: function (tea) {
      this.state.tea = tea.name;
      this.state.teaColor = tea.color;
    },

    toggleTopping: function (name) {
      var idx = this.state.toppings.indexOf(name);
      if (idx >= 0) {
        this.state.toppings.splice(idx, 1);
      } else {
        if (this.state.toppings.length >= 3) return;
        this.state.toppings.push(name);
      }
    },

    selectSweet: function (val) {
      this.state.sweet = val;
    },

    selectIce: function (val) {
      this.state.ice = val;
      this.state.iceLevel = val;
      this.state.iceCount = ICE_COUNT_MAP[val] || 0;
    },

    nextStep: function () {
      if (!this.isStepValid(this.recipeStep)) return;
      if (this.recipeStep < 3) {
        this.recipeStep++;
      } else {
        this.buildCustomRecipe();
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
      var teaName = this.state.tea;
      var toppingStr = this.state.toppings.length > 0 ? this.state.toppings[0] : '';
      this.state.recipeName = teaName + (toppingStr ? toppingStr : '\u5976\u8336');
      this.state.liquidColor = this.state.teaColor;
      this.state.iceLevel = this.state.ice;
      this.state.iceCount = ICE_COUNT_MAP[this.state.ice] || 0;
      this.state.recipeCal = 300 + this.state.toppings.length * 60;
      if (this.state.sweet === '\u5168\u7CD6') this.state.recipeCal += 80;
      if (this.state.sweet === '\u4E03\u5206\u751C') this.state.recipeCal += 50;
      if (this.state.sweet === '\u4E94\u5206\u751C') this.state.recipeCal += 30;
      this.state.sipCount = 0;
      this.state.shakeProgress = 0;
    },
  },
  template: '\
    <div id="scene-recipe" class="scene">\
      <div class="recipe-header">\
        <button class="btn-back" @click="goHome">\u2190</button>\
        <h2 class="brand-title">\u9009\u914D\u65B9</h2>\
      </div>\
      <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPct + \'%\' }"></div></div>\
      <p class="step-label">{{ stepLabelText }}</p>\
\
      <!-- Step 1: Cup type -->\
      <div class="step-panel" v-show="recipeStep === 0">\
        <div class="cup-options">\
          <div v-for="cup in cupTypes" :key="cup.value"\
               class="cup-card"\
               :class="{ selected: state.cup === cup.value }"\
               @click="selectCup(cup.value)">\
            <div class="cup-card-icon" :class="cup.iconClass"></div>\
            <span>{{ cup.label }}</span>\
          </div>\
        </div>\
      </div>\
\
      <!-- Step 2: Tea -->\
      <div class="step-panel" v-show="recipeStep === 1">\
        <div class="tea-grid">\
          <div v-for="tea in teaOptions" :key="tea.name"\
               class="tea-item"\
               :class="{ selected: state.tea === tea.name }"\
               @click="selectTea(tea)">\
            <div class="tea-color" :style="{ background: tea.color }"></div>\
            <span>{{ tea.name }}</span>\
          </div>\
        </div>\
      </div>\
\
      <!-- Step 3: Toppings -->\
      <div class="step-panel" v-show="recipeStep === 2">\
        <div class="topping-pills">\
          <div v-for="name in toppingOptions" :key="name"\
               class="topping-pill"\
               :class="{ selected: state.toppings.indexOf(name) >= 0 }"\
               @click="toggleTopping(name)">\
            {{ name }}\
          </div>\
        </div>\
        <p class="topping-count">{{ toppingCountText }}</p>\
      </div>\
\
      <!-- Step 4: Sweetness & Ice -->\
      <div class="step-panel" v-show="recipeStep === 3">\
        <div class="slider-group">\
          <p class="slider-label">\u751C\u5EA6</p>\
          <div class="segment-control">\
            <button v-for="s in sweetOptions" :key="s"\
                    class="segment-btn"\
                    :class="{ active: state.sweet === s }"\
                    @click="selectSweet(s)">\
              {{ s }}\
            </button>\
          </div>\
          <p class="slider-label">\u51B0\u5EA6</p>\
          <div class="segment-control">\
            <button v-for="ic in iceOptions" :key="ic"\
                    class="segment-btn"\
                    :class="{ active: state.ice === ic }"\
                    @click="selectIce(ic)">\
              {{ ic }}\
            </button>\
          </div>\
        </div>\
      </div>\
\
      <div class="recipe-nav">\
        <button class="btn-prev" :class="{ hidden: isPrevHidden }" @click="prevStep">\u4E0A\u4E00\u6B65</button>\
        <button class="btn-next" :disabled="isNextDisabled" @click="nextStep">{{ nextButtonText }}</button>\
      </div>\
    </div>',
};
