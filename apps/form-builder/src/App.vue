<script setup lang="tsx">
import { computed, h, reactive, ref, useTemplateRef } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
// 方式一
// import FormBuilder from './components/form-builder/index.vue'
// 方式二
import { useFormBuilder } from './components/form-builder'
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

const formInstance = useTemplateRef<FormInstance>('formRef')
const formData = ref({
  name: 'vben',
  age: 18,
  sex: 1,
})
console.log('🚀 ~ HelloWorld :', HelloWorld, formInstance)

const formItems = [
  {
    field: 'name',
    component: 'input',
    label: '姓名',
    placeholder: '请输入姓名',
    span: 12,
    onChange(value: any) {
      console.log('value change', value)
    },
  },
  {
    field: 'age',
    component: h('input', { style: { width: '200px' } }), // 自定义组件 01 component可为组件类型、函数、对象、组件
    // component: HelloWorld, // 自定义组件 02
    label: '年龄',
    onClick() {
      console.log('点击了')
    },
  },
  {
    field: 'sex',
    component: 'select',
    label: '性别',
    // placeholder: '请选择性别', // 方式一
    props: {
      // 方式二
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ],
    },
  },
]

// const formItems = computed(() =>
//   [
//     {
//       field: 'name',
//       type: 'input',
//       // component: 'input',
//       label: '姓名',
//       hidden: formData.value.name === '李华', // 因为此处是动态的，故使用computed包裹formItems
//       placeholder: 'Please input'
//     },
//     {
//       field: 'age',
//       type: 'input',
//       label: '年龄',
//       placeholder: '请输入年龄'
//     },
//     {
//       field: 'sex',
//       type: 'select',
//       label: '性别',
//       // placeholder: '请选择性别', // 方式一
//       props: { // 方式二
//         placeholder: '请选择性别',
//         options: [
//           { label: '男', value: 1 },
//           { label: '女', value: 2 }
//         ]
//       },
//       // slots: {
//       //   default: () => <div>自定义插槽</div>
//       // }
//     }
//   ]
// )

const rules: Partial<Record<string, Arrayable<FormItemRule>>> | undefined = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, type: 'number', message: '请输入年龄' }],
  sex: [{ required: true, message: '请输选择性别' }],
}

const { FormBuilder, validate } = useFormBuilder({
  formItems,
  rules,
  modelValue: formData.value,
})

const onSubmit = async () => {
  console.log(
    '🚀 ~ formInstance.value.validate ~ formInstance:',
    formInstance.value,
  )
  // await formInstance.value?.validate()
  await validate()
  console.log('校验成功', formData)
}

</script>

<template>
  <div>
    <FormBuilder
      ref="formRef"
      v-model="formData"
      :formItems="formItems"
      :rules="rules"
      :inline="true"
    >
      <!-- <template #age>
        <el-input placeholder="请输入年龄" />
      </template> -->
      <!-- <template #submit>
      </template> -->
    </FormBuilder>
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped></style>
