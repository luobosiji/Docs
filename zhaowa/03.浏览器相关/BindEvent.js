// 手写兼容性事件绑定
// IE - attachEvent vs addEventListener
// 区别：
// a. 传参：attachEvent 对于事件名需要加上'on'
// b. 执行顺序：attachEvent - 后绑定先执行； addEventListener - 先绑定先执行
// c. 解绑：detachEvent vs removeEventListener
// d. 阻断：event.cancelBubble = true vs event.stopPropgation() 
// e. 默认事件拦截：event.returnValue = false vs event.preventDefault()
class BindEvent {
  constructor(element) {
    this.element = element
  }
  // 事件绑定
  addEventListener = (type, handler) => {
    if (this.element.addEventListener) {
      this.element.addEventListener(type, handler, false)
    } else if (this.element.attachEvent) {
      this.element.attachEvent('on' + type, () => {
        handler.call(this.element)
      })
    } else {
      this.element['on' + type] = handler
    }
  }
  // 解绑事件
  removeEventListener = (type, handler) => {
    if (this.element.removeEventListener) {
      this.element.removeEventListener(type, handler, false)
    } else if (this.element.detachEvent) {
      this.element.detachEvent('on' + type, () => {
        handler.call(this.element)
      })
    } else {
      this.element['on' + type] = null
    }
  }
  // 阻断事件传递
  static stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
  }
  // 阻止默认行为
  static preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false
    }
  };

}