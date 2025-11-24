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
    <div class="page-head">
      <div flex-y-center>
        <div class="point-title">
          <span class="point"></span>
          <span class="point-label">逐日总蓄水</span>
        </div>
      </div>
      <div>
        <span>查询时间：</span>
        <DatePicker v-model="stm" dateFormat="yy-mm-dd" w-110px />
        <Select v-model="sHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />
        <span>-</span>
        <DatePicker v-model="etm" dateFormat="yy-mm-dd" w-110px />
        <Select v-model="eHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />

        <Button label="查询" size="small" @click="getList" :disabled="isLoading" ml-10px style="padding: 5px 25px;" />
        <Button label="导出" size="small" severity="success" v-if="tableData.length" @click="handleExport" ml-10px style="padding: 5px 25px;"  />
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
import { AgGridVue } from "ag-grid-vue3";
import { hourArr } from "@/utils/index.js";
import { useToast } from 'primevue/usetoast';
import { getTotalW } from "@/api/url.js";

defineOptions({
  name: 'zrzxs'
})

const toast = useToast()

const stm = ref('')
const sHour = ref('08')
const etm = ref('')
const eHour = ref('08')

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
  stm.value = dayjs().add(-7, "d").format("YYYY-MM-DD");
  etm.value = dayjs().format("YYYY-MM-DD");
  // sHour.value = eHour.value = dayjs().format("HH");

  columnDefs.value = [
    { field: "index", title: "序号", headerName: '序号' },
    { field: "stnm", title: "站名", headerName: '站名' },
    { field: "tm", title: "时间", headerName: '时间' },
    { field: "w", title: "全省总蓄水", headerName: '全省总蓄水' },
    { field: "compare", title: "与常年同期比成", headerName: '与常年同期比成' }
  ];

  getList();
})

const getList = () => {
  isLoading.value = true;
  let params = {
    stime: dayjs(stm.value).format("YYYY-MM-DD ") + `${sHour.value}:00`,
    etime: dayjs(etm.value).format("YYYY-MM-DD ") + `${eHour.value}:00`,
  }

  getTotalW(params).then(res => {
    isLoading.value = false

    if (res.code === 0) {
      tableData.value = res.data && res.data.map((item, index) => ({
        ...item,
        index: index + 1
      }));

      setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 50);
    }
  })
}

const handleExport = () => {
  const config = {
    headers: columnDefs.value.map(item => ({...item, width: 20})),
    data: tableData.value,
    headerDeep:1,
    fileName: '逐日总蓄水'
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

<style></style>