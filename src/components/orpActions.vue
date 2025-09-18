<template>
  <div class="orpType">
    <Button v-if="props.params.data.index != '注' && props.params.data.index" label="编辑" severity="info" size="small" text @click="handleView()" />
    <Button v-if="props.params.data.index != '注' && props.params.data.index" label="删除" severity="danger" size="small" text @click="handleRemove()" />
  </div>
</template>

<script setup>
defineOptions({
  name: 'orpActions'
})

const props = defineProps({
  params: {
    type: Object,
     default: () => {}
  },
})

const handleView = () => {
  props.params.params.view(props.params.data)
}

const handleRemove = () => {
  props.params.params.remove(props.params.data)
}

</script>

<style scoped>

</style>