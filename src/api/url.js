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
// 站点已测补报
export function listHs(data) {
  return http({
    url: '/water-flood/data/listHs',
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
