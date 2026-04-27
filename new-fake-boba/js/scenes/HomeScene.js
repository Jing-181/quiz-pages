import { state } from '../store/state.js';
import { PRESETS, ICE_COUNT_MAP } from '../data/constants.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'HomeScene',
  data: function () {
    return {
      state: state,
      drinkCount: 0,
    };
  },
  mounted: function () {
    this.animateCount(12345 + Math.floor(Math.random() * 500), 1500);
  },
  methods: {
    animateCount: function (target, duration) {
      var self = this;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        self.drinkCount = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          self.drinkCount = target;
        }
      }
      requestAnimationFrame(step);
    },

    randomRecipe: function () {
      var preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
      this.state.cup = 'classic';
      this.state.tea = preset.tea;
      this.state.teaColor = preset.color;
      this.state.toppings = preset.toppings.slice();
      this.state.sweet = preset.sweet;
      this.state.ice = preset.ice;
      this.state.iceLevel = preset.ice;
      this.state.iceCount = ICE_COUNT_MAP[preset.ice] || 0;
      this.state.recipeName = preset.name;
      this.state.recipeCal = preset.cal;
      this.state.liquidColor = preset.color;
      this.state.sipCount = 0;
      this.state.shakeProgress = 0;
      var scene = useScene();
      scene.goToScene('making');
    },

    goToRecipe: function () {
      var scene = useScene();
      scene.goToScene('recipe');
    },
  },
  template: `
    <div id="scene-home" class="scene">
      <div class="home-content">
        <div class="home-cup">
          <div class="cup-body-css">
            <div class="cup-liquid-home"></div>
            <div class="cup-bubble" style="width: 8px; height: 8px; left: 20px; bottom: 30px; animation-delay: 0s;"></div>
            <div class="cup-bubble" style="width: 6px; height: 6px; left: 40px; bottom: 40px; animation-delay: 1s;"></div>
            <div class="cup-bubble" style="width: 10px; height: 10px; left: 60px; bottom: 25px; animation-delay: 2s;"></div>
          </div>
          <div class="cup-rim"></div>
          <div class="cup-straw-home"></div>
        </div>
        <h1 class="home-title brand-title">假装喝奶茶</h1>
        <p class="home-subtitle">Fake Boba</p>
        <p class="emotion-text">很想喝但暂时不喝！<br>来假装喝一杯吧！</p>
        <div class="cta-group">
          <button class="btn-primary" @click="randomRecipe">🎲 随机来一杯</button>
          <button class="btn-outline" @click="goToRecipe">📋 自己选配方</button>
        </div>
        <p class="social-proof">已有 <span id="drink-count">{{ drinkCount.toLocaleString() }}</span> 人假装喝过</p>
      </div>
    </div>`,
};