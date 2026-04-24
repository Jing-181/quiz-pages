# Quiz Pages

一个包含多种趣味测试的网页集合，包括健身人格测试、跑者人格测试和饮酒人格测试。

## 项目结构

```
quiz-pages/
├── tests/              # 测试页面目录
│   ├── fitness/        # 健身人格测试
│   ├── running/        # 跑者人格测试
│   └── drinking/       # 饮酒人格测试
├── fake-boba/          # 假装喝奶茶项目
├── chinese-anime-top10/ # 中国动漫排行榜
├── fitness-guide/      # 健身指南
└── index.html          # 项目主页
```

## 访问地址

### GitHub Pages 在线访问
- **项目主页**：[https://jing-181.github.io/quiz-pages/](https://jing-181.github.io/quiz-pages/)
- **健身人格测试**：[https://jing-181.github.io/quiz-pages/tests/fitness/personality-test.html](https://jing-181.github.io/quiz-pages/tests/fitness/personality-test.html)
- **跑者人格测试**：[https://jing-181.github.io/quiz-pages/tests/running/personality-test.html](https://jing-181.github.io/quiz-pages/tests/running/personality-test.html)
- **饮酒人格测试**：[https://jing-181.github.io/quiz-pages/tests/drinking/personality-test.html](https://jing-181.github.io/quiz-pages/tests/drinking/personality-test.html)
- **假装喝奶茶**：[https://jing-181.github.io/quiz-pages/fake-boba/dist/index.html](https://jing-181.github.io/quiz-pages/fake-boba/dist/index.html)
- **中国动漫排行榜**：[https://jing-181.github.io/quiz-pages/chinese-anime-top10/index.html](https://jing-181.github.io/quiz-pages/chinese-anime-top10/index.html)
- **健身指南**：[https://jing-181.github.io/quiz-pages/fitness-guide/index.html](https://jing-181.github.io/quiz-pages/fitness-guide/index.html)

### 本地访问
- **项目主页**：[index.html](file:///workspace/quiz-pages/index.html)
- **健身人格测试**：[tests/fitness/personality-test.html](file:///workspace/quiz-pages/tests/fitness/personality-test.html)
- **跑者人格测试**：[tests/running/personality-test.html](file:///workspace/quiz-pages/tests/running/personality-test.html)
- **饮酒人格测试**：[tests/drinking/personality-test.html](file:///workspace/quiz-pages/tests/drinking/personality-test.html)
- **假装喝奶茶**：[fake-boba/dist/index.html](file:///workspace/quiz-pages/fake-boba/dist/index.html)
- **中国动漫排行榜**：[chinese-anime-top10/index.html](file:///workspace/quiz-pages/chinese-anime-top10/index.html)
- **健身指南**：[fitness-guide/index.html](file:///workspace/quiz-pages/fitness-guide/index.html)

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **框架**：Vue 3 (fake-boba 项目)
- **构建工具**：自定义 build.sh 脚本

## 功能特点

1. **响应式设计**：适配不同设备屏幕
2. **模块化架构**：fake-boba 项目采用 Vue 3 模块化设计
3. **视觉效果**：丰富的动画和交互效果
4. **用户体验**：直观的界面和流畅的操作流程

## 最近更新

- 修复了 fake-boba 项目中的核心 bug
- 统一了测试文件的目录结构和命名格式
- 优化了资源路径引用
- 生成了新的构建版本

## 如何运行

1. 克隆项目到本地
2. 使用浏览器直接打开对应 HTML 文件
3. 对于 fake-boba 项目，可以运行 `build.sh` 脚本重新构建

## 项目维护

- 测试文件统一存放在 `tests/` 目录
- 新的测试项目应遵循相同的目录结构和命名规范
- 构建脚本位于 `fake-boba/build.sh`
