/* ========== State ========== */
const state = {
  currentScene: 'home',
  recipeStep: 0,
  recipe: { cup: null, tea: null, toppings: [], sweetness: null, ice: null },
  making: { phase: 'idle', shakeProgress: 0 },
  sipping: { sipCount: 0, maxSips: 5, liquidLevel: 100 },
  isRandom: false,
  currentRecipe: null,
};

/* ========== Data ========== */
const TEAS = [
  { id: 'black', name: '红茶', color: '#D4A574' },
  { id: 'green', name: '绿茶', color: '#8BC34A' },
  { id: 'oolong', name: '乌龙', color: '#E8D5B7' },
  { id: 'taro', name: '芋泥', color: '#B39DDB' },
  { id: 'mango', name: '芒果', color: '#FFD54F' },
  { id: 'brown', name: '黑糖', color: '#8D6E63' },
];

const TOPPINGS = [
  { id: 'boba', name: '珍珠', color: '#2D1B0E', type: 'bottom', desc: '珍珠Q弹登场！' },
  { id: 'coconut', name: '椰果', color: '#F5F5DC', type: 'middle', desc: '椰果清脆加入～' },
  { id: 'pudding', name: '布丁', color: '#FFD700', type: 'bottom', desc: '布丁滑滑落下～' },
  { id: 'grass', name: '仙草', color: '#1A1A2E', type: 'middle', desc: '仙草清凉来袭！' },
  { id: 'taro-ball', name: '芋圆', color: '#9C7CB0', type: 'bottom', desc: '芋圆软糯登场～' },
  { id: 'red-bean', name: '红豆', color: '#8B0000', type: 'middle', desc: '红豆甜蜜加入！' },
  { id: 'oreo', name: '奥利奥', color: '#1A1A1A', type: 'top', desc: '奥利奥碎撒下～' },
  { id: 'foam', name: '奶盖', color: '#FFFDD0', type: 'top', desc: '奶盖缓缓铺上～' },
];

const SWEETNESS = ['无糖', '三分甜', '五分甜', '七分甜', '全糖'];
const ICE = ['去冰', '少冰', '正常冰', '多冰', '热饮'];

const PRESETS = [
  { name: '经典珍珠奶茶', cup: 'classic', tea: 'black', toppings: ['boba'], sweetness: 3, ice: 2, colors: ['#D4A574','#C4956A','#A67B5B'], calories: 450 },
  { name: '芋泥波波奶茶', cup: 'fat', tea: 'taro', toppings: ['taro-ball','boba'], sweetness: 3, ice: 1, colors: ['#C9A8E8','#B39DDB','#9575CD'], calories: 520 },
  { name: '杨枝甘露', cup: 'classic', tea: 'mango', toppings: ['coconut'], sweetness: 2, ice: 2, colors: ['#FFE082','#FFD54F','#FFC107'], calories: 380 },
  { name: '黑糖鲜奶', cup: 'fat', tea: 'brown', toppings: ['boba'], sweetness: 3, ice: 1, colors: ['#A1887F','#8D6E63','#6D4C41'], calories: 480 },
  { name: '抹茶拿铁', cup: 'tall', tea: 'green', toppings: ['red-bean'], sweetness: 1, ice: 0, colors: ['#AED581','#8BC34A','#689F38'], calories: 320 },
  { name: '芝士奶盖乌龙', cup: 'classic', tea: 'oolong', toppings: ['foam'], sweetness: 2, ice: 1, colors: ['#E8D5B7','#D4B896','#C4A57A'], calories: 400 },
];

const EMOTION_TEXTS = [
  '嗯～第一口总是最幸福的！',
  '珍珠的口感绝了，Q弹Q弹的～',
  '这个甜度刚刚好，完美！',
  '奶盖和茶底融合得太妙了',
  '感觉自己被治愈了呢～',
  '每一口都是小确幸',
  '假装喝也能这么开心！',
  '这就是多巴胺的味道吧',
  '好喝到想转圈圈！',
  '最后一口，意犹未尽...',
];

const RESULT_MESSAGES = [
  '恭喜你成功抵抗了奶茶的诱惑！\n虽然只是假装喝，但快乐是真的～',
  '你的意志力满分！\n今天的热量成功守护住了！',
  '假装喝完啦～\n心理上已经满足了，身体上零负担！',
  '你今天做了一个聪明的选择！\n既享受了快乐，又没有热量负担。',
];

const MOOD_TAGS = {
  '全糖': '快乐全糖党',
  '无糖': '佛系控糖派',
  '三分甜': '微甜刚刚好',
  '五分甜': '中庸之道者',
  '七分甜': '甜蜜爱好者',
  '热饮': '温暖守护者',
  '多冰': '冰爽冒险家',
  'boba': '珍珠狂热粉',
  'foam': '奶盖控',
  'taro-ball': '芋圆小达人',
};

/* ========== Init ========== */
function init() {
  createBubbles();
  createFloatingToppings();
  renderTeaGrid();
  renderToppingPills();
  renderSegmentControls();
}

/* ========== Bubbles ========== */
function createBubbles() {
  const container = document.getElementById('bubbles');
  const colors = ['rgba(196,149,106,0.12)','rgba(255,107,138,0.1)','rgba(255,183,77,0.12)','rgba(179,157,219,0.1)','rgba(139,195,74,0.1)'];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 35 + 12;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[i%colors.length]};
      animation-duration:${Math.random()*8+8}s;
      animation-delay:${Math.random()*5}s;
    `;
    container.appendChild(b);
  }
}

/* ========== Floating Toppings on Home ========== */
function createFloatingToppings() {
  const container = document.getElementById('floating-toppings');
  const items = [
    { emoji: '●', color: '#2D1B0E', size: 14, top: '15%', left: '12%' },
    { emoji: '●', color: '#2D1B0E', size: 10, top: '65%', left: '8%' },
    { emoji: '◆', color: '#FFD700', size: 12, top: '20%', right: '10%' },
    { emoji: '■', color: '#1A1A2E', size: 10, top: '55%', right: '8%' },
    { emoji: '●', color: '#9C7CB0', size: 12, top: '75%', left: '18%' },
    { emoji: '●', color: '#8B0000', size: 8, top: '35%', right: '15%' },
  ];
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'float-item';
    el.style.cssText = `
      top:${item.top}; ${item.left ? 'left:'+item.left : 'right:'+item.right};
      width:${item.size}px; height:${item.size}px;
      background:${item.color}; border-radius:50%;
      opacity: 0.25;
    `;
    container.appendChild(el);
  });
}

/* ========== Scene Navigation ========== */
function goToScene(name) {
  const scenes = ['home','recipe','making','tasting','result'];
  const oldIdx = scenes.indexOf(state.currentScene);
  const newIdx = scenes.indexOf(name);
  document.querySelectorAll('.scene').forEach((s, i) => {
    s.classList.remove('active','left');
    if (i < newIdx) s.classList.add('left');
    else if (i === newIdx) s.classList.add('active');
  });
  state.currentScene = name;
  if (name === 'making') startMaking();
  if (name === 'tasting') initTasting();
  if (name === 'result') renderResult();
}

/* ========== Recipe Selection ========== */
function renderTeaGrid() {
  const grid = document.getElementById('tea-grid');
  grid.innerHTML = TEAS.map(t => `
    <div class="tea-card" onclick="selectTea(this,'${t.id}')">
      <div class="tea-dot" style="background:${t.color}"></div>
      <span>${t.name}</span>
    </div>
  `).join('');
}

function renderToppingPills() {
  const pills = document.getElementById('topping-pills');
  pills.innerHTML = TOPPINGS.map(t => `
    <button class="topping-pill" onclick="toggleTopping(this,'${t.id}')">${t.name}</button>
  `).join('');
}

function renderSegmentControls() {
  const sc = document.getElementById('sweetness-control');
  sc.innerHTML = SWEETNESS.map((s, i) => `
    <button class="segment-btn" onclick="selectSweetness(this,${i})">${s}</button>
  `).join('');
  const ic = document.getElementById('ice-control');
  ic.innerHTML = ICE.map((s, i) => `
    <button class="segment-btn" onclick="selectIce(this,${i})">${s}</button>
  `).join('');
}

function selectCup(el, type) {
  document.querySelectorAll('.cup-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.recipe.cup = type;
  updateNextBtn();
}

function selectTea(el, id) {
  document.querySelectorAll('.tea-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.recipe.tea = id;
  updateNextBtn();
}

function toggleTopping(el, id) {
  el.classList.toggle('selected');
  const idx = state.recipe.toppings.indexOf(id);
  if (idx > -1) state.recipe.toppings.splice(idx, 1);
  else if (state.recipe.toppings.length < 3) state.recipe.toppings.push(id);
  else { el.classList.remove('selected'); return; }
  const count = state.recipe.toppings.length;
  document.getElementById('topping-count').textContent = count > 0 ? `已选 ${count}/3 个小料` : '';
  updateNextBtn();
}

function selectSweetness(el, idx) {
  document.querySelectorAll('#sweetness-control .segment-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.recipe.sweetness = idx;
  updateNextBtn();
}

function selectIce(el, idx) {
  document.querySelectorAll('#ice-control .segment-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.recipe.ice = idx;
  updateNextBtn();
}

function updateNextBtn() {
  const r = state.recipe;
  const step = state.recipeStep;
  let valid = false;
  if (step === 0) valid = !!r.cup;
  else if (step === 1) valid = !!r.tea;
  else if (step === 2) valid = r.toppings.length > 0;
  else if (step === 3) valid = r.sweetness !== null && r.ice !== null;
  const btn = document.getElementById('btn-next');
  btn.disabled = !valid;
  btn.textContent = step === 3 ? '开始制作' : '下一步';
}

function nextStep() {
  if (state.recipeStep < 3) {
    const old = document.getElementById(`step-${state.recipeStep}`);
    old.classList.remove('active');
    old.classList.add('left');
    state.recipeStep++;
    const next = document.getElementById(`step-${state.recipeStep}`);
    next.classList.remove('right');
    next.classList.add('active');
    document.getElementById('recipe-progress').style.width = `${(state.recipeStep+1)*25}%`;
    const labels = ['选杯型','选茶底','选小料','甜度 & 冰度'];
    document.getElementById('step-label').textContent = `第 ${state.recipeStep+1} 步 / 共 4 步 · ${labels[state.recipeStep]}`;
    document.getElementById('btn-prev').classList.toggle('hidden', state.recipeStep === 0);
    updateNextBtn();
  } else {
    goToScene('making');
  }
}

function prevStep() {
  if (state.recipeStep > 0) {
    const old = document.getElementById(`step-${state.recipeStep}`);
    old.classList.remove('active');
    old.classList.add('right');
    state.recipeStep--;
    const prev = document.getElementById(`step-${state.recipeStep}`);
    prev.classList.remove('left');
    prev.classList.add('active');
    document.getElementById('recipe-progress').style.width = `${(state.recipeStep+1)*25}%`;
    const labels = ['选杯型','选茶底','选小料','甜度 & 冰度'];
    document.getElementById('step-label').textContent = `第 ${state.recipeStep+1} 步 / 共 4 步 · ${labels[state.recipeStep]}`;
    document.getElementById('btn-prev').classList.toggle('hidden', state.recipeStep === 0);
    updateNextBtn();
  }
}

/* ========== Random Recipe ========== */
function randomRecipe() {
  const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
  state.recipe = {
    cup: preset.cup,
    tea: preset.tea,
    toppings: [...preset.toppings],
    sweetness: preset.sweetness,
    ice: preset.ice,
  };
  state.isRandom = true;
  state.currentRecipe = preset;
  goToScene('making');
}

/* ========== Making ========== */
function getTeaColor() {
  const tea = TEAS.find(t => t.id === state.recipe.tea);
  return tea ? tea.color : '#D4A574';
}

function startMaking() {
  state.making.phase = 'pour';
  const color = getTeaColor();
  const title = document.getElementById('making-title');
  const pot = document.getElementById('tea-pot');
  const stream = document.getElementById('tea-stream');
  const liquid = document.getElementById('making-liquid');
  const wave = document.getElementById('making-wave');
  const shakeUI = document.getElementById('shake-ui');
  const btnShake = document.getElementById('btn-shake');
  const shakeHint = document.getElementById('shake-hint');
  const desc = document.getElementById('topping-desc');

  // Reset
  shakeUI.classList.add('hidden');
  btnShake.classList.add('hidden');
  shakeHint.classList.add('hidden');
  desc.classList.remove('show');
  desc.textContent = '';
  liquid.setAttribute('height', '0');
  liquid.setAttribute('y', '270');
  liquid.setAttribute('fill', color);
  wave.setAttribute('fill', color);
  stream.style.height = '0';
  stream.style.opacity = '0';
  stream.innerHTML = '';
  pot.classList.remove('pouring');
  document.getElementById('making-toppings').innerHTML = '';

  // Phase 1: Pour tea (2s)
  title.textContent = '倒入茶底...';
  setTimeout(() => {
    pot.classList.add('pouring');
    // Create flowing tea droplets (enhanced particle effect)
    createTeaDroplets(stream, color);
    stream.classList.add('flowing');
    setTimeout(() => {
      liquid.setAttribute('height', '200');
      liquid.setAttribute('y', '70');
      // Splash effects (enhanced)
      createSplashDrops(color);
      // Cup vibration
      const cup = document.getElementById('making-cup');
      cup.style.transform = 'translateX(-50%) scale(1.01)';
      setTimeout(() => { cup.style.transform = 'translateX(-50%) scale(1)'; }, 150);
      setTimeout(() => { cup.style.transform = 'translateX(-50%) scale(1.008)'; }, 400);
      setTimeout(() => { cup.style.transform = 'translateX(-50%) scale(1)'; }, 550);
    }, 300);
    // "咕噜咕噜" text
    setTimeout(() => showMakingText('咕噜咕噜...'), 600);
  }, 200);

  // Phase 2: Add toppings (1.5s each)
  setTimeout(() => {
    pot.classList.remove('pouring');
    stream.classList.remove('flowing');
    stream.innerHTML = '';
    state.making.phase = 'toppings';
    title.textContent = '加入小料...';
    addToppingsToCup();
  }, 2500);

  // Phase 3: Shake
  const toppingTime = 2500 + state.recipe.toppings.length * 1500 + 500;
  setTimeout(() => {
    state.making.phase = 'shake';
    state.making.shakeProgress = 0;
    title.textContent = '摇一摇！';
    shakeUI.classList.remove('hidden');
    btnShake.classList.remove('hidden');
    shakeHint.classList.remove('hidden');
    updateShakeUI();
    enableShakeDetection();
  }, toppingTime);
}

/* Create flowing tea droplets (Enhanced: more particles, random properties) */
function createTeaDroplets(container, color) {
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const drop = document.createElement('div');
    drop.className = 'tea-droplet';
    const size = Math.random() * 6 + 3;
    drop.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${Math.random() * 14 - 2}px;
      animation-delay:${Math.random() * 0.6}s;
      animation-duration:${0.3 + Math.random() * 0.4}s;
      opacity: ${0.4 + Math.random() * 0.5};
      box-shadow: 0 0 ${size}px ${color}40;
    `;
    container.appendChild(drop);
  }
}

/* Create splash drops when liquid rises (Enhanced: more drops with varied trajectories) */
function createSplashDrops(color) {
  const area = document.getElementById('making-area');
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const drop = document.createElement('div');
      drop.className = 'splash-drop';
      const size = 3 + Math.random() * 5;
      const angle = (Math.random() - 0.5) * 80;
      drop.style.cssText = `
        background:${color};
        width:${size}px; height:${size}px;
        left:${40 + Math.random() * 80}px;
        top:${65 + Math.random() * 25}px;
        --tx:${angle}px;
        box-shadow: 0 0 4px ${color}30;
      `;
      area.appendChild(drop);
      setTimeout(() => drop.remove(), 800);
    }, i * 80);
  }
}

/* Show text popup during making (Enhanced: float animation) */
function showMakingText(text) {
  const area = document.getElementById('making-area');
  const el = document.createElement('div');
  el.className = 'text-pop';
  el.textContent = text;
  el.style.top = '40%';
  area.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/* Add toppings with enhanced effects (ripple + description) */
function addToppingsToCup() {
  const container = document.getElementById('making-toppings');
  const toppings = state.recipe.toppings;
  const desc = document.getElementById('topping-desc');

  toppings.forEach((tid, i) => {
    const t = TOPPINGS.find(tp => tp.id === tid);
    if (!t) return;
    setTimeout(() => {
      // Show description with fade-in
      showToppingDesc(t.desc);

      // Show "扑通" text
      showMakingText('扑通！');

      let y = 220;
      if (t.type === 'top') y = 80;
      else if (t.type === 'middle') y = 150;
      const count = t.id === 'boba' ? 5 : t.id === 'foam' ? 1 : 3;

      for (let j = 0; j < count; j++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const cx = 50 + Math.random() * 100;
        const cy = y + Math.random() * 30;
        const r = t.id === 'foam' ? 20 : t.id === 'boba' ? 6 : 5;
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy - 80);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', t.color);
        circle.setAttribute('opacity', '0');
        circle.classList.add('topping-svg');
        circle.style.animation = `topping-fall 1.5s cubic-bezier(0.34,1.56,0.64,1) ${j*0.1}s forwards`;
        container.appendChild(circle);
        setTimeout(() => {
          circle.setAttribute('cy', cy);
        }, 1500 + j * 100);
      }

      // Ripple effect for non-foam toppings
      if (t.id !== 'foam') {
        setTimeout(() => createRipple(y), 800);
      }

      // Hide description before next topping
      setTimeout(() => desc.classList.remove('show'), 1200);
    }, i * 1500);
  });
}

/* Create ripple effect (Enhanced: expanding ring with fade) */
function createRipple(yPos) {
  const area = document.getElementById('making-area');
  const ripple = document.createElement('div');
  ripple.className = 'ripple-ring';
  ripple.style.cssText = `
    left:50%; top:${yPos * 0.85 + 40}px;
    transform: translateX(-50%);
  `;
  area.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);
}

/* Show topping description with fade-in animation */
function showToppingDesc(text) {
  const desc = document.getElementById('topping-desc');
  desc.textContent = text;
  desc.classList.remove('show');
  void desc.offsetWidth; // Force reflow
  desc.classList.add('show');
}

/* ========== Shake Detection ========== */
let shakeThreshold = 15;
let shakeRequired = 8;
let lastShakeTime = 0;

function enableShakeDetection() {
  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', handleMotion);
  }
}

function handleMotion(e) {
  if (state.making.phase !== 'shake') return;
  const acc = e.accelerationIncludingGravity;
  if (!acc) return;
  const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
  if (force > shakeThreshold) {
    const now = Date.now();
    if (now - lastShakeTime > 200) {
      lastShakeTime = now;
      doShake();
    }
  }
}

function manualShake() {
  doShake();
}

/* doShake (Enhanced: screen micro-shake + liquid slosh) */
function doShake() {
  if (state.making.phase !== 'shake') return;
  state.making.shakeProgress++;
  const cup = document.getElementById('making-cup');
  cup.classList.add('cup-shaking');
  // Screen edge shake (enhanced)
  const app = document.getElementById('app-container');
  app.classList.add('screen-shaking');
  // Liquid slosh effect
  const liquid = document.getElementById('making-liquid');
  liquid.style.animation = 'liquid-slosh 0.4s ease-in-out';
  setTimeout(() => {
    cup.classList.remove('cup-shaking');
    app.classList.remove('screen-shaking');
    liquid.style.animation = 'liquid-wave 3s ease-in-out infinite';
  }, 400);
  updateShakeUI();
  if (state.making.shakeProgress >= shakeRequired) {
    state.making.phase = 'done';
    window.removeEventListener('devicemotion', handleMotion);
    // Ding effect
    showDing();
    setTimeout(() => goToScene('tasting'), 1000);
  }
}

function showDing() {
  const ding = document.createElement('div');
  ding.className = 'ding-overlay';
  ding.innerHTML = '<svg viewBox="0 0 60 60" width="60" height="60"><circle cx="30" cy="30" r="28" fill="rgba(255,255,255,0.9)" stroke="#FFB74D" stroke-width="3"/><text x="30" y="38" text-anchor="middle" font-size="24" fill="#FFB74D" font-family="ZCOOL KuaiLe">叮!</text></svg>';
  document.body.appendChild(ding);
  setTimeout(() => ding.remove(), 1200);
}

function updateShakeUI() {
  const progress = state.making.shakeProgress / shakeRequired;
  const offset = 283 - (283 * progress);
  document.getElementById('shake-circle').style.strokeDashoffset = offset;
  document.getElementById('shake-count').textContent = `${state.making.shakeProgress}/${shakeRequired}`;
}

/* ========== Tasting ========== */
function initTasting() {
  state.sipping.sipCount = 0;
  state.sipping.liquidLevel = 100;
  const color = getTeaColor();
  const liquid = document.getElementById('tasting-liquid');
  const wave = document.getElementById('tasting-wave');
  liquid.setAttribute('fill', color);
  liquid.setAttribute('y', '50');
  liquid.setAttribute('height', '220');
  wave.setAttribute('fill', color);
  wave.setAttribute('cy', '50');

  const btnSip = document.getElementById('btn-sip');
  btnSip.classList.remove('hidden');
  btnSip.disabled = false;
  document.getElementById('btn-sip-container').classList.remove('hidden');
  document.getElementById('btn-result').classList.add('hidden');
  document.getElementById('sip-progress').textContent = '第 0 / 5 口';
  document.getElementById('tasting-cup-area').classList.remove('cup-empty');
  document.getElementById('tasting-cup-area').style.transform = '';
  document.getElementById('steam-container').classList.remove('fast');
  document.getElementById('scene-tasting').classList.remove('warming', 'warmest');

  // Show satisfaction bar
  const satBar = document.getElementById('satisfaction-bar');
  satBar.classList.add('show');
  document.getElementById('satisfaction-fill').style.width = '0%';
  document.getElementById('satisfaction-pct').textContent = '0%';

  // Render toppings
  const container = document.getElementById('tasting-toppings');
  container.innerHTML = '';
  state.recipe.toppings.forEach(tid => {
    const t = TOPPINGS.find(tp => tp.id === tid);
    if (!t) return;
    let y = 220;
    if (t.type === 'top') y = 80;
    else if (t.type === 'middle') y = 150;
    const count = t.id === 'boba' ? 5 : t.id === 'foam' ? 1 : 3;
    for (let j = 0; j < count; j++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', 50 + Math.random() * 100);
      circle.setAttribute('cy', y + Math.random() * 30);
      circle.setAttribute('r', t.id === 'foam' ? 20 : t.id === 'boba' ? 6 : 5);
      circle.setAttribute('fill', t.color);
      circle.setAttribute('opacity', '0.9');
      container.appendChild(circle);
    }
  });
}

/* takeSip (Enhanced: vortex, star fly, warming, happy face) */
function takeSip() {
  if (state.sipping.sipCount >= state.sipping.maxSips) return;
  state.sipping.sipCount++;
  state.sipping.liquidLevel -= 20;

  const liquid = document.getElementById('tasting-liquid');
  const wave = document.getElementById('tasting-wave');
  const newHeight = Math.max(0, 220 - state.sipping.sipCount * 44);
  const newY = 50 + (220 - newHeight);
  liquid.setAttribute('height', newHeight);
  liquid.setAttribute('y', newY);
  wave.setAttribute('cy', newY);

  // Cup micro-shrink
  const cupArea = document.getElementById('tasting-cup-area');
  cupArea.classList.remove('sip-shrink');
  void cupArea.offsetWidth;
  cupArea.classList.add('sip-shrink');

  // Vortex effect at straw position
  createVortex(newY);

  // Star/hearts fly from straw top
  createStarFly();

  // Steam speed up
  document.getElementById('steam-container').classList.add('fast');

  // Show emotion
  showEmotion(EMOTION_TEXTS[state.sipping.sipCount - 1]);

  // Update progress
  document.getElementById('sip-progress').textContent = `第 ${state.sipping.sipCount} / 5 口`;

  // Update satisfaction bar
  const pct = Math.round((state.sipping.sipCount / state.sipping.maxSips) * 100);
  document.getElementById('satisfaction-fill').style.width = pct + '%';
  document.getElementById('satisfaction-pct').textContent = pct + '%';

  // Background warming after 3rd sip (enhanced: body class)
  if (state.sipping.sipCount >= 3) {
    document.getElementById('scene-tasting').classList.add('warming');
    document.body.classList.add('warming');
  }
  if (state.sipping.sipCount >= 4) {
    document.getElementById('scene-tasting').classList.add('warmest');
  }

  if (state.sipping.sipCount >= state.sipping.maxSips) {
    const btnSip = document.getElementById('btn-sip');
    btnSip.disabled = true;
    // Hide pulse rings
    document.querySelectorAll('.sip-pulse').forEach(p => p.style.display = 'none');
    setTimeout(() => {
      document.getElementById('btn-sip-container').classList.add('hidden');
      document.getElementById('tasting-cup-area').classList.add('cup-empty');
      // Enhanced confetti burst (50 particles with stars and hearts)
      launchEnhancedConfetti();
      // Show happy face
      showHappyFace();
      // Hide satisfaction bar
      document.getElementById('satisfaction-bar').classList.remove('show');
      setTimeout(() => {
        document.getElementById('btn-result').classList.remove('hidden');
      }, 1500);
    }, 800);
  }
}

/* Create vortex effect at straw position */
function createVortex(liquidY) {
  const cupArea = document.getElementById('tasting-cup-area');
  const vortex = document.createElement('div');
  vortex.className = 'vortex';
  vortex.style.cssText = `
    right: 22%; top: ${liquidY * 0.85 + 10}px;
  `;
  cupArea.appendChild(vortex);
  setTimeout(() => vortex.remove(), 600);
}

/* Create star/hearts flying from straw (Enhanced: 2-3 shapes) */
function createStarFly() {
  const cupArea = document.getElementById('tasting-cup-area');
  const straw = document.getElementById('tasting-straw');
  const strawRect = straw.getBoundingClientRect();
  const cupRect = cupArea.getBoundingClientRect();
  const baseX = strawRect.left - cupRect.left + 5;
  const baseY = strawRect.top - cupRect.top;

  const count = 2 + Math.floor(Math.random() * 2); // 2-3 shapes
  const shapes = ['star', 'heart', 'star'];
  const colors = ['#FFD54F', '#FF6B8A', '#FFB74D'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'star-fly';
    const sx = (Math.random() - 0.5) * 60;
    const sy = -(30 + Math.random() * 40);
    const sx2 = sx + (Math.random() - 0.5) * 40;
    const sy2 = sy - 40 - Math.random() * 30;
    const rot = (Math.random() > 0.5 ? '' : '-') + (360 + Math.random() * 360) + 'deg';

    if (shapes[i] === 'star') {
      el.innerHTML = `<svg viewBox="0 0 24 24" style="--sx:${sx}px;--sy:${sy}px;--sx2:${sx2}px;--sy2:${sy2}px;--rot:${rot};fill:${colors[i]};"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else {
      el.innerHTML = `<svg viewBox="0 0 24 24" style="--sx:${sx}px;--sy:${sy}px;--sx2:${sx2}px;--sy2:${sy2}px;--rot:${rot};fill:${colors[i]};"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    }
    el.style.cssText = `left:${baseX}px; top:${baseY}px;`;
    cupArea.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
}

/* Show happy face on last sip (Enhanced: cute face with blush) */
function showHappyFace() {
  const face = document.createElement('div');
  face.className = 'happy-face';
  face.innerHTML = `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <!-- Face circle -->
      <circle cx="60" cy="60" r="55" fill="#FFE082" stroke="#FFB74D" stroke-width="3"/>
      <!-- Inner glow -->
      <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <!-- Eyes -->
      <ellipse cx="42" cy="48" rx="5" ry="6" fill="#5D4037"/>
      <ellipse cx="78" cy="48" rx="5" ry="6" fill="#5D4037"/>
      <!-- Eye shine -->
      <circle cx="44" cy="46" r="2" fill="white"/>
      <circle cx="80" cy="46" r="2" fill="white"/>
      <!-- Blush (enhanced) -->
      <ellipse cx="32" cy="62" rx="10" ry="6" fill="#FF8A80" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="88" cy="62" rx="10" ry="6" fill="#FF8A80" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <!-- Smile -->
      <path d="M40,68 Q60,90 80,68" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Tiny sparkle -->
      <circle cx="18" cy="30" r="3" fill="#FFD54F" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="102" cy="35" r="2" fill="#FFD54F" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
  document.body.appendChild(face);
  setTimeout(() => face.remove(), 2500);
}

/* Enhanced confetti burst (50 particles with stars and hearts) */
function launchEnhancedConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#FF6B8A','#FFB74D','#8BC34A','#B39DDB','#FFD54F','#FF8A65','#FF69B4','#00BCD4'];
  const shapes = ['circle', 'rect', 'star', 'heart'];

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 6;
    const tx = (Math.random() - 0.5) * 300;
    const ty = -(100 + Math.random() * 200);
    const tx2 = tx + (Math.random() - 0.5) * 100;
    const ty2 = ty - 50 - Math.random() * 100;
    const rot = (Math.random() > 0.5 ? '' : '-') + (360 + Math.random() * 720) + 'deg';

    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left:50%; top:40%;
      width:${size}px; height:${shape === 'rect' ? size * 0.6 : size}px;
      background:${color};
      --tx:${tx}px; --ty:${ty}px; --tx2:${tx2}px; --ty2:${ty2}px; --rot:${rot};
      border-radius:${shape === 'circle' ? '50%' : shape === 'heart' ? '50% 50% 50% 0' : '2px'};
      animation: confetti-burst ${1 + Math.random() * 0.8}s ease-out ${Math.random() * 0.3}s forwards;
    `;

    if (shape === 'star') {
      piece.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      piece.style.background = 'none';
    } else if (shape === 'heart') {
      piece.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      piece.style.background = 'none';
      piece.style.borderRadius = '0';
    }

    container.appendChild(piece);
  }
  setTimeout(() => container.innerHTML = '', 3000);
}

function showEmotion(text) {
  const bubble = document.getElementById('emotion-bubble');
  bubble.textContent = text;
  bubble.classList.remove('show');
  void bubble.offsetWidth;
  bubble.classList.add('show');
  setTimeout(() => bubble.classList.remove('show'), 2200);
}

/* ========== Result Card ========== */
function renderResult() {
  const preset = state.currentRecipe || buildRecipeFromState();
  const color = getTeaColor();

  // Recipe name
  document.getElementById('result-recipe-name').textContent = preset.name;

  // Tags
  const details = document.getElementById('result-details');
  const teaName = TEAS.find(t => t.id === state.recipe.tea)?.name || '';
  const toppingNames = state.recipe.toppings.map(id => TOPPINGS.find(t => t.id === id)?.name).filter(Boolean);
  const tags = [teaName, SWEETNESS[state.recipe.sweetness], ICE[state.recipe.ice], ...toppingNames];
  details.innerHTML = tags.map(t => `<span class="result-tag">${t}</span>`).join('');

  // Mood tag
  const moodTag = generateMoodTag();
  document.getElementById('result-mood-container').innerHTML = `<span class="result-mood-tag">${moodTag}</span>`;

  // Message - personalized
  const msg = generatePersonalMessage();
  document.getElementById('result-message').textContent = msg;

  // Calories
  document.getElementById('result-calories').textContent = preset.calories;

  // Cup thumbnail (using external SVG)
  renderResultCup(color);

  // Update drink count
  const countEl = document.getElementById('drink-count');
  const count = parseInt(countEl.textContent.replace(/,/g, '')) + 1;
  countEl.textContent = count.toLocaleString();
}

/* Generate mood tag based on recipe characteristics */
function generateMoodTag() {
  const sweet = SWEETNESS[state.recipe.sweetness];
  const ice = ICE[state.recipe.ice];
  const toppings = state.recipe.toppings;

  // Priority-based mood tag
  if (sweet === '全糖') return MOOD_TAGS['全糖'];
  if (sweet === '无糖') return MOOD_TAGS['无糖'];
  if (toppings.includes('foam')) return MOOD_TAGS['foam'];
  if (toppings.includes('boba')) return MOOD_TAGS['boba'];
  if (toppings.includes('taro-ball')) return MOOD_TAGS['taro-ball'];
  if (ice === '热饮') return MOOD_TAGS['热饮'];
  if (ice === '多冰') return MOOD_TAGS['多冰'];
  if (sweet === '三分甜') return MOOD_TAGS['三分甜'];
  return MOOD_TAGS['五分甜'];
}

/* Generate personalized message based on recipe features */
function generatePersonalMessage() {
  const sweet = SWEETNESS[state.recipe.sweetness];
  const ice = ICE[state.recipe.ice];
  const toppings = state.recipe.toppings;
  const tea = TEAS.find(t => t.id === state.recipe.tea)?.name || '奶茶';

  let msg = '';
  if (sweet === '全糖') {
    msg = '虽然全糖，但假装喝就不算！\n快乐是零卡路里的～';
  } else if (sweet === '无糖') {
    msg = '无糖也假装喝？\n你的自律已经超越了味蕾！';
  } else if (toppings.includes('foam')) {
    msg = '奶盖的绵密口感，\n在想象中已经完美还原了！';
  } else if (toppings.includes('boba') && toppings.length === 1) {
    msg = '经典就是经典，\n珍珠和奶茶的搭配永远不会错！';
  } else if (toppings.length >= 2) {
    msg = '加料这么多，\n你是个懂享受的假装品鉴家！';
  } else if (ice === '热饮') {
    msg = '一杯热腾腾的' + tea + '，\n假装喝也能感受到温暖～';
  } else {
    const msgs = RESULT_MESSAGES;
    msg = msgs[Math.floor(Math.random() * msgs.length)];
  }
  return msg;
}

function buildRecipeFromState() {
  const teaName = TEAS.find(t => t.id === state.recipe.tea)?.name || '奶茶';
  const toppingStr = state.recipe.toppings.map(id => TOPPINGS.find(t => t.id === id)?.name).filter(Boolean).join('+');
  return {
    name: toppingStr ? `${teaName}${toppingStr}` : teaName,
    calories: 350 + Math.floor(Math.random() * 200),
  };
}

/* Render result cup thumbnail (using external SVG reference) */
function renderResultCup(color) {
  const thumb = document.getElementById('result-cup-thumb');
  const toppings = state.recipe.toppings;

  // Build toppings SVG
  let toppingsSvg = '';
  toppings.forEach(tid => {
    const t = TOPPINGS.find(tp => tp.id === tid);
    if (!t) return;
    let y = 120;
    if (t.type === 'top') y = 50;
    else if (t.type === 'middle') y = 85;
    const count = t.id === 'boba' ? 4 : t.id === 'foam' ? 1 : 2;
    for (let j = 0; j < count; j++) {
      const cx = 35 + Math.random() * 50;
      const cy = y + Math.random() * 15;
      const r = t.id === 'foam' ? 14 : t.id === 'boba' ? 4 : 3;
      toppingsSvg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${t.color}" opacity="0.9"/>`;
    }
  });

  thumb.innerHTML = `
    <svg viewBox="0 0 120 160" width="120" height="160">
      <defs>
        <clipPath id="rc-clip">
          <path d="M20,20 L20,140 Q20,150 30,150 L90,150 Q100,150 100,140 L100,20 Z"/>
        </clipPath>
        <linearGradient id="rc-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.5)"/>
          <stop offset="30%" style="stop-color:rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="60" cy="155" rx="35" ry="4" fill="rgba(0,0,0,0.05)"/>
      <!-- Cup body -->
      <path d="M20,20 L20,140 Q20,150 30,150 L90,150 Q100,150 100,140 L100,20 Z" fill="rgba(255,255,255,0.85)" stroke="#DDD0C4" stroke-width="1.2"/>
      <!-- Glass highlight -->
      <path d="M26,25 L27,135 Q27,142 32,144 L34,144 Q30,142 29,135 L28,25 Z" fill="url(#rc-shine)"/>
      <!-- Liquid -->
      <g clip-path="url(#rc-clip)">
        <rect x="20" y="40" width="80" height="110" fill="${color}" style="animation:liquid-wave 3s ease-in-out infinite;"/>
        ${toppingsSvg}
      </g>
      <!-- Lid -->
      <rect x="18" y="16" width="84" height="8" rx="4" fill="#E8DDD4"/>
      <rect x="18" y="16" width="84" height="4" rx="2" fill="#F0E8E0"/>
      <!-- Straw -->
      <line x1="82" y1="2" x2="74" y2="90" stroke="#FFB6C1" stroke-width="4" stroke-linecap="round"/>
      <line x1="82" y1="2" x2="74" y2="90" stroke="#FF69B4" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
      <rect x="78" y="0" width="8" height="7" rx="3" fill="#FFB6C1"/>
      <!-- Steam -->
      <path d="M55,12 Q53,6 56,0" stroke="rgba(200,180,160,0.3)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M62,10 Q60,4 63,-2" stroke="rgba(200,180,160,0.25)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>
  `;
}

/* ========== Save & Share ========== */
function saveCard() {
  if (typeof html2canvas !== 'undefined') {
    html2canvas(document.getElementById('result-card'), {
      backgroundColor: null,
      scale: 2,
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = '假装喝奶茶.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = () => saveCard();
    document.head.appendChild(script);
  }
}

function shareCard() {
  if (navigator.share) {
    navigator.share({
      title: '假装喝奶茶',
      text: `我今天假装喝了一杯${document.getElementById('result-recipe-name').textContent}！`,
      url: window.location.href,
    }).catch(() => {});
  } else {
    saveCard();
  }
}

/* ========== Reset ========== */
function resetState() {
  state.recipeStep = 0;
  state.recipe = { cup: null, tea: null, toppings: [], sweetness: null, ice: null };
  state.making = { phase: 'idle', shakeProgress: 0 };
  state.sipping = { sipCount: 0, maxSips: 5, liquidLevel: 100 };
  state.isRandom = false;
  state.currentRecipe = null;

  // Reset body warming class
  document.body.classList.remove('warming');

  // Reset UI
  document.querySelectorAll('.cup-card, .tea-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.topping-pill').forEach(p => p.classList.remove('selected'));
  document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('topping-count').textContent = '';
  document.getElementById('recipe-progress').style.width = '25%';
  document.getElementById('step-label').textContent = '第 1 步 / 共 4 步 · 选杯型';
  document.getElementById('btn-prev').classList.add('hidden');
  document.getElementById('btn-next').disabled = true;
  document.getElementById('btn-next').textContent = '下一步';

  // Reset step panels
  document.querySelectorAll('.step-panel').forEach((p, i) => {
    p.classList.remove('active','left','right');
    if (i === 0) p.classList.add('active');
    else p.classList.add('right');
  });

  // Reset sip pulse rings
  document.querySelectorAll('.sip-pulse').forEach(p => p.style.display = '');
}

/* ========== Start ========== */
init();
