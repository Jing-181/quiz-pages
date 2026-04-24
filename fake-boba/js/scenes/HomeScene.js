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
  template: '\
    <div id="scene-home" class="scene">\
      <div class="home-content">\
        <div class="home-cup">\
          <cup-component size="home" :show-steam="true" :show-ice="true" :ice-count="2"\
                          liquid-color="#C4956A" :liquid-height="65" />\
        </div>\
        <h1 class="home-title brand-title">\u5047\u88C5\u559D\u5976\u8336</h1>\
        <p class="home-subtitle">Fake Boba</p>\
        <p class="emotion-text">\u5F88\u60F3\u559D\u4F46\u6682\u65F6\u4E0D\u559D\uFF1F<br>\u6765\u5047\u88C5\u559D\u4E00\u676F\u5427\uFF01</p>\
        <div class="cta-group">\
          <button class="btn-primary" @click="randomRecipe">\uD83C\uDFB2 \u968F\u673A\u6765\u4E00\u676F</button>\
          <button class="btn-outline" @click="goToRecipe">\uD83D\uDCCB \u81EA\u5DF1\u9009\u914D\u65B9</button>\
        </div>\
        <p class="social-proof">\u5DF2\u6709 <span id="drink-count">{{ drinkCount.toLocaleString() }}</span> \u4EBA\u5047\u88C5\u559D\u8FC7</p>\
      </div>\
    </div>',
};
