<script setup lang="ts">
import { computed, useTemplateRef, type Component } from 'vue'
import {
  ElInput,
  ElSelect,
  ElCheckbox,
  ElRadio,
  ElForm,
  ElRow,
  ElCol,
  ElFormItem,
  type FormInstance,
} from 'element-plus'
import type { FormItem, PropConfig, Props } from './type';

// 定义组件映射类型
const componentMap = {
  input: ElInput,
  select: ElSelect,
  checkbox: ElCheckbox,
  radio: ElRadio,
} as const

export type ComponentKey = keyof typeof componentMap

// 定义 props 并提供默认值
const props = withDefaults(defineProps<Props>(), {
  formItems: () => [],
  rules: () => ({}),
  inline: false,
})

// 定义 model 类型，使用 Record 来表示动态对象
const modelValue = defineModel<Record<string, any>>({
  default: () => ({}),
})
// 模板引用
const formInstance = useTemplateRef<FormInstance>('formRef')

// 过滤隐藏的表单项
const filterItems = computed<FormItem[]>(() =>
  props.formItems.filter((item) => !item.hidden),
)

// 根属性列表 - 这些属性不应该传递给组件
const rootProps: (keyof FormItem)[] = ['field', 'label', 'component', 'hidden']

// 工具函数：排除指定的键
const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const newObj = { ...obj }
  keys.forEach((key) => delete newObj[key])
  return newObj
}

function getProps(item: FormItem): Partial<PropConfig> {
  if (item.props) {
    return item.props
  }
  return omit(item, rootProps)
}

// 动态获取组件
const getComponent = (item: FormItem): Component => {
  const { component } = item

  // component 是函数或对象时，直接返回（组件）
  if (component && typeof component !== 'string') {
    return component as Component
  }

  // 如果是字符串且在 componentMap 中存在，返回对应组件
  if (typeof component === 'string' && component in componentMap) {
    return componentMap[component as ComponentKey]
  }

  // 默认返回 input 组件
  return componentMap.input
}

// 表单验证方法
const validate = (...args: Parameters<FormInstance['validate']>) => {
  return formInstance.value?.validate(...args)
}

// 重置表单方法
const resetFields = () => {
  formInstance.value?.resetFields()
}

// 清空验证方法
const clearValidate = (props?: string | string[]) => {
  formInstance.value?.clearValidate(props)
}

// 暴露方法
defineExpose({
  validate,
  resetFields,
  clearValidate,
  formInstance,
})
</script>

<template>
  <el-form ref="formRef" :model="modelValue" :rules="rules" :inline="!inline">
    <!-- 网格布局模式 -->
    <el-row v-if="inline" :gutter="16">
      <el-col
        v-for="item in filterItems"
        :key="item.field"
        :span="item.span || 24"
      >
        <el-form-item :prop="item.field" :label="item.label">
          <slot :name="item.field" :item="item" :model="modelValue">
            <component
              :is="getComponent(item)"
              v-bind="getProps(item)"
              v-model="modelValue[item.field]"
            />
          </slot>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 垂直布局模式 -->
    <template v-else>
      <el-form-item
        v-for="item in filterItems"
        :key="item.field"
        :prop="item.field"
        :label="item.label"
      >
        <slot :name="item.field" :item="item" :model="modelValue">
          <component
            :is="getComponent(item)"
            v-bind="getProps(item)"
            v-model="modelValue[item.field]"
          />
        </slot>
      </el-form-item>
    </template>
  </el-form>
</template>

<style lang="sass" scoped></style>
