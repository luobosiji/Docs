
# JavaScript表达式&类型转换

> A.2 Expressions
> 
> left handside & right handside
> 
> a.b = c

```javascript

Object.setPrototypeOf()
apply()


// instanceof  是走原型链检查

```

- left handside（等号左侧|左侧表达式）
  - Member(MemberExpression) 成员、属性（Member返回的是一个 Reference类型）
    - a.b 
    - a[b]
    - foo`string${1}end` 
      - 调用函数foo([string, end],${1}) 
    - super.b
    - super['b']
    - new.target（在函数内部 判断是被谁调起的）
    - new Foo() （带()的优先）
  - New
    - new Foo 
  - Call
    - foo()
    - super()
    - foo()['b']
    - foo().b
    - foo()`abc`
- right handside
  - Update（更新运算符 UpdateExpression）
    - ++a、a++
    - --a、a--
    - no LineTerminator  换行符 会使表达式失效（a \r\n ++）
  - Unary(单目运算符)
    - delete a.b
    - void foo()
      - void 0 = undefined
    - typeof a
      - typeof null (object)
      - typeof function(){} (function)
    - \+ a
    - \- a
    - ~ a
    - ! a
      - !! 有类型转换
    - await a
  - Exoinental 乘方
    - ** （右结合）
  - Multiplicative 乘法
    - \* / %
  - Additive 加法
    - \+ -
  - Shift 位运算 左右移位
    - << >> >>>
  - Relationship 比较运算
    - <= >= > < instanceof in
  - Equality  等号
    - == !==  ===  !==
  - Bitwise 位运算
    - & ^ |
  - Logical 逻辑运算
    - && ||
  - Conditional 三目运算
    - ? :
  - 逗号 ,

![类型转换]()
- 装箱运算（四种基本类型）
  - object  Object()
  - number  Number()
  - string  String()
  - symbol  Symbol()
  - 函数中访问this 也会装箱(Symbol 被强制装箱)
    - (function(){return this}).apply(Symbol("x"))
- Object 类型转换
  - symbol.toPrimitive
  - valueOf() 优先使用
  - toString()
  

```javascript
// Object类型转换时
{
  [symbol.toPrimitive](){ return 6 }, //最优先 // 如果返回对象 则 报错
  valueOf(){ return 1}, // 其次  
  toString(){ return 2} // 最后
}
// 执行顺序
// 先检查 symbol.toPrimitive 如果没有 则调用 OrdinaryToPrimitive(object,hint)
// 如果hint 传 string 则先调用tostring 否则先调用 valueof


// IIFE ：Immediately-invoked Function Expressions 立即执行的函数表达式
(function(i){

})(i) 
// 如果不加 （） 或者 void  则被当成函数声明
// void 语义正确 
void function(i){

}(i)
```
