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
                <span class="point-label">潮位站高低潮摘录</span>
                </div>
            </div>
            <div>
                <span>查询时间：</span>
                <DatePicker v-model="stm" dateFormat="yy-mm-dd" w-110px />
                <!-- <Select v-model="sHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px /> -->
                <span m-x-5px>-</span>
                <DatePicker v-model="etm" dateFormat="yy-mm-dd" w-110px />
                <!-- <Select v-model="eHour" :options="hourArr" optionLabel="label" optionValue="value" w-70px m-x-5px /> -->
                <!-- <span ml-15px>测站选择：</span>
                <Select v-model="stcd" :options="siteArr" optionLabel="stnm" optionValue="stcd" w-120px /> -->

                <Button label="查询" size="small" @click="getList" :disabled="isLoading" ml-10px style="padding: 5px 25px;" />
                <Button label="潮位摘录数据" size="small" severity="success" v-if="tabledata.length" @click="handleShowTable" ml-10px style="padding: 5px 25px;"  />
            </div>
        </div>

        <div class="page-main">
            <div id="myChart" wh-full></div>
        </div>

        <Dialog v-model:visible="visible" modal>
            <template #header>
                <div flex-between>
                    <h3>{{ headerTitle }}</h3>
                    <p absolute top-22px right-60px><i title="导出" class="pi pi-download" cursor-pointer style="font-size: 15px;" @click="exportData"></i></p>
                </div>
            </template>
            <div w-1080px h-440px class="page-main" p-0px>
                <ag-grid-vue
                    class="ag-theme-alpine"
                    style="flex: 1;"
                    :rowData="tabledata" 
                    :columnDefs="columnDefs" 
                    @grid-ready="onGridReady"
                    :defaultColDef="defColOption"
                    theme="legacy"
                >
                </ag-grid-vue>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { getGdz } from "@/api/url.js";
import { AgGridVue } from "ag-grid-vue3";
import { useToast } from 'primevue/usetoast';
import { getInterval1 } from '@/utils/chartUtil.js'

defineOptions({
  name: 'cwgdczl'
})

const toast = useToast()

const stm = ref('')
const etm = ref('')
const stcd = ref('')
const siteArr = ref([])
const isLoading = ref(false)

const visible = ref(false)
const headerTitle = ref('摘录数据')
const tabledata = ref([])
const columnDefs = ref([])

let gridApi, myChart;
const defColOption = {
  // sortable: false,
  // suppressSizeToFit: true,
  // wrapText: true, 
  // autoHeight: true,
  // editable: true,
  // filter: "agSetColumnFilter"
}
onMounted(() => {
    stm.value = dayjs().add(-2, "d").format("YYYY-MM-DD");
    etm.value = dayjs().format("YYYY-MM-DD");

    initChart();
    getList();

    columnDefs.value = [
        { field: "index", title: "序号", headerName: "序号", width: 50, },
        { field: "maxPoint_waterLevel", title: "最高潮位", headerName: '最高潮位', width: 80 },
        { field: "maxPoint_time", title: "时间", headerName: '时间', width: 120 },
        { field: "minPoint_waterLevel", title: "最低潮位", headerName: '最低潮位', width: 80 },
        { field: "minPoint_time", title: "时间", headerName: '时间', width: 120 },
        { field: "secondMaxPoint_waterLevel", title: "次高潮位", headerName: '次高潮位', width: 80 },
        { field: "secondMaxPoint_time", title: "时间", headerName: '时间', width: 120 },
        { field: "secondMinPoint_waterLevel", title: "次低潮位", headerName: '次低潮位', width: 80 },
        { field: "secondMinPoint_time", title: "时间", headerName: '时间', width: 120 },
    ]
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
}

const setOption = (data1, data2) => {
    let zdata = [], zldata = [];
    let minz = Infinity, maxz = -Infinity;

    data1 && data1.forEach(item => {
        let tm = item.tm;
        zdata.push({value: [tm, item.z]});

        minz = Math.min(minz, item.z);
        maxz = Math.max(maxz, item.z);
    });
    data2 && data2.forEach(item => {
        zldata.push(
            { value: [item.maxPoint.time?formatTime(item.maxPoint.time):"", item.maxPoint.waterLevel] },
            { value: [item.minPoint.time?formatTime(item.minPoint.time):"", item.minPoint.waterLevel] },
            { value: [item.secondMaxPoint.time?formatTime(item.secondMaxPoint.time):"", item.secondMaxPoint.waterLevel] },
            { value: [item.secondMinPoint.time?formatTime(item.secondMinPoint.time):"", item.secondMinPoint.waterLevel] },
        );
    });

    let diffz = maxz - minz;
    let intervalData = getInterval1({ min: minz, max: maxz, diff: diffz });

    let option = {
        tooltip: {
            trigger: 'axis',
            // formatter: function(params) {
            //     let html = "", tm = params[0].value[0];

            //     params.forEach(item => {
            //         if(item.seriesName == '应测') {
            //             html += item.seriesName
            //         } else if(item.seriesName.includes("水位")) {
            //             html += item.seriesName + ": " + item.value[1] + " m<br>"
            //         } else if(item.seriesName.includes("流量")) {
            //             html += item.seriesName + ": " + item.value[1] + " m³/s<br>"
            //         }
            //     })

            //     return tm + "<br>" + html;
            // },
        },
        legend: {
            show: false
        },
        grid: {
            y: 30,
            y2: 15,
            x: 15,
            x2: 30,
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
                            "{hour|" + date.getHours() +"时}" +
                            "{minute|" + date.getMinutes() + "分}\n" +
                            "{day|" + date.getDate() +"日}"
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
                name: "潮位(m)",
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
            }
        ],
        series: [
            {
                name: '原始数据',
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
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: "white",
                            },
                        },
                    },
                    data: [
                        { type: "max", name: "最大值" },
                        { type: "min", name: "最小值" },
                    ],
                },
            },{
                name: "摘录后数据",
                type: "scatter",
                yAxisIndex: 0,
                data: zldata,
                connectNulls: true,
                showSymbol: false,
                symbol: "circle",
                symbolSize: 13,
                hoverAnimation: false,
                itemStyle: {
                    color: '#rgb(206,93,90)'
                },
                label: {
                    normal: {
                        show: true,
                        position: "top",
                    },
                },
                markPoint: {
                    silent: true,
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: "white",
                            },
                        },
                    },
                    data: [
                        { type: "max", name: "最大值" },
                        { type: "min", name: "最小值" },
                    ],
                },
            }
        ]
    }

    myChart && myChart.setOption(option, true);
    myChart && myChart.resize();
    myChart && myChart.hideLoading();
}

const getList = () => {
    isLoading.value = true;
    myChart && myChart.showLoading();
    let params = {
        stcd: "60115800",
        stime: dayjs(stm.value).format("YYYY-MM-DD ") + `00:00`,
        etime: dayjs(etm.value).format("YYYY-MM-DD ") + `00:00`,
    }

    getGdz(params).then(res => {
        isLoading.value = false
        if (res.code === 0) {
            const {gcx, dailyExtremes} = res.data;
            tabledata.value = dailyExtremes.map((item, index) => {
                return {
                    index: index + 1,
                    maxPoint_time: item.maxPoint.time?formatTime(item.maxPoint.time):'',
                    maxPoint_waterLevel: item.maxPoint.waterLevel,
                    minPoint_time: item.minPoint.time?formatTime(item.minPoint.time):'',
                    minPoint_waterLevel: item.minPoint.waterLevel,
                    secondMaxPoint_time: item.secondMaxPoint.time?formatTime(item.secondMaxPoint.time):'',
                    secondMaxPoint_waterLevel: item.secondMaxPoint.waterLevel,
                    secondMinPoint_time: item.secondMinPoint.time?formatTime(item.secondMinPoint.time):'',
                    secondMinPoint_waterLevel: item.secondMinPoint.waterLevel,
                }
            });
            setOption(gcx, dailyExtremes);
        }
    }).catch(err => {
        toast.add({ severity: 'error', summary: '请求失败，请重试', detail: '', group: 'tc', life: 3000 });
        console.log(err);
    })
}

const handleShowTable = () => {
    visible.value = true;

    setTimeout(() => {
        gridApi && gridApi.sizeColumnsToFit();
    }, 300);
}

const exportData = () => {
    let headers = columnDefs.value.map(item => ({...item, width: 25}));
    const config = {
        headers: headers,
        data: tabledata.value,
        headerDeep:1,
        fileName: "摘录数据"
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

function formatTime(time) {
  return dayjs(time).format("YYYY-MM-DD HH:mm");
}

</script>

<style></style>