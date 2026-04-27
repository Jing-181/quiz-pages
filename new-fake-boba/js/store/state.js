export const state = Vue.reactive({
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
  // 保存的成分信息
  savedIcePositions: [],
  savedToppingPositions: [],
  // 饮用进度相关
  sipProgress: 0, // 0-100
  isSipping: false,
});

/* ===== COMPUTED ===== */
export const iceCount = Vue.computed(() => ICE_COUNT_MAP[state.ice] || 0);
export const liquidPercent = Vue.computed(() => 80 - (state.sipCount * 16));
export const isMakingDone = Vue.computed(() => state.shakeProgress >= 100);
export const isAllDrunk = Vue.computed(() => state.sipCount >= state.maxSips);