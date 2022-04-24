## TypeScript 详解
### 一、TS的基础概念
#### 1. 什么是TS
a. 对比原理
* 他是JS的一个超集，在原有的语法基础上，添加强类型并切换为基于类的面向对象语言

> 面向项目：
TS - 面向解决大型的复杂项目、架构、代码维护复杂场景
JS - 脚本化语言，用于面向简单页面场景

> 自主检测：
TS - 编译时，主动发现并纠正错误
JS - 运行时，执行报错

> 类型检测
TS - 强类型语言，支持动态和静态的类型检测
JS - 弱类型语言，无静态类型选项

> 运行流程
TS - 依赖编译，依靠编译打包实现在浏览器端的运行
JS - 可直接在浏览器端运行

> 复杂特性
TS - 模块化、接口、泛型

b. 安装运行
```js
    npm install -g typescript
    tsc -v

    tsc xxx.ts

    // 面试点：所有类型的检测和纠错 - 编译时 => 工程化
```

#### 2. TS基础类型和语法

* boolean、string、number、array、null、undefined

```ts
// es
let isEnable = false;
let className = 'zhaowa';
let classNum = 2;
let u = undefined;
let n = null;
let classArr = ['basic', 'execute'];

// TS
let isEnable: boolean = false;
let className: string = 'zhaowa';
let classNum: number = 2;
let u: undefined = undefined;
let n: null = null;
// 统一方式 & <>方式
let classArr: string[] = ['basic', 'execute'];
let classArr: Array<string> = ['basic', 'execute'];
```

* tuple - 元祖
```ts
let tupleType: [string, boolean] = ['basic', false];
```

* enum - 枚举
```ts
// 数字型枚举 - 默认从0开始，依次递增
enum Score {
    BAD,  // 0
    NG,   // 1
    GOOD,  // 2
    PERFECT, // 3
}

let score: Score = Score.BAD;

// 字符串类型枚举
enum Score {
    BAD = 'BAD',
    NG = 'NG',
    GOOD = 'GOOD',
    PERFECT = 'PERFECT',
}

// 反向映射
enum Score {
    BAD,  // 0
    NG,   // 1
    GOOD,  // 2
    PERFECT, // 3
}

let scoreName = Score[0]; // BAD
let scoreVale = Score["BAD"]; // 0

// 异构
enum Enum {
    A,        // 0
    B,        // 1
    C = 'C',
    D = 'D',
    E = 8,
    F,        // 9
}

// 面试题：异构类型每一项的枚举值 => js本质实现（手写一个异构枚举的实现）
let Enum;
(function (Enum) {
    // 正向
    Enum["A"] = 0;
    Enum["B"] = 1;
    Enum["C"] = "C";
    Enum["D"] = "D";
    Enum["E"] = 8;
    Enum["F"] = 9;

    // 逆向
    Enum[0] = "A";
    Enum[1] = "B";
    Enum[8] = "E";
    Enum[9] = "F";
})(Enum || (Enum = {}))
```

* any、unknown、void
```ts
// any - 绕过所有类型检查 => 类型检测和编译筛查取消
let anyValue: any = 123;

anyValue = "anyValue";
anyValue = false;
let value1: boolean = anyValue;

// unknown -绕过赋值检查 => 禁止更改传递
let unknownValue: unknown;

unknownValue = true;
unknownValue = 123;
unknownValue = "unknownValue";

let value1: unknown = unknownValue; // OK
let value2: any = unknownValue;  // OK
let value3: boolean = unknownValue; // NOK

// void - 声明返回为空
function voidFunction(): void {
    console.log('void');
}

// never - 永不能执行完 or 永远error
function errorGen(msg: string): never {
    throw new Error(msg);
}

function infiniteLoop(): never {
    while(true) {
        // 业务逻辑
    }
}
```

* object / Object / {} - 对象

```ts
// object - 非原始类型
interface ObjectConstructor {
    create(o: object | null): any;
}

const proto = {};

Object.create(proto);
Object.create(null);
Object.create(undefined); // Error

// Object
// Object.prototype 上的属性
interface Object {
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
}

// 定义了Object类属性
interface ObjectConstructor {
    new(value: any): Object;
    readonly prototype: Object;
}

// {} - 定义空属性对象
const obj = {};

obj.prop = "props"; // NOK
obj.toString(); // OK
```

### 二、接口 - interface

* 对行为模块的抽象，具体的行为是有类来实现

```js
// 描述对象内容
interface Class {
    name: string;
    time: number;
}

let zhaowa: Class = {
    name: 'typescript',
    time: 2
}

// 只读
interface Class {
    readonly name: string;
    time: number;
}

// 面试题 - JS的引用类型操作不同 < = > const
let arr: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = arr;

ro[0] = 12;         // 赋值 - Error
ro.push(5);          // 增加 - Error
ro.length = 10;         // 长度改写 - Error
arr = ro;         // 覆盖 - Error

// 任意可添加属性
interface Class {
    readonly name: string;
    time: number;
    [propName: string]: any;
}

const c1 = { name: "JS" };
const c2 = { name: "browser", time: 1 };
const c3 = { name: "ts", level: 1 };
```

### 三、交叉类型 - &
```ts
// 合并
interface A {
    inner: D;
}
interface B {
    inner: E;
}
interface C {
    inner: F;
}

interface D {
    d: boolean;
}
interface E {
    e: string;
}
interface F {
    f: number;
}

type ABC = A & B & C;

let abc: ABC = {
    inner: {
        d: false,
        e: 'className',
        f: 5
    }
};

// 合并冲突
interface A {
    c: string;
    d: string;
}
interface B {
    c: number;
    e: string;
}

type AB = A & B;

let ab: AB;
// 合并的关系是'且' => c - never 
```

### 四、断言 - 类型的声明和转换（和编译器做了一个告知交流）

* 编译时作用

```ts
// 尖括号形式
let anyValue: any = 'hi zhaowa';
let anyLength: number = (<string>anyValue).length;

// as声明
let anyValue: any = 'hi zhaowa';
let anyLength: number = (anyValue as string).length;

// 非空判断 - 只确定不是空
type ClassTime = () => number;

const start = (ClassTime: ClassTime | undefined) {
    // 业务逻辑
    // if (额外判断逻辑) {
        let time = classTime!(); // 具体类型待定，但是非空确认
    // }
}

// 面试题
const tsClass: number | undefined = undefined;
const zhaowa: number = tsClass!;
console.log(zhaowa);

// 转义成
const tsClass = undefined;
const zhaowa = tsClass;
console.log(zhaowa); // undefined

// 肯定断言 - 肯定化保证赋值
let score: number;
startClass();
console.log('' + score); // 使用前赋值

function startClass() {
    score = 5;
}

// let score!: number; - 提前告知
```

### 五、类型守卫 - 语法规范范围内，额外的确认

* 多态 - 多种状态（多种类型）

```ts
// in - 定义属性场景下内容的确认
interface Teacher {
    name: string;
    courses: string[];
}
interface Student {
    name: string;
    startTime: Date;
}

type Class = Teacher | Student;

function startCourse(cls: Class) {
    if ('courses' in cls) {
        console.log("Courses:" + cls.courses);
    }
    if ('startTime' in cls) {
        console.log("startTime:" + cls.startTime);
    }
}

// typeof / instanceof - 类型分类场景下的身份确认
function class(name: string, score: string | number) {
    if (typeof score === "number") {
        return "teacher:" + name + ":" + score;
    }
    if (typeof score === "string") {
        return "student:" + name + ":" + score;
    }
}

const getName = (cls: Class) => {
    if(cls instanceof Teacher) {
        return cls.courses;
    }
    if(cls instanceof Student) {
        return cls.startTime;
    }
}

// 自定义类型
const isTeacher = function (cls: Teacher | Student): cls is Teacher {
    return 'courses' in cls;
}

const getName = (cls: Teacher | Student) => {
    if(isTeacher(cls)) {
        return cls.courses;
    }
}

// 类型别名 & 联合类型
```

### 六、 TS进阶

#### 1. 函数重载 - 复用

```ts
    class Course {
        start(name: number, score: number): number;
        start(name: string, score: string): string;
        start(name: string, score: number): string;
        start(name: number, score: string): string;
        start(name: Combinable, score: Combinable) {
            if (typeof name === 'string' || typeof score === 'string') {
                return 'student:' + name + ':' + score; 
            }
        }
    }

    const course = new Course();
    course.start('yunyin', 5);
```

#### 2. 泛型 - 复用

* 让模块可以支持多种类型数据 - 让类型声明和值一样，可以被赋值和传递

```ts
    function startClass <T, U>(name: T, score: U) : T {
        return name + score;
    }

    console.log(startClass<String, Number>("yunyin", 5));

    // T、U、K - 键值、V - 值、E - 节点、元素
```

#### 3. 装饰器 - decorator

```ts
    // tsc --target ES5 --experimentalDecorators
    // "experimentalDecorators": true

    // 类装饰器
    function Zhaowa(target: Function): void {
        target.prototype.startClass = function(): void {
            // 通用功能
        }
    }

    // 属性装饰器
    function propsWrapper(target: Object, key: string) {
        // 属性的统一操作
        Object.defineProperty(target, key, {
        })
    }

    // 方法装饰器 - target: Object, propertyKey: string, descriptor: TypePropertyDescript

    @Zhaowa
    class Course {
        constructor() {
            // 业务逻辑
        }

        @propsWrapper
        public name: string;

        @methodDec
        
    }


```
