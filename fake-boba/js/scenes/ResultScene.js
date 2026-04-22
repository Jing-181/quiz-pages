import { state } from '../store/state.js';
import { useTasting } from '../composables/useTasting.js';
import { useScene } from '../composables/useScene.js';

export default {
  name: 'ResultScene',
  data: function () {
    return {
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
    if (state.currentScene === 'result') {
      this.$nextTick(this.renderResult);
    }
  },
  methods: {
    renderResult: function () {
      var tasting = useTasting();

      this.recipeName = state.recipeName;
      this.liquidColor = state.liquidColor;
      this.calories = state.recipeCal;
      this.moodTag = tasting.getMoodTag();
      this.personalMessage = tasting.getPersonalMessage();

      // Build tags
      var tags = [state.sweet, state.ice];
      for (var i = 0; i < state.toppings.length; i++) {
        tags.push(state.toppings[i]);
      }
      this.tags = tags;
    },

    saveCard: function () {
      var self = this;
      if (typeof html2canvas === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = function () { self.doSaveCard(); };
        script.onerror = function () { alert('\u56FE\u7247\u5E93\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5'); };
        document.head.appendChild(script);
      } else {
        this.doSaveCard();
      }
    },

    doSaveCard: function () {
      var card = this.$refs.resultCard;
      html2canvas(card, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
      }).then(function (canvas) {
        var link = document.createElement('a');
        link.download = '\u5047\u88C5\u559D\u5976\u8336-' + state.recipeName + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(function () {
        alert('\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5');
      });
    },

    resetAll: function () {
      state.cup = '';
      state.tea = '';
      state.teaColor = '#C4956A';
      state.toppings = [];
      state.sweet = '';
      state.ice = '';
      state.iceLevel = '';
      state.iceCount = 0;
      state.recipeName = '';
      state.recipeCal = 0;
      state.liquidColor = '#C4956A';
      state.sipCount = 0;
      state.shakeProgress = 0;
      state.isShaking = false;
      if (state.shakeInterval) {
        clearInterval(state.shakeInterval);
        state.shakeInterval = null;
      }
      state.recipeStep = 0;
      var scene = useScene();
      scene.goToScene('home');
    },
  },
  template: '\
    <div id="scene-result" class="scene">\
      <div class="result-card" ref="resultCard">\
        <div class="result-card-header">\
          <h3 class="brand-title">\u5047\u88C5\u559D\u5976\u8336</h3>\
          <p>Fake Boba</p>\
        </div>\
        <div class="result-card-body">\
          <p class="result-subtitle">\u4ECA\u5929\u6211\u5047\u88C5\u559D\u4E86</p>\
          <!-- Mini cup -->\
          <div class="result-cup-mini">\
            <div class="result-cup-mini-straw"></div>\
            <div class="result-cup-mini-rim"></div>\
            <div class="result-cup-mini-body">\
              <div class="result-cup-mini-liquid" :style="{ background: liquidColor }"></div>\
            </div>\
          </div>\
          <p class="result-recipe-name">{{ recipeName }}</p>\
          <div class="result-details">\
            <span v-for="tag in tags" :key="tag" class="result-tag">{{ tag }}</span>\
          </div>\
          <!-- Mood tag -->\
          <div class="result-mood">{{ moodTag }}</div>\
          <p class="result-message">{{ personalMessage }}</p>\
          <div class="result-calories">\
            <span>{{ calories }}</span>\
            <span class="unit"> kcal \u70ED\u91CF\u5DF2\u8282\u7701</span>\
          </div>\
        </div>\
        <div class="result-actions">\
          <button class="btn-save" @click="saveCard">\u4FDD\u5B58\u56FE\u7247</button>\
          <button class="btn-retry" @click="resetAll">\u518D\u6765\u4E00\u676F</button>\
        </div>\
      </div>\
    </div>',
};
