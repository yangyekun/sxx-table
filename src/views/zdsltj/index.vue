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
    <div class="page-main">
      <div flex-y-center mb-10px>
        <div class="point-title">
          <span class="point"></span>
          <span class="point-label">站点数量统计</span>
        </div>
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
import { ref, onMounted } from 'vue';
import { AgGridVue } from "ag-grid-vue3";
import { useToast } from 'primevue/usetoast';
import { getStationCount } from "@/api/url.js";

defineOptions({
  name: 'zdsltj'
})

const toast = useToast()

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
    { field: "unit", title: "单位", headerName: '单位' },
    { field: "rain1", title: "雨量", headerName: '雨量' },
    { field: "rain2", title: "雨量（卫星）", headerName: '雨量（卫星）' },
    { field: "water", title: "水位", headerName: '水位' },
    { field: "water2", title: "水位（卫星）", headerName: '水位（卫星）' },
    { field: "sq", title: "墒情", headerName: '墒情' },
    { field: "ll", title: "流量", headerName: '流量' },
    { field: "zf", title: "蒸发", headerName: '蒸发' },
  ];

  getList();
})

// 查询数据
const getList = () => {
  tableData.value = [];
  isLoading.value = true;

  getStationCount().then(res => {
    isLoading.value = false;
    if (res.code === 0) {
      const arr = Object.entries(res.data).map(([key, item]) => {
        // key 是对象的键名，item 是对象的值 (即 res.data[key])
        return {
          unit: key,
          rain1: item.雨量,
          rain2: item['雨量（卫星）'],
          water: item.水位,
          water2: item['水位（卫星）'],
          sq: item.墒情,
          ll: item.流量,
          zf: item.蒸发
        };
      });
      
      tableData.value = arr;

      setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 50);
    }
  })
}

// 初始化
const onGridReady = (params) => {
  gridApi = params.api
  gridApi.sizeColumnsToFit();
};


</script>

<style></style>