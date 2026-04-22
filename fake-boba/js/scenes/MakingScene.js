import { state } from '../store/state.js';
import { useMaking } from '../composables/useMaking.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'MakingScene',
  data: function() {
    return {
      state: state,
      makingTitle: '正在制作中...',
      shakeAreaHidden: true,
    };
  },
  computed: {
    shakeProgress: function() {
      return this.state.shakeProgress;
    },
  },
  watch: {
    // Watch for scene activation to trigger making
    'state.currentScene': function(newVal) {
      if (newVal === 'making') {
        this.startMaking();
      }
    },
  },
  mounted: function() {
    // If scene is already active when mounted
    if (this.state.currentScene === 'making') {
      this.$nextTick(this.startMaking);
    }
  },
  methods: {
    startMaking: function() {
      var self = this;
      var making = useMaking();

      // Collect DOM refs
      var els = {
        title: self.$refs.makingTitle,
        shakeArea: self.$refs.shakeArea,
        shakerArea: self.$refs.shakerArea,
        shakerCup: self.$refs.shakerCup,
        shakerBody: self.$refs.shakerBody,
        shakerLiquid: self.$refs.shakerLiquid,
        shakerIceContainer: self.$refs.shakerIceContainer,
        shakerToppingsContainer: self.$refs.shakerToppingsContainer,
        pourArea: self.$refs.pourArea,
        pourShaker: self.$refs.pourShaker,
        pourStream: self.$refs.pourStream,
        servingCup: self.$refs.servingCup,
        servingLiquid: self.$refs.servingLiquid,
        servingIceContainer: self.$refs.servingIceContainer,
        servingToppingsContainer: self.$refs.servingToppingsContainer,
        shakeRingFill: self.$refs.shakeRingFill,
        shakeCountText: self.$refs.shakeCountText,
        btnShake: self.$refs.btnShake,
      };

      self.makingTitle = '正在制作中...';
      self.shakeAreaHidden = true;

      making.startMaking(els, function() {
        // Making complete callback - switch to tasting
        var scene = useScene();
        scene.goToScene('tasting');
      });
    },
  },
  template: '\
    <div id="scene-making" class="scene">\
      <h2 class="making-title brand-title" ref="makingTitle">{{ makingTitle }}</h2>\
      \
      <!-- 阶段1：雪克杯 -->\
      <div class="shaker-area" ref="shakerArea">\
        <div class="shaker-cup" ref="shakerCup">\
          <div class="shaker-lid"></div>\
          <div class="shaker-body" ref="shakerBody">\
            <div class="shaker-liquid" ref="shakerLiquid"></div>\
            <div class="shaker-ice-container" ref="shakerIceContainer"></div>\
            <div ref="shakerToppingsContainer"></div>\
          </div>\
        </div>\
      </div>\
      \
      <!-- 阶段2：倒入 -->\
      <div class="pour-area" ref="pourArea" style="display:none">\
        <div class="pour-shaker" ref="pourShaker">\
          <div class="shaker-lid"></div>\
          <div class="shaker-body">\
            <div class="shaker-liquid" style="height:70%"></div>\
          </div>\
        </div>\
        <div class="pour-stream" ref="pourStream"></div>\
        <div class="serving-cup" ref="servingCup">\
          <div class="serving-cup-body">\
            <div class="serving-liquid" ref="servingLiquid"></div>\
            <div class="serving-ice-container" ref="servingIceContainer"></div>\
            <div class="serving-toppings-container" ref="servingToppingsContainer"></div>\
          </div>\
          <div class="serving-cup-rim"></div>\
          <div class="serving-straw"></div>\
        </div>\
      </div>\
      \
      <!-- 摇晃UI -->\
      <div class="shake-area" ref="shakeArea" :class="{ hidden: shakeAreaHidden }">\
        <!-- SVG circular progress ring -->\
        <svg class="shake-progress-ring" width="90" height="90" viewBox="0 0 90 90">\
          <defs>\
            <linearGradient id="shakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">\
              <stop offset="0%" stop-color="#FF6B8A"/>\
              <stop offset="100%" stop-color="#FFB74D"/>\
            </linearGradient>\
          </defs>\
          <circle class="shake-progress-ring-bg" cx="45" cy="45" r="40"/>\
          <circle class="shake-progress-ring-fill" ref="shakeRingFill" cx="45" cy="45" r="40"/>\
        </svg>\
        <button class="btn-shake" ref="btnShake">💪 按住摇一摇！</button>\
        <p class="shake-count-text" ref="shakeCountText">0%</p>\
      </div>\
    </div>',
};
