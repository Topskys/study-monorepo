import {
  onScopeDispose,
  onUnmounted,
  unref,
  watch,
  type MaybeRefOrGetter,
} from 'vue'

// 定义事件目标类型
export type EventTarget = HTMLElement | Window | Document | null | undefined

// 定义不同事件映射的联合类型
export type EventMap = HTMLElementEventMap & WindowEventMap & DocumentEventMap

/**
 * 事件监听器参数类型
 */
export type EventListenerArgs<T extends keyof EventMap> =
  | [
      element: MaybeRefOrGetter<EventTarget | null | undefined>,
      type: T,
      listener: (event: EventMap[T]) => void,
      options?: AddEventListenerOptions | boolean,
    ]
  | [
      type: T,
      listener: (event: EventMap[T]) => void,
      options?: AddEventListenerOptions | boolean,
    ]

// Window 事件的参数类型
export type WindowEventArgs<K extends keyof WindowEventMap> =
  | [
      element: MaybeRefOrGetter<Window | null | undefined>,
      type: K,
      listener: (event: WindowEventMap[K]) => void,
      options?: AddEventListenerOptions | boolean,
    ]
  | [
      type: K,
      listener: (event: WindowEventMap[K]) => void,
      options?: AddEventListenerOptions | boolean,
    ]

// Document 事件的参数类型
export type DocumentEventArgs<K extends keyof DocumentEventMap> =
  | [
      element: MaybeRefOrGetter<Document | null | undefined>,
      type: K,
      listener: (event: DocumentEventMap[K]) => void,
      options?: AddEventListenerOptions | boolean,
    ]
  | [
      type: K,
      listener: (event: DocumentEventMap[K]) => void,
      options?: AddEventListenerOptions | boolean,
    ]

// HTMLElement 事件的参数类型
export type HTMLElementEventArgs<K extends keyof HTMLElementEventMap> =
  | [
      element: MaybeRefOrGetter<HTMLElement | null | undefined>,
      type: K,
      listener: (event: HTMLElementEventMap[K]) => void,
      options?: AddEventListenerOptions | boolean,
    ]
  | [
      type: K,
      listener: (event: HTMLElementEventMap[K]) => void,
      options?: AddEventListenerOptions | boolean,
    ]

// 通用事件参数类型
export type GenericEventArgs =
  | [
      element: MaybeRefOrGetter<EventTarget | null | undefined>,
      type: string,
      listener: (event: Event) => void,
      options?: AddEventListenerOptions | boolean,
    ]
  | [
      type: string,
      listener: (event: Event) => void,
      options?: AddEventListenerOptions | boolean,
    ]

// 重载签名：支持 Window 事件
export function useEventListener<K extends keyof WindowEventMap>(
  ...args: WindowEventArgs<K>
): () => void

export function useEventListener<K extends keyof DocumentEventMap>(
  ...args: DocumentEventArgs<K>
): () => void

export function useEventListener<K extends keyof HTMLElementEventMap>(
  ...args: HTMLElementEventArgs<K>
): () => void

export function useEventListener<K extends keyof EventMap>(
  ...args: EventListenerArgs<K>
): () => void

export function useEventListener(...args: GenericEventArgs): () => void

/**
 * 添加事件监听器的组合式函数
 *
 * @param args - 事件监听器参数
 * @returns 移除事件监听器的函数
 *
 * @example
 * // 监听 window 事件
 * useEventListener(window, 'resize', () => {})
 *
 * @example
 * // 简化语法，默认监听 window
 * useEventListener('resize', () => {})
 *
 * @example
 * // 监听元素事件
 * const elementRef = ref<HTMLElement>()
 * useEventListener(elementRef, 'click', (e) => {})
 *
 * @example
 * // 手动清理
 * const cleanup = useEventListener('scroll', () => {})
 * setTimeout(cleanup, 1000)
 */
export function useEventListener(...args: any[]) {
  const element = typeof args[0] === 'string' ? window : args.shift()

  let off = () => {}

  const stop = watch(
    () => unref(element),
    (el) => {
      // 移除之前的监听器
      off()
      // 添加新的监听器
      if (!el) return
      el.addEventListener(...args)
      // 保存移除监听器的函数
      off = () => el.removeEventListener(...args)
    },
    {
      immediate: true,
    },
  )

  const dispose = () => {
    off()
    stop()
  }

  /**
   * 卸载事件方式一
   */
    // onUnmounted(() => {
    //   off();
    // });

  /**
   * 卸载事件方式二
   *
   * 不在组件中使用时的卸载，避免使用onUnmounted卸载
   */
  onScopeDispose(() => {
    console.log("🚀 ~ onScopeDispose ~ onScopeDispose:", ...args)
    dispose()
  })

  /**
   * 卸载事件方式三
   *
   * 可在组件或非组件手动卸载
   * @example
   * const close = useEventListener(window, 'resize', () => {})
   * setTimeout(close, 1000); // 1秒后卸载事件监听
   */
  return dispose;
}
