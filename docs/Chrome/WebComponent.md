# WebComponent

- 组件化
  - 高内聚，低耦合

- 提供局部视图封装能力
  - 可以让 dom、cssom 和js 运行在局部环境中。
  - 使局部css和dom不影响全局

## 技术

- Custom elements（自定义元素）
- Shadow DOM（影子 DOM）
- 和HTML templates（HTML 模板）




### Shadow DOM（影子 DOM）

![影子DOM](./res/%E5%BD%B1%E5%AD%90Dom.webp)

- 影子 DOM 中的元素对于整个网页是不可见的；
- 影子 DOM 内部的 CSS 只对内部的元素起作用。

```javascript
  class GeekBang extends HTMLElement {
   constructor() {
      super() 
      //获取组件模板 
      const content = document.querySelector('#geekbang-t').content 
      //创建影子DOM节点 
      const shadowDOM = this.attachShadow({ mode: 'open' }) 
      //将模板添加到影子DOM上 
      shadowDOM.appendChild(content.cloneNode(true)) 
      } 
    } 
    customElements.define('geek-bang', GeekBang)
```


## 对比 Vue、React

- web component是**通过浏览器引擎提供api接口**进行操作，然后在dom，cssom生成过程中控制实现组件化的作用域/执行执行上下文的隔离
- vue/react 是在没有浏览器引擎支持的情况下，通过采取一些取巧的手法（比如：js执行上下文的封装利用闭包；样式的封装利用文件hash值作为命名空间在css选择的时候多套一层选择条件（hash值），本质上还是全局的只是不同组件css选择的时候只能选择到组件相应的css样式，实现的隔离）


