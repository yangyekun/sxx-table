<template>
  <div class="orpType">
    <Button label="批准" severity="success" size="small" text @click="handleApprove()" />
    <Button label="拒绝" severity="danger" size="small" text @click="handleReject()" />
  </div>
</template>

<script setup>
defineOptions({
  name: 'btnActions'
})

const props = defineProps({
  params: {
    type: Object,
     default: () => {}
  },
})

const handleApprove = () => {
  props.params.params.approve(props.params.data)
}

const handleReject = () => {
  props.params.params.reject(props.params.data)
}

</script>

<style scoped>

</style>