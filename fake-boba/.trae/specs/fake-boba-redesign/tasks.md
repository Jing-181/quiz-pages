# Fake Boba 项目重新梳理 - 实施计划

## [ ] Task 1: 修复首页奶茶图标组件显示问题
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 检查 CupComponent 组件在首页的使用情况
  - 修复组件渲染问题，确保杯子、液体、冰块和蒸汽效果正确显示
  - 检查 CSS 样式和组件属性是否正确设置
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-1.1: 首页奶茶图标组件正确显示，包括杯子、液体、冰块和蒸汽效果
- **Notes**: 检查 HomeScene 中 CupComponent 的属性传递是否正确

## [ ] Task 2: 实现点击奶茶杯子并支持拖拽摇晃的交互
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 修改制作页面的交互逻辑，移除摇一摇按钮
  - 实现点击杯子并拖拽的交互，模拟物理摇晃效果
  - 添加拖拽事件监听，计算摇晃强度和进度
  - 优化摇晃动画效果，使视觉更加真实
- **Acceptance Criteria Addressed**: AC-2, AC-4
- **Test Requirements**:
  - `human-judgment` TR-2.1: 用户可以点击并拖拽奶茶杯子，杯子跟随移动
  - `human-judgment` TR-2.2: 摇晃效果自然，进度条随摇晃程度增加
  - `human-judgment` TR-2.3: 页面显示提示信息"点击奶茶杯子并摇晃"，不显示摇一摇按钮
- **Notes**: 参考现有的 useDeviceMotion.js，实现鼠标/触摸拖拽的物理效果

## [ ] Task 3: 实现长按奶茶杯子来模拟喝奶茶的交互
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 修改品尝页面的交互逻辑，从点击事件改为长按事件
  - 实现长按时间检测，根据长按时间计算喝了多少奶茶
  - 优化液体减少的动画效果，使其更加自然
  - 添加长按开始和结束的视觉反馈
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment` TR-3.1: 用户长按奶茶杯子时，液体逐渐减少
  - `human-judgment` TR-3.2: 液体减少量与长按时间成正比
  - `human-judgment` TR-3.3: 交互流畅，视觉效果自然
- **Notes**: 实现长按事件的监听和处理，确保在移动设备上也能正常工作

## [ ] Task 4: 清理项目中没用的文件，优化项目结构
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 检查项目目录结构，识别并移除无用的文件
  - 优化代码结构，移除冗余代码
  - 确保项目文件组织清晰，易于维护
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgment` TR-4.1: 项目中不存在没用的文件
  - `human-judgment` TR-4.2: 项目结构清晰，代码组织合理
- **Notes**: 检查 dist 目录、测试文件和其他可能的冗余文件

## [ ] Task 5: 调整代码结构，删除没用用到的HTML文件
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 检查项目中的HTML文件，识别并删除没用用到的文件
  - 只保留index.html作为主入口文件
  - 确保项目结构简洁明了
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgment` TR-5.1: 项目只保留index.html，其他HTML文件已删除
  - `human-judgment` TR-5.2: 项目结构清晰，无冗余HTML文件
- **Notes**: 检查dist目录和其他可能的HTML文件

## [ ] Task 6: 将HTML拆分为组件形式加载
- **Priority**: P1
- **Depends On**: Task 5
- **Description**:
  - 将index.html中的HTML代码拆分为组件形式
  - 确保组件结构清晰，易于维护
  - 优化组件加载方式，提高代码可维护性
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgment` TR-6.1: HTML代码已拆分为组件形式加载
  - `human-judgment` TR-6.2: 组件结构清晰，易于维护
- **Notes**: 参考现有的Vue组件结构，确保一致性

## [ ] Task 7: 测试和验证所有功能
- **Priority**: P1
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5, Task 6
- **Description**:
  - 测试首页奶茶图标显示
  - 测试拖拽摇晃交互
  - 测试长按喝奶茶交互
  - 验证代码结构调整和HTML组件拆分
  - 确保所有功能正常工作
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
- **Test Requirements**:
  - `human-judgment` TR-7.1: 所有功能正常工作，交互流畅
  - `human-judgment` TR-7.2: 视觉效果符合预期
  - `human-judgment` TR-7.3: 项目结构清晰，无冗余文件
  - `human-judgment` TR-7.4: HTML代码已拆分为组件形式
- **Notes**: 在不同设备和浏览器上测试，确保兼容性
