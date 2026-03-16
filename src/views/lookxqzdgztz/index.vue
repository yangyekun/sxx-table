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
          <span class="point-label" style="color: #09090b;width: 140px">汛前重点工作台账</span>
          <select class="select-date" v-model="state.selectedWeek" @change="handleSelect" style="width: 150px">
            <option v-for="item in state.historyList" :value="item.key">{{ item.name }}</option>
          </select>
        </div>
        <div>
          <Button label="刷新" size="small" @click="getReportList"
                  style="padding: 5px 25px;color:#ffffff;margin-right: 10px;"/>
          <Button label="导出" size="small" @click="handleExport" severity="success"
                  style="padding: 5px 25px;color:#ffffff;"/>
        </div>
      </div>
    </div>
    <div class="page-table" style="background: transparent;padding: 0">
      <ag-grid-vue
          class="ag-theme-alpine"
          style="flex: 1;"
          :rowData="state.tableData"
          :columnDefs="state.columnDefs"
          @grid-ready="onGridReady"
          :defaultColDef="gridOptions.defaultColDef"
          :grid-options="gridOptions"
          tooltipShowDelay="0"
          theme="legacy">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import {useToast} from 'primevue/usetoast';
import {AgGridVue} from "ag-grid-vue3";
import {userid, reportList, listHistory} from "@/api/url.js";
import {column} from '@/utils/columnDefs.js'
import CustomTooltip from "@/views/xqzdgztz/customtooltip.js";

defineOptions({
  name: 'lookxqzdgztz'
})
const toast = useToast()
const state = reactive({
  historyList: [],
  tableData: [],
  columnDefs: [],
  historyIdList: [],
  msg: '',
  field: '',
  selectedWeek: '',
  active: 1,
  newData: {}
})
const handleExport = () => {
  let dataColumn = JSON.parse(JSON.stringify(state.columnDefs))
  const visibleColumns = dataColumn
      .map(item => ({...item, width: 20}));
  visibleColumns.forEach(item => {
    item.title = item.headerName
  })
  const config = {
    headers: visibleColumns.map(item => ({...item, width: 20})),
    data: state.tableData,
    headerDeep: 1,
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
      toast.add({severity: 'error', summary: '导出失败，请重试', detail: '', group: 'tc', life: 3000});
    }
  }).catch(err => {
    toast.add({severity: 'error', summary: '导出失败，请重试', detail: '', group: 'tc', life: 3000});
    console.log(err);
  })
}
const handleSelect = (e) => {
  let value = e.target.value
  for (let k in state.newData) {
    if (k === value) {
      state.tableData = state.newData[k]
    }
  }
}

const getField = (value) => {
  state.columnDefs.forEach(item => {
    if (item.title === value) {
      state.field = item.field
    }
  })
}

const getReportList = () => {
  // 获取本周一至本周末日期
  const stWeekDay = dayjs().day(1).format('YYYY-MM-DD')
  const edWeekDay = dayjs().day(7).format('YYYY-MM-DD')
  let day = stWeekDay + '~' + edWeekDay
  let userId= localStorage.getItem('userid');
  // let userId = `lutianqiang`
  // let userId = `zjt`
  // let userId = `hefei`
  state.historyList = []
  state.tableData = []
  state.columnDefs = column
  reportList(userId).then(res => {
    if (res.code === 0) {
      state.tableData = res.data
      state.newData = res.data
      getField(res.msg)
      for (let k in res.data) {
        state.tableData = res.data[k]
        state.historyList.push({
          key: k,
          name: dayjs(k.split('~')[0]).format('MM月DD日') + '-' + dayjs(k.split('~')[1]).format('MM月DD日'),
        })
      }
      state.historyList = state.historyList.reverse()
      state.historyList.forEach((item, index) => {
        item['index'] = index + 1
      })
      // 设置下拉框默认选中当前周
      state.selectedWeek = day
      state.columnDefs.forEach(item => {
        // 设置鼠标悬停提示
        item.tooltipValueGetter = tooltipValueGetter
      })
// 默认使用本周日期数据
      state.tableData = JSON.parse(JSON.stringify(res.data[day]))
      state.msg = res.msg
    }
  })
}
const  tooltipValueGetter = (params) => {
  state.tooltips = ''
  const excludedFields = ["sortOrder", "task", "taskDescription", "timeLimit", "responsiblePerson", "involvedDepartments"];
  if (!excludedFields.includes(params.colDef.field)) {
    if (state.historyIdList && Array.isArray(state.historyIdList)) {
      state.historyIdList.forEach(item => {
        if (item && item.id === params.data.id) {
          const fieldData = item[params.colDef.field]
          // 确保是数组且不为空
          if (fieldData && Array.isArray(fieldData) && fieldData.length > 0) {
            fieldData.forEach(i => {
              if (i) {
                state.tooltips += '修改人:' + (i.creatorId || '') +'<br>'+ '修改时间:' + (dayjs(i.updateTime).format('YYYY-MM-DD HH:mm')+'<br>'
                    || '')
              }
            })
          }
        }
      })
    }
    return state.tooltips
  }
}
const getHistoryData = () =>{
  listHistory().then(res=>{
    if(res.code === 0){
      state.historyIdList=res.data
    }
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
    tooltipComponent : CustomTooltip
  },
  tooltipMouseTrack: true,
  tooltipShowDelay: 500,  // 缩短延迟效果
  tooltipInteraction: true,
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
  getReportList()
  getHistoryData()
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