# overview

## React 为什么要发明Hooks

- 使用class作为组件是否合适 ？
  - React组件之间很少会互相继承的
  - 很少会在外部去调用一个类实例（组件方法都是在内部调用）
- 用函数去描述一个组件才是最为自然的方式。
  - Hooks 提供了 内部状态、以及声明周期机制

### Hooks
> 把某个目标结果勾到某个可能会变化的数据源 或 事件源上，当被勾到的数据源发生变化时，产生这个目标结果的代码就会**重新执行**。

- 优势
  - 简化了逻辑复用
    - 高阶函数代码难理解，不直观、且会增加额外的组件节点。
  - 有助于关注分离
    - 把业务逻辑清晰的隔离开，更容易理解、维护

![关注分离](./res/%E5%85%B3%E6%B3%A8%E5%88%86%E7%A6%BB.webp)

### Hooks 使用规则

- 只能在函数组件的顶级作用域使用
  - Hooks在组件的多次渲染之间，必须按顺序执行，不能再循环、判断、嵌套中执行
- 只能在函数组件 或 其它 Hooks中使用

### useState 
> 让函数组件具有维持状态的能力，一个组件在多次渲染之间 state 是共享的


### useEffect 
> 执行副作用，指和当前执行结果无关的代码

- 执行时机： 每次组件render完后 判断依赖 并 执行
- 多种情况：
  - 没有依赖项，则会每次render后都执行
  - 空数组作为依赖项，只有首次执行时触发，对应 componentDidMount
  - 返回一个函数，用于组件销毁时做一些清理操作 对应  componentWillUnmount
  - 提供依赖项: 第一次和 依赖项发生变化后 执行

### useCallback 缓存回调函数
> 多次渲染会多次创建事件处理函数，会让接收事件处理函数的组件 重新渲染

- 依赖项为空数组时 缓存最开始回调函数

### useMemo 缓存计算结果
> 避免重复计算, 避免因重复计算导致的重复渲染
> useCallback 的功能 可以用 useMemo来实现

#### 依赖项
  - 依赖项中的定义变量，必须在回调函数中用到
  - 一般是常量数组，不是变量
  - React 会用浅比较来对比依赖项是否发生变化

### useRef 
> 多次渲染之间共享数据\
> 不会触发组件的重新渲染\
> 保存DOM节点的引用

```javascript
const myRef = useRef(initialValue)
// myRef.current 来设置值
const inputEl = useRef(null)
inputEl.current.focus()

<input ref={inputEl}/>
```

### useContext
> 定义全局状态

### 自定义Hooks
> 以 use 开头的函数 这样React能知道这是一个Hook\
> 函数中使用其它Hooks 这样才能让组件刷新

```javascript
import { useRef } from 'react';
// 创建一个自定义 Hook 用于执行一次性代码
function useSingleton(callback) {
  // 用一个 called ref 标记 callback 是否执行过
  const called = useRef(false);
  // 如果已经执行过，则直接返回
  if (called.current) return;
  // 第一次调用时直接执行
  callBack();
  // 设置标记为已执行过
  called.current = true;
}
// ...
useSingleton(()=>{
  // 这段代码只执行一次
})
// ...
```

## 原则
- 状态最小化原则，避免冗余状态
- 唯一数据源原则，避免中间状态



