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
          <span class="point-label">大中型水库超特征水位</span>
        </div>
      </div>
      <div flex-y-center>
        <div flex justify-center gap-4 mr-10px>
            <div v-for="category of stationTypes" :key="category.code" class="flex items-center gap-2">
                <Checkbox v-model="stationType" :inputId="category.code" name="category" :value="category.name" />
                <label :for="category.code">{{ category.name }}</label>
            </div>
        </div>
        <span>查询时间：</span>
        <DatePicker v-model="stm" dateFormat="yy-mm-dd" w-110px />
        <Select v-model="sHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />
        <span>-</span>
        <DatePicker v-model="etm" dateFormat="yy-mm-dd" w-110px ml-10px />
        <Select v-model="eHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />

        <Button label="查询" size="small" @click="getList" :disabled="isLoading" style="padding: 5px 25px;" />
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
import { AgGridVue } from "ag-grid-vue3";
import { useToast } from 'primevue/usetoast';
import {hourArr} from "@/utils/index.js";
import {getRsvrFeatureLevel} from "@/api/url.js";

defineOptions({
  name: 'dzxskctzsw'
})

const toast = useToast()

const stm = ref('')
const sHour = ref('08')
const etm = ref('')
const eHour = ref('08')
const stationType = ref(['大型水库', '中型水库'])
const stationTypes = ref([
    { name: '大型水库', code: '大型水库' },
    { name: '中型水库', code: '中型水库' }
])

let gridApi;
const defColOption = {
  // sortable: false,
  // suppressSizeToFit: true,
  // wrapText: true, 
  // autoHeight: true,
  // editable: true,
  // filter: "agSetColumnFilter"
}

const tableData = ref([])
const isLoading = ref(false)

const getList = () => {
    let params = {
        btime: dayjs(stm.value).format("YYYY-MM-DD ") + `${sHour.value}:00`,
        etime: dayjs(etm.value).format("YYYY-MM-DD ") + `${eHour.value}:00`,
        stationType: stationType.value.join(',')
    };
    getRsvrFeatureLevel(params).then(res => {
        if(res.code === 0) {
            tableData.value = res.data;

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
    fileName: '大中型水库超特征水位'
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

let columnDefs = ref([
    {headerName: '站码', field: 'stcd', minWidth: 100},
    {headerName: '站名', field: 'stnm', minWidth: 100},
    {headerName: '站点类型', field: 'stationType', minWidth: 100},
    {headerName: '最高水位(m)', field: 'maxZ', minWidth: 100},
    {headerName: '最高水位时间', field: 'maxTm', minWidth: 150},
    {headerName: '正常蓄水位(m)', field: 'normalZ', minWidth: 100},
    {headerName: '超正常蓄水位', field: 'overNormalZ', minWidth: 120},
    {headerName: '汛限水位(m)', field: 'floodLimitZ', minWidth: 120},
    {headerName: '超汛限水位', field: 'overFloodLimitZ', minWidth: 120},
    {headerName: '超特征类型', field: 'overType', minWidth: 110}
]);

onMounted(() => {
    stm.value = dayjs().add(-3, "d").format("YYYY-MM-DD");
    etm.value = dayjs().format("YYYY-MM-DD");
    
    getList();
});
</script>

<style></style>