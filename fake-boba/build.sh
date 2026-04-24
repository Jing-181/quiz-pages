#!/bin/bash
# build.sh - 将多文件 Vue 项目打包为单文件 HTML
# 用法: bash build.sh
# 输出: dist/index.html

set -e

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$BASE_DIR/dist"
CSS_FILE="$BASE_DIR/css/style.css"

# JS 文件加载顺序（依赖关系）
JS_FILES=(
  "js/data/constants.js"
  "js/store/state.js"
  "js/composables/useScene.js"
  "js/composables/useDeviceMotion.js"
  "js/composables/useMaking.js"
  "js/composables/useTasting.js"
  "js/components/CupComponent.js"
  "js/components/EmotionBubble.js"
  "js/components/ShakeProgress.js"
  "js/scenes/HomeScene.js"
  "js/scenes/RecipeScene.js"
  "js/scenes/MakingScene.js"
  "js/scenes/TastingScene.js"
  "js/scenes/ResultScene.js"
  "js/app.js"
)

# 读取 favicon 并转为 base64 data URI
FAVICON_B64=""
if [ -f "$BASE_DIR/assets/favicon.png" ]; then
  FAVICON_B64=$(base64 -w0 "$BASE_DIR/assets/favicon.png")
fi

# 合并 JS
MERGED_JS=""
for file in "${JS_FILES[@]}"; do
  filepath="$BASE_DIR/$file"
  if [ ! -f "$filepath" ]; then
    echo "ERROR: $filepath not found"
    exit 1
  fi
  MERGED_JS+="// ===== $file ====="$'\n'
  MERGED_JS+=$(cat "$filepath")
  MERGED_JS+=$'\n\n'
done

# 处理 JS：去掉 import/export，修复 Vue 引用
# 1. 去掉 import ... from 'vue' 行
# 2. 去掉 import ... from '../xxx' 和 './xxx' 行
# 3. export const/var -> var/const
# 4. export default -> var XXX =
# 5. const { reactive, computed } = Vue; 已在源码中处理

MERGED_JS=$(echo "$MERGED_JS" | sed \
  -e "/^import.*from 'vue';/d" \
  -e "/^import.*from '\.\.\/data\/constants\.js';/d" \
  -e "/^import.*from '\.\.\/store\/state\.js';/d" \
  -e "/^import.*from '\.\.\/composables\/useScene\.js';/d" \
  -e "/^import.*from '\.\.\/composables\/useMaking\.js';/d" \
  -e "/^import.*from '\.\.\/composables\/useTasting\.js';/d" \
  -e "/^import.*from '\.\.\/composables\/useDeviceMotion\.js';/d" \
  -e "/^import.*from '\.\.\/components\/CupComponent\.js';/d" \
  -e "/^import.*from '\.\.\/components\/EmotionBubble\.js';/d" \
  -e "/^import.*from '\.\.\/components\/ShakeProgress\.js';/d" \
  -e "/^import.*from '\.\/store\/state\.js';/d" \
  -e "/^import.*from '\.\/components\/CupComponent\.js';/d" \
  -e "/^import.*from '\.\/components\/EmotionBubble\.js';/d" \
  -e "/^import.*from '\.\/components\/ShakeProgress\.js';/d" \
  -e "/^import.*from '\.\/scenes\/HomeScene\.js';/d" \
  -e "/^import.*from '\.\/scenes\/RecipeScene\.js';/d" \
  -e "/^import.*from '\.\/scenes\/MakingScene\.js';/d" \
  -e "/^import.*from '\.\/scenes\/TastingScene\.js';/d" \
  -e "/^import.*from '\.\/scenes\/ResultScene\.js';/d" \
  -e "s/^export default /var __component__ = /" \
  -e "s/^export const /var /" \
  -e "s/^export function \([a-zA-Z]*\)(/var \1 = function(/" \
)

# 读取 CSS
CSS_CONTENT=""
if [ -f "$CSS_FILE" ]; then
  CSS_CONTENT=$(cat "$CSS_FILE")
fi

# favicon 引用
FAVICON_TAG=""
if [ -n "$FAVICON_B64" ]; then
  FAVICON_TAG='<link rel="icon" type="image/png" href="data:image/png;base64,'"$FAVICON_B64"'">'
else
  FAVICON_TAG='<link rel="icon" type="image/png" href="assets/favicon.png">'
fi

# 生成 HTML
cat > "$DIST_DIR/index.html" << HTMLEOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <title>假装喝奶茶 | Fake Boba</title>
  $FAVICON_TAG
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap" rel="stylesheet">
  <style>
$CSS_CONTENT
  </style>
</head>
<body>
  <div id="app"></div>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script>
$MERGED_JS
  </script>
</body>
</html>
HTMLEOF

# 修复 export default 的组件名
# 将 var __component__ = { name: 'XXX', ... 改为 var XXX = { ... }
# 这里用 python 来做更可靠

python3 -c "
import re, sys

with open('$DIST_DIR/index.html', 'r') as f:
    content = f.read()

# Fix: var __component__ = { name: 'CupComponent', ... } -> var CupComponent = { ...
def replace_component(match):
    full = match.group(0)
    name_match = re.search(r\"name:\s*['\\\"](\w+)['\\\"]\", full)
    if name_match:
        name = name_match.group(1)
        return 'var ' + name + ' = ' + full[len('var __component__ = '):]
    return full

content = re.sub(r'var __component__\s*=\s*\{[^}]*name:\s*[\'\"](\w+)[\'\"][^}]*\}', replace_component, content, flags=re.DOTALL)

with open('$DIST_DIR/index.html', 'w') as f:
    f.write(content)

print('Build complete!')
"

# 统计
LINES=$(wc -l < "$DIST_DIR/index.html")
SIZE=$(du -h "$DIST_DIR/index.html" | cut -f1)
echo "Output: dist/index.html ($LINES lines, $SIZE)"
