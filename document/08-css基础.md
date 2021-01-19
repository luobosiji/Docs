# CSS基础知识

- CSS
  - At-rules
    - @charset
    - @import
    - @media
    - @page
  - rule
    - Selector
      - selector_group
      - combinator
      - simple_selector
        - type
        - *
        - #
        - .
        - []
        - :
        - ::
    - Declaraion
      - Key
        - Property
        - variable(--变量)
          - 声明 --xxx
          - 使用 color: var(xxx)
      - Value


```javascript
// 获取网页 https://www.w3.org/TR/?tag=css    css标准
let list = document.getElementById('container').children
let result = []
for (const li of list) {
  if(li.getAttribute('data-tag').match(/css/)){
    result.push({
      name: li.children[1].innerText,
      url: li.children[1].children[0].href
    })
  }
}
let standards = JSON.stringify(result,null,4)

// 获取每份标准中的内容
let iframe = document.createElement('iframe')
document.body.innerHTML = ''
document.body.appendChild(iframe)

// iframe.src = 'https://www.w3.org/TR/2020/WD-css-cascade-4-20200818/'
// iframe.contentDocument.getElementsByClassName('prod')  // 爬取链接中的内容

function happen(elment, event){
  return new Promise((resolve)=>{
    let handler = () =>{
      console.log(iframe.contentDocument.getElementsByClassName('prod'))
      resolve()
      elment.removeEventListener(event, handler)
    }
    elment.addEventListener(event, handler)
  })
}
void async function(){
  for(let standard of standards){
    console.log(standard.name)
    iframe.src = standard.url
    await happen(iframe, "load")
  }
}()
 

```

## 选择器语法

- 简单选择器
  - *
  - div svg|a
  - .cls
  - #id
  - [attr=value]
  - :hover
  - ::before
- 复合选择器
  - 多个简单选择器
  - *或div必须写在最前面
- 复杂选择器
  - 复合 `<sp>` 复合 (子孙关系)
  - 复合 `>` 复合
  - 复合 `~` 复合 （相邻）
  - 复合 `+` 复合
  - 复合 `||` 复合 （table中的一列 ，有标准，但很多浏览器没实现）
- 伪类(针对超链接设计的)
  - :any-link （所有超链接）
  - :link（没访问过的） :visited（访问过的）
  - :hover  鼠标悬浮
  - :active   激活状态
  - :focus   焦点状态
  - :target   目标状态
  - 树结构
    - :empty  无子元素
    - :nth-child()   第几个子元素
    - :nth-last-child()  最后一个子元素
    - :first-child :last-child :only-child    第一个、最后一个、唯一的一个（不推荐使用 ，会影响layout次数）
- 逻辑型
  - :not 伪类  非。。元素
  - :where :has  4.0版本的 用不了
- 伪元素
  - ::before  内容开头
  - ::after   内容最后
  - ::first-line   向段落的第一行添加特殊样式（只能控制内容相关，不能控制盒子）
  - ::first-letter   向段落的第一个字符添加特殊样式（基本所有样式都可以）

## 选择器优先级

- 计算选择器优先级
  - 《CSS REFACTORING》 中提到了算法的过程 。
  - div#a.b .c[id=x]  0 1 3 1
  - #a:not(#b)  0 2 0 0  :not（非#b 元素的所有元素的背景色：） 伪类不参与优先级计算
  - *.a   0 0 1 0  * 不参与优先级计算
  - div.a   0 0 1 1

```javascript
// A specificity is determined by plugging numbers into (a, b, c, d):

// If the styles are applied via the style attribute, a=1; otherwise, a=0.
// b is equal to the number of ID selectors present.
// c is equal to the number of class selectors, attribute selectors, and pseudoclasses present.
// d is equal to the number of type selectors and pseudoelements present.

  // 优先级是由 A 、B、C、D 的值来决定的，其中它们的值计算规则如下：

  // 如果存在内联样式，那么 A = 1, 否则 A = 0;
  // B 的值等于 ID选择器 出现的次数;
  // C 的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数;
  // D 的值等于 标签选择器 和 伪元素 出现的总次数 。

```

## 排版 

### 盒（Box）
> 排版和渲染的基本单位是盒
> box-sizing: content-box;botder-box 
> margin + padding + borderWidth(botder-box) + contentWidth(content-box)

- 正常流排版
  - 收集盒进横行
  - 计算盒在行中的排布
  - 计算行的排布

- 一个line的盒子里如何没有文字 基线在底部 
- float:right; clear:right(从一个新行来开始浮动)
  - 会导致重排
- 边距(margin 留白)折叠只会发生在上下方向（BFC正常流排版）
  - overflow:hidden
- display:flex 不是BFC （每个item内 还是BFC）
- BFC 绕排

