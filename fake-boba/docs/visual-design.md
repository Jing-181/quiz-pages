# 假装喝奶茶 - 视觉设计文档

> 版本：v2.0 | 更新：2026-04-23
> 本文档用于指导 AI 画图工具生成各界面设计稿

---

## 全局设计规范

### 设计风格
- **关键词**：可爱、治愈、温暖、小清新、ins风、日系奶茶店
- **插画风格**：扁平化 + 柔和阴影 + 圆润造型
- **整体色调**：暖色系为主（米白、奶茶棕、淡粉、橙黄）
- **圆角**：所有元素使用大圆角（12-24px），营造柔和感
- **阴影**：柔和投影 `0 4px 16px rgba(0,0,0,0.06)`，不使用硬阴影

### 色板
| 名称 | 色值 | 用途 |
|------|------|------|
| 奶茶棕 | `#C4956A` | 红茶液体、主品牌色 |
| 粉红 | `#FF6B8A` | 强调色、选中态、按钮 |
| 橙黄 | `#FFB74D` | 渐变搭配、温暖感 |
| 抹茶绿 | `#8BC34A` | 绿茶液体 |
| 芋泥紫 | `#B39DDB` | 芋泥相关 |
| 芒果黄 | `#FFD54F` | 芒果相关 |
| 黑糖棕 | `#8D6E63` | 黑糖相关 |
| 背景浅 | `#FFF8F0` | 页面背景 |
| 背景深 | `#FFE8D6` | 渐变过渡 |
| 文字深 | `#4A3728` | 主文字 |
| 文字浅 | `#9B8B7E` | 次要文字 |
| 杯子塑料 | `rgba(255,255,255,0.9)` | 透明杯身 |
| 冰块 | `rgba(220,240,255,0.7)` | 冰块 |

### 字体
- 标题：ZCOOL KuaiLe（可爱手写风）
- 正文：系统默认（-apple-system, sans-serif）

### 画布尺寸
- 移动端：375 × 812px（iPhone X 比例）
- 设计稿请按此比例输出

---

## 界面 1：首页

### 设计稿提示词
```
Mobile app UI design, 375x812px, cute boba tea shop landing page.
Center: a cute transparent plastic boba tea cup with brown milk tea liquid,
tapioca pearls at bottom, pink-orange gradient straw, steam rising.
Above cup: title "假装喝奶茶" in playful handwritten font, subtitle "Fake Boba".
Below cup: tagline "很想喝但暂时不喝？来假装喝一杯吧！".
Two buttons: rounded pill shape, "🎲 随机来一杯" (pink-orange gradient),
"📋 自己选配方" (white with pink border).
Bottom: social proof "已有 12,888 人假装喝过".
Background: warm cream gradient (#FFF8F0 to #FFE8D6), soft floating light orbs.
Style: kawaii, healing, pastel colors, rounded shapes, soft shadows.
No real photos, flat illustration style.
```

### 界面要素清单
| 元素 | 描述 | 位置 |
|------|------|------|
| 奶茶杯插画 | 透明杯+液体+珍珠+吸管+蒸汽 | 页面中上部 |
| 标题 | "假装喝奶茶" | 杯子上方 |
| 副标题 | "Fake Boba" | 标题下方 |
| 引导文案 | "很想喝但暂时不喝？来假装喝一杯吧！" | 杯子下方 |
| 随机按钮 | 粉橙渐变胶囊按钮 | 文案下方 |
| 自选按钮 | 白底粉边胶囊按钮 | 随机按钮下方 |
| 社交证明 | "已有 XX,XXX 人假装喝过" | 页面底部 |
| 背景装饰 | 渐变底色 + 3个浮动光斑 | 全页面 |

---

## 界面 2：选配方 - 第1步（选杯型）

### 设计稿提示词
```
Mobile app UI design, 375x812px, boba tea cup selection screen.
Top: back arrow (←) left, title "选配方" center.
Progress bar: 25% filled, pink-orange gradient.
Step label: "第 1 步 / 共 4 步 · 选杯型".
Center area: 3 cup cards arranged horizontally.
Each card: white rounded rectangle with shadow, containing a CSS-drawn cup illustration on top and label below.
Cup 1 "经典杯": standard straight-walled cup.
Cup 2 "胖胖杯": wider bottom, cute round shape.
Cup 3 "高瘦杯": tall and slender.
Second card is selected (highlighted with pink border #FF6B8A and soft pink glow).
Bottom: "上一步" (hidden) and "下一步" (enabled, pink gradient) buttons.
Background: warm cream.
Style: kawaii, clean, minimal, pastel.
```

### 界面要素清单
| 元素 | 描述 |
|------|------|
| 返回按钮 | ← 左上角 |
| 标题 | "选配方" 居中 |
| 进度条 | 25% 粉橙渐变填充 |
| 步骤文案 | "第 1 步 / 共 4 步 · 选杯型" |
| 杯型卡片 ×3 | 白底圆角卡片，内含杯型缩略图+名称 |
| 选中态 | 粉色边框 + 粉色阴影光晕 |
| 导航按钮 | 上一步（隐藏）/ 下一步（disabled/enabled） |

### 第2-4步差异
- 第2步（选茶底）：6个色块网格（2×3），每个显示茶底颜色圆点+名称
- 第3步（选小料）：8个胶囊按钮（2行×4列），选中后填充色，底部"已选 X/3 个小料"
- 第4步（甜度冰度）：两组分段控件，每组5个按钮

---

## 界面 3：制作 - 阶段1（雪克杯调制）

### 设计稿提示词
```
Mobile app UI design, 375x812px, boba tea making process - shaker cup stage.
Title at top: "正在调制中..." in playful font.
Center: a cocktail shaker cup (梯形, wider at top, narrower at bottom).
Shaker has: semi-circle dome lid (gray-silver), transparent plastic body showing
brown milk tea liquid inside, ice cubes floating, tapioca pearls at bottom.
Left side of cup body: a subtle vertical highlight reflection.
Below shaker: a circular progress ring (100px diameter, pink-orange gradient stroke),
center text shows "摇一摇！".
Below progress ring: a large rounded pill button "💪 按住摇一摇！"
with pink-orange gradient background.
Background: warm cream gradient with subtle bokeh light spots.
Style: kawaii, warm, inviting, like being in a cozy boba shop.
Flat illustration, no photos.
```

### 界面要素清单
| 元素 | 描述 | 尺寸/样式 |
|------|------|----------|
| 标题 | "正在调制中..." | 品牌字体 |
| 雪克杯盖 | 半圆弧形穹顶 + 盖钮 | 130×30px，银灰渐变 |
| 雪克杯身 | 梯形透明塑料杯 | 上宽130px，下宽90px，高160px |
| 杯身高光 | 左侧竖向反光条 | 6px宽，白色渐变 |
| 液体 | 奶茶色，有波纹光泽 | 高度随制作进度变化 |
| 冰块 | 不规则多边形，半透明冰蓝 | 20-25px，2-6块 |
| 小料 | 各种形状沉在杯底 | 见PRD小料表 |
| 进度环 | SVG圆环，粉橙渐变 | 直径100px，stroke 8px |
| 摇晃按钮 | 胶囊形，粉橙渐变 | 180×50px |

### 摇晃状态
- 杯子左右摆动 ±15°
- 液体倾斜晃荡
- 气泡从底部上升
- 进度环数字递增

---

## 界面 4：制作 - 阶段2（倒入饮用杯）

### 设计稿提示词
```
Mobile app UI design, 375x812px, pouring boba tea from shaker to serving cup.
Title: "倒入杯中..." at top.
Left side: a cocktail shaker tilted 45 degrees to the right, lid open,
brown liquid streaming out from the spout.
Center: a curved liquid stream flowing from shaker to cup (parabolic arc).
Right side: a transparent plastic boba tea serving cup (classic shape, slightly tapered),
gradually filling with brown milk tea liquid. Pink-orange gradient straw inserted diagonally.
Ice cubes and tapioca pearls visible inside the cup.
Background: warm cream.
Style: kawaii, dynamic, showing the moment of pouring.
Flat illustration style with soft shadows.
```

### 界面要素清单
| 元素 | 描述 |
|------|------|
| 倾斜雪克杯 | 向右倾斜45°，盖子打开，液面下降 |
| 液体流 | 弧形曲线，从雪克杯口流向饮用杯 |
| 饮用杯 | 经典奶茶杯，透明塑料，液面逐渐上升 |
| 吸管 | 粉橙渐变，斜插杯中 |
| 冰块+小料 | 在饮用杯内可见 |

---

## 界面 5：品尝奶茶

### 设计稿提示词
```
Mobile app UI design, 375x812px, drinking boba tea tasting screen.
Center: a transparent plastic boba tea cup with pink-orange straw,
brown milk tea liquid at 60% height (partially drunk), tapioca pearls at bottom.
Above the cup: a small speech bubble with text "嗯~ 好满足！" and a cute blushing face.
Small pink stars (⭐) and hearts (❤️) floating upward from the straw top.
Below cup: 5 progress dots (3 filled with pink-orange gradient, 2 empty).
Text: "第 3 / 5 口".
A large rounded button "🥤 喝一口！" below progress.
Background: warm cream with a subtle warm orange overlay (10% opacity) for cozy feeling.
Style: kawaii, satisfying, warm atmosphere.
Flat illustration.
```

### 界面要素清单
| 元素 | 描述 | 动画 |
|------|------|------|
| 饮用杯 | 同制作阶段2的成品杯 | 液面每口下降16% |
| 吸管 | 粉橙渐变 | 喝时底部产生漩涡 |
| 漩涡 | 螺旋形，液体深色版 | 旋转2-3圈后消失 |
| 星星/爱心 | 粉红色，从吸管口飘出 | 向上飘 + 渐隐 |
| 情绪气泡 | 圆角对话气泡 + 文案 | 弹出→停留1.5s→淡出 |
| 进度点 | 5个圆点，空心/实心 | 喝一口更新一个 |
| 喝一口按钮 | 粉橙渐变胶囊 | 按下缩小 |
| 暖色遮罩 | 全屏淡橙色叠加 | 第3口后出现 |

### 喝完状态
- 杯子倾斜15°
- 笑脸浮现 😊
- 彩色纸屑飘落
- "查看结果卡"按钮

---

## 界面 6：结果卡

### 设计稿提示词
```
Mobile app UI design, 375x812px, boba tea result card screen.
Center: a rounded white card with soft shadow, decorated with subtle boba pattern dots.
Top of card: a small cute boba tea cup illustration showing the user's custom drink
(brown liquid, pearls, pink straw).
Below cup: recipe details in clean typography:
"经典珍珠奶茶" as title, then tags: "红茶 · 珍珠 · 七分甜 · 正常冰".
A personalized fun message: "恭喜你成功假装喝了一杯奶茶！".
Mood tag badge: "快乐全糖党" in a rounded pink pill.
Bottom of card: two buttons -
"📸 保存图片" (pink gradient) and "🔄 再来一杯" (white with pink border).
Background: warm cream with confetti particles.
Style: kawaii, celebratory, Instagram-story-worthy.
Flat illustration.
```

### 界面要素清单
| 元素 | 描述 |
|------|------|
| 卡片容器 | 白底圆角，微妙波点纹理，柔和阴影 |
| 杯子缩略图 | CSS绘制的小杯子（匹配用户配方） |
| 配方名称 | 大号品牌字体 |
| 配方标签 | 胶囊标签，显示茶底·小料·甜度·冰度 |
| 个性化文案 | 根据配方特征生成 |
| 心情标签 | 圆角胶囊，粉色背景 |
| 保存按钮 | 粉橙渐变 |
| 再来一杯按钮 | 白底粉边 |
| 彩色纸屑 | 背景装饰 |

---

## 附录：各界面完整流程设计稿提示词

### 完整流程一镜到底
```
Mobile app UI storyboard, 6 panels showing complete boba tea simulation flow:
Panel 1 (Home): Cute boba cup illustration, title "假装喝奶茶", two entry buttons.
Panel 2 (Recipe): Cup type selection with 3 cup cards, progress bar at 25%.
Panel 3 (Making-Shaker): Cocktail shaker with tea liquid, ice, pearls, shake progress ring.
Panel 4 (Making-Pour): Shaker tilted pouring into serving cup with straw.
Panel 5 (Tasting): Drinking from cup, speech bubble "好满足!", floating hearts, progress dots.
Panel 6 (Result): Result card with cup thumbnail, recipe tags, mood badge, confetti.
All panels: 375x812px, kawaii style, warm pastel colors, flat illustration, soft shadows.
Connected by arrows showing flow direction.
```
