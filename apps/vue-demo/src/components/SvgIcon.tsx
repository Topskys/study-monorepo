import type { DefineComponent } from 'vue'

interface SvgIconProps {
  name: string
  // 可以添加其他属性，这些属性将被传递给 <el-icon> 组件
  [key: string]: any
}

type SvgIconMap = {
  [key: string]: DefineComponent<SvgIconProps>
}

const icons = import.meta.glob('../../../../packages/shared/icons/*.svg', {
  eager: true,
}) as SvgIconMap
console.log('🚀 ~ icons:', icons)

const getIconComponent = (name: string): DefineComponent<SvgIconProps> => {
  return icons[`../../../../packages/shared/icons/${name}.svg`]
}

export default function SvgIcon(props: SvgIconProps) {
  const IconComponent = getIconComponent(props.name)
  return (
    <el-icon {...props}>
      <IconComponent></IconComponent>
    </el-icon>
  )
}
