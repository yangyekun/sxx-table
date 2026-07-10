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
      <div>
        <span>查询时间：</span>
        <DatePicker v-model="stm" dateFormat="yy-mm-dd" w-110px />
        <Select v-model="sHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />
        <span>-</span>
        <DatePicker v-model="etm" dateFormat="yy-mm-dd" w-110px ml-10px />
        <Select v-model="eHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />

        <span m-x-5px>时间类型：</span>
        <Select v-model="timeType" :options="timeTypeList" optionLabel="" optionValue="" w-110px />
        <span m-x-5px>库湖类型：</span>
        <Select v-model="stationType" :options="stationTypeList" optionLabel="" optionValue="" w-110px />

        <Button label="查询" size="small" @click="getList" :disabled="isLoading" ml-10px style="padding: 5px 25px;" />
        <Button label="导出" size="small" severity="success" v-if="tableData.length" @click="handleExport" ml-10px style="padding: 5px 25px;"  />
      </div>
    </div>

    <div class="page-main">
      <div flex-between mb-10px>
        <div class="point-title">
          <span class="point"></span>
          <span class="point-label">库湖最大拦蓄水量</span>
        </div>
        <div>单位：水位（米），蓄水量（百万立方米）</div>
      </div>
      
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
import { hourArr } from "@/utils/index.js";
import { useToast } from 'primevue/usetoast';
import { AgGridVue } from "ag-grid-vue3";

import { getMaxMinWDiff, getMaxMinWDiffRule } from "@/api/url.js";


defineOptions({
  name: 'khzdlxsl'
})

const toast = useToast()

const stm = ref('')
const sHour = ref('08')
const etm = ref('')
const eHour = ref('08')

const stationTypeList = ref('')
const timeTypeList = ref('')
const stationType = ref('')
const timeType = ref('任意时间')
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
  stm.value = dayjs().add(-3, "d").format("YYYY-MM-DD");
  etm.value = dayjs().format("YYYY-MM-DD");
  sHour.value = eHour.value = dayjs().format("HH");

  columnDefs.value = [
    { field: "index", title: "序号", headerName: '序号' },
    { field: "stcd", title: "站码", headerName: '站码' },
    { field: "stnm", title: "站名", headerName: '站名' },
    { field: "rvnm", title: "河名", headerName: '河名' },
    { field: "cityName", title: "市名", headerName: '市名' },
    { field: "startTime", title: "开始时间", headerName: '开始时间' },
    { field: "endTime", title: "结束时间", headerName: '结束时间' },
    { field: "maxZ", title: "最大水位", headerName: '最大水位' },
    { field: "minZ", title: "最小水位", headerName: '最小水位' },
    { field: "maxW", title: "最大水位对应蓄量", headerName: '最大水位对应蓄量' },
    { field: "minW", title: "最小水位对应蓄量", headerName: '最小水位对应蓄量' },
    { field: "diffW", title: "蓄量差", headerName: '蓄量差' },
  ];

  init()
})

const init = () => {
  getMaxMinWDiffRule().then(res => {
    if(res.code === 0) {
      stationTypeList.value = res.data.stationType;
      stationType.value = stationTypeList.value[0];

      timeTypeList.value = res.data.timeType;

      getList();
    }
  })
}

const getList = () => {
  let stime = dayjs(stm.value).format("YYYY-MM-DD ") + `${sHour.value}:00`;
  let etime = dayjs(etm.value).format("YYYY-MM-DD ") + `${eHour.value}:00`;

  getMaxMinWDiff({ stime, etime, stationType: stationType.value, timeType: timeType.value }).then(res => {
    if(res.code === 0) {
      tableData.value = res.data && res.data.map((item, index) => ({
        ...item,
        index: index + 1
      }));

      setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 50);
    }
  });
}

const handleExport = () => {
  const config = {
    headers: columnDefs.value.map(item => ({...item, width: 20})),
    data: tableData.value,
    headerDeep:1,
    fileName: '库湖最大拦蓄水量'
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
