const { createApp, reactive, computed, provide, ref } = Vue;
import { state } from './store/state.js';

// Components
import CupComponent from './components/CupComponent.js';
import EmotionBubble from './components/EmotionBubble.js';

// Scenes
import HomeScene from './scenes/HomeScene.js';
import RecipeScene from './scenes/RecipeScene.js';
import MakingScene from './scenes/MakingScene.js';
import TastingScene from './scenes/TastingScene.js';
import ResultScene from './scenes/ResultScene.js';

const app = createApp({
  components: {
    CupComponent,
    EmotionBubble,
    HomeScene,
    RecipeScene,
    MakingScene,
    TastingScene,
    ResultScene,
  },
  template: `
    <!-- Background blobs -->
    <div class="bg-blob bg-blob-1"></div>
    <div class="bg-blob bg-blob-2"></div>
    <div class="bg-blob bg-blob-3"></div>

    <!-- Warm overlay -->
    <div class="warm-overlay" :class="{ active: state.currentScene === 'tasting' && state.sipCount >= 3 }"></div>

    <!-- Scenes -->
    <home-scene v-if="state.currentScene === 'home'" />
    <recipe-scene v-if="state.currentScene === 'recipe'" />
    <making-scene v-if="state.currentScene === 'making'" />
    <tasting-scene v-if="state.currentScene === 'tasting'" />
    <result-scene v-if="state.currentScene === 'result'" />
  `,
  setup() {
    provide('state', state);
    return { state };
  }
});

app.mount('#app');
