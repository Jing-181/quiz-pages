# 假装喝奶茶 - Bug 分析与待修复清单

## 当前状态

- 多文件 Vue 3 架构已搭建完成（js/ 目录下 15 个模块文件）
- CSS 视觉优化已完成（杯子材质、液体光影、冰块样式等 13 项改进）
- build.sh 构建脚本已创建（多文件 → 单文件 dist/index.html）
- **核心 bug 未修复**：选配方页面点击选项无响应

## 已确认的 Bug

### Bug 1：选配方点击无响应（核心问题）

**现象**：进入选配方页面后，杯型/茶底/小料选项都能看到，但点击后不高亮，"下一步"按钮始终 disabled。

**已排除的原因**：
- ~~CSS 样式缺失~~ — `.cup-card.selected` 样式存在且正确
- ~~`v-show` 不工作~~ — 第一个 step-panel 没有 `display:none`，说明 `v-show` 生效了
- ~~`@click` 事件没绑定~~ — template 中 `@click="selectCup(cup.value)"` 语法正确
- ~~`state` 未暴露给 template~~ — `data()` 中有 `state: state`
- ~~JS 语法错误~~ — `node --check` 通过

**疑似根因**：
Vue 3 中 `data()` 返回的 reactive 对象，在 template 中通过 `state.cup` 访问时，响应式追踪可能不完整。methods 中用 `this.state.cup = type` 修改值后，template 中的 `:class="{ selected: state.cup === cup.value }"` 可能没有重新渲染。

**可能的修复方向**：
1. 不在 `data()` 中返回 `state`，改用 `setup()` 返回 `toRefs(state)` 解构后的属性
2. 或者完全不用 reactive 对象，把 `state.cup`、`state.tea` 等直接作为组件的 `data()` 属性
3. 或者用 Pinia（但需要额外 CDN）

### Bug 2：build.sh 构建脚本问题（已修复）

- `</script>` 被写成 `<\/script>` → 已修复
- `export function` 转换语法错误 → 已修复
- `reactive`/`computed` 重复声明 → 已修复

## 项目文件结构

```
fake-boba/
├── index.html              # 多文件入口（需 HTTP 服务器）
├── build.sh                # 构建脚本（多文件 → 单文件）
├── dist/
│   └── index.html          # 构建产物（可直接双击打开）
├── css/
│   └── style.css           # 全部样式
├── js/
│   ├── app.js              # Vue 应用入口
│   ├── data/
│   │   └── constants.js    # 静态数据
│   ├── store/
│   │   └── state.js        # reactive 状态
│   ├── composables/
│   │   ├── useScene.js     # 场景切换
│   │   ├── useMaking.js    # 制作流程
│   │   ├── useTasting.js   # 品尝流程
│   │   └── useDeviceMotion.js
│   ├── components/
│   │   ├── CupComponent.js
│   │   ├── EmotionBubble.js
│   │   └── ShakeProgress.js
│   └── scenes/
│       ├── HomeScene.js
│       ├── RecipeScene.js  # ← Bug 所在
│       ├── MakingScene.js
│       ├── TastingScene.js
│       └── ResultScene.js
└── assets/
    └── favicon.png
```

## 待实现功能

### 制作场景重设计
将当前"直接在一个杯子里倒茶加料"改为真实奶茶店流程：
1. **阶段1 - 调制**：雪克杯（梯形带盖），倒茶→加冰→加小料→摇晃
2. **阶段2 - 出品**：雪克杯倾斜倒入饮用杯（带吸管），饮用杯逐渐填满
3. 倒完后自动跳转品尝页

详细设计见 `fake-boba-fix-and-redesign.md`

## 技术约束

- Vue 3 CDN（`vue.global.prod.js`），不用 ES Module
- 单文件 HTML 部署（GitHub Pages）
- 移动端优先 375px
- 不使用构建工具（webpack/vite）
