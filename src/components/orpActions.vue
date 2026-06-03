<template>
  <div class="orpType">
    <Button v-if="props.params.data.index != '注' && props.params.data.index && props.params.permission.includes('edit')" label="编辑" severity="info" size="small" text @click="handleEdit()" />
    <Button v-if="props.params.data.index != '注' && props.params.data.index && props.params.permission.includes('remove')" label="删除" severity="danger" size="small" text @click="handleRemove()" />
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

const handleEdit = () => {
  props.params.edit(props.params.data)
}

const handleRemove = () => {
  props.params.remove(props.params.data)
}

</script>

<style scoped>

</style>