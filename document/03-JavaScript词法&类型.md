# JavaScript 词法&类型

## A Grammar Summary
### A.1 Lexical Grammar
```javascript
// 定义 源字符 是任何 unicode 代码点
  SourceCharacter ::
    any Unicode code point
//  Unicode字符集：字符集合 规定了一系列字符
//  字符 对应 码点（正整数 ）
```
#### Unicode（基本是 U+0000 四位，后边引入Emoji位数不够变成五位）
>（0-128）ascii字符(美国信息交换标准代码)常用部分 兼容性强
>
> `'a'.codePointAt(0)` 可以查看`a`字符对应的码点
> 
> `String.fromCharCode(num)` 可以查看码点对应的字符
> `String.fromCodePoint`  超出四位使用这个
- [Unicode官网](https://home.unicode.org/)
- [Unicode查阅文档fileformat](http://www.fileformat.info/info/unicode/)
  - blocks
    - basic latin 
      - List without images (fast)
    - CJK Unified Ideographs 
      - C中文 J日文 K韩文
      - U+4E00	U+9FFF 范围判断中文
        - 因为有好多增补的字符 所以有时候用unicode判断并不准确
    - Specials 往上	
      - 四位能表示的范围（BMP 基本字符平面）兼容性特别好
      - 超出四位 使用以下API
        - `String.fromCodePoint`
        - `String.codePointAt`
  - Categories 分类
    - Separator, Space 空格
  - 中文变量名
    - 因涉及到文件的编码保存方式，使用 `\u十六进制unicode`转译（`'厉'.codePointAt(0).toString(16)`）
  ```javascript
    // 这里 \u5389\u5bb3 与 厉害 等效
    var \u5389\u5bb3 = 2
    console.log(厉害) // 输出2
  ```
  
#### InputElement
- WhiteSpace 空格
  - `<TAB>`
  - `<VT>` 纵向制表符  \v
  - `<FF>` FORM FEED
  - `<SP>` 普通空格 0020
  - `<NBSP>` NO-BREAK SPACE  `&nbsp;`解决排版问题，有空格但是不会从中间折行
  - `<ZWNBSP>` U+FEFF  ZERO WIDTH NO BREAK SPACE
    FEFF 另一个名字 BOM BIT ORDER MASK（第一个字符 有可能永远按照 Bom 处理 吞一个字符 所以 前端规范 页首加一个回车）
  - `<USP>`
- LineTerminator 换行符
  - `<LF>` \n LINE FEED（统一使用这个）
  - `<CR> `回车 CARRIAGE RENTURN
  - 超出 unicode 之外
    - `<LS>` 分行符 LINE SEPARATOR
    - `<PS>` 分段符 PARAGRAPH SEPARATOR
- Comment 注释
- CommonToken
- Punctuator: 符号 比如 `> = < }`
- Keywords：比如 `await`、`break`... 不能用作变量名，但像 getter 里的 `get`就是个例外
  - Future reserved Keywords: `eum`
- IdentifierName：标识符，可以以字母、_ 或者 $ 开头，代码中用来标识**[变量](https://developer.mozilla.org/en-US/docs/Glossary/variable)、[函数](https://developer.mozilla.org/en-US/docs/Glossary/function)、或[属性](https://developer.mozilla.org/en-US/docs/Glossary/property)**的字符序列
  - 变量名：不能用 Keywords
  - 属性：可以用 Keywords

##### Literal: 直接量
  - Number
    - 存储 Uint8Array、Float64Array
    - 各种进制的写法
      - 二进制0b
      - 八进制0o
      - 十六进制0x
    - 实践
      - 比较浮点是否相等：Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
      - 如何快捷查看一个数字的二进制：(97).toString(2)
  - String
    - Character
    - Code Point
    - Encoding
      - unicode编码 - utf
        - utf-8 可变长度 （控制位的用处）
    - Grammar
      - `''`、`""`、``` `
  - Boolean
  - Null
  - Undefind


## 知识补充
### ASCII 码
- 计算机内部，所有信息最终都是一个**二进制值**。每一个二进制位（bit）有0和1两种状态，因此**八个二进制位**就可以组合出256种状态，这**被称为一个字节（byte）**。也就是说，一个字节一共可以用来表示256种不同的状态，每一个状态对应一个符号，就是256个符号，从00000000到11111111。
- 上个世纪60年代，美国制定了一套字符编码，**对英语字符与二进制位之间的关系**，做了统一规定。这被称为 ASCII 码，一直沿用至今。
- ASCII 码**一共规定了128个字符的编码**，比如空格SPACE是32（二进制00100000），大写的字母A是65（二进制01000001）。这128个符号（**包括32个**不能打印出来的**控制符号**），只占用了一个字节的后面7位，最前面的一位统一规定为0。

### Unicode
>将世界上所有的符号都纳入其中。每一个符号都给予一个独一无二的编码，那么乱码问题就会消失。这是一种所有符号的编码。
- Unicode 只是一个符号集，它只规定了符号的二进制代码，却没有规定这个二进制代码应该如何存储。
- 两个严重的问题
  - **如何才能区别 Unicode 和 ASCII** ？计算机怎么知道三个字节表示一个符号，而不是分别表示三个符号呢？
  - 英文字母只用一个字节表示就够了，如果 Unicode 统一规定，每个符号用三个或四个字节表示，那么每个英文字母前都必然有二到三个字节是0，这**对于存储来说是极大的浪费**，文本文件的大小会因此大出二三倍，这是无法接受的。

### UTF-8
> 互联网的普及，强烈要求出现一种统一的编码方式。UTF-8 就是在互联网上使用最广的一种 Unicode 的实现方式。
> 
> **UTF-8 是 Unicode 的实现方式之一**
- 它是一种变长的编码方式。它可以使用1~4个字节表示一个符号，**根据不同的符号而变化字节长度**。
- 编码规则
  - 对于单字节的符号，字节的第一位设为0，后面7位为这个符号的 Unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的。
  - 对于n字节的符号（n > 1），第一个字节的前n位都设为1，第n + 1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的 Unicode 码。
    - 从最后一个二进制位开始，（二进制）依次从后向前填入

```javascript
// 规则
Unicode符号范围     |        UTF-8编码方式
(十六进制)        |              （二进制）
----------------------+---------------------------------------------
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
// 以汉字严为例，演示如何实现 UTF-8 编码。
// 严的 Unicode 是4E25（100111000100101），
// 根据上表，可以发现4E25处在第三行的范围内（0000 0800 - 0000 FFFF），
// 因此严的 UTF-8 编码需要三个字节，即格式是1110xxxx 10xxxxxx 10xxxxxx。
// 然后，从严的最后一个二进制位开始，依次从后向前填入格式中的x，多出的位补0。
// 这样就得到了，严的 UTF-8 编码是11100100 10111000 10100101，
// 转换成十六进制就是E4B8A5。
```

## 作业
- 写一个正则表达式 匹配所有 Number 直接量
```javascript
  NumericLiteral :: 
    DecimalLiteral  // 十进制
    BinaryIntegerLiteral // 二进制
    OctalIntegerLiteral // 八进制
    HexIntegerLiteral // 十六进制
```
```javascript
// DecimalLiteral
// DecimalIntegerLiteral
/^0|[1-9]\d*$/
// .DecimalIntegerLiteral
// DecimalIntegerLiteral.DecimalDigits
/^\.\d+|(0|[1-9]\d*)\.?\d*$/
// DecimalIntegerLiteral ExponentPart(ExponentIndicator SignedInteger)
/^(\.\d+|(0|[1-9]\d*)\.?\d*)([eE][\+\-]?\d+)?$/
// BinaryIntegerLiteral
/^0[bB][01]+$/
// OctalIntegerLiteral
/^0[oO][0-7]+$/
// HexIntegerLiteral
/^0[xX][0-9a-fA-F]+$/
// NumericLiteral
/^(\.\d+|(0|[1-9]\d*)\.?\d*)([eE][\+\-]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/
```

- 写一个 UTF-8 Encoding 的函数

```javascript
  function customEncoding(str){
    var back = [];
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (0x00 <= code && code <= 0x7f) {
        // 0xxxxxxx
        back.push(code);
      } else if (0x80 <= code && code <= 0x7ff) {
        // 110xxxxx 10xxxxxx
        // parseInt(11000000,2) 192
        // parseInt(10000000,2) 128
        // parseInt(11111) 31
        // parseInt(111111) 63
        back.push((192 | (31 & (code >> 6))));
        back.push((128 | (63 & code)))
      } else if ((0x800 <= code && code <= 0xd7ff) 
          || (0xe000 <= code && code <= 0xffff)) {
        // 1110xxxx 10xxxxxx 10xxxxxx
        back.push((224 | (15 & (code >> 12))));
        back.push((128 | (63 & (code >> 6))));
        back.push((128 | (63 & code)))
      }
    }
    for (i = 0; i < back.length; i++) {
      // 只保留低八位的数
      // 将 0x1234 & 0xff
      // 0x1234 表示为二进制 00010010  00110100
      // 0xff       表示为二进制 11111111
      // 两个数做与操作，显然将0xff补充到16位，就是高位补0
      // 此时0xff 为 0000000011111111
      // 与操作 1&0 =0 1&1 =1 这样 0x1234只能保留低八位的数 0000000000110100 也就是 0x34
      back[i] &= 0xff;
      back[i] = back[i].toString(16)
    }
    return back.join('')
  }
```

- 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号