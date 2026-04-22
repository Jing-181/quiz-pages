# 假装喝奶茶 - Vue 模块化重构方案

## 摘要

将当前 2489 行单文件面条代码重构为 Vue 3 数据驱动 + 多模块架构，提升可维护性和迭代稳定性。不改变功能，只重构架构。

## 当前问题

| 问题 | 表现 |
|------|------|
| 全局状态混乱 | `var state` 对象 + 54个全局函数 + DOM直操作，改一处容易牵一发动全身 |
| DOM操作散落各处 | `getElementById` + `innerHTML` + `classList` 遍布每个函数，难以追踪 |
| 视觉修改风险高 | 改杯子样式需要翻遍 CSS + JS 多处，容易遗漏或破坏其他功能 |
| 无法独立测试 | 所有逻辑耦合在一起，无法单独验证某个模块 |
| 迭代困难 | 每次优化都是"全量重写"，因为代码没有清晰的模块边界 |

## 目标架构

```
fake-boba/
├── index.html              # 入口（Vue CDN + 根组件挂载）
├── css/
│   └── style.css           # 全局样式 + CSS变量 + 动画
├── js/
│   ├── app.js              # Vue应用入口 + 路由
│   ├── store/
│   │   └── state.js        # 集中状态管理（响应式）
│   ├── data/
│   │   └── constants.js    # 所有静态数据（配方、选项、文案）
│   ├── composables/
│   │   ├── useScene.js     # 场景切换逻辑
│   │   ├── useMaking.js    # 制作过程（倒茶+加料+摇一摇）
│   │   ├── useTasting.js   # 品尝过程（喝一口+特效）
│   │   └── useDeviceMotion.js  # 陀螺仪/摇晃检测
│   ├── components/
│   │   ├── CupComponent.js     # 奶茶杯渲染（核心视觉组件）
│   │   ├── IceCubeComponent.js # 冰块组件
│   │   ├── ToppingDot.js       # 小料视觉（差异化形状）
│   │   ├── EmotionBubble.js    # 情绪气泡
│   │   ├── ShakeProgress.js    # 摇晃进度环
│   │   └── ResultCard.js       # 结果卡
│   └── scenes/
│       ├── HomeScene.js        # 首页
│       ├── RecipeScene.js      # 选配方
│       ├── MakingScene.js      # 制作
│       ├── TastingScene.js     # 品尝
│       └── ResultScene.js      # 结果卡
└── assets/
    └── hero-cup.svg
```

## 模块职责划分

### 1. `data/constants.js` — 静态数据层

**职责**：所有不随运行时变化的数据

```javascript
export const PRESETS = [...];
export const TEA_OPTIONS = [...];
export const TOPPING_OPTIONS = [...];
export const SWEET_OPTIONS = [...];
export const ICE_OPTIONS = [...];
export const SIP_MESSAGES = [...];
export const RESULT_MESSAGES = [...];
export const TOPPING_STYLES = {...};
export const TOPPING_FUN_TEXT = {...};
export const ICE_COUNT_MAP = {...};
```

**对应当前代码**：第 1461-1523 行的所有 `var` 常量

### 2. `store/state.js` — 集中状态管理

**职责**：用 Vue 3 `reactive()` 管理所有运行时状态

```javascript
import { reactive, computed } from 'vue';

export const state = reactive({
  // 场景
  currentScene: 'home',  // home | recipe | making | tasting | result

  // 配方
  cup: '',
  tea: '',
  teaColor: '#C4956A',
  toppings: [],
  sweet: '',
  ice: '',
  recipeName: '',
  recipeCal: 0,
  liquidColor: '#C4956A',

  // 制作
  makingPhase: 'idle',  // idle | pouring | icing | topping | shaking | done
  shakeProgress: 0,
  isShaking: false,

  // 品尝
  sipCount: 0,
  maxSips: 5,

  // 选配方步骤
  recipeStep: 0,
});

// 计算属性
export const iceCount = computed(() => ICE_COUNT_MAP[state.ice] || 0);
export const liquidHeight = computed(() => 80 - (state.sipCount * 16));
export const isMakingDone = computed(() => state.shakeProgress >= 100);
export const isAllDrunk = computed(() => state.sipCount >= state.maxSips);
```

**对应当前代码**：第 1526-1546 行的 `var state` + 散落各处的派生计算

### 3. `composables/useScene.js` — 场景切换

**职责**：统一管理场景切换逻辑

```javascript
export function useScene() {
  function goToScene(name) {
    state.currentScene = name;
    window.scrollTo(0, 0);
  }
  return { goToScene };
}
```

**对应当前代码**：第 1549-1563 行的 `goToScene()`

### 4. `composables/useMaking.js` — 制作过程

**职责**：倒茶、加冰、加小料、摇一摇的完整流程控制

```javascript
export function useMaking() {
  function startMaking() { ... }
  function createTeaDroplets() { ... }
  function createSplashDroplets() { ... }
  function addIce() { ... }
  function addTopping(name) { ... }
  function startShaking() { ... }
  function stopShaking() { ... }
  function onShakeComplete() { ... }
  return { startMaking, startShaking, stopShaking };
}
```

**对应当前代码**：第 1791-2191 行的 14 个函数

### 5. `composables/useTasting.js` — 品尝过程

**职责**：喝一口、特效触发、完成检测

```javascript
export function useTasting() {
  function takeSip() { ... }
  function createVortex() { ... }
  function createStarFly() { ... }
  function showEmotion() { ... }
  function showHappyFace() { ... }
  function createConfetti() { ... }
  return { takeSip };
}
```

**对应当前代码**：第 2194-2364 行的 10 个函数

### 6. `components/CupComponent.js` — 奶茶杯（核心）

**职责**：根据 props 渲染不同状态的杯子（制作/品尝/结果卡）

```javascript
export default {
  props: {
    liquidColor: String,    // 液体颜色
    liquidHeight: Number,   // 液面高度百分比
    cupType: String,        // classic | fat | tall
    showStraw: Boolean,
    showIce: Boolean,
    iceCount: Number,
    toppings: Array,        // 小料列表
    showSteam: Boolean,
    size: String,           // 'normal' | 'mini' | 'home'
    tilted: Boolean,
  },
  template: `
    <div class="cup-wrapper" :class="[size, { tilted }]">
      <div class="cup-body" :class="cupType">
        <div class="cup-liquid" :style="{ height: liquidHeight + '%', background: liquidColor }">
          <div class="liquid-wave"></div>
          <ToppingDot v-for="t in toppings" :key="t" :name="t" />
        </div>
        <IceCubeComponent v-for="i in iceCount" :key="i" />
        <div class="cup-highlight"></div>
      </div>
      <div class="cup-rim"></div>
      <div v-if="showStraw" class="cup-straw"></div>
      <div v-if="showSteam" class="steam-container">...</div>
    </div>
  `
};
```

**对应当前代码**：散落在 CSS（第 361-406, 657-705, 900-972 行）和 JS 中的杯子渲染逻辑

### 7. `components/IceCubeComponent.js` — 冰块

**职责**：渲染单个冰块（随机变体、浮动动画）

### 8. `components/ToppingDot.js` — 小料视觉

**职责**：根据小料名称渲染不同形状（珍珠/芋圆/椰果等）

### 9. 场景组件（5个）

每个场景是一个 Vue 组件，通过 `v-if="state.currentScene === 'xxx'"` 切换：

```html
<!-- app.js 根组件 -->
<template>
  <HomeScene v-if="state.currentScene === 'home'" />
  <RecipeScene v-if="state.currentScene === 'recipe'" />
  <MakingScene v-if="state.currentScene === 'making'" />
  <TastingScene v-if="state.currentScene === 'tasting'" />
  <ResultScene v-if="state.currentScene === 'result'" />
  <EmotionBubble />
  <WarmOverlay />
</template>
```

**对应当前代码**：第 1283-1457 行的 HTML + 各场景的 JS 逻辑

## 数据流设计

```
用户操作 → 修改 state → Vue 响应式更新 DOM
                ↓
         computed 自动计算
         (iceCount, liquidHeight, etc.)
                ↓
         CupComponent 自动重渲染
         (液面高度、冰块数量、小料形状)
```

**关键改进**：改视觉只需要改 `CupComponent` 的 template 和 CSS，不需要碰任何 JS 逻辑。

## 视觉优化路径（重构后）

重构完成后，后续视觉优化变得非常安全：

| 要改什么 | 只需要改 | 不用碰 |
|----------|---------|--------|
| 杯子形状/材质 | `CupComponent` template + `css/cup.css` | JS逻辑 |
| 液体颜色/渐变 | `CupComponent` template + `data/constants.js` 的 color | 其他组件 |
| 冰块外观 | `IceCubeComponent` template + CSS | 其他组件 |
| 小料形状 | `ToppingDot` template + CSS | 其他组件 |
| 摇奶茶效果 | `useMaking.js` composable | 其他场景 |
| 品尝页特效 | `useTasting.js` composable | 其他场景 |
| 新增茶底选项 | `data/constants.js` | 任何组件 |
| 新增小料类型 | `data/constants.js` + `ToppingDot` | 其他组件 |

## 技术选型

| 项 | 选择 | 理由 |
|----|------|------|
| 框架 | Vue 3 CDN | 无需构建，直接浏览器运行，GitHub Pages 友好 |
| 状态管理 | `reactive()` + `computed()` | 项目规模不需要 Pinia |
| 组件注册 | 全局注册（`app.component()`） | 简单直接 |
| 模块加载 | ES Module `<script type="module">` | 原生支持，无需打包 |
| CSS | 保持全局 CSS 文件 | 组件少，不需要 scoped CSS |

## 入口文件 `index.html` 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>假装喝奶茶 | Fake Boba</title>
  <link href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app"></div>

  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

## 实施步骤

### Step 1: 创建数据层
- `js/data/constants.js`：提取所有静态数据
- `js/store/state.js`：创建响应式状态 + computed

### Step 2: 创建 composables
- `js/composables/useScene.js`
- `js/composables/useMaking.js`
- `js/composables/useTasting.js`
- `js/composables/useDeviceMotion.js`

### Step 3: 创建组件
- `js/components/CupComponent.js`
- `js/components/IceCubeComponent.js`
- `js/components/ToppingDot.js`
- `js/components/EmotionBubble.js`
- `js/components/ShakeProgress.js`
- `js/components/ResultCard.js`

### Step 4: 创建场景
- `js/scenes/HomeScene.js`
- `js/scenes/RecipeScene.js`
- `js/scenes/MakingScene.js`
- `js/scenes/TastingScene.js`
- `js/scenes/ResultScene.js`

### Step 5: 组装入口
- `js/app.js`：创建 Vue 应用，注册组件，挂载
- `index.html`：精简为入口骨架

### Step 6: CSS 拆分
- `css/style.css`：全局样式 + 变量 + 动画
- 可选：`css/cup.css`、`css/recipe.css` 等按场景拆分

### Step 7: 验证
- 完整走一遍"随机来一杯"流程
- 完整走一遍"自己选配方"流程
- 验证所有功能无回归

## 关键约束

- **场景切换仍用 `v-if`**（Vue 的条件渲染，等同于 display:none/block，可靠）
- **CDN 部署**：所有文件通过 `<script type="module">` 加载，无需打包工具
- **向后兼容**：功能完全不变，只是代码组织方式改变
- **渐进式重构**：可以先搭框架，逐步迁移，不需要一次全部完成
