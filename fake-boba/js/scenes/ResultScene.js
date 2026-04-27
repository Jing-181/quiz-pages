import { state } from '../store/state.js';
import { useTasting } from '../composables/useTasting.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'ResultScene',
  data: function () {
    return {
      state: state,
      recipeName: '',
      liquidColor: '',
      tags: [],
      moodTag: '',
      personalMessage: '',
      calories: 0,
    };
  },
  watch: {
    'state.currentScene': function (newVal) {
      if (newVal === 'result') {
        this.renderResult();
      }
    },
  },
  mounted: function () {
    if (this.state.currentScene === 'result') {
      this.$nextTick(this.renderResult);
    }
  },
  methods: {
    renderResult: function () {
      var tasting = useTasting();

      this.recipeName = this.state.recipeName;
      this.liquidColor = this.state.liquidColor;
      this.calories = this.state.recipeCal;
      this.moodTag = tasting.getMoodTag();
      this.personalMessage = tasting.getPersonalMessage();

      // Build tags
      var tags = [this.state.sweet, this.state.ice];
      for (var i = 0; i < this.state.toppings.length; i++) {
        tags.push(this.state.toppings[i]);
      }
      this.tags = tags;
    },

    saveCard: function () {
      var self = this;
      if (typeof html2canvas === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = function () { self.doSaveCard(); };
        script.onerror = function () { alert('图片库加载失败，请检查网络后重试'); };
        document.head.appendChild(script);
      } else {
        this.doSaveCard();
      }
    },

    doSaveCard: function () {
      var self = this;
      var card = this.$refs.resultCard;
      html2canvas(card, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
      }).then(function (canvas) {
        var link = document.createElement('a');
        link.download = '假装喝奶茶-' + self.state.recipeName + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(function () {
        alert('保存失败，请重试');
      });
    },

    resetAll: function () {
      this.state.cup = '';
      this.state.tea = '';
      this.state.teaColor = '#C4956A';
      this.state.toppings = [];
      this.state.sweet = '';
      this.state.ice = '';
      this.state.iceLevel = '';
      this.state.iceCount = 0;
      this.state.recipeName = '';
      this.state.recipeCal = 0;
      this.state.liquidColor = '#C4956A';
      this.state.sipCount = 0;
      this.state.sipProgress = 0;
      this.state.isSipping = false;
      this.state.shakeProgress = 0;
      this.state.isShaking = false;
      this.state.savedIcePositions = [];
      this.state.savedToppingPositions = [];
      if (this.state.shakeInterval) {
        clearInterval(this.state.shakeInterval);
        this.state.shakeInterval = null;
      }
      this.state.recipeStep = 0;
      var scene = useScene();
      scene.goToScene('home');
    },

    shareCard: function () {
      // 生成分享链接
      var recipeData = {
        cup: this.state.cup,
        tea: this.state.tea,
        teaColor: this.state.teaColor,
        toppings: this.state.toppings,
        sweet: this.state.sweet,
        ice: this.state.ice,
        recipeName: this.state.recipeName,
        recipeCal: this.state.recipeCal
      };
      var shareUrl = window.location.origin + window.location.pathname + '?recipe=' + encodeURIComponent(JSON.stringify(recipeData));
      
      // 尝试使用系统分享API
      if (navigator.share) {
        navigator.share({
          title: '我假装喝了一杯' + this.state.recipeName,
          text: '快来和我一起假装喝奶茶吧！',
          url: shareUrl
        }).catch(function (error) {
          console.log('分享失败:', error);
          // 降级方案
          prompt('复制链接分享给朋友:', shareUrl);
        });
      } else {
        // 降级方案
        prompt('复制链接分享给朋友:', shareUrl);
      }
    },
  },
  template: `
    <div id="scene-result" class="scene">
      <div class="result-card" ref="resultCard">
        <div class="result-card-header">
          <h3 class="brand-title">喝完啦！</h3>
          <p>太棒了，又假装喝了一杯</p>
        </div>
        <div class="result-card-body">
          <p class="result-subtitle">今天你假装喝了</p>
          <!-- Mini cup -->
          <div class="result-cup-mini">
            <div class="result-cup-mini-straw"></div>
            <div class="result-cup-mini-rim"></div>
            <div class="result-cup-mini-body">
              <div class="result-cup-mini-liquid" :style="{ background: liquidColor }"></div>
            </div>
          </div>
          <p class="result-recipe-name">{{ recipeName }}</p>
          <div class="result-details">
            <span v-for="tag in tags" :key="tag" class="result-tag">{{ tag }}</span>
          </div>
          <!-- Mood tag -->
          <div class="result-mood">{{ moodTag }}</div>
          <p class="result-message">{{ personalMessage }}</p>
          <div class="result-calories">
            <span>{{ calories }}</span>
            <span class="unit"> kcal 热量已节省</span>
          </div>
        </div>
        <div class="result-actions">
          <button class="btn-save" @click="saveCard">保存图片</button>
          <button class="btn-save" @click="shareCard">分享给朋友</button>
          <button class="btn-retry" @click="resetAll">再来一杯</button>
        </div>
      </div>
    </div>`,
};
