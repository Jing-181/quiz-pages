import { state } from '../store/state.js';
import { SIP_MESSAGES, RESULT_MESSAGES, TOPPING_STYLES } from '../data/constants.js';

let sipInterval = null;

/**
 * 品尝流程 composable
 *
 * DOM 操作通过传入的元素引用执行，
 * 临时粒子（漩涡、星星、纸屑）直接操作 DOM 后自动移除。
 */
export function useTasting() {

  /* ============================================================
   *  initTasting — 初始化品尝页
   * ============================================================ */
  function initTasting(els, updateProgress) {
    state.sipCount = 0;
    state.sipProgress = 0;
    state.isSipping = false;
    els.liquid.style.height = '80%';
    els.liquid.style.background = state.liquidColor;

    // Reset cup tilt
    els.cupBody.classList.remove('tilted');

    // Remove warm overlay
    els.warmOverlay.classList.remove('active');

    // Add ice cubes from saved positions
    addTastingIce(els.iceContainer);

    // Add toppings from saved positions
    addTastingToppings(els.toppingsContainer);

    // Build sip dots (now for visual only)
    els.sipDots.innerHTML = '';
    for (var i = 0; i < 5; i++) {
      var dot = document.createElement('div');
      dot.className = 'sip-dot';
      dot.id = 'sip-dot-' + i;
      els.sipDots.appendChild(dot);
    }

    els.sipProgress.textContent = '饮用进度: 0%';
    els.btnSip.classList.remove('hidden');
    els.btnSipWrap.classList.remove('hidden');
    els.btnResult.classList.add('hidden');

    // Clean up any leftover elements
    var leftovers = els.cupArea.querySelectorAll('.sip-vortex, .sip-star, .happy-face, .confetti-piece');
    for (var j = 0; j < leftovers.length; j++) {
      if (leftovers[j].parentNode) leftovers[j].parentNode.removeChild(leftovers[j]);
    }
  }

  /* ============================================================
   *  addTastingIce — 品尝页添加冰块
   * ============================================================ */
  function addTastingIce(container) {
    container.innerHTML = '';
    var positions = state.savedIcePositions || [];
    for (var i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var ice = document.createElement('div');
      ice.className = 'ice-cube ' + (pos.class || 'ice-cube-1');
      ice.style.left = pos.left + '%';
      ice.style.top = pos.top + '%';
      ice.style.animationDelay = (i * 0.3) + 's';
      container.appendChild(ice);
    }
  }

  /* ============================================================
   *  addTastingToppings — 品尝页添加小料
   * ============================================================ */
  function addTastingToppings(container) {
    container.innerHTML = '';
    var toppings = state.savedToppingPositions || [];
    for (var i = 0; i < toppings.length; i++) {
      var item = toppings[i];
      if (!item || !item.pos) continue;
      
      var dot = document.createElement('div');
      dot.className = 'making-topping-dot show';
      dot.style.left = item.pos.left + '%';
      dot.style.bottom = item.pos.bottom + '%';
      
      var size = item.pos.style.size;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';

      if (item.pos.style.shape === 'circle' || item.pos.style.shape === 'ellipse') {
        dot.style.borderRadius = '50%';
      } else if (item.pos.style.shape === 'square') {
        dot.style.borderRadius = '2px';
      } else if (item.pos.style.shape === 'rect') {
        dot.style.borderRadius = '2px';
      }

      if (item.pos.style.extra && item.pos.style.extra.indexOf('background:') === 0) {
        dot.style.cssText += ';' + item.pos.style.extra;
      } else if (item.pos.style.extra && item.pos.style.extra.indexOf('box-shadow') === 0) {
        dot.style.background = item.pos.style.color;
        dot.style.cssText += ';' + item.pos.style.extra;
      } else if (item.pos.style.extra && item.pos.style.extra.indexOf('transform:') === 0) {
        dot.style.background = item.pos.style.color;
        dot.style.cssText += ';' + item.pos.style.extra;
      } else {
        dot.style.background = item.pos.style.color;
        if (item.pos.style.extra) dot.style.cssText += ';' + item.pos.style.extra;
      }
      
      container.appendChild(dot);
    }
  }

  /* ============================================================
   *  startSipping — 开始持续饮用
   * ============================================================ */
  function startSipping(els, updateProgress, onComplete) {
    if (state.isSipping || state.sipProgress >= 100) return;
    
    state.isSipping = true;
    els.cupBody.classList.add('tilted');
    
    sipInterval = setInterval(function() {
      if (!state.isSipping || state.sipProgress >= 100) {
        stopSipping();
        return;
      }
      
      // Increase progress
      state.sipProgress += 2;
      if (state.sipProgress > 100) state.sipProgress = 100;
      
      // Update liquid height
      var newHeight = 80 - (state.sipProgress * 0.8);
      if (newHeight < 0) newHeight = 0;
      els.liquid.style.height = newHeight + '%';
      
      // Update sip count for milestones
      var newSipCount = Math.floor(state.sipProgress / 20);
      if (newSipCount > state.sipCount) {
        state.sipCount = newSipCount;
        
        // Update visual dots
        var dot = document.getElementById('sip-dot-' + (state.sipCount - 1));
        if (dot) dot.classList.add('filled');
        
        // Effects
        createVortex(els.cupArea);
        createStarFly(els.cupArea);
        showEmotion(els.emotionBubble);
        
        // 3rd sip: warm overlay
        if (state.sipCount === 3) {
          els.warmOverlay.classList.add('active');
        }
      }
      
      updateProgress();
      
      if (state.sipProgress >= 100) {
        stopSipping();
        
        // Done drinking - special effects
        els.btnSip.classList.add('hidden');
        els.btnSipWrap.classList.add('hidden');
        els.btnResult.classList.remove('hidden');

        // Happy face
        showHappyFace(els.cupArea);

        // Confetti
        createConfetti(els.cupArea);
        
        onComplete();
      }
    }, 50);
  }

  /* ============================================================
   *  stopSipping — 停止饮用
   * ============================================================ */
  function stopSipping() {
    state.isSipping = false;
    if (sipInterval) {
      clearInterval(sipInterval);
      sipInterval = null;
    }
  }

  /* ============================================================
   *  createVortex — 吸管底部漩涡特效
   * ============================================================ */
  function createVortex(container) {
    var vortex = document.createElement('div');
    vortex.className = 'sip-vortex';
    // Position near straw bottom in the liquid
    vortex.style.right = '30px';
    vortex.style.bottom = '60px';
    container.appendChild(vortex);
    setTimeout(function() {
      if (vortex.parentNode) vortex.parentNode.removeChild(vortex);
    }, 900);
  }

  /* ============================================================
   *  createStarFly — 星星/爱心从吸管顶部飞出
   * ============================================================ */
  function createStarFly(container) {
    var star = document.createElement('div');
    star.className = 'sip-star';
    // Alternate star and heart
    if (state.sipCount % 2 === 0) {
      star.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B8A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    } else {
      star.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B8A"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    }
    // Position at straw top
    star.style.right = '28px';
    star.style.top = '-5px';
    container.appendChild(star);
    setTimeout(function() {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, 1100);
  }

  /* ============================================================
   *  showEmotion — 显示情绪气泡
   * ============================================================ */
  function showEmotion(bubbleEl) {
    var msg = SIP_MESSAGES[Math.floor(Math.random() * SIP_MESSAGES.length)];
    bubbleEl.textContent = msg;
    bubbleEl.classList.remove('show');
    bubbleEl.offsetHeight; // reflow
    bubbleEl.classList.add('show');
    setTimeout(function() {
      bubbleEl.classList.remove('show');
    }, 1500);
  }

  /* ============================================================
   *  showHappyFace — 显示笑脸
   * ============================================================ */
  function showHappyFace(container) {
    var face = document.createElement('div');
    face.className = 'happy-face';
    face.innerHTML =
      '<div class="happy-face-eye left"></div>' +
      '<div class="happy-face-eye right"></div>' +
      '<div class="happy-face-mouth"></div>' +
      '<div class="happy-face-blush left"></div>' +
      '<div class="happy-face-blush right"></div>';
    container.appendChild(face);
  }

  /* ============================================================
   *  createConfetti — 纸屑特效
   * ============================================================ */
  function createConfetti(container) {
    var colors = ['#FF6B8A', '#FFB74D', '#8BC34A', '#B39DDB', '#FFD54F', '#C4956A', '#FF4081'];
    var count = 10 + Math.floor(Math.random() * 6); // 10-15

    for (var i = 0; i < count; i++) {
      (function(idx) {
        setTimeout(function() {
          var piece = document.createElement('div');
          piece.className = 'confetti-piece';
          piece.style.background = colors[Math.floor(Math.random() * colors.length)];
          piece.style.left = (50 + (Math.random() - 0.5) * 80) + 'px';
          piece.style.top = '40px';
          piece.style.setProperty('--confetti-x', ((Math.random() - 0.5) * 100) + 'px');
          piece.style.animationDelay = (Math.random() * 0.3) + 's';
          piece.style.width = (5 + Math.random() * 5) + 'px';
          piece.style.height = (5 + Math.random() * 5) + 'px';
          piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
          container.appendChild(piece);
          setTimeout(function() {
            if (piece.parentNode) piece.parentNode.removeChild(piece);
          }, 2000);
        }, idx * 50);
      })(i);
    }
  }

  /* ============================================================
   *  getPersonalMessage — 获取个性化结果文案
   * ============================================================ */
  function getPersonalMessage() {
    if (state.sweet === '全糖') return '虽然选了全糖，但假装喝就不算！';
    if (state.sweet === '无糖') return '无糖也快乐，自律的你最棒！';
    if (state.ice === '热饮') return '一杯热腾腾的假装奶茶，温暖你的心';
    if (state.toppings.indexOf('芝士奶盖') >= 0) return '奶盖爱好者，品味不一般！';
    if (state.toppings.length >= 3) return '小料拉满，你是奶茶界的满汉全席！';
    return RESULT_MESSAGES[Math.floor(Math.random() * RESULT_MESSAGES.length)];
  }

  /* ============================================================
   *  getMoodTag — 获取心情标签
   * ============================================================ */
  function getMoodTag() {
    if (state.sweet === '全糖') return '🍬 快乐全糖党';
    if (state.sweet === '无糖') return '🧘 佛系控糖派';
    if (state.toppings.indexOf('珍珠') >= 0) return '⚫ 珍珠狂热粉';
    if (state.toppings.indexOf('芝士奶盖') >= 0) return '🧀 奶盖爱好者';
    if (state.ice === '热饮') return '♨️ 暖心热饮派';
    if (state.toppings.length >= 3) return '🎉 小料满汉全席';
    return '✨ 佛系随缘派';
  }

  return {
    initTasting,
    startSipping,
    stopSipping,
    addTastingIce,
    createVortex,
    createStarFly,
    showEmotion,
    showHappyFace,
    createConfetti,
    getPersonalMessage,
    getMoodTag,
  };
}
