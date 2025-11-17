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
            <div flex-between>
                <div class="point-title">
                <span class="point"></span>
                <span class="point-label">站点已测补报</span>
                </div>
            </div>
            <div>
                <span>查询时间：</span>
                <DatePicker v-model="stm" dateFormat="yy-mm-dd" w-110px />
                <Select v-model="sHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />
                <span>-</span>
                <DatePicker v-model="etm" dateFormat="yy-mm-dd" w-110px ml-10px />
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

        <Dialog v-model:visible="visible" modal :header="title">
            <div id="myChart" w-950px h-350px></div>
            <div flex-end p-x-20px b-0 b-t-1px b-solid b-gray-300 pt-10px>
                <div flex-center>
                    <Checkbox v-model="selectOption" inputId="ingredient1" name="size" value="水位" />
                    <label for="ingredient1" ml-5px> 水位 </label>
                </div>
                <div flex-center ml-10px v-tooltip="'报汛流量[12345]'">
                    <Checkbox v-model="selectOption" inputId="ingredient2" name="size" value="报汛流量" />
                    <label for="ingredient2" ml-5px> 报汛流量 </label>
                </div>
                <div flex-center ml-10px v-tooltip="'软在线流量[9]'">
                    <Checkbox v-model="selectOption" inputId="ingredient3" name="size" value="软在线" />
                    <label for="ingredient3" ml-5px> 软在线 </label>
                </div>
                <div flex-center ml-10px v-tooltip="'硬在线流量[6]'">
                    <Checkbox v-model="selectOption" inputId="ingredient4" name="size" value="硬在线" />
                    <label for="ingredient4" ml-5px> 硬在线 </label>
                </div>
                <div flex-center ml-10px v-tooltip="'实测流量[235]'">
                    <Checkbox v-model="selectOption" inputId="ingredient5" name="size" value="实测流量" />
                    <label for="ingredient5" ml-5px> 实测流量 </label>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { listHs } from '@/api/url.js';
import { hourArr } from "@/utils/index.js";
import { getInterval1 } from '@/utils/chartUtil.js'

import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import { useToast } from 'primevue/usetoast';
import * as echarts from 'echarts';
import { AgGridVue } from "ag-grid-vue3";
import textActions from "@/components/textActions.vue";

defineOptions({
  name: 'zdycbb'
})

const toast = useToast()

const stm = ref('')
const sHour = ref('08')
const etm = ref('')
const eHour = ref('08')

const events = ref([]) // 洪水事件
const tableData = ref([])
const columnDefs = ref([])
const isLoading = ref(false)

const visible = ref(false)
const title = ref('王家坝过程线图')
const gcx = ref([])

let gridApi, myChart;
const defColOption = {
  // sortable: false,
  // suppressSizeToFit: true,
  // wrapText: true, 
  // autoHeight: true,
  // editable: true,
  // filter: "agSetColumnFilter"
}
const selectOption = ref(['水位', '报汛流量'])

onMounted(() => {
    stm.value = dayjs().add(-150, "d").format("YYYY-MM-DD");
    etm.value = dayjs().format("YYYY-MM-DD");
    sHour.value = eHour.value = dayjs().format("HH");

    columnDefs.value = [
        {
            field: "index",
            headerName: "#",
            suppressSizeToFit: true,
            valueFormatter: params => {
                return params.node.rowIndex + 1;
            }
        },
        {
            // field: "stnm", 
            title: "站名", 
            headerName: '站名',
            cellRenderer: textActions,
            cellRendererParams: {
                preview: handleClick
            }
        },
        { field: "stcd", title: "站码", headerName: '站码' },
        { field: "pc", title: "计划测次", headerName: '计划测次' },
        { field: "sc", title: "实际测次", headerName: '实际测次' },
        { field: "tm", title: "测流时间", headerName: '测流时间' },
    ];
    
    getList();
})

const initChart = () => {
    const chartDom = document.getElementById('myChart');
    if (!chartDom) return;
    if (myChart) {
        myChart.dispose(); // 销毁现有实例
        myChart = null;
    }

    myChart = echarts.init(chartDom);
}

const getList = () => {
    isLoading.value = true;
    gcx.value = [];
    tableData.value = [];

    let params = {
        stcds: ["50101100", "50101000", "50102350"],
        stcd: "50101100",
        stime: dayjs(stm.value).format("YYYY-MM-DD ") + `${sHour.value}:00`,
        etime: dayjs(etm.value).format("YYYY-MM-DD ") + `${eHour.value}:00`,
        qz: [
            { "tm": 24, "pc": 3 },
            { "z": 27.5, "pc": 3 },
            { "z": "25", "q": 2000, "pc": 2 },
            { "z": 23, "q": 1000, "pc": 1 }
        ],
        dataTs: { stcd:"50102350" }
    };

    listHs(params).then(res => {
        isLoading.value = false;
        if(res.code === 0) {
            tableData.value = res.data.datePcVos;
            gcx.value = res.data.gcx || [];
            events.value = res.data.events.map(item => {
                return [
                    { xAxis: item.startPoint.tm },
                    { xAxis: item.endPoint.tm },
                ]
            }) || [];

            setTimeout(() => {
                gridApi && gridApi.hideOverlay();
                gridApi && gridApi.sizeColumnsToFit();
            }, 50);
        }
    })
}

const setOption = (data) => {
    let zdata = [], qdata = [];
    let data_q_sc = [], data_q_rzx = [], data_q_yzx = []
    let minz = Infinity, maxz = -Infinity;
    let minq = Infinity, maxq = -Infinity;

    data && data.forEach(item => {
        let tm = item.tm;
        
        zdata.push({value: [tm, item.z]});
        // 235代表实测流量
        // 12345报汛流量
        // 9软在线流量
        // 6硬在线流量：包含 二线能坡 和 雷达波
        if(item.q != undefined){
            let msqmt = item.msqmt
            let qvalue = [tm, item.q]
            if ('235'.indexOf(msqmt) > -1){
                data_q_sc.push(qvalue)
            }else if (msqmt == '9'){
                data_q_rzx.push(qvalue)
            }else if (msqmt == '6'){
                data_q_yzx.push(qvalue)
            }
            if ('12345'.indexOf(msqmt) > -1){
              qdata.push(qvalue)
            }
            // 流量为 0时，msqtm为null 报汛流量删除
            // qdata.push(qvalue)
        }

        minz = Math.min(minz, item.z);
        maxz = Math.max(maxz, item.z);
        // minq = Math.min(minq, item.q || 0);
        // maxq = Math.max(maxq, item.q || 0);
    });

    let diffz = maxz - minz;
    let intervalData = getInterval1({ min: minz, max: maxz, diff: diffz });
    
    let option = {
        tooltip: {
            trigger: 'axis',
            // formatter: this.tooltipFormatterkr,
        },
        legend: [
            {
                show: false,
                data: [],
                selected: {
                    "水位": true,
                    "报汛流量": true,
                    "软在线流量": false,
                    "硬在线流量": false,
                    "实测流量": false,
                }
            }
        ],
        grid: {
            y: 25,
            y2: 10,
            x: 10,
            x2: 10,
            containLabel: true
        },
        xAxis: [
            {
                type: "time",
                onZero: false,
                axisLine: {
                    lineStyle: {
                        color: "#000",
                        width: 1, //这里是为了突出显示加上的
                    },
                },
                axisLabel: {
                    showMinLabel: true,
                    showMaxLabel: true,
                    formatter(value, index) {
                        let date = new Date(value);

                        return (
                            "{month|" +
                            (date.getMonth() + 1) +
                            "月}" +
                            "{day|" +
                            date.getDate() +
                            "日}\n" +
                            "{year|" +
                            date.getFullYear() +
                            "}年"
                        );
                    },
                    rich: {
                    month: {
                        color: "#000",
                        fontWeight: "bold",
                    },
                    day: {
                        color: "#078525",
                        fontWeight: "bold",
                    },
                    year: {
                        color: "#999",
                    },
                    },
                },
            }
        ],
        yAxis: [
            {
                type: "value",
                scale: true,
                position: "left",
                nameLocation: "end",
                name: "水位(m)",
                nameGap: 10,
                min: intervalData.minz,
                max: intervalData.maxz,
                interval: intervalData.interval,
                axisPointer: {
                    snap: true,
                },
                nameTextStyle: {
                    color: "#000", //水位(m)
                },
                axisLabel: {
                    showMaxLabel: false,
                    showMinLabel: false,
                    textStyle: {
                        color: '#000'
                    },
                    formatter: (value, index) => {
                        //保留两位小数
                        value = value + "";
                        if (value.indexOf(".") != -1) {
                            var zhengshu = value.split(".")[0];
                            var xiaoshu = value.split(".")[1];
                            xiaoshu = xiaoshu.length > 2 ? xiaoshu.substr(0, 2) : xiaoshu;
                            value = zhengshu + "." + xiaoshu;
                        }
                        return value;
                    },
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#000",
                        width: 1, //这里是为了突出显示加上的
                    },
                },
            },
            {
                type: "value",
                scale: true,
                position: "right",
                nameLocation: "end",
                name: "流量(m³/s)   ",
                connectNulls: true, //链接空数据
                nameGap: 10,
                axisPointer: {
                    snap: true,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#f00",
                        width: 2,
                    },
                },
                splitLine: {
                    show: false,
                },
                nameTextStyle: {
                    color: "#f00",
                    fontSize: 13,
                    padding: [0, 0, 0, 0],
                },
                axisLabel: {
                    textStyle: {
                        color: "#000",
                        fontSize: 13,
                    },
                },
            },
        ],
        series: [
            {
                name: '水位',
                type: 'line',
                yAxisIndex: 0,
                showSymbol: false,
                hoverAnimation: false,
                animationDuration: 5000,
                data: zdata,
                lineStyle: {
                    normal: {
                        color: "#00b7ee",
                        width: 2,
                    },
                },
                label: {
                    normal: {
                        show: true,
                        position: "top",
                    },
                },
                itemStyle: {
                    normal: {
                        color: ["#00b7ee"],
                        width: 2,
                        //shadowColor: 'rgba(0,0,0,0.4)',
                        //shadowBlur: 10,
                        //shadowOffsetY: 10
                    },
                },
                markPoint: {
                    silent: true,
                    // symbol: 'pin',
                    // symbolSize: 10,
                    label: {
                    normal: {
                        show: true,
                        //  position: 'bottom',
                        offset: [0, 15],
                        textStyle: {
                        color: "#00b7ee",
                        },
                    },
                    },
                    itemStyle: {
                    normal: {
                        color: "rgba(255, 255, 255, 0.1)",
                        //shadowColor: 'rgba(255, 0, 0, 0.5)',
                    },
                    },
                    data: [
                    { type: "max", name: "最大值" },
                    { type: "min", name: "最小值" },
                    ],
                },
                markArea: {
                    itemStyle: {
                        color: 'rgba(255, 173, 177, 0.4)'
                    },
                    data: events.value
                }
            },{
                name: "报汛流量",
                type: "line",
                yAxisIndex: 1,
                data: qdata,
                connectNulls: true,
                showSymbol: false,
                symbol: "diamond",
                symbolSize: 5,
                hoverAnimation: false,
                label: {
                    normal: {
                    show: true,
                    position: "top",
                    fontWeight: "bold", // 文字粗细
                    formatter: function (params) {
                        return (params.value[1] + "").replace("-", "–");
                    },
                    },
                },
                lineStyle: {
                    normal: {
                    color: "#ff0000",
                    width: 2,
                    },
                },
                itemStyle: {
                    normal: {
                    color: ["#ff0000"],
                    width: 1,
                    //shadowColor: 'rgba(0,0,0,0.4)',
                    //shadowBlur: 10,
                    //shadowOffsetY: 10
                    },
                },
            },{
                name: "实测流量",
                type: "scatter",
                yAxisIndex: 1,
                data: data_q_sc,
                connectNulls: true,
                showSymbol: false,
                symbol:
                    "path://d=M22.2,4c0,0,0.5,0.6,0,1.1l-6.8,6.8l6.9,6.9c0.5,0.5,0,1.1,0,1.1L20,22.3c0,0-0.6,0.5-1.1,0L12,15.4l-6.9,6.9c-0.5,0.5-1.1,0-1.1,0L1.7,20c0,0-0.5-0.6,0-1.1L8.6,12L1.7,5.1C1.2,4.6,1.7,4,1.7,4L4,1.7c0,0,0.6-0.5,1.1,0L12,8.5l6.8-6.8c0.5-0.5,1.1,0,1.1,0L22.2,4z",
                symbolSize: 10,
                hoverAnimation: false,
                label: {
                    normal: {
                        show: false,
                        position: "top",
                    },
                },
                lineStyle: {
                    normal: {
                        color: "#ff00ff",
                        width: 2,
                    },
                },
                itemStyle: {
                    normal: {
                        color: ["#000000"], //e98400
                        width: 10,
                        //shadowColor: 'rgba(0,0,0,0.4)',
                        //shadowBlur: 10,
                        //shadowOffsetY: 10
                    },
                },
                tooltip: {},
            },{
                /*
                        为了避免因为水位流量关系量程问题出现的这种平头现象  软在线 可以不用连线 直接显示点 因为点足够多，并不影响效果
                        */
                name: "软在线",
                type: "scatter",
                yAxisIndex: 1,
                data: data_q_rzx,
                connectNulls: true,
                showSymbol: false,
                symbol: "circle", // 'diamond',
                symbolSize: 3,
                hoverAnimation: false,
                label: {
                    normal: {
                        //show: true,
                        show: false,
                        position: "top",
                    },
                },
                // lineStyle: {
                //     normal: {
                //         color: '#9900ff',
                //         width: 2,
                //     },
                // },
                itemStyle: {
                    // normal: {
                    // color: "rgba(232, 4, 4, 1)"//
                    color: "#9900ff",
                    //width: 3
                    //  }
                },
            },{
                name: "硬在线",
                type: "line",
                yAxisIndex: 1,
                data: data_q_yzx,
                connectNulls: true,
                showSymbol: false,
                symbolSize: 10,
                // step: STTP == "RR" || STTP == "DD" ? "end" : false,
                hoverAnimation: false,
                label: {
                    normal: {
                        show: true,
                        position: "top",
                    },
                },
                lineStyle: {
                    normal: {
                        color: "#ff00ff",
                        width: 2,
                    },
                },
                itemStyle: {
                    normal: {
                        color: ["#ff00ff"],
                        width: 3,
                    },
                },
            },
        ]
    }

    myChart && myChart.setOption(option, true);
    myChart && myChart.resize();
}

const handleClick = (params) => {
    visible.value = true;
    setTimeout(() => {
        initChart();
        setOption(gcx.value);
    }, 0);
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

watch(() => selectOption.value, (params) => {
    let selected = {};
    if(params.includes("水位")) {
        selected["水位"] = true;
    } else {
        selected["水位"] = false;
    }
    if(params.includes("报汛流量")) {
        selected["报汛流量"] = true;
    } else {
        selected["报汛流量"] = false;
    }
    if(params.includes("软在线流量")) {
        selected["软在线"] = true;
    } else {
        selected["软在线"] = false;
    }
    if(params.includes("硬在线流量")) {
        selected["硬在线"] = true;
    } else {
        selected["硬在线"] = false;
    }
    if(params.includes("实测流量")) {
        selected["实测流量"] = true;
    } else {
        selected["实测流量"] = false;
    }
    
    myChart.setOption({
        legend: {
            data: [],
            selected: selected
        },
    })
}, {deep: true});

</script>

<style>
</style>