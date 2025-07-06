import type { FormRules } from "element-plus"
import type { Component, VNode } from "vue"

// 定义选项类型
export interface Option {
  label: string
  value: any
  disabled?: boolean
  [key: string]: any
}

// 扩展属性类型，支持事件处理器和任意属性
export interface PropConfig {
  placeholder: string
  disabled: boolean
  options: Option[]
  value: any
  label: string
  span: number
  rules: any[]
  // 允许任意属性，包括其他事件处理器和组件特定属性
  [key: string]: any
}

// 定义表单项类型
export interface FormItem extends Partial<PropConfig> {
  field: string
  component?: ComponentKey | string | Component | VNode | Function
  label?: string
  hidden?: boolean
  props?: Partial<PropConfig>
}

// 定义组件 props 类型
export interface Props {
  formItems: FormItem[]
  rules?: FormRules
  inline?: boolean
  modelValue?: Record<string, any>
}