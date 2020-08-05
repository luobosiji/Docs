# JavaScript 结构化程序设计

## JS执行粒度
- JS Context（上下文 执行环境） => Realm （领域、全局对象）
  - Realm
    - 有propertype 则需要realm
    - function
    - class
- 宏任务
- 微任务（Promise）
- 函数调用（Execution Context）
  - execution Context  执行上下文
    - code evaluation state  代码执行位置
    - Function 函数调用
      - Closure(环境部分 会被带在函数身上 Environment Record)
    - Script or Module 模块调用
    - Generator (执行yeild语句)
    - Realm 全局对象
    - LexicalEnvironment 词法环境
      - this
      - new.target
      - super
      - 变量
    - VariableEnvironment 变量环境
      - 仅用来处理 var 声明（历史遗留包袱）
- 语句/声明
- 表达式
- 直接量/变量/this ....

事件循环 在js引擎之外的东西（事件循环不属于JavaScript引擎实现的东西，而是由浏览器或node js宿主环境实现的）

```javascript
// 逗号语法
//逗号返回后面的值 
var x = (1, 2 ,3)
// 如果1，2 位置 是运算或者函数 会  被执行
console.log(x) //3

// 输出 1，2
new Promise(resolve => resolve()).then(()=>console.log(1)), 1+1
// 输出2，1
new Promise(resolve => resolve()).then(()=>console.log(1));
console.log(1+1)



```

```javascript
// Objective-C
JSContext* context = [[JSContext alloc] init];
JSValue* result;
// 这里是js代码
// 宏任务1
//  微任务1 new Promise
//  微任务2 resolve()
// 宏任务2
// function()
NSSTRING* code = @'new Promise(resolve => resolve()).then(()=>this.a=3), function(){return this.a}'
// 执行js代码  根据逗号语法 返回最后函数
result = [context evaluateScript:code]  //evaluateScript  宏任务1
// 打印的是function
NSLog(@"%@", [result toString]);
// callWithArguments 执行函数 @[这里可以给函数传参]
result = [result callWithArguments:@[]]; //callWithArguments 宏任务2
// 这里是函数的执行结果
NSLog(@"%@", [result toString]);


// JavaScript
// 3,1, (undefined),2
// undefined 分隔两个宏任务
new Promise(resolve => resolve()).then(()=>console.log('1'))

setTimeout(function(){
    console.log('2')
}, 0)

console.log(3)

// 以下两个宏任务
// 0,4,5,-2,（1入队，-1入队）
//    1, （1.5入队）
//    -1,1.5(先后顺序根据入队列时机来看)
// 2,3
async function aoo(){
    console.log('-2')
    // 这里如果不存在awiat  则本函数是同步
    await new Promise(resolve => resolve())
    console.log('-1')
}
new Promise(resolve =>{ console.log(0); resolve()}).then(()=>{
    console.log('1')
    new Promise(resolve => resolve()).then(()=>console.log('1.5'))
})

setTimeout(function(){
    console.log('2')
    new Promise(resolve => resolve()).then(()=>console.log('3'))
}, 0)

console.log(4)
console.log(5)
aoo()
```
