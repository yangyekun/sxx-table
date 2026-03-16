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