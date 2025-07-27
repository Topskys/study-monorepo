<script setup lang="ts">
import { ref } from 'vue';
import { useEventListener } from '../hooks/useEventListener';

const boxRef = ref<HTMLDivElement | null>(null);

const close = useEventListener('mousemove', ()=>{
    console.log('mousemove');
});

// useEventListener(boxRef, 'mouseenter', ()=>{
//     console.log('mouseenter');
// });

useEventListener(boxRef, 'mousemove', ()=>{
    console.log('mousemove');
});

setTimeout(()=>{
    close();
}, 2000);

</script>

<template>
    <div class="box w-[200px] h-[200px] bg-amber text-center line-height-[200px]" ref="boxRef">
        useEventListener
    </div>
</template>

<style scoped></style>