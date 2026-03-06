<template>
  <div class="page" style="padding: 0">
    <Toast position="top-center" group="tc">
      <template #container="{ message, closeCallback }">
        <div style="padding: 8px 15px;display: flex; align-items: center;">
<!--          <i class="pi pi-times-circle" style="color: 'var(&#45;&#45;p-red-500)'; margin-right: 5px;"></i>-->
          {{ message.summary }}
        </div>
      </template>
    </Toast>
    <div class="page-head" style="background: #ffffff;">
      <div flex-y-center style="display: flex;justify-content: space-between;align-items: center;width: 100%">
        <div class="point-title">
          <span class="point"></span>
          <span class="point-label" style="color: #09090b">汛前重点工作台账</span>
        </div>
        <div>
          <Button label="刷新" size="small" @click="getReportList" style="padding: 5px 25px;color:#ffffff;margin-right: 10px;" />
          <Button label="导出" size="small" @click="handleExport" severity="success" style="padding: 5px 25px;color:#ffffff;" />
        </div>
      </div>
    </div>
    <div class="page-table" style="background: transparent;padding: 0">
      <div class="page-table-list">
        <div>
          <select class="select-date" @change="handleSelect">
            <option v-for="item in state.yearList" :value="item.value">{{ item.lable }}</option>
          </select>
        </div>
        <div
            v-for="item in state.historyList"
            :key="item.index"
            @click="handleItemClick(item)"
            :class="{ active: state.active===item.index }"
        >
        {{item.name}}
        </div>
      </div>
      <ag-grid-vue
          class="ag-theme-alpine"
          style="flex: 1;"
          :rowData="state.tableData"
          :columnDefs="state.columnDefs"
          @grid-ready="onGridReady"
          :defaultColDef="gridOptions.defaultColDef"
          :grid-options="gridOptions"
          theme="legacy">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import dayjs from "dayjs";
import {useToast} from 'primevue/usetoast';
import {AgGridVue} from "ag-grid-vue3";
import {userid, reportList} from "@/api/url.js";
import {column} from '@/utils/columnDefs.js'
import axios from "axios";

defineOptions({
  name: 'lookxqzdgztz'
})
const toast = useToast()
const state = reactive({
  dateTime: '',
  yearList: [],
  historyList: [],
  tableData: [],
  columnDefs: [],
  msg: '',
  field: '',
  active:1,
  newData:{}
})
const handleExport = () => {
  let dataColumn=JSON.parse(JSON.stringify(state.columnDefs))
  const visibleColumns = dataColumn
      .map(item => ({...item, width: 20}));
  visibleColumns.forEach(item=>{
    item.title=item.headerName
  })
  const config = {
    headers: visibleColumns.map(item => ({...item, width: 20})),
    data: state.tableData,
    headerDeep:1,
    fileName: '汛前重点工作台账'
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
const handleSelect = (e) => {
  let year = e.target.value
}
// 列表点击事件
const handleItemClick = (data) => {
  state.dateTime = data.name
  state.active=data.index
  for (let k in state.newData){
    if(k===data.key){
      state.tableData=state.newData[k]
    }
  }
}

// 获取用户id
const getUserId = () => {
  let userId= localStorage.getItem('userid');
  // let userId = `lutianqiang`
  return
  userid(userId).then(res => {
    if (res.code === 0 && res.data.length) {
      console.log(res.data)
    }
  })
}

const getField = (value) => {
  state.columnDefs.forEach(item => {
    if (item.title === value) {
      state.field = item.field
    }
  })
}

const getReportList = () => {
  let userId= localStorage.getItem('userid');
  // let userId = `lutianqiang`
  // let userId = `hefei`
  state.historyList = []
  state.tableData = []
  state.columnDefs = column
  reportList(userId).then(res => {
    let columns = [
      {
        field: 'sq',
        title: '水情通信处',
        headerName: '水情通信处',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'hf',
        title: '合肥局',
        headerName: '合肥局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      }, {
        field: 'sz',
        title: '宿州局',
        headerName: '宿州局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'bb',
        title: '蚌埠局',
        headerName: '蚌埠局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'fy',
        title: '阜阳局',
        headerName: '阜阳局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'cz',
        title: '滁州局',
        headerName: '滁州局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'la',
        title: '六安局',
        headerName: '六安局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'mas',
        title: '马鞍山局',
        headerName: '马鞍山局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'wh',
        title: '芜湖局',
        headerName: '芜湖局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      },
      {
        field: 'hs',
        title: '黄山局',
        headerName: '黄山局',
        width: 300,
        editable: false,
        cellEditor: null,
        headerCellStyle: {textAlign: 'center'},
      }]
    state.columnDefs = [...state.columnDefs, ...columns]
    state.tableData = res.data
    state.newData=res.data
    getField(res.msg)
    for (let k in res.data) {
      state.tableData = res.data[k]
      state.historyList.push({
        key: k,
        name: dayjs(k.split('~')[0]).format('MM月DD日') + '-' + dayjs(k.split('~')[1]).format('MM月DD日'),
      })
    }
    state.historyList=state.historyList.reverse()
    state.historyList.forEach((item,index)=>{
      item['index']=index+1
    })
    // 使用第一个时期的数据作为基础数据
    const firstKey = Object.keys(res.data)[Object.keys(res.data).length-1]
    state.tableData = JSON.parse(JSON.stringify(res.data[firstKey]))
    // 为每条数据添加 index
    state.tableData.forEach((item, index) => {
      item['index'] = index + 1
    })
    state.msg = res.msg
    state.dateTime = state.historyList[0].name
  })
}
let gridApi;
const gridOptions = ref({
  defaultColDef: {
    // sortable: false,
    suppressSizeToFit: false,
    wrapText: true,
    autoHeight: true,
    editable: true,
    // filter: "agSetColumnFilter",
  },
})
// 初始化
const onGridReady = (params) => {
  gridApi = params.api
  // gridApi.sizeColumnsToFit();
};
onMounted(() => {
  state.stm = dayjs().add(-3, "d").format("YYYY-MM-DD");
  state.etm = dayjs().format("YYYY-MM-DD");
  state.sHour = state.eHour = dayjs().format("HH");
  // getUserId()
  const currentYear = dayjs().year()
  for (let year = 1950; year <= currentYear; year++) {
    state.yearList.push({
      value: year,
      lable: year + '年'
    })
  }
  state.yearList = state.yearList.reverse()
  getReportList()
})

</script>

<style>

.page-table {
  background: #09090b;
  display: flex;
  padding: 15px;
  overflow: hidden;
  height: 100%;
  border-radius: 5px;
}

.page-table-list {
  width: 200px;
  border-radius: 4px;
  background: #ffffff;
  margin-right: 10px;
  color: #09090b;
  padding: 10px
}

.page-table-list div {
  padding: 5px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}
.page-table-list div.active {
  background-color: #9DC8FD;
  //color: #cccccc;
}
.page-table-list div:hover {
  background-color: #f0f0f0;
}

.select-date {
  width: 100%;
  background: transparent;
  color: #09090b;
  height: 25px;
}
</style>