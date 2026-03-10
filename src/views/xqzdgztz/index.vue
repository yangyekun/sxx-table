<template>
  <div class="page" style="padding: 0;">
    <Toast position="top-center" group="tc" style="margin-top: 80px">
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
          <span class="point-label" style="color: #09090b;width: 140px">汛前重点工作填报</span>
          <select class="select-date" @change="handleSelect" style="width: 150px">
            <option v-for="item in state.historyList" :value="item.key">{{ item.name }}</option>
          </select>
          <span class="point-label" style="color:red;margin-left: 20px;font-size: 12px">提示：仅限填报本周及本周之后工作任务（可多次填报），历史数据不可修改。</span>
        </div>
        <div>
          <Button label="刷新" size="small" @click="getReportList" style="padding: 5px 25px;color:#ffffff;margin-right: 10px;" />
          <Button label="导出" size="small" @click="handleExport" severity="success" style="padding: 5px 25px;color:#ffffff;" />
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
          theme="legacy">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive,h} from 'vue';
import dayjs from "dayjs";
import {useToast} from 'primevue/usetoast';
import {AgGridVue} from "ag-grid-vue3";
import {userid, submit, reportList,listHistory} from "@/api/url.js";
import {column} from '@/utils/columnDefs.js'
import axios from "axios";
import CustomTooltip from "./customtooltip.js"
defineOptions({
  name: 'sxxtb'
})

const toast = useToast()
const state = reactive({
  check: false,
  dateTime: '',
  historyList: [],
  historyIdList: [],
  tableData: [],
  columnDefs: [],
  newData: [],
  msg: '',
  field: '',
  timeShow:false,
  tooltips:''
})
//  导出
const handleExport = () => {
  let dataColumn=JSON.parse(JSON.stringify(state.columnDefs))
  const visibleColumns = dataColumn
      .filter(item => !item.hide)  // 👈 过滤掉隐藏的列
      .map(item => ({...item, width: 20}));
  visibleColumns.forEach(item=>{
    item.title=item.headerName
  })
  const config = {
    headers: visibleColumns.map(item => ({...item, width: 20})),
    data: state.tableData,
    headerDeep:1,
    fileName: '汛前重点工作填报'
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
// 下拉选择事件
const handleSelect = (e) =>{
  let value =e.target.value
  for (let k in state.newData){
    if(k===value){
      state.tableData=state.newData[k]
    }
  }
  // 所选日期时间戳
  let st = dayjs(value.split('~')[0]).startOf('day').valueOf()
  // 获取本周一时间戳
  const currentWeekStart = dayjs().day(1).startOf('day').valueOf()
  if (st < currentWeekStart) {
    state.timeShow=false
    console.log('这是历史周次，不可编辑')
  } else {
    state.timeShow=true
    console.log('这是本周，可以编辑')
  }
  // 动态处理对应局是否可修改历史数据
  state.columnDefs.forEach(item=>{
    if (item.field === state.field) {
      item.editable = state.timeShow
    }
  })
}
// 修改填报内容
const saveDataToBackend = (params) => {
  // let userId = localStorage.getItem('userid');
  // let userId =`lutianqiang`
  let userId =`zjt`
  let form = {
    userId: userId,
    id: params.id,
    sq: params.sq || '',
    hf: params.hf || '',
    sz: params.sz || '',
    bb: params.bb || '',
    fy: params.fy || '',
    cz: params.cz || '',
    la: params.la || '',
    mas: params.mas || '',
    wh: params.wh || '',
    aq: params.aq || '',
    hs: params.hs || ''
  }
  submit(form).then(res => {
    if (res.code === 0) {
      getReportList()
      toast.add({severity: 'success', summary: res.data, detail: '', group: 'tc', life: 3000});
    } else {
      toast.add({severity: 'error', summary: res.data, detail: '', group: 'tc', life: 3000});
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
// 调用列表接口
const getReportList = () => {
  // 获取本周一至本周末日期
  const stWeekDay = dayjs().day(1).format('YYYY-MM-DD')
  const edWeekDay = dayjs().day(7).format('YYYY-MM-DD')
  let day = stWeekDay+'~'+edWeekDay
  // let userId= localStorage.getItem('userid');
  // let userId = `lutianqiang`
  let userId = `zjt`
  // let userId = `hefei`
  state.historyList = []
  state.tableData = []
  state.columnDefs = column
  reportList(userId).then(res => {
    if(res.code === 0){
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
      // 默认使用本周日期数据
      state.tableData = JSON.parse(JSON.stringify(res.data[day]))
      state.msg = res.msg
      state.dateTime = state.historyList[0].name
      state.columnDefs.forEach(item => {
        // 设置鼠标悬停提示
        item.tooltipValueGetter=tooltipValueGetter
        if (item.title === res.msg) {
          // 默认不可编辑
          item.editable = false
          // 省局账号（sj、zjt、mh）可以修改水情通信处
          if((userId === 'sj' || userId === 'zjt' || userId === 'mh') && state.msg === '水情通信处'){
            item.editable = true
          }else if((userId !== 'sj' || userId !== 'zjt' || userId !== 'mh')&& state.msg !== '水情通信处'){
            item.editable = true
          }
          item.headerName = item.headerName
          item.cellEditor = item.editable ? 'agTextCellEditor' : null
          item.cellEditorPopu = true
          item.key=state.dateTime
          if (item.editable) {
            item.onCellClicked = params => {
              params.api.startEditingCell({
                rowIndex: params.rowIndex,
                colKey: params.column.colId
              })
            }
            item.onCellValueChanged = params => {
              saveDataToBackend(params.data)
            }
          } else {
            item.onCellClicked = null
            item.onCellValueChanged = null
          }
        }
      })
    }else {
      toast.add({ severity: 'error', summary: res.data, detail: '', group: 'tc', life: 3000 });
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
                state.tooltips += '修改人:' + (i.deptId || '') +'<br>'+ '修改时间:' + (dayjs(i.updateTime).format('YYYY-MM-DD HH:mm')+'<br>'
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
    suppressSizeToFit: false,
    wrapText: true,
    autoHeight: true,
    editable: true,
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

.select-date {
  width: calc(100% - 120px);
  background: transparent;
  color: #09090b;
  height: 25px;
}


.custom-tooltip {
  padding: 10px;
  color: var(--ag-foreground-color);
  background-color: #FFFFFF;
  box-shadow: #909399 0px 0px 5px;
}

.custom-tooltip p {
  margin: 5px;
  white-space: nowrap;
}

.custom-tooltip p:first-of-type {
  font-weight: bold;
}
</style>