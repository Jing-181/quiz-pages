import { state } from '../store/state.js';
import { TOPPING_STYLES, TOPPING_FUN_TEXT } from '../data/constants.js';

/**
 * 制作流程 composable
 *
 * 所有 DOM 操作通过传入的 container / el 参数执行，
 * 临时粒子（茶滴、飞溅、气泡）直接操作 DOM 后自动移除。
 */
export function useMaking() {

  /* ============================================================
   *  startMaking — 主流程控制
   *  @param {Object} els - 组件提供的 DOM 元素引用
   *    els.title           - 标题元素
   *    els.shakeArea       - 摇晃区域
   *    els.shakerArea      - 雪克杯区域
   *    els.shakerCup       - 雪克杯元素
   *    els.shakerBody      - 雪克杯身元素
   *    els.shakerLiquid    - 雪克杯液体元素
   *    els.shakerIceContainer - 雪克杯冰块容器
   *    els.shakerToppingsContainer - 雪克杯小料容器
   *    els.pourArea        - 倒入区域
   *    els.pourShaker      - 倒入时的雪克杯
   *    els.pourStream      - 倒茶流
   *    els.servingCup      - 饮用杯
   *    els.servingLiquid   - 饮用杯液体
   *    els.shakeRingFill   - 摇晃进度环
   *    els.shakeCountText  - 摇晃百分比文字
   *    els.btnShake        - 摇晃按钮
   *  @param {Function} onComplete - 制作完成回调（切换到品尝页）
   * ============================================================ */
  function startMaking(els, onComplete) {
    // Reset making UI
    els.title.textContent = '正在制作中...';
    els.shakeArea.classList.add('hidden');
    els.shakerArea.style.display = 'block';
    els.pourArea.style.display = 'none';

    els.shakerLiquid.style.height = '0%';
    els.shakerLiquid.style.background = state.liquidColor;
    els.shakerLiquid.classList.remove('wobbling');

    // Clear toppings & ice
    els.shakerToppingsContainer.innerHTML = '';
    els.shakerIceContainer.innerHTML = '';

    // Reset shake
    state.shakeProgress = 0;
    state.isShaking = false;
    updateShakeRing(els.shakeRingFill, els.shakeCountText);

    // ---- Phase 1: Pour tea with droplets (2s) ----
    els.title.textContent = '倒茶中...';
    els.shakerBody.classList.add('pouring');

    setTimeout(function() {
      createTeaDroplets(els.shakerArea);
    }, 300);

    setTimeout(function() {
      els.shakerLiquid.style.height = '70%';
    }, 500);

    setTimeout(function() {
      createSplashDroplets(els.shakerArea, els.shakerLiquid);
    }, 800);

    setTimeout(function() {
      els.shakerBody.classList.remove('pouring');
    }, 2200);

    // ---- Phase 2: Add ice cubes ----
    var iceDelay = 2500;
    if (state.iceCount > 0) {
      setTimeout(function() {
        els.title.textContent = '加冰块...';
        addIce(els.shakerIceContainer, state.iceCount);
      }, iceDelay);
      iceDelay += 800;
    }

    // ---- Phase 3: Add toppings (1s each) ----
    for (var i = 0; i < state.toppings.length; i++) {
      (function(index) {
        setTimeout(function() {
          els.title.textContent = '加' + state.toppings[index] + '...';
          addTopping(els.shakerToppingsContainer, els.shakerArea, state.toppings[index]);
        }, iceDelay + index * 1200);
      })(i);
    }

    // ---- Phase 4: Shake ----
    var shakeDelay = iceDelay + state.toppings.length * 1200 + 500;
    setTimeout(function() {
      els.title.textContent = '摇一摇！';
      els.shakeArea.classList.remove('hidden');
      state.shakeProgress = 0;
      updateShakeRing(els.shakeRingFill, els.shakeCountText);
      initShakeButton(els, onComplete);
    }, shakeDelay);
  }

  /* ============================================================
   *  createTeaDroplets — 倒茶时的茶滴粒子
   * ============================================================ */
  function createTeaDroplets(container) {
    var streamColor = state.liquidColor;
    var dropletCount = 6 + Math.floor(Math.random() * 3); // 6-8

    for (var i = 0; i < dropletCount; i++) {
      (function(idx) {
        setTimeout(function() {
          var droplet = document.createElement('div');
          droplet.className = 'tea-droplet';
          var size = 4 + Math.floor(Math.random() * 5); // 4-8px
          droplet.style.width = size + 'px';
          droplet.style.height = size + 'px';
          droplet.style.background = streamColor;
          // Random horizontal position within cup mouth
          var leftOffset = 60 + Math.floor(Math.random() * 60); // 60-120px area
          droplet.style.left = leftOffset + 'px';
          droplet.style.top = '20px';
          droplet.style.animationDelay = (Math.random() * 0.3) + 's';
          container.appendChild(droplet);
          // Remove after animation
          setTimeout(function() {
            if (droplet.parentNode) droplet.parentNode.removeChild(droplet);
          }, 1000);
        }, idx * 100);
      })(i);
    }
  }

  /* ============================================================
   *  createSplashDroplets — 液面飞溅粒子
   * ============================================================ */
  function createSplashDroplets(container) {
    var streamColor = state.liquidColor;
    var splashCount = 2 + Math.floor(Math.random() * 2); // 2-3

    for (var i = 0; i < splashCount; i++) {
      (function(idx) {
        setTimeout(function() {
          var splash = document.createElement('div');
          splash.className = 'splash-droplet';
          var size = 3 + Math.floor(Math.random() * 3);
          splash.style.width = size + 'px';
          splash.style.height = size + 'px';
          splash.style.background = streamColor;
          // Position near liquid surface
          var leftOffset = 65 + Math.floor(Math.random() * 50);
          splash.style.left = leftOffset + 'px';
          splash.style.top = '70px'; // approximate liquid surface
          container.appendChild(splash);
          setTimeout(function() {
            if (splash.parentNode) splash.parentNode.removeChild(splash);
          }, 600);
        }, idx * 80);
      })(i);
    }
  }

  /* ============================================================
   *  addIce — 添加冰块
   * ============================================================ */
  function addIce(container, count) {
    var iceClasses = ['ice-cube-1', 'ice-cube-2', 'ice-cube-3'];

    for (var i = 0; i < count; i++) {
      (function(idx) {
        setTimeout(function() {
          var ice = document.createElement('div');
          var cls = iceClasses[idx % iceClasses.length];
          ice.className = 'ice-cube ' + cls;
          // Position randomly in upper-middle area of cup
          var left = 10 + Math.random() * 75;
          var top = 10 + Math.random() * 50;
          ice.style.left = left + '%';
          ice.style.top = top + '%';
          ice.style.animationDelay = (idx * 0.5) + 's, ' + (idx * 0.7) + 's';
          // Drop animation
          ice.style.opacity = '0';
          ice.style.animation = 'iceDrop 0.5s ease-out forwards, iceFloat 3s ease-in-out ' + (idx * 0.5) + 's infinite';
          container.appendChild(ice);
        }, idx * 200);
      })(i);
    }
  }

  /* ============================================================
   *  addTopping — 添加小料（含差异化样式和动画）
   * ============================================================ */
  function addTopping(container, areaEl, toppingName) {
    var style = TOPPING_STYLES[toppingName];
    if (!style) return;

    // Show fun text
    showToppingFunText(areaEl, toppingName);

    // Special handling for cream layer
    if (style.shape === 'layer') {
      addCreamLayer(container, style);
      return;
    }

    var dot = document.createElement('div');
    dot.className = 'making-topping-dot';

    // Position randomly in lower part of cup
    var left = 15 + Math.random() * 70;
    var bottom = 5 + Math.random() * 40;
    dot.style.left = left + '%';
    dot.style.bottom = bottom + '%';

    var size = style.size;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';

    // Apply shape
    if (style.shape === 'circle' || style.shape === 'ellipse') {
      dot.style.borderRadius = '50%';
    } else if (style.shape === 'square') {
      dot.style.borderRadius = '2px';
    } else if (style.shape === 'rect') {
      dot.style.borderRadius = '2px';
    }

    // Apply color / extra styles
    if (style.extra && style.extra.indexOf('background:') === 0) {
      dot.style.cssText += ';' + style.extra;
    } else if (style.extra && style.extra.indexOf('box-shadow') === 0) {
      dot.style.background = style.color;
      dot.style.cssText += ';' + style.extra;
    } else if (style.extra && style.extra.indexOf('transform:') === 0) {
      dot.style.background = style.color;
      dot.style.cssText += ';' + style.extra;
    } else {
      dot.style.background = style.color;
      if (style.extra) dot.style.cssText += ';' + style.extra;
    }

    // Determine animation type
    var animName = 'bounceIn';
    if (toppingName === '椰果' || toppingName === '仙草' || toppingName === '奥利奥碎') {
      animName = 'spinIn';
    } else if (toppingName === '布丁') {
      animName = 'floatIn';
    }

    dot.style.animation = animName + ' 0.6s ease-out forwards';
    container.appendChild(dot);
  }

  /* ============================================================
   *  addCreamLayer — 芝士奶盖特殊处理
   * ============================================================ */
  function addCreamLayer(container, style) {
    var cream = document.createElement('div');
    cream.className = 'cream-layer';
    container.appendChild(cream);
    // Trigger spread after append
    setTimeout(function() {
      cream.classList.add('spread');
    }, 50);
  }

  /* ============================================================
   *  showToppingFunText — 显示小料趣味文字
   * ============================================================ */
  function showToppingFunText(areaEl, toppingName) {
    var text = TOPPING_FUN_TEXT[toppingName];
    if (!text) return;
    var el = document.createElement('div');
    el.className = 'topping-fun-text';
    el.textContent = text;
    el.style.top = '-20px';
    areaEl.appendChild(el);
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1600);
  }

  /* ============================================================
   *  updateShakeRing — 更新摇晃进度环
   * ============================================================ */
  function updateShakeRing(ringEl, textEl) {
    if (!ringEl) return;
    var circumference = 251.2; // 2 * PI * 40
    var offset = circumference - (state.shakeProgress / 100) * circumference;
    ringEl.style.strokeDashoffset = offset;
    if (textEl) {
      textEl.textContent = Math.floor(state.shakeProgress) + '%';
    }
  }

  /* ============================================================
   *  createShakeBubble — 摇晃时液体中的气泡
   * ============================================================ */
  function createShakeBubble(liquidEl) {
    var bubble = document.createElement('div');
    bubble.className = 'shake-bubble';
    var size = 3 + Math.floor(Math.random() * 4);
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = (15 + Math.random() * 70) + '%';
    bubble.style.bottom = (30 + Math.random() * 30) + '%';
    liquidEl.appendChild(bubble);
    setTimeout(function() {
      if (bubble.parentNode) bubble.parentNode.removeChild(bubble);
    }, 900);
  }

  /* ============================================================
   *  startShaking — 开始摇晃（长按触发）
   * ============================================================ */
  function startShaking(els, onComplete) {
    if (state.shakeProgress >= 100) return;
    state.isShaking = true;
    els.shakerLiquid.classList.add('wobbling');
    els.shakerArea.classList.add('shaking');

    // Progress increment: ~3% per 100ms = 30% per second = ~3.3s to fill
    state.shakeInterval = setInterval(function() {
      if (!state.isShaking || state.shakeProgress >= 100) return;
      state.shakeProgress += 3;
      if (state.shakeProgress > 100) state.shakeProgress = 100;
      updateShakeRing(els.shakeRingFill, els.shakeCountText);

      // Create shake bubbles
      if (Math.random() > 0.5) {
        createShakeBubble(els.shakerLiquid);
      }

      if (state.shakeProgress >= 100) {
        onShakeComplete(els, onComplete);
      }
    }, 100);
  }

  /* ============================================================
   *  stopShaking — 停止摇晃
   * ============================================================ */
  function stopShaking(els) {
    if (!state.isShaking) return;
    state.isShaking = false;
    if (state.shakeInterval) {
      clearInterval(state.shakeInterval);
      state.shakeInterval = null;
    }
    els.shakerLiquid.classList.remove('wobbling');
    els.shakerArea.classList.remove('shaking');
  }

  /* ============================================================
   *  onShakeComplete — 摇晃完成
   * ============================================================ */
  function onShakeComplete(els, onComplete) {
    stopShaking(els);

    // Show ding text
    var ding = document.createElement('div');
    ding.className = 'ding-text';
    ding.textContent = '叮～摇好了！';
    els.shakerArea.appendChild(ding);

    setTimeout(function() {
      if (ding.parentNode) ding.parentNode.removeChild(ding);
      els.shakeArea.classList.add('hidden');
      els.title.textContent = '倒入杯中...';
      
      // 切换到倒入场景
      els.shakerArea.style.display = 'none';
      els.pourArea.style.display = 'block';
      
      // 开始倒入动画
      setTimeout(function() {
        els.pourShaker.classList.add('pouring');
        els.servingCup.classList.add('show');
        
        // 饮用杯填充动画
        setTimeout(function() {
          els.servingCup.classList.add('filling');
          els.servingLiquid.style.height = '70%';
          els.servingLiquid.style.background = state.liquidColor;
          
          // 饮用杯放大动画
          setTimeout(function() {
            els.servingCup.classList.add('scaling');
            els.title.textContent = '完成！';
            
            // 完成回调
            setTimeout(function() {
              if (onComplete) onComplete();
            }, 600);
          }, 1500);
        }, 500);
      }, 500);
    }, 1300);
  }

  /* ============================================================
   *  initShakeButton — 初始化摇晃按钮事件
   * ============================================================ */
  function initShakeButton(els, onComplete) {
    var btn = els.btnShake;
    // Remove old listeners by cloning
    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    // Update reference in els
    els.btnShake = newBtn;

    // Long press: mousedown / touchstart
    newBtn.addEventListener('mousedown', function() {
      startShaking(els, onComplete);
    });
    newBtn.addEventListener('touchstart', function() {
      startShaking(els, onComplete);
    }, { passive: true });
    window.addEventListener('mouseup', function() {
      stopShaking(els);
    });
    window.addEventListener('touchend', function() {
      stopShaking(els);
    });
    window.addEventListener('touchcancel', function() {
      stopShaking(els);
    });
  }

  /* ============================================================
   *  addShakeProgress — 外部摇晃增量（供 DeviceMotion 调用）
   * ============================================================ */
  function addShakeProgress(amount, els, onComplete) {
    if (state.shakeProgress >= 100) return;
    state.shakeProgress += amount;
    if (state.shakeProgress > 100) state.shakeProgress = 100;
    updateShakeRing(els.shakeRingFill, els.shakeCountText);

    // Brief visual feedback
    els.shakerLiquid.classList.add('wobbling');
    els.shakerArea.classList.add('shaking');
    setTimeout(function() {
      els.shakerLiquid.classList.remove('wobbling');
      els.shakerArea.classList.remove('shaking');
    }, 200);

    if (state.shakeProgress >= 100) {
      onShakeComplete(els, onComplete);
    }
  }

  return {
    startMaking,
    createTeaDroplets,
    createSplashDroplets,
    addIce,
    addTopping,
    startShaking,
    stopShaking,
    addShakeProgress,
    updateShakeRing,
  };
}
