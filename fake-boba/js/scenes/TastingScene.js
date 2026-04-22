import { state } from '../store/state.js';
import { useTasting } from '../composables/useTasting.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'TastingScene',
  data: function () {
    return {
      state: state,
      sipProgressText: '饮用进度: 0%',
      btnSipHidden: false,
      btnSipWrapHidden: false,
      btnResultHidden: true,
    };
  },
  computed: {
    sipCount: function () {
      return this.state.sipCount;
    },
  },
  watch: {
    'state.currentScene': function (newVal) {
      if (newVal === 'tasting') {
        this.initTasting();
      }
    },
  },
  mounted: function () {
    if (this.state.currentScene === 'tasting') {
      this.$nextTick(this.initTasting);
    }
  },
  methods: {
    initTasting: function () {
      var self = this;
      var tasting = useTasting();

      var els = {
        liquid: self.$refs.tastingLiquid,
        cupBody: self.$refs.tastingCupBody,
        warmOverlay: self.$refs.warmOverlay,
        iceContainer: self.$refs.tastingIceContainer,
        toppingsContainer: self.$refs.tastingToppingsContainer,
        sipDots: self.$refs.sipDots,
        sipProgress: self.$refs.sipProgress,
        btnSip: self.$refs.btnSip,
        btnSipWrap: self.$refs.btnSipWrap,
        btnResult: self.$refs.btnResult,
        cupArea: self.$refs.tastingCupArea,
        emotionBubble: self.$refs.emotionBubble,
      };

      tasting.initTasting(els, self.updateProgress.bind(self));

      self.sipProgressText = '饮用进度: 0%';
      self.btnSipHidden = false;
      self.btnSipWrapHidden = false;
      self.btnResultHidden = true;
    },

    updateProgress: function () {
      this.sipProgressText = '饮用进度: ' + Math.round(this.state.sipProgress) + '%';
    },

    onStartSip: function () {
      var self = this;
      var tasting = useTasting();
      
      var els = {
        liquid: self.$refs.tastingLiquid,
        cupBody: self.$refs.tastingCupBody,
        warmOverlay: self.$refs.warmOverlay,
        iceContainer: self.$refs.tastingIceContainer,
        sipDots: self.$refs.sipDots,
        sipProgress: self.$refs.sipProgress,
        btnSip: self.$refs.btnSip,
        btnSipWrap: self.$refs.btnSipWrap,
        btnResult: self.$refs.btnResult,
        cupArea: self.$refs.tastingCupArea,
        emotionBubble: self.$refs.emotionBubble,
      };

      tasting.startSipping(els, self.updateProgress.bind(self), self.onComplete.bind(self));
    },

    onStopSip: function () {
      var tasting = useTasting();
      tasting.stopSipping();
    },

    onComplete: function () {
      var self = this;
      setTimeout(function () {
        self.btnSipHidden = true;
        self.btnSipWrapHidden = true;
        self.btnResultHidden = false;
      }, 1600);
    },

    goToResult: function () {
      var scene = useScene();
      scene.goToScene('result');
    },
  },
  template: '\
    <div id="scene-tasting" class="scene">\
      <div class="warm-overlay" ref="warmOverlay"></div>\
      <div class="tasting-header">\
        <h2 class="brand-title">你的奶茶好了！</h2>\
        <p class="sip-progress" ref="sipProgress">{{ sipProgressText }}</p>\
      </div>\
      <div class="tasting-cup-area" ref="tastingCupArea">\
        <div class="steam-container">\
          <div class="steam-line"></div>\
          <div class="steam-line"></div>\
          <div class="steam-line"></div>\
        </div>\
        <div class="tasting-straw-el"></div>\
        <div class="tasting-cup-rim"></div>\
        <div class="tasting-cup-body" ref="tastingCupBody">\
          <div class="tasting-liquid" ref="tastingLiquid"></div>\
          <div class="tasting-ice-container" ref="tastingIceContainer"></div>\
          <div class="tasting-toppings-container" ref="tastingToppingsContainer"></div>\
        </div>\
      </div>\
      <div class="sip-dots" ref="sipDots"></div>\
      <div class="btn-sip-wrap" ref="btnSipWrap" :class="{ hidden: btnSipWrapHidden }">\
        <div class="sip-pulse-ring"></div>\
        <div class="sip-pulse-ring"></div>\
        <div class="sip-pulse-ring"></div>\
        <button class="btn-sip" ref="btnSip" :class="{ hidden: btnSipHidden }" \
                @mousedown="onStartSip" @mouseup="onStopSip" @mouseleave="onStopSip"\
                @touchstart="onStartSip" @touchend="onStopSip" @touchcancel="onStopSip">按住喝！</button>\
      </div>\
      <button class="btn-primary" ref="btnResult" :class="{ hidden: btnResultHidden }" @click="goToResult">查看结果</button>\
      <!-- Emotion bubble -->\
      <emotion-bubble ref="emotionBubble" :show="false" />\
    </div>',
};
