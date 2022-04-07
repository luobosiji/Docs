# 浏览器相关

## BOM （Browser Object Model 浏览器对象模型）

- window
  - 核心对象，提供浏览器接口：alert、setTimeout...
- location
  - 提供当前加载地址信息和一些导航功能
  - origin / protocol / host / port / pathname / search / hash / 
  - assign() / replace() / reload() / toString()
- navigation
  - 浏览器系统信息 包括用户代理等：userAgent、剪切板、键盘相关
- screen
  - 屏幕信息
  - innerWidth / offsetWidth / getBoundingClientRect()
- history
  - 保存浏览记录
  - state / pushState() / replaceState()


## Event 事件模型
- 过程
  - 捕获阶段
  - 目标阶段
  - 冒泡阶段
- `addEventListener(event, function, useCapture)` useCapture默认是false 为冒泡
- 阻止事件传播`e.stopPropagation()`
- `event.stopImmediatePropagation()` 
  - 相同节点绑定多个同类事件 默认它们会按照被添加的顺序执行 
  - 执行本方法后 不会继续执行
- `e.preventDefault()` 阻止默认行为，如：a标签跳转


## 面试
- 从url输入到页面展示发生了什么  获取资源 => 渲染页面
  - DOM
  - CSSOM
  - Render Tree： DOM + CSSOM 生成渲染树
  - layout 计算布局
  - Painting 绘制