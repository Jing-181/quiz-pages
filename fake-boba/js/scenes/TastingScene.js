import { state } from '../store/state.js';
import { useTasting } from '../composables/useTasting.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'TastingScene',
  data: function () {
    return {
      sipProgressText: '\u7B2C 0 / 5 \u53E3',
      btnSipHidden: false,
      btnSipWrapHidden: false,
      btnResultHidden: true,
    };
  },
  computed: {
    sipCount: function () {
      return state.sipCount;
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
    if (state.currentScene === 'tasting') {
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
        sipDots: self.$refs.sipDots,
        sipProgress: self.$refs.sipProgress,
        btnSip: self.$refs.btnSip,
        btnSipWrap: self.$refs.btnSipWrap,
        btnResult: self.$refs.btnResult,
        cupArea: self.$refs.tastingCupArea,
        emotionBubble: self.$refs.emotionBubble,
      };

      tasting.initTasting(els);

      self.sipProgressText = '\u7B2C 0 / 5 \u53E3';
      self.btnSipHidden = false;
      self.btnSipWrapHidden = false;
      self.btnResultHidden = true;
    },

    takeSip: function () {
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

      tasting.takeSip(els);

      // Update reactive data
      self.sipProgressText = '\u7B2C ' + state.sipCount + ' / 5 \u53E3';

      if (state.sipCount >= 5) {
        // Delay hiding sip button and showing result button
        setTimeout(function () {
          self.btnSipHidden = true;
          self.btnSipWrapHidden = true;
          self.btnResultHidden = false;
        }, 1600);
      }
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
        <h2 class="brand-title">\u4F60\u7684\u5976\u8336\u597D\u4E86\uFF01</h2>\
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
        </div>\
      </div>\
      <div class="sip-dots" ref="sipDots"></div>\
      <div class="btn-sip-wrap" ref="btnSipWrap" :class="{ hidden: btnSipWrapHidden }">\
        <div class="sip-pulse-ring"></div>\
        <div class="sip-pulse-ring"></div>\
        <div class="sip-pulse-ring"></div>\
        <button class="btn-sip" ref="btnSip" :class="{ hidden: btnSipHidden }" @click="takeSip">\u559D\u4E00\u53E3\uFF01</button>\
      </div>\
      <button class="btn-primary" ref="btnResult" :class="{ hidden: btnResultHidden }" @click="goToResult">\u67E5\u770B\u7ED3\u679C\u5361</button>\
      <!-- Emotion bubble -->\
      <emotion-bubble ref="emotionBubble" :show="false" />\
    </div>',
};
