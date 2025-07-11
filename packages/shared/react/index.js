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

  // diff结束提交渲染
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  // 否则放到下一帧（16.6666...）执行
  requestIdleCallback(workLoop) // 实际不用改函数执行，而是基于postMessage实现
}

requestIdleCallback(workLoop)

/**
 * 执行单个工作单元（fiber）
 *
 * @param fiber 工作单元（fiber）对象
 * @returns 返回下一个需要执行的工作单元（fiber）对象或null
 */
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
    updateDom(fiber.dom, {}, fiber.props)
  }

  //  遍历子节点
  reconcileChildren(fiber, fiber.props.children)

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
  const isEvent = (key) => key.startsWith('on')
  const isProperty = (key) => key !== 'children' && !isEvent(key)
  const isNew = (prev, next) => (key) => prev[key] !== next[key]
  const isGone = (prev, next) => (key) => !(key in next)

  // 移除旧的或者改变了的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = ''
    })

  // 设置新的或者改变了的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      // 处理特殊属性
      if (name === 'className') {
        dom.className = nextProps[name]
      } else if (name === 'style') {
        // 处理style对象
        Object.assign(dom.style, nextProps[name])
      } else {
        dom[name] = nextProps[name]
      }
    })

  // 添加新的事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

/**
 * 将指定的React元素渲染到指定的DOM容器中。
 * 初始化fiber所有数据
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
 * 构建子节点fiber树和diff算法
 *
 * @param fiber 父节点Fiber对象
 * @param children 子节点数组
 */
function reconcileChildren(fiber, children) {
  let index = 0
  let prevSibling = null
  let oldFiber = fiber.alternate && fiber.alternate.child // 旧的Fiber树的第一个子节点

  while (index < children.length || oldFiber !== null) {
    const element = children[index]
    // DIFF（复用，新增，删除）
    let newFiber = null
    const sameType = element && oldFiber && element.type === oldFiber.type
    // 复用
    if (sameType) {
      console.log('🚀 ~ reconcileelementren ~ UPDATE:', element)
      newFiber = {
        type: element.type,
        props: element.props, // 更新props
        dom: oldFiber.dom,
        parent: fiber,
        alternate: oldFiber, // 关联旧节点
        effectTag: 'UPDATE',
      }
    }
    // 新增节点
    if (element && !sameType) {
      console.log('🚀 ~ reconcileelementren ~ PLACEMENT:', fiber)
      newFiber = createFiber(element, fiber)
      newFiber.effectTag = 'PLACEMENT'
    }
    // 删除节点
    if (oldFiber && !sameType) {
      console.log('🚀 ~ reconcileelementren ~ DELETION:', oldFiber)
      oldFiber.effectTag = 'DELETION'
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling // 移动到下一个兄弟节点
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

/**
 * 创建一个 Fiber 节点
 *
 * @param element 元素对象
 * @param parent 父 Fiber 节点
 * @returns 返回创建的 Fiber 节点
 */
function createFiber(element, parent) {
  return {
    type: element.type,
    props: element.props,
    parent: parent,
    dom: null,
    child: null,
    sibling: null,
    alternate: null,
    effectTag: null,
  }
}

/**
 * 提交根节点
 *
 * 将所有删除操作提交到DOM中，并提交工作单元（work unit）到DOM，
 * 然后将当前根节点设置为工作单元根节点，并将工作单元根节点重置为空，
 * 以回归原始状态。
 */
function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null // 回归原始状态
}

/**
 * 提交工作单元
 *
 * @param {Fiber} fiber - 当前工作单元
 */
function commitWork(fiber) {
  if (!fiber) {
    return
  }

  const parentDom = fiber.parent.dom
  console.log('🚀 ~ commitWork ~ parentDom:', parentDom, fiber)
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    parentDom.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    parentDom.removeChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// TEST
// 第一次渲染
render(
  React.createElement(
    'div',
    { id: 'container', className: 'box', style: { color: 'red' } },
    React.createElement('a', { href: 'http://' }, 'link'),
    React.createElement('h1', { title: 'hello' }, 'Hello World'),
  ),
  document.getElementById('app'),
)

// 稍后更新props
setTimeout(() => {
  render(
    React.createElement(
      'div',
      {
        id: 'container',
        className: 'new-box',
        style: { color: 'blue', fontSize: '20px' },
      },
      React.createElement('a', { href: 'http://', title: 'a-link' }, 'a-link'),
      React.createElement(
        'h1',
        { title: 'updated', onClick: () => alert('clicked') },
        'Updated!',
      ),
    ),
    document.getElementById('app'),
  )
}, 2000)
