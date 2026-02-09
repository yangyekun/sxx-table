<template>
  <div class="orpType">
    <Button v-if="params.type.includes('批准')" label="批准" severity="success" size="small" text @click="handleApprove()" />
    <Button v-if="params.type.includes('拒绝')" label="拒绝" severity="danger" size="small" text @click="handleReject()" />
    <Button v-if="params.type.includes('错误修改')" label="错误修改" severity="info" size="small" text @click="handleModify()" />
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
  props.params.params.approve(props.params.data, props.params.isSecondCheck)
}

const handleReject = () => {
  props.params.params.reject(props.params.data, props.params.isSecondCheck)
}

const handleModify = () => {
  props.params.params.modify(props.params.data, props.params.isSecondCheck)
}


</script>

<style scoped>

</style>