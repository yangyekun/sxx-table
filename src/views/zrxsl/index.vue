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
            <span class="point-label">逐日蓄水量</span>
            </div>
        </div>
        <div>
            <span>查询时间：</span>
            <DatePicker v-model="stm" dateFormat="yy-mm-dd" w-110px />
            <span>-</span>
            <DatePicker v-model="etm" dateFormat="yy-mm-dd" w-110px />
            <span ml-10px>查询时次：</span>
            <Select v-model="hour" :options="hourArr" optionLabel="label" optionValue="value" w-80px />

            <Button label="查询" size="small" @click="getList" :disabled="isLoading" ml-10px style="padding: 5px 25px;" />
            <Button label="清除缓存" size="small" severity="danger" @click="refresh" :loading="refreshLoading" ml-10px style="padding: 5px 25px;" />
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
            theme="legacy"
        >
        </ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { useToast } from 'primevue/usetoast';
import { waterStorageList, waterStorageRefresh } from '@/api/url';

defineOptions({
  name: 'zrxsl'
});

const toast = useToast();

const stm = ref('');
const etm = ref('');
const hour = ref(8);
let hourArr = [
    { label: '6时', value: 6 },
    { label: '8时', value: 8 },
];

let gridApi;
const tableData = ref([]);
const isLoading = ref(false);
const refreshLoading = ref(false);

const getList = () => {
    isLoading.value = true;

    let data = {
        stime: dayjs(stm.value).format('YYYY-MM-DD'),
        etime: dayjs(etm.value).format('YYYY-MM-DD'),
        hour: hour.value,
    };
    waterStorageList(data).then(res => {
        if (res.code === 0) {
            tableData.value = res.data;

            setTimeout(() => {
                gridApi && gridApi.sizeColumnsToFit();
            }, 50);
        }
        isLoading.value = false;
    }).catch(err => {
        isLoading.value = false;
        toast.error(err.message);
    });
}

const refresh = () => {
    refreshLoading.value = true;
    waterStorageRefresh({
        stime: dayjs(stm.value).format('YYYY-MM-DD'),
        etime: dayjs(etm.value).format('YYYY-MM-DD'),
        hour: hour.value,
    }).then(res => {
        if(res.code === 0) {
            getList();
            toast.add({severity: 'success', summary: '清除缓存成功', detail: '', group: 'tc', life: 3000});
        }
        refreshLoading.value = false;
    }).catch(err => {
        toast.error(err.message);
        refreshLoading.value = false;
    });
}

const handleExport = () => {
    let rowHeight = {};
    const config = {
        headers: column,
        data: tableData.value,
        fileName: '逐日蓄水量',
        headerDeep: 1,
    }
  
  // http://60.174.203.118:5233/export // 公司
  // http://10.34.1.25:5233/export // 省局
  axios.post('http://60.174.203.118:5233/export', config).then(res => {
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
};

// 初始化
const onGridReady = (params) => {
  gridApi = params.api
  gridApi.sizeColumnsToFit();
};

let columnDefs = ref([
    { field: 'time', headerName: '时间' },
    { field: 'largeReservoirStorage', headerName: '大型水库' },
    { field: 'largeReservoirCompare', headerName: '常年同期比较' },
    { field: 'mediumReservoirStorage', headerName: '中型水库' },
    { field: 'mediumReservoirCompare', headerName: '常年同期比较' },
    { field: 'smallReservoirStorage', headerName: '小型水库' },
    { field: 'smallReservoirCompare', headerName: '常年同期比较' },
    { field: 'lakeStorage', headerName: '湖泊' },
    { field: 'lakeCompare', headerName: '常年同期比较' },
    { field: 'riverStorage', headerName: '河道' },
    { field: 'riverCompare', headerName: '常年同期比较' },
    { field: 'totalStorage', headerName: '总计' },
    { field: 'totalCompare', headerName: '常年同期比较' },
]);

onMounted(() => {
  stm.value = dayjs().format("YYYY-MM-DD");
  etm.value = dayjs().format("YYYY-MM-DD");

  getList();
});

</script>

<style></style>