# Quiz Pages 项目 Code Wiki

## 目录
1. [项目概述](#项目概述)
2. [项目结构](#项目结构)
3. [核心模块详解](#核心模块详解)
4. [fake-boba 假装喝奶茶项目详解](#fake-boba-假装喝奶茶项目详解)
5. [人格测试项目详解](#人格测试项目详解)
6. [其他项目](#其他项目)
7. [开发指南](#开发指南)

---

## 项目概述

### 项目简介
**Quiz Pages** 是一个包含多个趣味网页的项目集合，主要包括：
- 假装喝奶茶（Fake Boba）- 互动游戏
- 多种人格测试（健身、跑步、饮酒）
- 中国动漫 TOP10 排行榜
- 健身指南

### 技术栈
| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式与动画 |
| Vanilla JavaScript | 核心逻辑 |
| Vue 3 | fake-boba 项目框架 |
| GitHub Pages | 部署平台 |

### 在线地址
- 项目主页：https://jing-181.github.io/quiz-pages/
- 假装喝奶茶：https://jing-181.github.io/quiz-pages/fake-boba/dist/index.html

---

## 项目结构

### 目录树
```
quiz-pages/
├── index.html                    # 项目主页（卡片式导航）
├── README.md                     # 项目说明文档
├── favicon.png                   # 网站图标
│
├── chinese-anime-top10/          # 中国动漫 TOP10 排行榜
│   ├── index.html
│   ├── favicon.png
│   └── images/                   # 动漫图片资源
│
├── drinking/                     # 饮酒人格测试（旧版）
│   ├── index.html
│   ├── app.js
│   ├── sfx.js
│   └── style.css
│
├── fake-boba/                    # 假装喝奶茶项目（核心项目）
│   ├── index.html
│   ├── build.sh                  # 构建脚本
│   ├── assets/                   # 静态资源
│   │   ├── favicon.png
│   │   └── hero-cup.svg
│   ├── css/
│   │   └── style.css
│   ├── dist/                     # 构建输出目录
│   │   ├── index.html
│   │   └── recipe-test.html
│   ├── docs/                     # 项目文档
│   │   ├── bug-analysis.md
│   │   ├── fake-boba-design-plan.md
│   │   ├── fake-boba-fix-and-redesign.md
│   │   └── fake-boba-vue-refactor.md
│   └── js/                       # Vue 3 源代码
│       ├── app.js                # 应用入口
│       ├── components/           # Vue 组件
│       │   ├── CupComponent.js
│       │   ├── EmotionBubble.js
│       │   └── ShakeProgress.js
│       ├── composables/          # 组合式函数
│       │   ├── useDeviceMotion.js
│       │   ├── useMaking.js
│       │   ├── useScene.js
│       │   └── useTasting.js
│       ├── data/
│       │   └── constants.js      # 常量数据
│       ├── scenes/               # 场景组件
│       │   ├── HomeScene.js
│       │   ├── RecipeScene.js
│       │   ├── MakingScene.js
│       │   ├── TastingScene.js
│       │   └── ResultScene.js
│       └── store/
│           └── state.js          # 响应式状态管理
│
├── fitness-guide/                # 健身指南
│   ├── index.html
│   ├── favicon.png
│   ├── favicon-16.png
│   └── favicon-32.png
│
└── tests/                        # 新版人格测试目录
    ├── drinking/                 # 饮酒人格测试（新版）
    │   ├── personality-test.html
    │   ├── app.js
    │   ├── sfx.js
    │   └── style.css
    ├── fitness/                  # 健身人格测试
    │   └── personality-test.html
    └── running/                  # 跑步人格测试
        └── personality-test.html
```

### 文件职责说明

| 文件/目录 | 职责 |
|----------|------|
| `index.html`（根目录） | 项目入口，卡片式导航页，自动发现项目 |
| `fake-boba/` | 假装喝奶茶互动游戏（最复杂的项目） |
| `tests/` | 人格测试项目集合 |
| `chinese-anime-top10/` | 中国动漫排行榜 |
| `fitness-guide/` | 健身指南页面 |

---

## 核心模块详解

### 1. 项目主页（index.html）

#### 功能概述
根目录的 `index.html` 是项目的主入口，提供卡片式导航，支持手动配置和自动发现项目。

#### 核心特性
- 手动配置项目（推荐方式）
- 自动从 GitHub API 扫描项目
- 响应式网格布局
- 骨架屏加载
- 动画入场效果

#### 关键代码片段

**手动项目配置：**
```javascript
const MANUAL_PROJECTS = [
  {
    name: '假装喝奶茶',
    desc: '一个纯虚拟的情绪产品，选配方→模拟制作→假装喝几口→生成结果卡→分享',
    path: 'fake-boba/',
    icon: '🧋',
    color: '#FF6B8A'
  },
  // ... 更多项目
];
```

**渲染项目卡片：**
```javascript
function renderProjects(projects) {
  grid.innerHTML = '';
  projects.forEach(function (project, i) {
    var card = createCard(project, i);
    grid.appendChild(card);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        card.classList.add('visible');
      });
    });
  });
}
```

---

## fake-boba 假装喝奶茶项目详解

### 项目简介
**Fake Boba** 是一个互动式情绪产品，用户可以通过以下流程体验：
1. 选择奶茶配方（杯子、茶底、配料、甜度、冰量）
2. 模拟制作过程（倒茶、加冰、摇晃）
3. 假装品尝（5口喝完）
4. 生成结果卡并分享

### 架构设计

采用 **场景式架构** + **组合式函数** + **响应式状态管理**。

```
App (根组件)
├── State Management (store/state.js)
├── Scenes (场景)
│   ├── HomeScene (首页)
│   ├── RecipeScene (配方页)
│   ├── MakingScene (制作页)
│   ├── TastingScene (品尝页)
│   └── ResultScene (结果页)
├── Components (组件)
│   ├── CupComponent (杯子)
│   ├── EmotionBubble (情绪气泡)
│   └── ShakeProgress (摇晃进度)
└── Composables (组合函数)
    ├── useScene (场景切换)
    ├── useMaking (制作逻辑)
    ├── useTasting (品尝逻辑)
    └── useDeviceMotion (设备运动)
```

### 核心文件详解

#### 1. 状态管理（store/state.js）

所有应用状态集中管理，使用 Vue 3 响应式系统。

```javascript
export const state = Vue.reactive({
  currentScene: 'home',           // 当前场景
  cup: '',                        // 杯子类型
  tea: '',                        // 茶底
  teaColor: '#C4956A',            // 茶底颜色
  toppings: [],                   // 配料列表
  sweet: '',                      // 甜度
  ice: '',                        // 冰量
  iceCount: 0,                    // 冰块数量
  recipeName: '',                 // 配方名称
  recipeCal: 0,                   // 卡路里
  liquidColor: '#C4956A',         // 液体颜色
  makingPhase: 'idle',            // 制作阶段
  shakeProgress: 0,               // 摇晃进度 (0-100)
  isShaking: false,               // 是否正在摇晃
  sipCount: 0,                    // 已喝口数
  maxSips: 5,                     // 最大口数
  recipeStep: 0,                  // 配方步骤
  shakeInterval: null,            // 摇晃定时器
  makingTimer: null,              // 制作定时器
});

// 计算属性
export const iceCount = Vue.computed(() => ICE_COUNT_MAP[state.ice] || 0);
export const liquidPercent = Vue.computed(() => 80 - (state.sipCount * 16));
export const isMakingDone = Vue.computed(() => state.shakeProgress >= 100);
export const isAllDrunk = Vue.computed(() => state.sipCount >= state.maxSips);
```

#### 2. 常量数据（data/constants.js）

包含所有预设配方、茶底、配料、消息等数据。

**预设配方示例：**
```javascript
const PRESETS = [
  { 
    name: '经典珍珠奶茶', 
    tea: '红茶', 
    toppings: ['珍珠'], 
    sweet: '七分甜', 
    ice: '正常冰', 
    color: '#C4956A', 
    cal: 450 
  },
  { 
    name: '芋泥波波', 
    tea: '芋泥', 
    toppings: ['芋圆', '珍珠'], 
    sweet: '七分甜', 
    ice: '少冰', 
    color: '#B39DDB', 
    cal: 520 
  },
  // ...
];
```

**茶底选项：**
```javascript
const TEA_OPTIONS = [
  { name: '红茶', color: '#C4956A' },
  { name: '绿茶', color: '#8BC34A' },
  { name: '乌龙', color: '#D4B896' },
  { name: '芋泥', color: '#B39DDB' },
  { name: '芒果', color: '#FFD54F' },
  { name: '黑糖', color: '#8D6E63' }
];
```

**配料视觉配置：**
```javascript
const TOPPING_STYLES = {
  '珍珠': { shape: 'circle', size: 14, color: '#2D1B0E', extra: 'box-shadow:inset -3px -3px 4px rgba(255,255,255,0.3)' },
  '芋圆': { shape: 'circle', size: 14, color: '#B39DDB', extra: 'background:repeating-linear-gradient(45deg,#B39DDB,#B39DDB 3px,#9C7CCD 3px,#9C7CCD 6px)' },
  '椰果': { shape: 'square', size: 12, color: 'rgba(245,245,220,0.7)', extra: 'border-radius:3px' },
  // ...
};
```

#### 3. 组合式函数（Composables）

##### useScene.js - 场景切换

```javascript
function useScene() {
  function goToScene(name) {
    state.currentScene = name;
    window.scrollTo(0, 0);
  }
  return { goToScene };
}
```

##### useDeviceMotion.js - 设备运动检测

利用设备陀螺仪检测摇晃动作（在手机上效果更好）。

```javascript
function useDeviceMotion(onShakeDetected) {
  function handleDeviceMotion(e) {
    if (state.shakeProgress >= 100) return;
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > 30) {
      onShakeDetected(2); // 摇晃力超过阈值，增加进度
    }
  }
  
  function init() {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }
  }
  
  function destroy() {
    if (window.DeviceMotionEvent) {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    }
  }
  
  return { init, destroy };
}
```

##### useMaking.js - 制作流程控制

这是最复杂的组合式函数，负责：
- 倒茶动画
- 加冰动画
- 加配料动画
- 摇晃动画
- 倒入成品杯

关键函数签名：
```javascript
function useMaking() {
  function startMaking(els, onComplete); // 开始制作
  function addTeaDroplets(teaColor);    // 添加茶滴
  function addIceCubes(iceContainer, count, color); // 添加冰块
  function addToppings(toppingContainer, toppings); // 添加配料
  function startShakeAnimation(shakeProgressRing, shakeCountText); // 摇晃动画
  // ...
}
```

#### 4. 场景组件（Scenes）

##### RecipeScene.js - 配方选择场景

分5步选择配方：
1. 杯子类型（经典、胖杯、高杯）
2. 茶底
3. 配料（可多选）
4. 甜度
5. 冰量

每个步骤有独立的进度条和导航按钮。

##### MakingScene.js - 制作场景

核心交互场景，包含：
- 雪克杯展示
- 倒茶效果
- 加冰动画
- 配料出现
- 摇晃交互（圆形进度环）
- 倒入成品杯

##### TastingScene.js - 品尝场景

用户可以点击"喝一口"按钮，每次点击：
- 液体高度减少
- 显示情绪气泡
- 进度点变化
- 5口后进入结果页

##### ResultScene.js - 结果场景

展示最终结果：
- 迷你奶茶杯
- 配方名称
- 标签（甜度、冰量、配料等）
- 心情标签
- 卡路里
- 再来一杯按钮

### 关键技术点

1. **CSS 动画系统**：丰富的动画类，包括渐入、脉冲、摇晃、上浮等
2. **液体效果**：使用 `border-radius` 和渐变模拟液体晃动
3. **粒子系统**：茶滴、气泡、飞溅等 DOM 粒子动画
4. **响应式设计**：适配移动端和桌面端
5. **无障碍支持**：减少动画选项 (`prefers-reduced-motion`)

---

## 人格测试项目详解

### 饮酒人格测试（tests/drinking/）

这是一个完整的人格测试应用，具有代表性。

#### 架构
```
HTML (结构) → CSS (样式) → JS (逻辑)
```

#### 核心数据结构

**人格类型（PERSONAS）：**
```javascript
const PERSONAS = [
  {
    id: 'sommelier',
    enName: 'SOMMELIER',
    name: '品酒大师',
    emoji: '🍷',
    color: '#8B2252',
    brief: '闻一闻就知道年份和产区，舌头就是我的色谱仪。',
    desc: '你是酒桌上的权威...',
    peaks: ['品酒修养 MAX', '氛围追求 HIGH', '微醺控制 HIGH'],
    attributes: [1.0, 0.0, 0.5, 0.8, 0.3, -0.2, -0.8] // 7维度分数
  },
  // ... 9种其他人格
];
```

**测试题目（ALL_Q）：**
```javascript
const ALL_Q = [
  {
    mod: '模块一·饮酒偏好',
    text: '你最喜欢的饮酒场景是？',
    hint: '独处还是热闹？',
    opts: [
      { t: '家里沙发上，一个人安静地品一杯', s: [0.5, -1.0, 0.5, 0.3, 0.0, 1.0, -0.5] },
      // ... 其他选项
    ]
  },
  // ... 14道题目
];
```

#### 算法流程

1. **题目洗牌**：使用 Fisher-Yates 算法打乱题目
2. **逐题回答**：记录每个选项的分数向量
3. **分数累加**：累加所有选择的分数
4. **归一化**：将总分归一化到 [-1, 1] 区间
5. **距离计算**：计算与所有人格类型的曼哈顿距离
6. **结果排序**：选择距离最小的人格类型
7. **平局处理**：如有平局，使用欧几里得距离二次判断

```javascript
function calcResult() {
  let tot = [0, 0, 0, 0, 0, 0, 0];
  history.forEach(s => s.forEach((v, i) => tot[i] += v));
  
  // 归一化
  let norm = tot.map(v => {
    let clamped = Math.max(-12, Math.min(12, v));
    return clamped / 12;
  });
  
  // 曼哈顿距离排序
  let sc = PERSONAS.map(p => {
    let m = 0;
    norm.forEach((v, i) => m += Math.abs(v - p.attributes[i]));
    return { id: p.id, m, persona: p };
  });
  sc.sort((a, b) => a.m - b.m);
  
  // 结果渲染
  let winner = sc[0].persona;
  renderResult(winner, norm);
}
```

#### UI 特色

1. **水彩风格**：柔和的渐变和半透明效果
2. **气泡粒子**：点击选项时的气泡动画
3. **进度条**：顶部进度条显示测试进度
4. **里程碑**：25%、50%、75% 时显示庆祝提示
5. **结果页**：7维度条形图 + 深度解析

---

## 其他项目

### 中国动漫 TOP10
- 静态页面
- 展示热门国产动漫
- 卡片式布局
- 图片预览

### 健身指南
- 静态资源页面
- 提供健身相关指导信息

### 其他人格测试
- 健身人格测试（tests/fitness/）
- 跑步人格测试（tests/running/）
- 架构与饮酒人格测试类似

---

## 开发指南

### 环境准备
不需要复杂的构建工具，直接使用浏览器即可开发：
1. 克隆项目：`git clone <repo>`
2. 用浏览器打开对应 HTML 文件

### fake-boba 构建流程

项目包含一个 `build.sh` 脚本，用于构建生产版本：

```bash
cd fake-boba
./build.sh
```

构建产物输出到 `fake-boba/dist/` 目录。

### 代码风格

#### JavaScript
- 使用 ES6+ 语法
- `fake-boba` 项目使用模块系统（ES modules）
- 测试项目使用 IIFE 封装

#### CSS
- 使用 CSS 变量管理颜色
- 优先使用 flex 布局
- 动画使用 `@keyframes` 定义
- 响应式使用媒体查询

#### Vue 组件写法
```javascript
export default {
  name: 'ComponentName',
  props: { /* ... */ },
  setup() {
    /* ... */
  },
  template: `<!-- ... -->`
};
```

### 贡献流程

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 部署

项目使用 GitHub Pages 部署：
- 主分支自动部署
- 访问地址：`https://<username>.github.io/quiz-pages/`

---

## 附录

### 相关文档

- [README.md](README.md) - 项目说明
- [fake-boba/docs/fake-boba-design-plan.md](fake-boba/docs/fake-boba-design-plan.md) - fake-boba 设计文档
- [fake-boba/docs/fake-boba-fix-and-redesign.md](fake-boba/docs/fake-boba-fix-and-redesign.md) - 修复与重设计记录
- [fake-boba/docs/fake-boba-vue-refactor.md](fake-boba/docs/fake-boba-vue-refactor.md) - Vue 重构记录

### 配色参考

| 用途 | 颜色值 |
|-----|--------|
| 奶茶主题色 | #FF6B8A, #FFB74D |
| 红茶 | #C4956A |
| 绿茶 | #8BC34A |
| 芋泥 | #B39DDB |
| 饮酒测试 | #8B2252 |

---

## 更新日志

### v1.0.0
- 初始版本
- 完成 fake-boba 项目
- 完成人格测试项目
- 完成主页导航

---

*本文档最后更新：2026-04-22*
