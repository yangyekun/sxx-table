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
                <span class="point-label">站点以测补报</span>
                </div>
            </div>
            <div>
                <span>查询时间：</span>
                <DatePicker v-model="stm" dateFormat="yy-mm-dd" w-110px />
                <Select v-model="sHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />
                <span>-</span>
                <DatePicker v-model="etm" dateFormat="yy-mm-dd" w-110px ml-10px />
                <Select v-model="eHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />

                <Button label="查询" size="small" @click="getList(false)" :disabled="isLoading" ml-10px style="padding: 5px 25px;" />
                <Button label="导出" size="small" severity="success" v-if="tableData.length" @click="handleExport(1)" ml-10px style="padding: 5px 25px;"  />
            </div>
        </div>

        <div class="page-main">
            <ag-grid-vue
                class="ag-theme-alpine"
                style="flex: 1;"
                :rowData="tableData" 
                :columnDefs="columnDefs" 
                @grid-ready="onGridReady1"
                :defaultColDef="defColOption"
                theme="legacy"
            >
            </ag-grid-vue>
        </div>

        <Dialog v-model:visible="visible" modal :header="title">
            <div flex-end mb-10px>
                <div flex-center mr-10px v-if="legendKzz.length">
                    <span>控制站水位：</span>
                    <div v-for="item in legendKzz" :key="item.name" flex-center mr-10px>
                        <Checkbox v-model="selectOption" :inputId="item.pinyin" name="size" :value="item.name" />
                        <label :for="item.pinyin" ml-5px :style="{ color: item.color }"> {{ item.name }} </label>
                    </div>
                </div>

                <i title="测报详情" class="pi pi-table" cursor-pointer style="font-size: 20px;" @click="showCbTable"></i>
            </div>
            <div id="myChart" w-950px h-350px :loading="isChartLoading"></div>
            <div flex-between b-0 b-t-1px b-solid b-gray-300 pt-10px>
                <div flex-center>
                    <DatePicker v-model="stm_chart" dateFormat="yy-mm-dd" w-95px />
                    <Select v-model="sHour_chart" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />
                    <span>-</span>
                    <DatePicker v-model="etm_chart" dateFormat="yy-mm-dd" w-95px ml-5px />
                    <Select v-model="eHour_chart" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />

                    <Button label="查询" size="small" @click="handleSiteClick(siteObj)" :disabled="isLoading" style="padding: 5px 25px;" />
                </div>
                <div flex-end>
                    <div flex-center>
                        <Checkbox v-model="selectOption" inputId="ingredient1" name="size" value="水位" />
                        <label for="ingredient1" ml-5px class="text-#00b7ee"> 水位 </label>
                    </div>
                    <div flex-center ml-10px v-tooltip="'报汛流量[12345]'">
                        <Checkbox v-model="selectOption" inputId="ingredient2" name="size" value="报汛流量" />
                        <label for="ingredient2" ml-5px class="text-#ff0000"> 报汛流量 </label>
                    </div>
                    <div flex-center ml-10px v-tooltip="'软在线流量[9]'">
                        <Checkbox v-model="selectOption" inputId="ingredient3" name="size" value="软在线" />
                        <label for="ingredient3" ml-5px class="text-#9900ff"> 软在线 </label>
                    </div>
                    <div flex-center ml-10px v-tooltip="'硬在线流量[6]'">
                        <Checkbox v-model="selectOption" inputId="ingredient4" name="size" value="硬在线" />
                        <label for="ingredient4" ml-5px class="text-#ff00ff"> 硬在线 </label>
                    </div>
                    <div flex-center ml-10px v-tooltip="'实测流量[235]'">
                        <Checkbox v-model="selectOption" inputId="ingredient5" name="size" value="实测流量" />
                        <label for="ingredient5" ml-5px class="text-#000000"> 实测流量 </label>
                    </div>
                    <div flex-center ml-10px v-tooltip="'合成流量'">
                        <Checkbox v-model="selectOption" inputId="ingredient6" name="size" value="合成流量" />
                        <label for="ingredient6" ml-5px class="text-#6fb94b"> 合成流量 </label>
                    </div>
                </div>
            </div>
            <div v-if="cbVisible" class="page-main" p-0px w-950px h-300px mt-10px>
                <div flex-between>
                    <h3>测报详情</h3>
                    <p>
                        <i title="导出" class="pi pi-download" cursor-pointer style="font-size: 20px;" @click="handleExport(2)"></i>
                    </p>
                </div>
                <ag-grid-vue
                    class="ag-theme-alpine"
                    style="flex:1;"
                    :rowData="siteViewData" 
                    :columnDefs="siteColumnDefs" 
                    @grid-ready="onGridReady2"
                    :defaultColDef="defColOption2"
                    theme="legacy"
                >
                </ag-grid-vue>
            </div>
        </Dialog>

        <Dialog v-model:visible="siteVisible" modal :header="siteTitle">
            <div w-920px h-440px class="page-main" p-0px>
                <ag-grid-vue
                    class="ag-theme-alpine"
                    style="flex: 1;"
                    :rowData="siteViewData" 
                    :columnDefs="siteColumnDefs" 
                    @grid-ready="onGridReady2"
                    :defaultColDef="defColOption2"
                    theme="legacy"
                >
                </ag-grid-vue>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import pinyin from 'js-pinyin';
import { hourArr } from "@/utils/index.js";
import { listHss, getCsdata, getgcx, getYcbb } from '@/api/url.js';
import { getInterval1 } from '@/utils/chartUtil.js'

import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import { useToast } from 'primevue/usetoast';
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

const tableData = ref([])
const columnDefs = ref([])
const isLoading = ref(false)

let gridApi, myChart, gridApi2;
const defColOption = {
  // sortable: false,
  // suppressSizeToFit: true,
  // wrapText: true, 
  // autoHeight: true,
  // editable: true,
  // filter: "agSetColumnFilter"
}
const selectOption = ref(['水位', '合成流量']);
const legendKzz = ref([]);

const visible = ref(false)
const cbVisible = ref(false)
const siteObj = ref({});
const title = ref('王家坝过程线图')
const isChartLoading = ref(false)
const stm_chart = ref('')
const sHour_chart = ref('08')
const etm_chart = ref('')
const eHour_chart = ref('08')
const ltz_chart = ref([])
const rhj_chart = ref([])

// 站点详情
const siteVisible = ref(false)
const siteTitle = ref('站点详情')

let siteViewData = ref([])
let siteColumnDefs = ref([
    { field: "stnm", title: "站名", headerName: '站名', align: 'center', width: 90 },
    { field: "stcd", title: "站码", headerName: '站码', align: 'center', width: 90 },
    { field: "yc", title: "应测", headerName: '应测', align: 'center', width: 90 },
    { field: "sc", title: "实测", headerName: '实测', align: 'center', width: 90 },
    { field: "tm", title: "测流时间", headerName: '测流时间', align: 'center', width: 150 },
    { field: "gz", title: "规则", headerName: '规则', align: 'center', width: 300 },
])
const defColOption2 = {}

onMounted(() => {
    stm_chart.value = stm.value = dayjs().add(-150, "d").format("YYYY-MM-DD");
    etm_chart.value = etm.value = dayjs().format("YYYY-MM-DD");
    sHour_chart.value = eHour_chart.value = sHour.value = eHour.value = dayjs().format("HH");

    columnDefs.value = [
        // {
        //     field: "index",
        //     headerName: "#",
        //     suppressSizeToFit: true,
        //     valueFormatter: params => {
        //         return params.node.rowIndex + 1;
        //     }
        // },
        { field: "index", title: "序号", headerName: '序号' },
        {
            field: "", 
            title: "站名", 
            headerName: '站名',
            cellRenderer: textActions,
            cellRendererParams: {
                preSite: handleSiteClick,
                type: ['测站']
            }
        },
        { field: "stcd", title: "站码", headerName: '站码' },
        { field: "yczs", title: "应测", headerName: '应测' },
        // { field: "events.length", title: "洪水场次", headerName: '洪水场次' },
        { field: "sczs", title: "实测", headerName: '实测' },
        {
            field: "", 
            title: "操作", 
            headerName: '操作',
            cellRenderer: textActions,
            cellRendererParams: {
                preview: handlePreview,
                type: ['查看']
            }
        }
    ];
    
    getList();
})

// 初始化图表
const initChart = () => {
    const chartDom = document.getElementById('myChart');
    if (!chartDom) return;
    if (myChart) {
        myChart.dispose(); // 销毁现有实例
        myChart = null;
    }

    myChart = echarts.init(chartDom);
    myChart && myChart.showLoading();
}

const showCbTable = () => {
    cbVisible.value = !cbVisible.value;

    console.log(siteViewData.value);
    console.log(siteColumnDefs.value);
}

// 渲染图表
const setOption = (data, events_data) => {
    let zdata = [], qdata = [];
    let data_q_sc = [], data_q_rzx = [], data_q_yzx = [], hcll = [];
    let ltz_data = [], rhj_data = [];
    let minz = Infinity, maxz = -Infinity;
    let minq = Infinity, maxq = -Infinity;
    let events = events_data || [];

    let yctms = siteViewData.value.flatMap(item => item.data).map(item => {
        let tm = item.tm? dayjs(item.tm).format("YYYY-MM-DD HH:mm:ss") : null;
        return {
            value: [tm, item.z]
        }
    });
    
    let selected = {}, series = [], areas = [];

    data && data.forEach(item => {
        let tm = item.tm ? dayjs(item.tm).format("YYYY-MM-DD HH:mm") : null;
        let cumulativeFlow = item.cumulativeFlow || null;
        
        zdata.push({value: [tm, item.z]});
        hcll.push({value: [tm, cumulativeFlow]})
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
    legendKzz.value && legendKzz.value.forEach(item => {
        series.push({
            name: item.name,
            type: 'line',
            yAxisIndex: 0,
            showSymbol: false,
            hoverAnimation: false,
            animationDuration: 5000,
            data: setKzzData(item.data),
            lineStyle: {
                normal: {
                    color: item.color,
                    width: 2,
                },
            }
        });
        selected[item.name] = false;
    });
    
    const result = filterByRanges(data, events) || [];
    result.forEach(item => {
        series.push({
            name: "合成流量",
            type: "line",
            yAxisIndex: 1,
            data: item,
            connectNulls: true,
            showSymbol: false,
            symbolSize: 10,
            hoverAnimation: false,
            label: {
                normal: {
                    show: true,
                    position: "top",
                },
            },
            lineStyle: {
                normal: {
                    color: "#6fb94b",
                    width: 2,
                },
            },
            itemStyle: {
                normal: {
                    color: "#6fb94b",
                    width: 3,
                },
            }
        })
    })
    events && events.forEach(item => {
        areas.push({
            brushType: 'lineX',
            coordRange: [item.startPoint.tm, item.endPoint.tm],
            xAxisIndex: 0
        })
    });

    let diffz = maxz - minz;
    let intervalData = getInterval1({ min: minz, max: maxz, diff: diffz });
    
    let option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let html = "", tm = params[0].value[0];
                params.forEach(item => {
                    if(item.seriesName == '应测') {
                        html += item.seriesName + ": " + item.value[1] + " m<br>"
                    } else if(item.seriesName.includes("水位")) {
                        html += item.seriesName + ": " + item.value[1] + " m<br>"
                    } else if(item.seriesName.includes("流量")) {
                        html += item.seriesName + ": " + item.value[1] + " m³/s<br>"
                    }
                });

                return tm + "<br>" + html;
            },
        },
        legend: [
            {
                show: false,
                data: [],
                selected: {
                    "水位": selectOption.value.includes("水位") ? true : false,
                    "报汛流量": selectOption.value.includes("报汛流量") ? true : false,
                    "软在线": selectOption.value.includes("软在线") ? true : false,
                    "硬在线": selectOption.value.includes("硬在线") ? true : false,
                    "实测流量": selectOption.value.includes("实测流量") ? true : false,
                    "合成流量": selectOption.value.includes("合成流量") ? true : false,
                    "应测": true,
                    ...selected
                }
            }
        ],
        dataZoom: [
            {
                type: 'inside',  // 重点：设置为 inside，开启鼠标滚轮缩放
                xAxisIndex: 0,   // 控制第一个 x 轴
                start: 0,        // 默认数据窗口范围 0%
                end: 100         // 默认数据窗口范围 100%
            }
        ],
        brush: {
            transformable: false,
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 1 // 1
            }
        },
        toolbox: {
            show: false,
            itemSize: 20,
            top: -15,
            left: 400,
            feature: {
                brush: {
                    type: ['lineX', 'keep', 'clear'],
                    title: {
                        lineX: '横向选择',
                        keep: '保持选择',
                        clear: '清除选择'
                    }
                }
            }
        },
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
                        color: "#00b7ee",
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
                        { type: "min", name: "最小值" }
                    ],
                },
                // markLine: markLine,
                // markArea: {
                //     itemStyle: {
                //         color: 'rgba(255, 173, 177, 0.4)'
                //     },
                //     data: events.value
                // }
            },
            {
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
                    color: "#ff0000",
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
                // label: {
                //     normal: {
                //         show: false,
                //         position: "top",
                //     },
                // },
                lineStyle: {
                    normal: {
                        color: "#000000",
                        width: 2,
                    },
                },
                itemStyle: {
                    normal: {
                        color: "#000000", //e98400
                        width: 10,
                        //shadowColor: 'rgba(0,0,0,0.4)',
                        //shadowBlur: 10,
                        //shadowOffsetY: 10
                    },
                },
                // tooltip: {},
            },{
                /*
                        为了避免因为水位流量关系量程问题出现的这种平头现象  软在线 可以不用连线 直接显示点 因为点足够多，并不影响效果
                        */
                name: "软在线",
                type: "line",
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
                    normal: {
                        // color: "rgba(232, 4, 4, 1)"//
                        color: "#9900ff",
                        //width: 3
                    }
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
                        color: "#ff00ff",
                        width: 3,
                    },
                },
            },
            ...series,
            {
                name: '应测',
                type: 'scatter',
                yAxisIndex: 0,
                showSymbol: false,
                connectNulls: true,
                symbol:
                    "path://d=M511.31136,1016.0068266666666c-68.65152,0-135.2832-13.46304-198.04928-40.00768-60.5888-25.62688-114.99008-62.30272-161.69344-109.00224-46.69952-46.69952-83.37408-101.09952-109.00096-161.6896C16.02048,642.5386666666666,2.56,575.9095466666666,2.56,507.25674666666663c0-68.65152,13.46176-135.28448,40.00768-198.04928,25.62688-60.5888,62.30144-114.99008,109.00096-161.69088,46.70208-46.7008,101.10336-83.3728,161.69344-109.00224C376.02816,11.967146666666668,442.65984-1.4933333333333332,511.31136-1.4933333333333332c68.6528,0,135.28448,13.46176,198.05056,40.00768,60.5888,25.62688,114.99136,62.30144,161.6896,109.00224,46.69952,46.7008,83.37664,101.09952,109.00224,161.69088,26.5472,62.76608,40.00768,129.39776,40.00768,198.04928,0,68.6528-13.46176,135.28448-40.00768,198.05056-25.62688,60.58752-62.30144,114.99008-109.00224,161.6896-46.69952,46.70208-101.09824,83.37792-161.6896,109.00224-62.7648,26.5472-129.3952,40.00768-198.05056,40.00768z,m0-883.3728c-206.56896,0-374.62272,168.05504-374.62272,374.62272s168.05504,374.62272,374.62272,374.62272,374.624-168.05504,374.624-374.62272c0-206.56896-168.05632-374.62272-374.624-374.62272z;path://d=M512.43264,250.92906666666667c141.088,0,255.49952,114.304,255.49952,255.30752s-114.4128,255.30752-255.49952,255.30752-255.49952-114.304-255.49952-255.30752,114.41152-255.30752,255.49952-255.30752z",
                symbolSize: 15,
                hoverAnimation: false,
                data: yctms,
                label: {
                    normal: {
                        show: false,
                        position: "top",
                        color: "#1afa29",
                        formatter: function (params) {
                            let date = dayjs(params.value[0]).format("MM-DD") || '';
                            return date;
                        }
                    },
                },
                lineStyle: {
                    normal: {
                        color: "#1afa29",
                        width: 2,
                    },
                },
                itemStyle: {
                    normal: {
                        color: "#1afa29",
                        width: 10
                    },
                },
            }
        ]
    }

    myChart && myChart.setOption(option, true);
    // 配置框选内容
    myChart.dispatchAction({
        type: 'brush',
        areas: areas
    });
    myChart && myChart.resize();

    myChart.on('dataZoom', function (params) {
        // 获取当前的 dataZoom 状态
        var opt = myChart.getOption();
        var start = opt.dataZoom[0].start;
        var end = opt.dataZoom[0].end;
        
        // 计算当前展示的百分比跨度
        var span = end - start;

        // 阈值逻辑：
        // 如果跨度大于 20% (代表当前看的数据很多，即缩小状态)，则不显示标签
        // 如果跨度小于 20% (代表当前看的数据很少，即放大状态)，则显示标签
        var shouldShowLabel = span < 40;

        // 只有当状态改变时才 setOption，避免性能浪费
        // 这里假设您的散点图是 series 中的第 1 个 (索引 0)
        if (opt.series[opt.series.length - 1].label.show !== shouldShowLabel) {
            myChart.setOption({
                series: [{
                    // 必须指定 name 或 index 才能覆盖特定 series
                    name: '应测', 
                    label: {
                        normal: {
                            show: shouldShowLabel
                        }
                    }
                }]
            });
        }
    });

    // myChart.on('brushselected', function (params) {
    //     const selectedInfo = params.batch[0];
    //     // 检查是否有选区信息
    //     if (!selectedInfo || !selectedInfo.areas || selectedInfo.areas.length === 0) {
    //         console.log('选区已清除，或没有有效的框选区域。');
    //         return;
    //     }

    //     // 保存框选区域的时间范围
    //     saveEvents.value = [];
    //     selectedInfo.areas.forEach(item => {
    //         let time = item.coordRange;
    //         saveEvents.value.push({
    //             startPoint: {
    //                 tm: dayjs(time[0]).format("YYYY-MM-DD HH:mm"),
    //             },
    //             endPoint: {
    //                 tm: dayjs(time[1]).format("YYYY-MM-DD HH:mm"),
    //             }
    //         })
    //     })
    // })
}

// 请求洪水场次数据
const getList = async () => {
    isLoading.value = true;
    gridApi && gridApi.showLoading();
    getYcbb({
        stime: dayjs(stm.value).format("YYYY-MM-DD ") + `${sHour.value}:00`,
        etime: dayjs(etm.value).format("YYYY-MM-DD ") + `${eHour.value}:00`,
    }).then(res => {
        if(res.code === 0) {
            tableData.value = res.data.map((item, i) => ({
                ...item, 
                index: i + 1
            }));

            setTimeout(() => {
                gridApi && gridApi.hideOverlay();
                gridApi && gridApi.sizeColumnsToFit();
            });
        }
    })
    isLoading.value = false;
}

// 查看过程线
const handleSiteClick = async (data) => {
    cbVisible.value = false;
    visible.value = true;
    siteObj.value = data || {};
    legendKzz.value = [];
    siteViewData.value = [];
    title.value = `${data.stnm}过程线图`;

    setTimeout(() => {
        initChart();
    })
    
    let params = {
        "stcd": data.stcd,
        "stime": dayjs(stm_chart.value).format("YYYY-MM-DD ") + `${sHour_chart.value}:00`,
        "etime": dayjs(etm_chart.value).format("YYYY-MM-DD ") + `${eHour_chart.value}:00`
    }
    const res1 = await getYcbb(params);
    const res2 = await getgcx(params);
    const res3 = await getCsdata(params);

    if(res1.code === 0) {
        siteViewData.value = res1.data[0].data.map(item => ({
            ...item,
            stcd: data.stcd,
            stnm: data.stnm
        })) || [];
    }
    if(res2.code === 0) {
        for(let key in res2.data) {
            if(data.stnm != key) {
                legendKzz.value.push({
                    name: `${key}水位`,
                    color: randomRgb(key),
                    data: res2.data[key],
                    pinyin: pinyin.getCamelChars(key)
                });
            }
        }
    }
    
    setOption(res2.data[data.stnm], res3.data);
    myChart && myChart.hideLoading();
}

// 查看详情
const handlePreview = (data) => {
    siteVisible.value = true;
    siteTitle.value = `${data.stnm} 测报详情`;

    siteViewData.value = data.data.map(item => ({
        ...item,
        stcd: data.stcd,
        stnm: data.stnm
    })) || [];
}

// 导出
const handleExport = (tag) => {
    let fileName = "", headers = [], data = [];

    switch (tag) {
        case 1:
            fileName = '站点以测补报数据';
            headers = [
                { field: "index", title: "站名", headerName: '序号', width: 20 },
                { field: "stnm", title: "序号", headerName: '站名', width: 20 },
                { field: "stcd", title: "站码", headerName: '站码', width: 20 },
                { field: "yczs", title: "应测", headerName: '应测', width: 20 },
                // { field: "events.length", title: "洪水场次", headerName: '洪水场次', width: 20 },
                { field: "sczs", title: "实测", headerName: '实测', width: 20 },
            ];
            data = tableData.value;
            break;

        case 2:
            fileName = '测报数据详情';
            headers = siteColumnDefs.value.map(item => ({...item, width: 25}));
            data = siteViewData.value;
            break;
    
        default:
            break;
    }
    const config = {
        headers: headers,
        data: data,
        headerDeep:1,
        fileName: fileName
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
const onGridReady1 = (params) => {
  gridApi = params.api
  gridApi.sizeColumnsToFit();
};

// 初始化
const onGridReady2 = (params) => {
  gridApi2 = params.api
  gridApi2.sizeColumnsToFit();
};

watch(() => selectOption.value, (params) => {
    let selected = {};
    
    if(params.includes("水位")) {
        selected["水位"] = true;
    } else {
        selected["水位"] = false;
    }
    // if(params.includes("润河集水位")) {
    //     selected["润河集水位"] = true;
    // } else {
    //     selected["润河集水位"] = false;
    // }
    // if(params.includes("鲁台子水位")) {
    //     selected["鲁台子水位"] = true;
    // } else {
    //     selected["鲁台子水位"] = false;
    // }
    if(params.includes("报汛流量")) {
        selected["报汛流量"] = true;
    } else {
        selected["报汛流量"] = false;
    }
    if(params.includes("软在线")) {
        selected["软在线"] = true;
    } else {
        selected["软在线"] = false;
    }
    if(params.includes("硬在线")) {
        selected["硬在线"] = true;
    } else {
        selected["硬在线"] = false;
    }
    if(params.includes("实测流量")) {
        selected["实测流量"] = true;
    } else {
        selected["实测流量"] = false;
    }
    if(params.includes("合成流量")) {
        selected["合成流量"] = true;
    } else {
        selected["合成流量"] = false;
    }

    legendKzz.value && legendKzz.value.forEach(item => {
        if(params.includes(item.name)) {
            selected[item.name] = true;
        } else {
            selected[item.name] = false;
        }
    });
    
    myChart.setOption({
        legend: {
            data: [],
            selected: selected
        },
    })
}, {deep: true});

function setKzzData(data) {
    return data = data.map(item => {
        let tm = item.tm ? dayjs(item.tm).format('YYYY-MM-DD HH:mm') : '';
        return [ tm, item.z];
    });
}

function filterByRanges(source, ranges) {
  const formatDate = (str) => new Date(str.replace(/-/g, '/'));

  return ranges.map(range => {
    const start = formatDate(range.startPoint.tm);
    const end = formatDate(range.endPoint.tm);

    return source
      .filter(item => {
        const cur = formatDate(item.tm);
        return cur >= start && cur <= end;
      })
      .map(item => ({
        value: [item.tm, item.cumulativeFlow || '-']
      }));
  });
}

function randomRgb(params) {
    let R = Math.floor(Math.random() * 100 + 50);
    let G = Math.floor(Math.random() * 100 + 50);
    let B = Math.floor(Math.random() * 75 + 180);

    return 'rgb(' + R + ',' + G + ',' + B + ', 1)';
}

</script>

<style>
</style>