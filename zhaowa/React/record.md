# Reac源码分析

## 几个问题
- 为什么要用虚拟dom
  - 某种程度上，保证性能的下限
  - 中间层，vdom -> fiber对象 -> 真实dom

```javascript
// 虚拟DOM
function A() {
  return (
    <div className='name'>
      <p>hello</p>
    </div>
  )
}

// 上面代码 通过 babel 转换为如下代码
function A_() {
  return React.createElement('div', 
              {className: 'main'},
              React.createElement('p', null, 'hello')
  )
}

const vdom = {
  type: 'div',
  props: {
    classNmae: 'main',
    children: [
      {
        type: 'p',
        props: {
          children:[
            {
              value: 'hello'
            }
          ]
        }
      }
    ]
  }
}

```

## react
- 提供处理虚拟dom相关函数
- 包括hooks等行管用户侧的API

## react-reconciler
> diff 算法 是 vdom 和 current Fiber 对比  生成 workinprogress Fiber

### 流程
- beginwork 从根节点往子节点上找（通过child指针连接）
  - 没有子节点 则开始当前一层的 complateWork 
  - 继续找兄弟节点 开始beginwork （sibling）
  - 直到最小节点 开始向父节点返回 （return）
- complateWork 阶段 对修改和新增 打tag
- commitWork 阶段 
  - 通过更新链表 来快速更新
    - firestEffect
    - nextEffect
    - ...
    - lastEffect
  - react-dom
    - 更新属性
    - 创建节点

#### 具体解释
- beginWork
  - mount阶段 创建节点
  - 生成 fiberRootNode -> currentFiber
- completeWork
  - vdom 和 current Fiber 对比 生成 WorkinProgress Fiber 新的节点树
    - 通过逐级比较（alternate）
    - diff后 会有tag标记 哪里更新，哪里插入删除

- commitWork
  - 提交更新
  - before mutation
    - getSnapshotBeforeUpdate
  - mutation
    - 遍历所有effect 处理这些 placement 标记
  - 切换fiber树
    - root.current = finishFiber
  - layout阶段
    - cdm cdu声明周期
  - 更新到界面上

## react-dom
- diff prop
- create dom


## 整体流程
1. vdom
2. current Fiber
3. vdom & current Fiber 执行diff  生成 workinprogress Fiber
4. 在界面上的真实节点




## diff
- 跨层级移动不比较
- 同层比较

workloop


## 源码跟踪
- render 
- legacyRenderSubtreeIntoContainer
  - 创建 fiberroot 根节点
- updateContainer
- scheduleUpdateOnFiber
- ensureRootIsScheduled
- performSyncWorkOnRoot
- renderRootSync
- workLoopSync
- performUnitOfWork
- beginWork
- completeWork


 