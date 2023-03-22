import axios from 'axios'; // 引入axios
import lodash from 'lodash';


var Request = axios.create(
    {

        timeout: 1000000,
        headers: { 'X-Custom-Header': 'foobar', 'userAgent': navigator.userAgent }
    }
);

Request.interceptors.request.use(async config => {

    var storage = window.localStorage;
    var token=storage.getItem("token");
    
    let DefaultOptions = {
        headers: { "token":token }
    };


    return lodash.merge(config, DefaultOptions);
}, error => {
    return Promise.reject(error);
});

var fetchError=(a,b,v)=>{

};
Request.interceptors.response.use(response => {
    let { data, config } = response;

    if (data === '') {
        let message = '数据不存在';
        fetchError(message, 200, config);
        return Promise.reject(message);
    }

    let { resCode, message } = data;

    if (resCode===-2) {
        let message = 'token不合法或者已经过期';
        fetchError(message, -2, config);
        return Promise.reject(message);
    }

    // if (resCode!==0) {
    //     fetchError(message, resCode, config);
    //     return Promise.reject(message);
    // }
    
    return response;
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '错误请求';
                break;
            case 401:
                error.message = '未授权，请重新登录';
                break;
            case 403:
                error.message = '拒绝访问';
                break;
            case 404:
                error.message = '请求错误,未找到该资源';
                break;
            case 405:
                error.message = '请求方法未允许';
                break;
            case 408:
                error.message = '请求超时';
                break;
            case 500:
                error.message = '服务器端出错';
                break;
            case 501:
                error.message = '网络未实现';
                break;
            case 502:
                error.message = '网络错误';
                break;
            case 503:
                error.message = '服务不可用';
                break;
            case 504:
                error.message = '网络超时';
                break;
            case 505:
                error.message = 'http版本不支持该请求';
                break;
            default:
                error.message = `连接错误${error.response.status}`;
        }
        let errorData = {
            status: error.response.status,
            message: error.message,
            config: error.response.config
        };
        fetchError(errorData.message, errorData.status, errorData.config);
    } else {
        fetchError(error.message, '000', error.config);
    }
    return Promise.reject(error);
});
Request.all = axios.all;
Request.spread = axios.spread;
export default Request
