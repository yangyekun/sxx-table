import axios from 'axios';

const http = axios.create({
  // baseURL: 'http://192.168.5.39:8080',
  baseURL: 'http://10.34.1.25:8010',
  timeout: 60000 * 5
});

const duration = 3500;

http.interceptors.request.use(config => {
  // if (!config.noToken) {
  //   config.headers.token = sessionStorage.getItem('token');
  // }
  return config;
}, error => {
  console.log(error);
});

http.interceptors.response.use(response => {
  if (!response.config.noCode) {
    if(response.data.code !== 0) {
      const msg = response.config.errMsg || response.data.msg;

      if(response.data.msg == '凭证已失效') {
        sessionStorage.clear();
        location.reload();
      }
    }
  }
  return response.data;
}, error => {
  console.log(error);
  const code = error.response.status;
  switch (code) {
  case 401:
    msg = '当前登录已过期，请重新登录';
    break;
  case 403:
    msg = `请求已被拒绝: ${error.config.url}`;
    break;
  case 404:
    msg = `请求不存在: ${error.config.url}`;
    break;
  case 500:
    msg = `服务内部错误: ${error.config.url}`;
    break;
  case 502:
    msg = '服务网关错误';
    break;
  case 503:
    msg = '服务暂时不可用';
    break;
  case 504:
    msg = '网关超时';
    break;

  default:
    break;
  }
  if (code === 401) {
    setTimeout(() => {
      sessionStorage.clear();
      location.reload();
    }, duration);
  }
});

export default http;
