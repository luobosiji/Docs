# 重学HTML
> HTML的定义: XML与SGML

- DTD

- ENTITY
  - quot  '
  - amp   &
  - lt    < 
  - gt    >

- Browser API
  - ...
  - DOM
    - DOM Tree
    - Events
    - Range API
  - CSSOM
    - document.styleSheets
    - window.getComputedStyle(elt, pasudoElt)
      - elt 想要获取的元素
      - pasudoElt 可选，伪元素




```javascript
document.styleSSheets[0].cssRule[0].style.color='xxx'
document.styleSSheets[0].insertRule('p{colole:pink}',0)
document.styleSSheets[0].removeRule(0)

CSSStyleRule.prototype

// 获取样式 可以通过style来修改
winodw.getComputedStyle(elt,pseudoElt)
// - elt 想要获取的元素
// - pseudoElt 可选 伪元素

// 返回一个以全局（global） Document 作为起点与终点的 Range 对象。
let range = new Range()
// var range = document.getSelection().getRangeAt(0)
// 设置 Range 的起点。
range.setStart(element, 9)
// 设置 Range 的终点。
range.setEnd(element, 4)

// 使 Range 包含某个节点的内容。
range.selectNodeContents(document.getElementsByTagName('style')[0])
// 把 Range 的内容从文档树移动到一个文档片段中。
range.extractContents()


```