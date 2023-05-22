import qs from 'qs';
import State from '@/tools/state';
import axios from 'axios';
import { baseConfig } from '@/config';
import { deleteEmptyOption } from '@/tools/tools';

/**
 * 请求类(封装axios)
 */
class RequestClass {
    servers;

    constructor(baseURL) {

        // 初始化servers
        this.servers = axios.create({
            baseURL,
            headers: {
                'X-Custom-Header': 'foobar',
            },
            timeout: 600000,
            withCredentials: false, // 跨域请求时发送Cookie
        });

        // 请求拦截
        this.servers.interceptors.request.use(function (config) {

            if (sessionStorage.getItem('info')) {
                // eslint-disable-next-line no-param-reassign
                config.headers = {
                    ...config.headers,
                    // 添加token
                    'Authorization': State.userInfo.currentToken,
                };
            } else {
                // eslint-disable-next-line no-param-reassign
                config.headers = { ...config.headers };
            }

            return config;
        }, function (error) {
            return Promise.reject(error || { code: 0, message: '网络繁忙，请稍候再试！' });
        });

        // 响应拦截
        this.servers.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            // 可以把错误处理放到这来
            return Promise.reject(error.response || { code: 0, message: '网络繁忙，请稍候再试！' });
        });
    }

    /**
     * fetch
     * @param method 方法名称
     * @param url 地址
     * @param body 数据
     * @param hasFile 是否有文件
     * @returns {Promise<any>}
     */
    async connection(method = 'get', url, body, hasFile = false) {
        const headers = {};
        // token 处理
        // if (this.isExpires()) {
        //     let res = await this.refreshStatusToken();
        //     State.setTokenInfo(res);
        // }
        // this.setStatusToken();

        // 参数有文件时，修改请求头
        if (hasFile) headers['Content-Type'] = 'multipart/form-data';
        if (State.isLogin && State.userInfo.currentToken) headers['Authorization'] = State.userInfo.currentToken;

        // 基本请求信息处理
        method = method.toLocaleLowerCase();
        let data = typeof body === 'object' ? deleteEmptyOption(body) : {};

        // get请求参数处理
        if (method === 'get') {
            url = url + (url.indexOf('?') >= 0 ? '&' : '?' + qs.stringify(body));
            body = {};
        }

        // 发送请求, 封装错误和结果数据
        let error, reslutData;
        return this.servers({ method, url, data, headers })
            .then((result) => {
                const { data, headers } = result;
                if (data.code && data.code !== 200) return [{ message: data.message }, data, headers];
                return [error, data, headers];
            })
            .catch((e) => {
                error = this.errorHandle(e);
                return [error, reslutData];
            });
    }

    /**
     * 错误处理
     */
    errorHandle(error) {
        let res = {};
        if (error.status) {
            switch (error.status) {
                case 400: res.message = error.data.message || 'status:400, 发出的请求有错误'; break;
                case 401: res.message = error.data.message || 'status:401, 没有权限（令牌、用户名、密码错误）。'; break;
                case 403: res.message = error.data.message || 'status:403, 访问被禁止'; break;
                case 404: res.message = error.data.message || 'status:404, 页面未找到或接口不存在'; break;
                case 405: res.message = error.data.message || 'status:405, 请求方法与服务器不一致'; break;
                case 406: res.message = error.data.message || 'status:406, 请求的格式不可得。'; break;
                case 410: res.message = error.data.message || 'status:410, 请求的资源被永久删除'; break;
                case 422: res.message = error.data.message || 'status:422, 验证错误。'; break;
                case 500: res.message = error.data.message || 'status:500, 服务器出错，请联系管理员'; break;
                case 502: res.message = error.data.message || 'status:502, 网关错误。'; break;
                case 503: res.message = error.data.message || 'status:503, 服务不可用，服务器暂时过载或维护。'; break;
                case 504: res.message = error.data.message || 'status:504, 网关超时。'; break;
            }
        }
        else {
            res = error;
        }
        return res;
    }


    /**
     * 为请求头设置token
     */
    setStatusToken() {
        const { userInfo: user } = State;
        if (State.isLogin && user) {
            this.servers.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        }
    }

    /**
     * 检查token是否快要过期或者已经过期
     */
    isExpires() {
        const { tokenInfo: { expires_in } } = State;
        return expires_in - new Date() < 5;
    }

    /**
     * 刷新token
     */
    async refreshStatusToken() {
        this.servers({ method: 'get', url: `/singleLogin/refresh/${1}` })
            .then(() => {
            })
            .catch(() => {
            });
    }

    /**
     * 设置嵌套formData
     */
    setFormData(formData, params, prefix = '') {
        prefix = prefix ? prefix + '.' : '';
        for (const key in params) {
            if ({}.hasOwnProperty.call(params, key)) {
                if (params[key] && (params[key] instanceof Array)) {
                    params[key].forEach((item, index) => {
                        if (typeof item === 'object') {
                            this.setFormData(formData, item, `${prefix}${key}[${index}]`);
                        } else
                            formData.append(`${prefix}${key}[${index}]`, item);
                    });
                } else if (typeof params[key] === 'object') {
                    this.setFormData(formData, params[key], `${prefix}${key}`);
                } else
                    formData.append(`${prefix}${key}`, params[key]);
            }
        }
    }
}

export default RequestClass;
export const baseReq = new RequestClass(baseConfig.service.proxy);
export const userCenterReq = new RequestClass('http://');
