<script setup lang="tsx">
import { defineProps, computed } from "vue";
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
}) as Record<string, DefineComponent<SvgIconProps>>;
console.log('🚀 ~ icons2:', icons)

const props = defineProps<SvgIconProps>();

const IconComponent = icons[`../../../../packages/shared/icons/${props.name}.svg`]
</script>

<template>
  <el-icon>
    <IconComponent></IconComponent>
     <!-- <component :is="IconComponent"></component> -->
  </el-icon>
</template>