import { h, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import FormBuilder from './index.vue'
import type { Props } from './type'

export const useFormBuilder = (props: Props) => {
  const formRef = ref()

  const Component = (_: any, { slots }: { slots: any }) => {
    // 此处ref、computed （.value）不会自动解包，因为props不在是template中使用，而是h，可使用reactive包裹解决
    return h(FormBuilder, { ...reactive(props), ref: formRef }, slots)
  }

  // 表单验证方法
  const validate = (...args: Parameters<FormInstance['validate']>) => {
    return formRef.value?.validate(...args)
  }

  return {
    FormBuilder: Component,
    validate,
  }
}

export { FormBuilder }
export default FormBuilder
