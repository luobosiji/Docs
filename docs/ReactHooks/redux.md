# Redux
> 全局唯一、树状结构\
> 跨组件状态共享

- State
  - 纯 js Object
- Action
  - Object
  - 用来描述发生的动作
- Reducer 函数
  - 接收 action 和 state作为参数，计算得到新的 Store

## 所有修改数据都是通过 Reducer来完成
- 可预测性
- 易于调试


```javascript
import { createStore } from 'redux'
// 定义 Store 的初始值
const initialState = { value: 0 }
// Reducer，处理 Action 返回新的 State
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'counter/incremented':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
}
// 利用 Redux API 创建一个 Store，参数就是 Reducer
const store = createStore(counterReducer)
// Store 提供了 subscribe 用于监听数据变化
store.subscribe(() => console.log(store.getState()))
// 计数器加 1，用 Store 的 dispatch 方法分发一个 Action，由 Reducer 处理
const incrementAction = { type: 'counter/incremented' };
store.dispatch(incrementAction);
// 监听函数输出：{value: 1}
// 计数器减 1
const decrementAction = { type: 'counter/decremented' };
store.dispatch(decrementAction)
// 监听函数输出：{value: 0}
```

## react-redux
> 实现 react和 redux 互通

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
const rootElement = document.getElementById('root')
ReactDOM.render(
  // 利用React的Context机制存放 store信息
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)

// ...


import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
export function Counter() {
  // 从 state 中获取当前的计数值
  const count = useSelector(state => state.value)
  // 获得当前 store 的 dispatch 方法
  const dispatch = useDispatch()
  // 在按钮的 click 时间中去分发 action 来修改 store
  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'counter/incremented' })}
      >+</button>
      <span>{count}</span>
      <button
        onClick={() => dispatch({ type: 'counter/decremented' })}
      >-</button>
    </div>
  )
}

```

## 异步 Action
> 是 Redux 的一个使用模式，通过组合使用同步Action，用一致的方式提供了异步逻辑方案\
> 结合 redux-thunk 中间件机制 实现异步请求逻辑的重用


- 使用三个同步 action来完成异步请求
  - 下边这种方式无法重用

```javascript
function DataList() {
  const dispatch = useDispatch();
  // 在组件初次加载时发起请求
  useEffect(() => {
    // 请求发送时
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      // 请求成功时
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      // 请求失败时
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }, []);
  
  // 绑定到 state 的变化
  const data = useSelector(state => state.data);
  const pending = useSelector(state => state.pending);
  const error = useSelector(state => state.error);
  
  // 根据 state 显示不同的状态
  if (error) return 'Error.';
  if (pending) return 'Loading...';
  return <Table data={data} />;
}
```

### middleware
> 提供一个拦截器，在 reducer 处理 action 之前调用\
> 可以传递到 reducer 也可以构建新的 action 发动到 reducer


```javascript
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducer'
const composedEnhancer = applyMiddleware(thunkMiddleware)
const store = createStore(rootReducer, composedEnhancer)
```

```javascript
function fetchData() {
  return dispatch => {
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }
}
```

```javascript
import fetchData from './fetchData';
function DataList() {
  const dispatch = useDispatch();
  // dispatch 了一个函数由 redux-thunk 中间件去执行
  dispatch(fetchData());
}
```
