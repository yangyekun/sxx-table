<template>
  <div>
    <!-- <span @click="handleClick()" text-red>{{props.params.data.stnm}}</span> -->
    <Button :label="props.params.data.stnm" severity="info" size="small" text @click="handleClick()" />
  </div>
</template>

<script setup>

defineOptions({
  name: 'textActions'
})

const props = defineProps({
  params: {
    type: Object,
     default: () => {}
  },
})

const handleClick = () => {
  props.params.preview(props.params.data)
}

</script>

<style scoped>

</style>