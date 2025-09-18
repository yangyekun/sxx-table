<template>
  <div class="page">
    <Toast position="top-center" group="tc">
      <template #container="{ message, closeCallback }">
        <div style="padding: 8px 15px;display: flex; align-items: center;">
          <i class="pi pi-times-circle" style="color: 'var(--p-red-500)'; margin-right: 5px;"></i>
          {{ message.summary }}
        </div>
      </template>
    </Toast>
    <Toast position="top-center" group="cg">
      <template #container="{ message, closeCallback }">
        <div style="padding: 8px 15px;display: flex; align-items: center;">
          <i class="pi pi-check" style="color: 'var(--p-red-500)'; margin-right: 5px;"></i>
          {{ message.summary }}
        </div>
      </template>
    </Toast>
    <ConfirmPopup></ConfirmPopup>
    <div class="page-head">
      <div class="point-title">
        <span class="point"></span>
        <span class="point-label">同步气象雨量数据记录</span>
      </div>
      <div>
        <Button label="刷新" size="small" @click="getList" :disabled="isLoading" style="padding: 5px 25px;" />
        <Button label="导出" size="small" severity="success" v-if="tableData.length" @click="handleExport" style="padding: 5px 25px;margin-left: 10px;"  />
      </div>
    </div>
    <div class="page-main">
      <ag-grid-vue
        class="ag-theme-alpine"
        style="flex: 1;"
        :rowData="tableData" 
        :columnDefs="columnDefs" 
        @grid-ready="onGridReady"
        :defaultColDef="defColOption"
        theme="legacy"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import dayjs from "dayjs";
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import { AgGridVue } from "ag-grid-vue3";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

defineOptions({
  name: 'index'
})

const tableData = ref([])
const columnDefs = ref([])
const isLoading = ref(false)

let gridApi;
const defColOption = {
  // sortable: false,
  // suppressSizeToFit: true,
  // wrapText: true, 
  // autoHeight: true,
  // editable: true,
  // filter: "agSetColumnFilter"
}

onMounted(() => {
  columnDefs.value = [
    { field: "index", title: "序号", headerName: '序号' },
    { field: "stcd", title: "站码", headerName: '站码' },
    { field: "stnm", title: "站名", headerName: '站名' },
    { field: "drpBefore", title: "同步前雨量", headerName: '同步前雨量' },
    { field: "drpAfter", title: "序同步后雨量号", headerName: '同步后雨量' },
    { field: "tm", title: "雨量时间", headerName: '雨量时间' },
    { field: "operationTime", title: "操作时间", headerName: '操作时间' },
  ];
})

// 查询数据
const getList = async () => {
  tableData.value = [];
  isLoading.value = true;
  let data = {
    stm: '2025-09-15 00:00',
    etm: '2025-09-18 16:00'
  }

  axios.get(`http://10.34.1.25:8010/cj/water/selectQXRainSyc?stm=${data.stm}&etm=${data.etm}`).then(res => {
    isLoading.value = false;
    if(res.data.code === 0) {
      tableData.value = res.data.data.map((item, idx) => ({
        ...item,
        index: idx + 1
      }));
      setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 0);
    }
  });
}
getList()

const handleExport = () => {
  const config = {
    headers: columnDefs.value.map(item => ({...item, width: 20})),
    data: tableData.value,
    headerDeep:1,
    fileName: '同步气象雨量数据记录'
  };

  // http://60.174.203.118:5233/export // 公司
  // http://10.34.1.25:5233/export // 省局
  axios.post('http://10.34.1.25:5233/export', config).then(res => {
    if (res.data.code === 0) {
      const a = document.createElement('a')
      a.href = res.data.data;
      a.click();
    } else {
      toast.add({ severity: 'error', summary: '导出失败，请重试', detail: '', group: 'tc', life: 3000 });
    }
  }).catch(err => {
    toast.add({ severity: 'error', summary: '导出失败，请重试', detail: '', group: 'tc', life: 3000 });
    console.log(err);
  })
}

// 初始化
const onGridReady = (params) => {
  gridApi = params.api
  gridApi.sizeColumnsToFit();
};

</script>

<style>
.ag-cell {
  text-align: center;
  white-space: normal !important;  /* 允许文本换行 */
  word-wrap: break-word;           /* 自动换行 */
}
.text-red {
  color: red;
}
.dialogForm .t2 {
  font-weight: 400;
}

.w285 {
  width: 285px;
}
</style>
