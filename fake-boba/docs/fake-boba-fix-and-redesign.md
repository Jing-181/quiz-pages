# 假装喝奶茶 - 修复+制作场景重设计 实施方案

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修复选配方bug + 重新设计制作过程为真实奶茶店场景 + 推送上线

**Architecture:** 将本地多文件版本打包为单文件推送（避免ES Module兼容问题），同时重新设计制作页为两阶段：调制（雪克杯）→ 倒入饮用杯

**Tech Stack:** Vue 3 CDN + 单文件HTML/CSS/JS

---

## 问题根因分析

### 问题1：选配方页面没有选项
- **根因**：线上还是旧的单文件版本（2821行），从未推送多文件版本的修复
- **修复**：将本地修复后的多文件版本打包为单文件推送

### 问题2：制作过程不够真实
- **根因**：当前只有一个杯子，直接在里面倒茶加料，不像真实奶茶店
- **重设计**：两阶段制作
  - 阶段1（调制）：雪克杯（带盖的摇摇杯），倒茶→加小料→加冰→摇晃
  - 阶段2（出品）：打开雪克杯，倒入饮用杯（带吸管的透明杯），加奶盖

---

## Task 1: 打包多文件版本为单文件

**Files:**
- Read: `/workspace/fake-boba/js/` 下所有文件
- Create: `/workspace/fake-boba/index.html`（单文件，覆盖当前）

- [ ] **Step 1: 读取所有源文件**

读取以下文件，了解最新代码：
- `js/data/constants.js`
- `js/store/state.js`
- `js/composables/useScene.js`
- `js/composables/useMaking.js`
- `js/composables/useTasting.js`
- `js/composables/useDeviceMotion.js`
- `js/components/CupComponent.js`
- `js/components/EmotionBubble.js`
- `js/components/ShakeProgress.js`
- `js/scenes/HomeScene.js`
- `js/scenes/RecipeScene.js`
- `js/scenes/MakingScene.js`
- `js/scenes/TastingScene.js`
- `js/scenes/ResultScene.js`
- `js/app.js`
- `css/style.css`

- [ ] **Step 2: 合并为单文件**

生成 `/workspace/fake-boba/index.html`：
- CSS 内联到 `<style>` 标签
- 所有 JS 合并为一个 `<script>` 标签（在 Vue CDN 之后）
- 去掉所有 `import`/`export`
- `from 'vue'` 改为 `Vue.xxx`
- 组件定义用 `var XXX = { ... }`
- app.js 中 `createApp` 从 `Vue.createApp` 获取
- **关键**：每个场景组件的 `data()` 中包含 `state: state`

- [ ] **Step 3: 验证**

- 确认无 `import`/`export` 残留
- 确认无 `type="module"`
- 确认所有场景组件 `data()` 中有 `state: state`

---

## Task 2: 重新设计制作场景（两阶段）

**Files:**
- Modify: `/workspace/fake-boba/index.html`（或对应的 JS/CSS）

### 设计方案

#### 阶段1：调制（雪克杯）
```
┌─────────────────────┐
│   正在调制中...       │
│                      │
│    ┌──────────┐      │
│    │  ╭─────╮ │ ← 雪克杯盖（半圆弧形）
│    │  │     │ │ ← 雪克杯身（梯形，上宽下窄）
│    │  │ 🧊  │ │ ← 冰块在杯内
│    │  │ ●●● │ │ ← 小料在杯内
│    │  │▓▓▓▓▓│ │ ← 液体
│    │  ╰─────╯ │
│    └──────────┘      │
│                      │
│   [摇晃进度环 0%]     │
│   [💪 按住摇一摇！]   │
└─────────────────────┘
```

- 雪克杯用 CSS 绘制：梯形（上宽下窄）+ 半圆盖 + 透明塑料质感
- 倒茶：液体从顶部倒入雪克杯
- 加小料：小料从上方掉入雪克杯
- 加冰：冰块掉入
- 摇晃：整个雪克杯摇晃，内部液体晃荡

#### 阶段2：出品（倒入饮用杯）
```
┌─────────────────────┐
│   倒入杯中...        │
│                      │
│  雪克杯     饮用杯    │
│  ╱╲        ┌──┐     │
│ │  │  ───→  │  │     │
│ │  │        │🧋│     │
│ ╰──╯        │  │     │
│             └──┘     │
│              │ ← 吸管 │
└─────────────────────┘
```

- 雪克杯倾斜，液体流向饮用杯
- 饮用杯逐渐被填满
- 倒完后雪克杯消失，饮用杯居中放大
- 自动跳转到品尝页

#### CSS 设计

**雪克杯**：
```css
.shaker-cup {
  position: relative;
  width: 120px;
  height: 180px;
  margin: 0 auto;
}
.shaker-lid {
  /* 半圆弧形盖子 */
  width: 130px;
  height: 30px;
  background: linear-gradient(180deg, #E8E0D8, #D5CCC4);
  border-radius: 65px 65px 0 0;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.shaker-body {
  /* 梯形杯身 - 上宽下窄 */
  width: 120px;
  height: 160px;
  background: linear-gradient(135deg, 
    rgba(255,255,255,0.9), 
    rgba(240,235,230,0.85), 
    rgba(255,255,255,0.8));
  border: 2px solid rgba(200,190,180,0.4);
  clip-path: polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%);
  border-radius: 0 0 20px 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.shaker-liquid {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 0%;
  transition: height 2s ease;
  border-radius: 0 0 18px 18px;
}
```

**倒入动画**：
```css
.shaker-cup.pouring {
  animation: shakerPour 1.5s ease-in-out forwards;
}
@keyframes shakerPour {
  0% { transform: rotate(0deg); }
  30% { transform: rotate(-45deg) translateX(-20px); }
  100% { transform: rotate(-60deg) translateX(-30px); opacity: 0; }
}
```

**饮用杯**（出品杯）：
```css
.serving-cup {
  position: absolute;
  bottom: 0;
  right: -60px;
  width: 100px;
  height: 160px;
  opacity: 0;
  transition: opacity 0.5s;
}
.serving-cup.show {
  opacity: 1;
}
```

#### JS 逻辑修改

`useMaking.js` 的 `startMaking` 函数需要改为两阶段：

```
Phase 1: 调制（雪克杯）
  1. 显示雪克杯
  2. 倒茶入雪克杯（2s）
  3. 加冰块入雪克杯（1s）
  4. 加小料入雪克杯（每个1s）
  5. 摇晃雪克杯（长按3s）

Phase 2: 出品（倒入饮用杯）
  6. 雪克杯倾斜倒入（1.5s动画）
  7. 饮用杯逐渐填满（1s）
  8. 雪克杯消失，饮用杯居中放大（0.5s）
  9. 跳转品尝页
```

#### MakingScene template 修改

```html
<div id="scene-making" class="scene">
  <h2 class="making-title brand-title" ref="makingTitle">正在调制中...</h2>
  
  <!-- 阶段1：雪克杯 -->
  <div class="shaker-area" ref="shakerArea">
    <div class="shaker-cup" ref="shakerCup">
      <div class="shaker-lid"></div>
      <div class="shaker-body" ref="shakerBody">
        <div class="shaker-liquid" ref="shakerLiquid"></div>
        <div class="shaker-ice-container" ref="shakerIceContainer"></div>
        <div ref="shakerToppingsContainer"></div>
      </div>
    </div>
  </div>
  
  <!-- 阶段2：倒入 -->
  <div class="pour-area" ref="pourArea" style="display:none">
    <div class="pour-shaker" ref="pourShaker">
      <div class="shaker-lid"></div>
      <div class="shaker-body">
        <div class="shaker-liquid" style="height:70%"></div>
      </div>
    </div>
    <div class="pour-stream"></div>
    <div class="serving-cup" ref="servingCup">
      <div class="serving-cup-body">
        <div class="serving-liquid" ref="servingLiquid"></div>
      </div>
      <div class="serving-cup-rim"></div>
      <div class="serving-straw"></div>
    </div>
  </div>
  
  <!-- 摇晃UI -->
  <div class="shake-area" ref="shakeArea" :class="{ hidden: shakeAreaHidden }">
    <svg ...>进度环</svg>
    <button class="btn-shake" ref="btnShake">💪 按住摇一摇！</button>
    <p class="shake-count-text" ref="shakeCountText">0%</p>
  </div>
</div>
```

---

## Task 3: 推送上线

- [ ] **Step 1: 推送到 GitHub**

将 `/workspace/fake-boba/index.html`（单文件版本）推送到 `fake-boba/index.html`

- [ ] **Step 2: 等待 GitHub Pages 更新**

等待 1-2 分钟

- [ ] **Step 3: 验证线上**

访问 https://jing-181.github.io/quiz-pages/fake-boba/ 验证：
1. 首页正常显示
2. "自己选配方" → 选项能点击选中
3. "随机来一杯" → 雪克杯调制 → 倒入饮用杯 → 品尝

---

## 关键约束

- 单文件 HTML/CSS/JS（避免 ES Module 兼容问题）
- Vue 3 CDN（`vue.global.prod.js`）
- 场景切换：`v-if`（Vue 条件渲染）
- 所有动画只用 transform 和 opacity
- 移动端优先 375px
- 不使用外部 JS 库（html2canvas 除外）
