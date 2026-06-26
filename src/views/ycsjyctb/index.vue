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
            <span class="point-label">遥测数据异常情况填报</span>
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
            <!-- <Button label="新增" size="small" severity="warn" @click="handleAdd" ml-10px style="padding: 5px 25px;" /> -->
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
            :getRowHeight="getRowHeight"
            theme="legacy"
            :pinnedTopRowData="pinnedTopRowData"
        >
        </ag-grid-vue>
    </div>

    <Dialog v-model:visible="visible" modal :header="title">
        <div w-950px h-440px p-0px flex flex-wrap>
            <div flex-end>
                <label w-145px text-right pr-10px>站名</label>
                <InputText type="text" v-model="form.stcd" disabled w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>站码</label>
                <InputText type="text" v-model="form.stcd" disabled w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>管理单位</label>
                <InputText type="text" v-model="form.manageUnit" disabled w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>异常情况</label>
                <InputText type="text" v-model="form.abnormalSituation" disabled w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>提醒短信发送时间</label>
                <InputText type="text" v-model="form.smsSendTime" disabled w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>异常原因类型</label>
                <Select v-model="form.reasonType" :options="reasonTypeList" optionLabel="label" optionValue="value" w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>异常原因详细说明</label>
                <Textarea v-model="form.reasonDetail" rows="3" w-800px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>处置计划</label>
                <InputText type="text" v-model="form.disposalPlan" w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>处置进度</label>
                <InputText type="text" v-model="form.disposalProgress" w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>处置结果</label>
                <Select v-model="form.disposalResult" :options="disposalResultList" optionLabel="label" optionValue="value" w-170px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>备注</label>
                <Textarea v-model="form.note" rows="3" w-800px />
            </div>
            <div flex-end>
                <label w-145px text-right pr-10px>水情处技术指导意见</label>
                <Textarea v-model="form.techGuidance" rows="3" w-800px />
            </div>
        </div>
        <div flex-end>
            <Button label="保存" size="small" @click="handleSave" ml-10px style="padding: 5px 25px;" />
        </div>
    </Dialog>
  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { hourArr } from "@/utils/index.js";
import { useToast } from 'primevue/usetoast';
import { selectFaultReport, updateFaultReport } from '@/api/url.js';
import OrpActions from '@/components/orpActions.vue';
import { column } from './columnDefs.js';

defineOptions({
  name: 'ycsjyctb'
});

let reasonTypeList = [
    { label: '工程影响', value: '工程影响' },
    { label: '设备故障', value: '设备故障' },
    { label: '网络故障', value: '网络故障' },
    { label: '管理问题', value: '管理问题' },
    { label: '不可抗逆', value: '不可抗逆' },
    { label: '原因不明', value: '原因不明' },
];
let disposalResultList = [
    { label: '处置完毕', value: '处置完毕' },
    // { label: '暂时恢复有待观察', value: '暂时恢复有待观察' },
    { label: '暂时恢复', value: '暂时恢复' },
];

const toast = useToast();

const stm = ref('');
const sHour = ref('08');
const etm = ref('');
const eHour = ref('08');

const tableData = ref([]);
const columnDefs = ref([]);
const isLoading = ref(false);

let gridApi;
const defColOption = {
//   sortable: false,
//   suppressSizeToFit: true,
//   wrapText: false, 
//   autoHeight: true,
  // editable: true,
  // filter: "agSetColumnFilter"
};

const visible = ref(false);
const title = ref('新增遥测数据异常情况填报');
const form = reactive({
    stnm: '',
    stcd: '',
    manageUnit: '',
    abnormalSituation: '',
    smsSendTime: '',
    reasonType: '',
    reasonDetail: '',
    responseTime: '',
    disposalPlan: '',
    disposalProgress: '',
    disposalResult: '',
    note: '',
    techGuidance: '',
});
const pinnedTopRowData = ref([
    {
        index: '注',
        stnm: '必填。系统根据“汛期水位站2小时未到报”、“非汛期水位站6小时未到报”等规则，自动生成。不可修改。',
        abnormalSituation: '必填。系统自动填报，如“汛期水位站2小时未到报”等。不可修改。',
        smsSendTime: '必填。系统自动填报提醒短信的发送时间，精确到分钟，不可修改。',
        reasonType: '必填。市局填报异常情况原因类型，分为“工程影响”“设备故障”“网络故障”“管理问题”“不可抗逆”“原因不明”等。下拉选择。可修改。',
        reasonDetail: '市局填报异常情况详细原因，可修改。',
        responseTime: '必填。系统自动填报市局首次填报“异常原因类型”“异常原因详细说明”“处置计划”“处置进度”“处置结果”中任意一项的时间。不可修改。',
        disposalPlan: '市局填报处置计划。实时更新。',
        disposalProgress: '市局填报已经开展的处置过程。实时更新。',
        disposalResult: '市局填报“处置完毕”“暂时恢复”处置结果。下拉选择。实时更新。'
    }
]);

// 调整行高
const getRowHeight = (params) => {
  return params.data.index == "注" ? 95 : 40
};

const getList = () => {
    isLoading.value = true;

    let stime = dayjs(stm.value).format("YYYY-MM-DD ") + `${sHour.value}:00`;
    let etime = dayjs(etm.value).format("YYYY-MM-DD ") + `${eHour.value}:00`;
    let params = `stm=${stime}&etm=${etime}&userid=${localStorage.getItem('userid')}`;

    selectFaultReport(params).then(res => {
        if(res.code === 0) {
            tableData.value = res.data.map((item, index) => ({
                ...item,
                index: String(index + 1),
            }));

            setTimeout(() => {
                gridApi && gridApi.sizeColumnsToFit();
            }, 50);
        }
        isLoading.value = false;
    }).catch(err => {
        isLoading.value = false;
        toast.error(err.message);
    });
};

const handleEdit = (data) => {
    Object.assign(form, data);
    visible.value = true;
    title.value = `${data.stnm}(${data.stcd}) - 编辑遥测数据异常情况填报`;
}

const handleExport = () => {
    let rowHeight = {};
    if(tableData.value && tableData.value.length) {
        tableData.value.forEach((item, index) => {
            if(index == 0) return rowHeight[2] = 150;
            rowHeight[index + 3] = 80;
        });
    }

    const config = {
        headers: column,
        data: pinnedTopRowData.value.concat(tableData.value),
        fileName: '遥测数据异常情况填报',
        rowHeight
    }
    let custom_obj = config.data.find(item => item.index == "注");
    config.custom = [
        { 'merged':{'s':[2, 2],'e':[2, 4]}, 'value': custom_obj.stnm, width: 20 }
    ];
  
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

const handleSave = () => {
    let params = {
        id: form.id,
        reasonType: form.reasonType,
        reasonDetail: form.reasonDetail,
        disposalPlan: form.disposalPlan,
        disposalProgress: form.disposalProgress,
        disposalResult: form.disposalResult,
        note: form.note,
        techGuidance: form.techGuidance,
        operatorUserid: localStorage.getItem('userid')
    };

    updateFaultReport(params).then(res => {
        if(res.code === 0) {
            toast.add({ severity: 'success', summary: '保存成功', detail: '', group: 'tc', life: 3000 });
            getList();
            visible.value = false;
        } else {
            toast.error({ severity: 'error', summary: '保存失败', detail: res.msg, group: 'tc', life: 3000 });
        }
    });
}

// 初始化
const onGridReady = (params) => {
  gridApi = params.api
  gridApi.sizeColumnsToFit();
};

onMounted(() => {
  stm.value = dayjs().add(-7, "d").format("YYYY-MM-DD");
  etm.value = dayjs().format("YYYY-MM-DD");
  eHour.value = dayjs().add(1, "h").format("HH");

  columnDefs.value = [
    { field: "index", title: "序号", headerName: '序号', minWidth: 80 },
    { field: "stnm", title: "站名", headerName: '站名', minWidth: 100, colSpan: (params) => params.data.index == '注'? 3 : 1 },
    { field: "stcd", title: "站码", headerName: '站码', minWidth: 100 },
    { field: "manageUnit", title: "管理单位", headerName: '管理单位', minWidth: 110 },
    { field: "abnormalSituation", title: "异常情况", headerName: '异常情况', minWidth: 185, tooltipField: 'abnormalSituation' },
    { field: "smsSendTime", title: "提醒短信发送时间", headerName: '提醒短信发送时间', minWidth: 150 },
    { field: "reasonType", title: "异常原因类型", headerName: '异常原因类型', minWidth: 250, tooltipField: 'reasonType' },
    { field: "reasonDetail", title: "异常原因详细说明", headerName: '异常原因详细说明', minWidth: 380, tooltipField: 'reasonDetail' },
    { field: "responseTime", title: "响应时间", headerName: '响应时间', minWidth: 255 },
    { field: "disposalPlan", title: "处置计划", headerName: '处置计划', minWidth: 180, tooltipField: 'disposalPlan' },
    { field: "disposalProgress", title: "处置进度", headerName: '处置进度', minWidth: 185, tooltipField: 'disposalProgress' },
    { field: "disposalResult", title: "处置结果", headerName: '处置结果', minWidth: 180, tooltipField: 'disposalResult' },
    { field: "note", title: "备注", headerName: '备注', minWidth: 100, tooltipField: 'note' },
    { field: "techGuidance", title: "水情处技术指导意见", headerName: '水情处技术指导意见', minWidth: 180, tooltipField: 'techGuidance' },
    {
        field: "", 
        title: "操作", 
        headerName: '操作',
        minWidth: 100,
        pinned: 'right',
        cellRenderer: OrpActions,
        cellRendererParams: {
            edit: handleEdit,
            permission: ['edit']
        }
    }
  ];

  getList();
});

</script>

<style>
.ag-cell-label-container {
    justify-content: center;
    text-align: center;
}
.ag-header-cell-label {
    justify-content: center;
}

.ag-row-pinned .ag-cell-not-inline-editing {
    line-height: 22px !important;
}
</style>
