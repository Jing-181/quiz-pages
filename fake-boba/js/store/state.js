import { reactive, computed } from 'vue';
import { ICE_COUNT_MAP } from '../data/constants.js';

export const state = reactive({
  currentScene: 'home',
  cup: '',
  tea: '',
  teaColor: '#C4956A',
  toppings: [],
  sweet: '',
  ice: '',
  iceLevel: '',
  iceCount: 0,
  recipeName: '',
  recipeCal: 0,
  liquidColor: '#C4956A',
  makingPhase: 'idle',
  shakeProgress: 0,
  isShaking: false,
  sipCount: 0,
  maxSips: 5,
  recipeStep: 0,
  shakeInterval: null,
  makingTimer: null,
});

/* ===== COMPUTED ===== */
export const iceCount = computed(() => ICE_COUNT_MAP[state.ice] || 0);
export const liquidPercent = computed(() => 80 - (state.sipCount * 16));
export const isMakingDone = computed(() => state.shakeProgress >= 100);
export const isAllDrunk = computed(() => state.sipCount >= state.maxSips);
