<script setup lang="tsx">
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import SvgIcon from './components/SvgIcon.tsx'
import SvgIcon2 from './components/SvgIcon.vue'
import Test from './pages/test.vue';

// import Star from 'shared/icons/send.svg?component'
// import Rose from 'shared/icons/rose.svg?component'
// import Tigger from 'shared/icons/tigger.svg?component'

// 使用 Glob 模式导入所有图标
// const icons = import.meta.glob('../../../packages/shared/icons/*.svg', { eager: true });
// console.log("🚀 ~ icons:", icons, HelloWorld)

// const IconComponent = (name: string) => icons[`../../../packages/shared/icons/${name}.svg`];


// const Star = IconComponent('send');
// const Rose = IconComponent('rose');
// const Tigger = IconComponent('tigger');

// const SvgIcon = (props) => {
//   const Icon = IconComponent(props.name);
//   return <el-icon {...props}>
//     <Icon ></Icon>
//   </el-icon>
// }

const showTest = ref(true);
</script>

<template>
  <div>
    <!-- <el-icon :size="20" color="#409eff">
      <Star />
    </el-icon>
    <el-icon :size="20" color="#409eff">
      <Rose class="rose" />
    </el-icon>
    <el-icon :size="20" color="red">
      <Tigger class="tigger" />
    </el-icon> -->

    <SvgIcon name="tigger" :size="100" color="red"/>
    <SvgIcon2 name="tigger" :size="100" color="red"/>

    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />

  <el-button @click="showTest = !showTest">toggle</el-button>

  <Test v-show="showTest"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
