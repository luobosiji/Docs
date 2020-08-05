# Statement

- Runtime
  - Completion Record  语句完成记录
    - [[type]]: normal/break/continue/return/or throw
      - 非normal 都可以改变运行顺序
    - [[value]]: Types
    - [[target]]: label
      - 为了循环而（break、continue）存在
  - Lexical Enviorment 词法环境（初始）

- Grammar
  - 简单语句
    - ExpressionStatement
      - a = 1 +2;
    - EmptyStatement
      - ;
    - DebuggerStatement
      - debugger;
    - ThrowStatement
      - throw a;
    - ContinueStatement
      - continue label1; 可以带个标签名
    - BreakStatement
      - break label2;
    - ReturnStatement
      - return 1+2;
  - 复合语句
    - BlockStatement { 大括号内的语句，多条语句 合成一条 }
      - [[type]]: normal
    - LabelledStatement
    - IterationStatement
      - Iteration(循环 迭代)
        - while(){}
          - 消费break continue （遇到他们 会执行）
        - do{} while()
        - for(_; ; ){}
        - for(_ in ){} 遍历对象
        - for(_ of ){} 可以遍历数组
          - for本身会生成一个作用域
          - _ 位置 可以声明语句
            - var （不受块级作用域影响）
            - let、const（会在函数体内 在生成一个作用域）

```javascript
 function *g(){
    yield 0;
    yield 1;
    yield 4;
  }
  for (const p of g()) {
    // 只要有迭代性质（Iteration）的 都可以用for of
    // for of => Iteration => Generator/Array
  }

// [[type]]: return
// [[target]]: label
  try{
    throw
  }catch(e){
    let e // 这里不能声明，因为 catch 并没有生成作用域
    // 如果顶部 声明 var e  这里 catch 会做一个类似 let的作用域
  }finally{

  }

// 作用域（源代码文本范围） 和上下文（用户电脑上 js引擎中的内存）

// 函数声明  
function foo(){

}
// 函数表达式
var o = function(){

}

function sleep(d){
  return new Promise(resolve => setTimeout((resolve, d)))
}

// 异步立即执行函数
void async function(){
  var i = 0
  while(true){
    console.log(i++)
    await sleep(1000) // 等1秒
  }
}()


async function* foo(){
  var i = 0
  while(true){
    yield i++
    await sleep(1000) // 等1秒
  }
}()

void async function(){
  var g = foo()
  // console.log(await g.next())
  // console.log(await g.next())
  for await(let e of g){

  }
}()

// Evaluation 预处理阶段会有操作
// 提升
// 函数声明 提前 函数会执行
// 变量声明 只提前声明 赋值不会提前


// 对象的三要素 唯一性、状态、行为（状态的改变即是行为，行为改变状态原则，行为必须改变自身状态）
// 狗咬人： 人的状态改变了  所以 人的受伤是一个行为（方法）


// 封装（复用、解耦、内聚 一类概念  是描述架构的）、 
// 继承（面向对象的子系统）、
// 多态（描述 动态性的程度）



```
- 类 （基于类的面向对象）
  - 归类（多继承）
  - 分类（单继承）
    - 为了弥补单继承不足 出现
      - interface
      - mixins
- Object-Prototype（原型）
  - 属性 property
    - 数据属性（data property）
      - [[value]]
      - writable
      - enumerable 是否能被枚举
      - configurable 属性的数据属性能否被改变
    - 访问器属性(accessor property)
      - get
      - set
      - enumerable
      - configurable
  - 原型 Prototype
    - 原型链（一直找到 原型为null 为止）
      - 每个对象只需要描述自己和原型的区别
- Object API/Grammar
  - {} . [] Object.defineProperty 创建对象 基本的对象能力 
  - Object.create / Object.setPrototypeOf/ Object.getPrototypeOf 原型API
  - new / class / extends
  - new / function / prototype (乱乱乱  舍弃)
- Function Object
  - [[call]]

```javascript
// “行为改变状态” 原则
// 先进行有效抽象 
// 狗咬人 人 应该是 受伤  而不是 被咬


new Dtae()  //创建对象
Date() //返回字符串
// new class 比较合理 
// new function 不合理


// tc39/ecma262
```