# Twitter 源代码的前 10 行

- `<!DOCTYPE html>`
  - 放在html文件第一行的 文档类型 声明，告诉浏览器这是一个html页面

- `<html dir="ltr" lang="en">`
  - html根元素，dir是方向 从右到左的 lang是语言
  - 使用 屏幕阅读器

- `<meta charset="utf-8">`
  - 元数据，告诉浏览器使用哪种字符编码
  - 应该放到head标签中

- `<meta name="viewport" content="width=device-...`
  - 视口相关信息：设置比例、缩放

- `<meta property="og:site_name" content="Twitt...`
  - Open Graph 标签，SEO相关 标注页面，网页代表哪一类型
  - 以卡片形式预览网页

- `<meta name="apple-mobile-web-app-title" cont...`
  - 将网站固定在iPhone桌面上，title、svg...

- `<meta name="theme-color" content="#ffffff"...`
  - Apple 状态栏颜色元标记，告诉浏览器为周围的UI 设置主题

- `<meta http-equiv="origin-trial" content="...`
  - 用户代理跟踪反馈，例如 折叠手机  打开还是关闭

- `html{-ms-text-size-adjust:100%;-webkit-text...`
  - -ms是 Internet Explorer 用于非标准属性的供应商前缀
  - -webkit- 基于 WebKit 的浏览器  用于非标准属性的供应商前缀
  - text-size-adjust 设置浏览器放大文本的百分比（移动端访问pc网站 浏览器可能会调整文本大小以使其更大以便更易于阅读 ）

- `body{margin:0;}`
  - 因为不同的浏览器具有不同的默认样式（用户代理样式表）
    - 通过重置属性来覆盖它们，以便您的网站在不同设备上看起来相同