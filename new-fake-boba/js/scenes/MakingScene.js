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
        shakeRingFill: self.$refs.shakeRingFill,
        shakeCountText: self.$refs.shakeCountText,
        btnShake: self.$refs.btnShake,
        makingArea: self.$refs.makingArea,
        makingCupBody: self.$refs.makingCupBody,
        makingLiquid: self.$refs.makingLiquid,
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
  template: `
    <div id="scene-making" class="scene">
      <h2 class="making-title brand-title" ref="makingTitle">{{ makingTitle }}</h2>
      
      <!-- Making area -->
      <div class="making-area" ref="makingArea">
        <div class="making-cup-body" ref="makingCupBody">
          <div class="making-liquid" ref="makingLiquid"></div>
        </div>
        <div class="making-cup-rim"></div>
        <div class="making-straw"></div>
      </div>
      
      <!-- Shaking UI -->
      <div class="shake-area" ref="shakeArea" :class="{ hidden: shakeAreaHidden }">
        <!-- SVG circular progress ring -->
        <svg class="shake-progress-ring" width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="shakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FF6B8A"/>
              <stop offset="100%" stop-color="#FFB74D"/>
            </linearGradient>
          </defs>
          <circle class="shake-progress-ring-bg" cx="60" cy="60" r="50"/>
          <circle class="shake-progress-ring-fill" ref="shakeRingFill" cx="60" cy="60" r="50"/>
        </svg>
        <button class="btn-shake" ref="btnShake">💪 按住摇一摇！</button>
        <p class="shake-count-text" ref="shakeCountText">0%</p>
      </div>
    </div>`,
};