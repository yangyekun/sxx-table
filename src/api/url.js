import http from '@/utils/http.js';

// 杨乐乐
// 同步气象雨量数据记录
export function selectQXRainSyc(data) {
  return http({
    url: `/cj/water/selectQXRainSyc?stm=${data.stime}&etm=${data.etime}`,
    method: 'get'
  });
}

//库湖最大拦蓄水量
export function getMaxMinWDiffRule() {
  return http({
    url: `/jb/water/getMaxMinWDiffRule`,
    method: 'get'
  });
}

export function getMaxMinWDiff(data) {
  return http({
    url: `/jb/water/getMaxMinWDiff?btime=${data.stime}&etime=${data.etime}&stationType=${data.stationType}&timeType=${data.timeType}`,
    method: 'get'
  });
}

// 站点统计
export function getStationCount(data) {
  return http({
    url: "/jb/station/getStationCount",
    method: 'get'
  });
}

// 逐日总蓄水
export function getTotalW(data) {
  return http({
    url: `/jb/hq/getTotalW?startTime=${data.stime}&endTime=${data.etime}`,
    method: 'get'
  });
}

// 尹权哲 
// 站点以测补报
// const prefix = '/data';
const prefix = '/water-flood/data';

export function getYcbb(data) {
  return http({
    url: prefix + '/v1/ycbb',
    method: 'post',
    data
  });
}

export function getgcx(data) {
  return http({
    url: prefix + '/v1/getgcx',
    method: 'post',
    data
  });
}

export function getCsdata(data) {
  return http({
    url: prefix + '/v1/getCsdata',
    method: 'post',
    data
  });
}

export function listHss(data) {
  return http({
    url: prefix + '/listHss',
    method: 'post',
    data
  });
}

export function getCcByStcd(data) {
  return http({
    url: prefix + '/getCcByStcd',
    method: 'post',
    data
  });
}

// 逐潮高低潮摘录
export function getGdz(data) {
  return http({
    url: prefix + '/getGdzs',
    // url: prefix + '/getGdz',
    method: 'post',
    data
  });
}

// 获取用户
export function userid(params) {
    return http({
        url: `/cj/shebei/getSheBeiTail?userid=${params}`,
        method: 'get',
    });
}
// 重点工作台账保存
export function submit(data) {
    return http({
        url: `/cj/api/report/submit`,
        method: 'post',
        data
    });
}
// 重点工作台账列表
export function reportList(params) {
    return http({
        url: `/cj/api/report/list?userId=${params}`,
        method: 'get',
    });
}
// 重点工作台账历史修改记录
export function listHistory(params) {
    return http({
        url: `/cj/api/report/listHistory`,
        method: 'get',
    });
}

// 逐日总蓄水
export function getRsvrFeatureLevel(data) {
  return http({
    url: '/jb/water/getRsvrFeatureLevel',
    method: 'post',
    data
  });
}

// 遥测数据异常情况填报
export function selectFaultReport(data) {
  return http({
    url: `/cj/record/selectFaultReport?${data}`,
    method: 'get'
  });
}

// 遥测数据异常情况填报更新
export function updateFaultReport(data) {
  return http({
    url: `/cj/record/updateFaultReport`,
    method: 'post',
    data
  });
}

export function get3hRainForecast(data) {
  return http({
    url: `/jb/huaiwei/get3hRainForecastImageBase64?startTime=${data.time}&rainHour=${data.hour}`,
    method: 'get'
  });
}

export function waterStorageList(data) {
  return http({
    url: `/cj/waterStorage/list?startTime=${data.stime}&endTime=${data.etime}&hour=${data.hour}`,
    method: 'get'
  });
}

export function waterStorageRefresh(data) {
  return http({
    url: `/cj/waterStorage/refresh?startTime=${data.stime}&endTime=${data.etime}&hour=${data.hour}`,
    method: 'get'
  });
}