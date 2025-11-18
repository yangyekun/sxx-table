<template>
  <div>
    <!-- <span @click="handleClick()" text-red>{{props.params.data.stnm}}</span> -->
    <Button v-if="props.params.type.includes('测站')" :label="props.params.data.stnm" severity="info" size="small" text @click="handleClick()" />
    <Button v-if="props.params.type.includes('查看')" label="查看" severity="info" size="small" text @click="handleView()" />
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
  props.params.preSite(props.params.data)
}

const handleView = () => {
  props.params.preview(props.params.data)
}
</script>

<style scoped>

</style>