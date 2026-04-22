import { state } from '../store/state.js';
import { useMaking } from '../composables/useMaking.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'MakingScene',
  data: function () {
    return {
      state: state,
      makingTitle: '\u6B63\u5728\u5236\u4F5C\u4E2D...',
      shakeAreaHidden: true,
    };
  },
  computed: {
    shakeProgress: function () {
      return this.state.shakeProgress;
    },
  },
  watch: {
    // Watch for scene activation to trigger making
    'state.currentScene': function (newVal) {
      if (newVal === 'making') {
        this.startMaking();
      }
    },
  },
  mounted: function () {
    // If scene is already active when mounted
    if (this.state.currentScene === 'making') {
      this.$nextTick(this.startMaking);
    }
  },
  methods: {
    startMaking: function () {
      var self = this;
      var making = useMaking();

      // Collect DOM refs
      var els = {
        title: self.$refs.makingTitle,
        shakeArea: self.$refs.shakeArea,
        teaStream: self.$refs.teaStream,
        makingArea: self.$refs.makingArea,
        cupBody: self.$refs.makingCupBody,
        liquid: self.$refs.makingLiquid,
        toppingsContainer: self.$refs.makingToppingsContainer,
        iceContainer: self.$refs.makingIceContainer,
        shakeRingFill: self.$refs.shakeRingFill,
        shakeCountText: self.$refs.shakeCountText,
        btnShake: self.$refs.btnShake,
      };

      self.makingTitle = '\u6B63\u5728\u5236\u4F5C\u4E2D...';
      self.shakeAreaHidden = true;

      making.startMaking(els, function () {
        // Making complete callback - switch to tasting
        var scene = useScene();
        scene.goToScene('tasting');
      });
    },
  },
  template: '\
    <div id="scene-making" class="scene">\
      <h2 class="making-title brand-title" ref="makingTitle">{{ makingTitle }}</h2>\
      <div class="making-area" ref="makingArea">\
        <div class="tea-stream" ref="teaStream"></div>\
        <div class="making-straw"></div>\
        <div class="making-cup-rim"></div>\
        <div class="making-cup-body" ref="makingCupBody">\
          <div class="making-liquid" ref="makingLiquid"></div>\
          <div class="making-ice-container" ref="makingIceContainer"></div>\
          <div ref="makingToppingsContainer"></div>\
        </div>\
      </div>\
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
        <button class="btn-shake" ref="btnShake">\uD83D\uDCAA \u6309\u4F4F\u6447\u4E00\u6447\uFF01</button>\
        <p class="shake-count-text" ref="shakeCountText">0%</p>\
      </div>\
    </div>',
};
