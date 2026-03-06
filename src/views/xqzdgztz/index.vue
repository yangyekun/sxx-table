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
          <span class="point-label" style="color: #09090b">汛前重点工作填报</span>
          <span class="point-label" style="color:red;margin-left: 20px;font-size: 12px">提示：仅限填报本周工作任务（本周内可多次填报），历史数据不可修改。</span>
        </div>
        <div>
          <Button label="刷新" size="small" @click="getReportList" style="padding: 5px 25px;color:#ffffff;margin-right: 10px;" />
          <Button label="导出" size="small" @click="handleExport" severity="success" style="padding: 5px 25px;color:#ffffff;" />
        </div>
      </div>
    </div>
    <div class="page-table" style="background: transparent;padding: 0">
      <div class="page-table-list">
        <div style="display: flex;justify-content: center;align-items: center">
          <div style="width: 180px">
            工作年选择:
          </div>
          <select class="select-date" @change="handleSelect">
            <option v-for="item in state.yearList" :value="item.value">{{ item.lable }}</option>
          </select>
        </div>
        <div
            :class="{ active: state.check }"
            @click="handleCheckAll"
        >
          <input
              type="checkbox"
              :checked="state.check"
              class="custom-checkbox"/>
          <span>全选</span>
        </div>

        <div
            v-for="item in state.historyList"
            :key="item.index"
            @click="handleItemClick(item)"
            :class="{ active: state.selectedList.includes(item.index) }"
        >
          <input
              type="checkbox"
              :checked="state.selectedList.includes(item.index)"
              class="custom-checkbox"/>
          <span>{{ item.name }}</span>
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
import {userid, submit, reportList} from "@/api/url.js";
import {column} from '@/utils/columnDefs.js'
import axios from "axios";

defineOptions({
  name: 'sxxtb'
})
const toast = useToast()
const state = reactive({
  check: false,
  dateTime: '',
  yearList: [],
  selectedList: [1],
  historyList: [],
  tableData: [],
  columnDefs: [],
  msg: '',
  field: ''
})
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
const handleSelect = (e) => {
  let year = e.target.value
}
// 全选
const handleCheckAll = () => {
  state.check = !state.check
  if (state.check) {
    state.selectedList = state.historyList.map(item => item.index)
    // addColumnsForIndexes(state.historyList.map(item => item.name))
    addColumnsForIndexes(state.historyList)
  } else {
    state.selectedList = []
    removeDynamicColumns()
  }
}
// 列表点击事件
const handleItemClick = (data) => {
  state.dateTime = data.name
  const index = state.selectedList.indexOf(data.index)
  // 如果已选中，则取消选中；如果未选中，则添加
  if (index > -1) {
    state.selectedList.splice(index, 1)
    removeColumnByIndex(data)
  } else {
    state.selectedList.push(data.index)
    // addColumnsForIndexes([data.name])
    addColumnsForIndexes(data)
  }
  // 更新全选 checkbox 状态
  state.check = state.selectedList.length === state.historyList.length
}
// 创建动态列配置的统一函数
const createDynamicColumn = (name, headerName) => {
  // name 为动态列的标识符，headerName 为列的标题(表示日期)
  const baseConfig = {
    field: `${name}${headerName}`,
    title: `${state.msg}`,
    headerName: `${state.msg}${headerName}`,
    width: 300,
    key:headerName
  }
  // 第一个索引的列允许编辑
  if (headerName === state.historyList[0].name) {
    return {
      ...baseConfig,
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorPopup: true,
      onCellClicked: params => {
        params.api.startEditingCell({
          rowIndex: params.rowIndex,
          colKey: params.column.colId
        })
      },
      onCellValueChanged: params => {
        saveDataToBackend(params.data)
      },
    }
  }
  // 其他索引的列只读
  return {
    ...baseConfig,
    editable: false,
    cellEditor: null,
  }
}
// 处理push时根据日期列表顺序排序
const sortColumnDefs = () => {
  let data =[]
  state.columnDefs.forEach(item=>{
    if(item.key){
      data.push(item)
    }
  })
  data.forEach((item) => {
    const historyItem = state.historyList.find(h => h.name === item.key)
    if (historyItem) {
      item['index'] = historyItem.index
    } else {
      item['index'] = 0 // 给一个默认值，避免 undefined
    }
  })
  data.sort((a, b) => a.index - b.index)
  const staticColumns = state.columnDefs.filter(item => !item.key)
  state.columnDefs = [...staticColumns, ...data]
}
// 批量添加列（检查是否已存在）
const addColumnsForIndexes = (indexes) => {
  let data = Array.isArray(indexes) ? indexes.map(x => x.name) : [indexes.name]
  data.forEach((item,index) => {
    const exists = state.columnDefs.some(col => col.headerName === `${state.msg}${item}`)
    if (!exists) {
      state.columnDefs.push(createDynamicColumn(state.field, item))
    }
  })
  sortColumnDefs()
}

// 移除所有动态列
const removeDynamicColumns = () => {
  state.columnDefs = state.columnDefs.filter(col => !col.field.startsWith(state.field))
}
// 移除指定索引的列
const removeColumnByIndex = (data) => {
  const colIndex = state.columnDefs.findIndex(col => col.headerName === `${state.msg}${data.name}`)
  if (colIndex > -1) {
    state.columnDefs.splice(colIndex, 1)
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
// 修改填报内容
const saveDataToBackend = (params) => {
  let userId = localStorage.getItem('userid');
  // let userId =`lutianqiang`
  const baseColumns = ['sq', 'hf', 'sz', 'bb', 'fy', 'cz', 'la', 'mas', 'wh', 'aq', 'hs']
  baseColumns.forEach(item => {
    if (item===state.field) {
      params[state.field] = params[state.field+state.dateTime]
    }
  })
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

const getReportList = () => {
  // let userId= localStorage.getItem('userid');
  let userId = `lutianqiang`
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
    columns.forEach(item => {
      if (item.title !== res.msg) {
        item.hide = true
      }
    })
    state.columnDefs = [...state.columnDefs, ...columns]
    state.tableData = res.data
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
    const firstKey = Object.keys(res.data).reverse()[0]
    state.tableData = JSON.parse(JSON.stringify(res.data[firstKey]))
    // 为每条数据添加 index
    state.tableData.forEach((item, index) => {
      item['index'] = index + 1
    })
    // 遍历所有时期的数据，填充到对应的列
    Object.keys(res.data).reverse().forEach((key) => {
      const periodData = res.data[key]
      const periodName = dayjs(key.split('~')[0]).format('MM月DD日') + '-' + dayjs(key.split('~')[1]).format('MM月DD日')
      periodData.forEach((rowData, rowIndex) => {
        if (state.tableData[rowIndex]) {
          // 将对应字段值填充到动态列中
          state.tableData[rowIndex][state.field + periodName] = rowData[state.field] || ''
        }
      })
    })
    state.msg = res.msg
    state.dateTime = state.historyList[0].name
    state.columnDefs.forEach(item => {
      if (item.title === res.msg) {
        item.field=item.field+state.dateTime
        item.headerName = item.headerName + state.dateTime
        item.editable = true
        item.cellEditor = 'agTextCellEditor'
        item.cellEditorPopu = true
        item.key=state.dateTime
        item.onCellClicked = params => {
          params.api.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: params.column.colId
          })
        }
        item.onCellValueChanged = params => {
          saveDataToBackend(params.data)
        }
      }
    })
    console.log(state.tableData)
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
  // 获取本周一至本周日
  const weekStart = dayjs().day(1).format('MM月DD日')
  const weekEnd = dayjs().day(7).format('MM月DD日')
  // getUserId()
  // 生成年份列表（1950 年至今）
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

.page-table-list div:hover {
  background-color: #f0f0f0;
}

.select-date {
  width: calc(100% - 120px);
  background: transparent;
  color: #09090b;
  height: 25px;
}

/* 自定义 checkbox 样式 */
.custom-checkbox {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: red;
}

.custom-checkbox:checked {
  accent-color: #9DC8FD;
}

.page-table-list div.active .custom-checkbox {
  accent-color: #ffffff;
}

.page-table-list div.active .custom-checkbox:checked {
  accent-color: #9DC8FD;
}
</style>