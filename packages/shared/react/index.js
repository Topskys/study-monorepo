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
console.log('🚀 ~ vDom:', vDom)

/* 实现虚拟dom转fiber结构 和 时间切片 */

let nextUnitOfWork = null // 下一个工作单元
let wipRoot = null // 正在工作中的根节点 fiber
let currentRoot = null // 当前根节点 fiber
let deletions = null // 删除的节点 fiber

function workLoop(deadline) {
  let shouldYield = false
  // 有空闲时间则执行
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  // 否则放到下一帧（16.6666...）执行
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 接收一个单元并返回一个新的单元
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
    updateDom(fiber.dom, prevProps, fiber.props)
  }

  //  遍历子节点
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      // 存在兄弟节点，则返回兄弟节点
      return nextFiber.sibling
    }
    // 不存在兄弟节点，则返回父节点的兄弟节点
    nextFiber = nextFiber.parent
  }

  return null
}

/**
 * 根据Fiber节点创建真实DOM元素
 *
 * @param fiber Fiber节点对象
 * @returns 返回创建的DOM元素或文本节点
 */
function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
  updateDom(dom, {}, fiber.props) // 更新属性
  return dom
}

/**
 * 更新DOM节点
 *
 * @param {HTMLElement} dom 需要更新的DOM节点
 * @param {Object} prevProps 之前的属性对象
 * @param {Object} nextProps 更新后的属性对象
 */
function updateDom(dom, prevProps, nextProps) {
  // example: <div id="foo" /> -> <div id="bar" />
  if (dom && dom.firstChild) {
    updateDom(dom.firstChild, prevProps.children[0], nextProps.children[0])
  } else if (prevProps.children && nextProps.children) {
    updateDom(dom, prevProps.children[0], nextProps.children[0])
  }
}

/**
 * 将指定的React元素渲染到指定的DOM容器中。
 *
 * @param element 要渲染的React元素
 * @param container DOM容器元素
 */
function render(element, container) {
  // 初始化fiber结构
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot, // 保存当前根节点（旧的fiber树）
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

/**
 * 构建子节点fiber树和实现diff算法
 *
 * @param fiber 父节点Fiber对象
 * @param children 子节点数组
 */
function reconcileChildren(fiber, children) {
  let index = 0
  let prevSibling = null
  while (index < children.length) {
    const child = children[index]
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      dom: null,
    }

    if (index === 0) {
      // 第一个子节点，则设置为父节点的子节点
      fiber.child = newFiber
    } else if (element) {
      // 否则设置为上一个兄弟节点的兄弟节点
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }
}
