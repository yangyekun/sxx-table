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
                @grid-ready="onGridReady1"
                :defaultColDef="defColOption"
                theme="legacy"
            >
            </ag-grid-vue>
        </div>

        <Dialog v-model:visible="visible" modal :header="title">
            <template #header>
                <div w-full flex-between>
                    <h3>{{title}}</h3>

                    <div flex-center mr-10px>
                        <span>控制站水位：</span>
                        <div flex-center>
                            <Checkbox v-model="selectOption" inputId="ltz" name="size" value="鲁台子水位" />
                            <label for="ltz" ml-5px> 鲁台子 </label>
                        </div>
                        <div flex-center ml-10px>
                            <Checkbox v-model="selectOption" inputId="rhs" name="size" value="润河集水位" />
                            <label for="rhs" ml-5px> 润河集 </label>
                        </div>
                    </div>
                </div>
            </template>
            
            <div id="myChart" w-950px h-350px :loading="isChartLoading"></div>
            <div flex-between b-0 b-t-1px b-solid b-gray-300 pt-10px>
                <div flex-center>
                    <DatePicker v-model="stm_chart" dateFormat="yy-mm-dd" w-95px />
                    <Select v-model="sHour_chart" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />
                    <span>-</span>
                    <DatePicker v-model="etm_chart" dateFormat="yy-mm-dd" w-95px ml-5px />
                    <Select v-model="eHour_chart" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px />

                    <Button label="查询" size="small" @click="madeChart" :disabled="isLoading" style="padding: 5px 25px;" />
                </div>
                <div flex-end>
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
                    <div flex-center ml-10px v-tooltip="'合成流量'">
                        <Checkbox v-model="selectOption" inputId="ingredient6" name="size" value="合成流量" />
                        <label for="ingredient6" ml-5px> 合成流量 </label>
                    </div>
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="siteVisible" modal :header="siteTitle">
            <div w-780px h-350px class="page-main" p-0px>
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
import dayjs from 'dayjs';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { listHss, getCcByStcd, getgcx } from '@/api/url.js';
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
const selectOption = ref(['水位', '合成流量'])

const visible = ref(false)
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
    { field: "stnm", title: "站名", headerName: '站名', align: 'center', width: 80 },
    { field: "stcd", title: "站码", headerName: '站码', align: 'center', width: 80 },
    { field: "pc", title: "计划测次", headerName: '计划测次', align: 'center', width: 90 },
    { field: "sc", title: "实际测次", headerName: '实际测次', align: 'center', width: 90 },
    { field: "tm", title: "测流时间", headerName: '测流时间', align: 'center', width: 100 },
    { field: "gz", title: "规则", headerName: '规则', align: 'center' },
])
const defColOption2 = {}

onMounted(() => {
    stm_chart.value = stm.value = dayjs().add(-150, "d").format("YYYY-MM-DD");
    etm_chart.value = etm.value = dayjs().format("YYYY-MM-DD");
    sHour_chart.value = eHour_chart.value = sHour.value = eHour.value = dayjs().format("HH");

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
        { field: "length", title: "洪水场次", headerName: '洪水场次' },
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

// 渲染图表
const setOption = (data, events_data) => {
    let zdata = [], qdata = [];
    let data_q_sc = [], data_q_rzx = [], data_q_yzx = [], hcll = [];
    let ltz_data = [], rhj_data = [];
    let minz = Infinity, maxz = -Infinity;
    let minq = Infinity, maxq = -Infinity;
    let events = events_data || [];

    data && data.forEach(item => {
        let tm = item.tm;
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
    ltz_chart.value && ltz_chart.value.forEach(item => {
        ltz_data.push({value: [item.tm, item.z]})

        // minz = Math.min(minz, item.z);
        // maxz = Math.max(maxz, item.z);
    })
    rhj_chart.value && rhj_chart.value.forEach(item => {
        rhj_data.push({value: [item.tm, item.z]})
    })
    const result = filterByRanges(data, events) || [];
    let series = [], areas = [];
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
                    color: "#ff00ff",
                    width: 2,
                },
            },
            itemStyle: {
                normal: {
                    color: "orange",
                    width: 3,
                },
            },
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
            // formatter: this.tooltipFormatterkr,
        },
        legend: [
            {
                show: false,
                data: [],
                selected: {
                    "水位": true,
                    "报汛流量": false,
                    "软在线流量": false,
                    "硬在线流量": false,
                    "实测流量": false,
                    "合成流量": true,
                    "鲁台子水位": false,
                    "润河集水位": false,
                }
            }
        ],
        brush: {
            transformable: false,
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
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
                    { type: "min", name: "最小值" },
                    ],
                },
                // markArea: {
                //     itemStyle: {
                //         color: 'rgba(255, 173, 177, 0.4)'
                //     },
                //     data: events.value
                // }
            },{
                name: '鲁台子水位',
                type: 'line',
                yAxisIndex: 0,
                showSymbol: false,
                hoverAnimation: false,
                animationDuration: 5000,
                data: ltz_data,
                lineStyle: {
                    normal: {
                        color: "#009e96",
                        width: 2,
                    },
                }
            },{
                name: '润河集水位',
                type: 'line',
                yAxisIndex: 0,
                showSymbol: false,
                hoverAnimation: false,
                animationDuration: 5000,
                data: rhj_data,
                lineStyle: {
                    normal: {
                        color: "#ffba00",
                        width: 2,
                    },
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
                        color: "#000000", //e98400
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
                        color: "#ff00ff",
                        width: 3,
                    },
                },
            },
            ...series,
            // {
            //     name: "合成流量",
            //     type: "line",
            //     yAxisIndex: 1,
            //     data: hcll,
            //     connectNulls: true,
            //     showSymbol: false,
            //     symbolSize: 10,
            //     hoverAnimation: false,
            //     label: {
            //         normal: {
            //             show: true,
            //             position: "top",
            //         },
            //     },
            //     lineStyle: {
            //         normal: {
            //             color: "#ff00ff",
            //             width: 2,
            //         },
            //     },
            //     itemStyle: {
            //         normal: {
            //             color: "orange",
            //             width: 3,
            //         },
            //     },
            // },
        ]
    }

    myChart && myChart.setOption(option, true);
    // 配置框选内容
    myChart.dispatchAction({
        type: 'brush',
        areas: areas
    });
    myChart && myChart.resize();

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
const getList = () => {
    isLoading.value = true;
    let params = {
        stcd: '50101100',
        stcds: [ "50101100", "50101000", "50400200","50100900" ],
        stime: dayjs(stm.value).format("YYYY-MM-DD ") + `${sHour.value}:00`,
        etime: dayjs(etm.value).format("YYYY-MM-DD ") + `${eHour.value}:00`,
    }

    getCcByStcd(params).then(res => {
        isLoading.value = false;
        if(res.code === 0) {
            tableData.value = [
                { stnm: "王家坝", stcd: "50101100", length: res.data.events.length, events: res.data.events, listBxsw: res.data.listBxsw },
            ];

            setTimeout(() => {
                gridApi && gridApi.hideOverlay();
                gridApi && gridApi.sizeColumnsToFit();
            }, 50);
        }
    });
}

// 查询过程线数据
const madeChart = () => {
    isLoading.value = true;
    myChart && myChart.showLoading();
    let params = {
        stcd: '50101100',
        stcds: [ "50101100", "50101000", "50400200","50100900" ],
        stime: dayjs(stm_chart.value).format("YYYY-MM-DD ") + `${sHour_chart.value}:00`,
        etime: dayjs(etm_chart.value).format("YYYY-MM-DD ") + `${eHour_chart.value}:00`,
    };

    getCcByStcd(params).then(res => {
        isLoading.value = false;
        if(res.code === 0) {
            setOption(res.data.listBxsw, res.data.events);

            myChart && myChart.hideLoading();
        }
    })
}

// 查看过程线
const handleSiteClick = (data) => {
    visible.value = true;
    search_kzz(data);

    setTimeout(() => {
        initChart();

        // setOption(data.listBxsw, data.events);
        // myChart && myChart.hideLoading();
    }, 0);
}

const search_kzz = async (data) => {
    let params1 = {
        stcds: ['50103100'],
        stime: dayjs(stm_chart.value).format("YYYY-MM-DD ") + `${sHour_chart.value}:00`,
        etime: dayjs(etm_chart.value).format("YYYY-MM-DD ") + `${eHour_chart.value}:00`,
    }
    let params2 = {
        stcds: ['50102350'],
        stime: dayjs(stm_chart.value).format("YYYY-MM-DD ") + `${sHour_chart.value}:00`,
        etime: dayjs(etm_chart.value).format("YYYY-MM-DD ") + `${eHour_chart.value}:00`,
    }
    const res1 = await getgcx(params1)
    const res2 = await getgcx(params2)

    if(res1.code == 0) {
        ltz_chart.value = res1.data;
    }
    if(res2.code == 0) {
        rhj_chart.value = res2.data;
    }

    setOption(data.listBxsw, data.events);
    myChart && myChart.hideLoading();
}

// 查看详情
const handlePreview = (data) => {
    siteVisible.value = true;
    siteTitle.value = `${data.stnm} 测报详情`;
    let params = {
        stcds: [ "50101100","50101000","50400200","50100900"],
        stcdTs: ["50103100", "50102350"],
        events: data.events,
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
    }

    listHss(params).then(res => {
        if(res.code === 0) {
            siteViewData.value = res.data;
        }
    })
}

// 导出
const handleExport = () => {
  const config = {
    headers: [
        { field: "stnm", title: "站名", headerName: '站名', width: 20 },
        { field: "stcd", title: "站码", headerName: '站码', width: 20 },
        { field: "length", title: "洪水场次", headerName: '洪水场次', width: 20 },
    ],
    data: tableData.value,
    headerDeep:1,
    fileName: '站点以测补报数据'
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
    if(params.includes("润河集水位")) {
        selected["润河集水位"] = true;
    } else {
        selected["润河集水位"] = false;
    }
    if(params.includes("鲁台子水位")) {
        selected["鲁台子水位"] = true;
    } else {
        selected["鲁台子水位"] = false;
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
    if(params.includes("合成流量")) {
        selected["合成流量"] = true;
    } else {
        selected["合成流量"] = false;
    }
    
    myChart.setOption({
        legend: {
            data: [],
            selected: selected
        },
    })
}, {deep: true});

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

</script>

<style>
</style>