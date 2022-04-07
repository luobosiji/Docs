# JS模块化

## 模块化历程

- 雏形：IIFE 立即执行函数
  - 利用函数块级作用域来实现模块化
  - 通过参数来传递外部依赖
- CJS - CommonJs
  - module + exports 对外暴露接口
  - 通过require来调用其它模块
  - 优点：
    - 率先在服务器端实现了，从框架层面解决依赖、全局变量污染的问题
  - 缺点：
    - 主要针对服务端的解决方案。对异步拉取不是很友好
- AMD （异步加载 + 允许指定回调函数）例如框架 require.js
  - define定义 + require加载
  - 优点：
    - 增加了异步加载
    - 利用浏览器并发请求能力
  - 缺点：
    - 必须提前加载所有依赖, 不能按需加载
- CMD（在AMD基础上新增：按需加载，依赖就近引入）
- UMD 兼容 AMD & CMD & CJS
  - 通过运行时或编译时，让同一份代码模块在使用CJS/AMD/CMD的项目中运行起来
  - 是集结了 CommonJs、CMD、AMD 的规范于一身
- ES6 模块化
  - export + import

## IIFE 案例

```javascript
// 参数传递外部依赖
const iifeModule = ((dependencyModule1, dependencyModule2) => {
  let count = 0;
  return {
    increase: () => ++count;
    reset: () => {
      count = 0;
    }
  }
})(dependencyModule1, dependencyModule2);

iifeModule.increase();
iifeModule.reset();
```

## CJS 案例

```javascript
// 模块暴露接口
exports.increase = increase;
exports.reset = reset;

// 引用使用
const { increase, reset } = require('./main.js');
increase();

```

## AMD 案例

```javascript
  // 通过define来定义一个模块，然后require进行加载
  /*
  define
  params: 模块名，依赖模块，工厂方法
   */
  // callback(require, export, module) => { }
  // callback可通过 require 来加载其它模块，或兼容已有模块
  // callback可通过 export 来暴露模块
  define(id, [depends], callback);
  require([module], callback);
```
## UMD 案例

```javascript
((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        //CommonJS
        var $ = requie('jquery');
        module.exports = factory($);
    } else {
        root.testModule = factory(root.jQuery);
    }
})(this, ($) => {
    //todo
});

```


## ES6 案例

```javascript
// 引入区域
  import dependencyModule1 from './dependencyModule1.js';
  import dependencyModule2 from './dependencyModule2.js';

  // 实现代码逻辑
  let count = 0;
  export const increase = () => ++count;
  export const reset = () => {
    count = 0;
  }

  // 导出区域
  export default {
    increase, reset
  }
  // 通过 type=module 来指定ES6模块
  <script type="module" src="esModule.js"></script>

  // ES11 解决动态模块加载
  import('./esModule.js').then(dynamicEsModule => {
    dynamicEsModule.increase();
  })
  // 缺点：本质上韩式运行时的依赖分析
```


## 揭示模式 revealing
> 模块模式下的一种封装，对外暴露想暴露的方法、属性，内部实现外部不需要关心
> 通过匿名函数内 return {} 来实现