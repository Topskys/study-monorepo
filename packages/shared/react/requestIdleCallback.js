const ImmediatePriority = 1 // 立即执行，级别最高（用户输入、事件）
const UserBlockingPriority = 2 // 用户阻塞，级别次高（滚动、动画、交互）
const NormalPriority = 3 // 正常优先级（ajax数据加载、render布局计算）
const LowPriority = 4 // 低
const IdlePriority = 5 // 最低优先级（空闲时执行）console

let scheduledHostCallback = null
let timeoutHandle = null

function getCurrentTime() {
  // 使用performance.now()获取当前时间，相对准确于Date.now()，但不完全准确
  return performance.now() // 精确到微秒
}

/**
 * 简单模拟任务调度器，用于调度不同优先级的任务
 */
class SimpleScheduler {
  /**
   * 构造函数
   *
   * 初始化任务队列、是否正在执行任务状态，并创建消息通道用于处理任务执行。
   */
  constructor() {
    /**
     * 任务队列，用于存储待执行的任务相关信息。
     */
    this.taskQueue = [] // 任务队列
    this.isPerformingWork = false // 是否正在执行任务 锁

    const channel = new MessageChannel() // 创建消息通道
    // 发消息到port1，触发onmessage事件
    this.port = channel.port2
    // 获取消息通道的port2
    channel.port1.onmessage = this.performWorkUnitDeaLine.bind(this)
  }

  /**
   * 根据优先级调度任务
   *
   * @param {number} priorityLevel - 任务优先级
   * @param {Function} callback - 任务回调函数
   * @returns {Object} 返回任务对象，包含任务ID、回调函数、优先级、开始时间和过期时间
   */
  scheduleCallback(priorityLevel, callback) {
    const currentTime = getCurrentTime()
    const task = {
      id: Math.random(),
      callback,
      priorityLevel,
      startTime: currentTime,
      expirationTime: currentTime + this.getTimeoutByPriority(priorityLevel),
    }

    this.push(this.taskQueue, task) // 插入任务到队列中

    // 插入任务到队列中，按优先级排序
    // this.insertTask(task)

    // 如果没有在执行任务，则开始调度
    this.requestHostCallback()

    // return task
  }

  /**
   * 请求宿主回调
   *
   * 当需要宿主进行回调时，调用此方法。
   * 如果当前没有正在执行的工作，则将标记设置为true，并通过port发送消息通知宿主进行回调。
   */
  requestHostCallback() {
    if (!this.isPerformingWork) {
      this.isPerformingWork = true
      this.port.postMessage(null) // 发送消息到port1，触发onmessage事件
    }
  }

  /**
   * 执行工作单元调度
   */
  performWorkUnitDeaLine() {
    const currentTime = getCurrentTime()
    const deadline = currentTime + 5 // 给每个时间片5ms

    while (this.taskQueue.length > 0 && currentTime < deadline) {
      const task = this.peak(this.taskQueue) // 取出队列中的第一个任务（优先级最高）
      // if (
      //   task.expirationTime <= currentTime ||
      //   task.priorityLevel === ImmediatePriority
      // ) {
        // 任务过期或立即执行
        task.callback()
        this.pop(this.taskQueue) // 执行完任务后，从队列中移除
      // } else {
      //   // 任务还没到执行时间，重新插入队列
      //   this.insertTask(task)
      //   break
      // }
    }

    // 如果还有任务，继续调度
    if (this.taskQueue.length > 0) {
      this.requestHostCallback()
    } else {
      this.isPerformingWork = false
    }
  }

  // 根据优先级获取超时时间
  /**
   * 根据优先级获取超时时间
   *
   * @param priorityLevel 优先级等级
   * @returns 返回超时时间（毫秒）
   */
  getTimeoutByPriority(priorityLevel) {
    switch (priorityLevel) {
      case ImmediatePriority:
        return -1 // 立即执行
      case UserBlockingPriority:
        return 250
      case NormalPriority:
        return 5000
      case LowPriority:
        return 10000
      case IdlePriority:
        return 1073741823 // 32位操作系统，v8最大堆栈大小
      default:
        return 5000
    }
  }

  // 源码使用最小堆实现，此处简化处理（队列）
  push(taskQueue, task) {
    taskQueue.push(task)
    // 按照过期时间排序
    taskQueue.sort((a, b) => a.expirationTime - b.expirationTime)
  }

  peak(taskQueue) {
    return taskQueue[0] || null
  }

  pop() {
    return this.taskQueue.shift()
  }

  // 插入任务到队列中，按优先级和过期时间排序
  insertTask(task) {
    let index = 0
    while (index < this.taskQueue.length) {
      const existingTask = this.taskQueue[index]
      if (
        task.priorityLevel < existingTask.priorityLevel ||
        (task.priorityLevel === existingTask.priorityLevel &&
          task.expirationTime < existingTask.expirationTime)
      ) {
        break
      }
      index++
    }
    this.taskQueue.splice(index, 0, task)
  }
}

const simpleScheduler = new SimpleScheduler()
// 执行打印顺序 1,2,3,4
simpleScheduler.scheduleCallback(UserBlockingPriority, () => {
  console.log('UserBlockingPriority', UserBlockingPriority)
})

simpleScheduler.scheduleCallback(LowPriority, () => {
  console.log('LowPriority', LowPriority)
})

simpleScheduler.scheduleCallback(NormalPriority, () => {
  console.log('NormalPriority', NormalPriority)
})

simpleScheduler.scheduleCallback(ImmediatePriority, () => {
  console.log('ImmediatePriority', ImmediatePriority)
})

