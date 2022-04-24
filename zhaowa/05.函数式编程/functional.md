# 函数式编程
> 模块拆分，一个方法只做一件事。
> 纯函数，无状态（幂等）、无副作用

## 发展历程
- 命令式
  - `trim(reverse(toUpperCase(map(arr))));`
- 面向对象式
  - `arr.map().toUpperCase().reverse().trim();`
- 函数式
  - `const result = compose(trim, reverse, toUpperCase, map);`


## 组装函数
```js
    const compose = (f, g) => x => f(g(x))

    const sum1 = x => x + 1;
    const sum2 = x => x + 2;
    const sum12 = compose(sum1, sum2);
    sum12(1);
```

## 面试
- 提取url参数
```javascript

function query(sHref = window.location.href){
    var obj = {};
    var args = sHref.split('?');
    if(args[0] == sHref) return obj;
    var arr = args[1].split('&');
    for(var i = 0;i< arr.length;i++){
        var arg = arr[i].split('=');
        obj[arg[0]] = arg[1];
    }
    return obj;
}

```

- 正确的遍历
- 手写可拆分传参的累加函数

```js
    // 1. 构造科里化结构
    // 2. 输入 处理外部arguments => 类数组形态处理
    // 3. 传入参数无限拓展 => 递归 内层逻辑 => 返回函数
    // 4. 主功能实现 => 累加
    // 5. 输出

    const add = function() {
        // 输入
        let args = Array.prototype.slice.call(arguments);

        // 内层处理
        let inner = function() {
            args.push(...arguments); // 内外层参数合并
            return inner;
        }

        inner.toString = function() {
            return args.reduce((prev, cur) => {
                return prev + cur;
            });
        }

        return inner;
    }

    '' + add(1)(2)(3)(4) // '10'
    parInt(add(1)(2)(3)(4), 10) // 10
```

- 惰性函数

```js
    // 惰性函数
    let program = name => {
        if(name === "progressive") {
            return program = () => {
                console.log('progressive');
            }
        } else if (name === "objective") {
            return program = () => {
                console.log('objective');
            }
        } else {
            return program = () => {
                console.log('functional');
            }
        }
    }

    program("progressive")();
    console.log("lazy");
    program();
    // progressive lazy progressive
```