/**
 * React原理解析
 * 
 * @date 2023年7月7日21:23:18
 */
const React = {
  createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => {
          if (typeof child === 'object') {
            return child
          }
          return this.createTextElement(child)
        }),
      },
    }
  },
  createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: [],
      },
    }
  },
  createRoot(selector) {
    this.container = document.querySelector(selector)
    return this
  },
  render(dom) {
    this.container.appendChild(dom)
  },
}

// Text Element
const text = document.createTextNode('')
text.nodeValue = 'Text Element'

// Use React
const vDom = React.createElement(
    'div',
    { id: 'foo' },
    'Hello World',
    React.createElement('a', { href: 'https://google.com' }, 'Link'),
)
console.log("🚀 ~ vDom:", vDom)
