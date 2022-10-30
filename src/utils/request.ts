import axios from 'axios';
import { ElMessage } from 'element-plus';
import { Session } from '@/utils/storage';

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			// (<any>config.headers).common['Authorization'] = `${Session.get('token')}`;
			(config.headers as any).Authorization = `Bearer ${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code !== '00000') {
			// `token` 过期或者账号已在别处登录
			if (res.code === 401 || res.code === 4001) {
				// Session.clear(); // 清除浏览器全部临时缓存
				// window.location.href = '/'; // 去登录页
				Session.clear();
				if (window.opener) {
					window.close();
				} else {
					window.open('http://123.60.45.29:10081/gateway/#/dashboard');
					window.close();
				}
				// ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
				// 	.then(() => { })
				// 	.catch(() => { });
			} else {
				ElMessage.error(res.msg);
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return response.data;
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data.code === 'A0231') {
				Session.clear();
				if (window.opener) {
					window.close();
				} else {
					window.open('http://123.60.45.29:10081/gateway/#/dashboard');
					window.close();
				}
			}
			if (error.response.data) ElMessage.error(error.response.data.msg);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

/**
 * 后期修改刷新token
 * let refreshing = false,// 正在刷新标识，避免重复刷新
waitQueue = [] // 请求等待队列

service.interceptors.response.use(
response => {
const {code, msg, data} = response.data
if (code !== '00000') {
if (code === 'A0230') { // access_token过期 使用refresh_token刷新换取access_token
const config = response.config
if (refreshing == false) {
refreshing = true
const refreshToken = getRefreshToken()
return store.dispatch('user/refreshToken', refreshToken).then((token) => {
config.headers['Authorization'] = 'Bearer ' + token
config.baseURL = '' // 请求重试时，url已包含baseURL
waitQueue.forEach(callback => callback(token)) // 已刷新token，所有队列中的请求重试
waitQueue = []
return service(config)
}).catch(() => { // refresh_token也过期，直接跳转登录页面重新登录
MessageBox.confirm('当前页面已失效，请重新登录', '确认退出', {
confirmButtonText: '重新登录',
cancelButtonText: '取消',
type: 'warning'
}).then(() => {
store.dispatch('user/resetToken').then(() => {
location.reload()
})
})
}).finally(() => {
refreshing = false
})
} else {
// 正在刷新token，返回未执行resolve的Promise,刷新token执行回调
return new Promise((resolve => {
waitQueue.push((token) => {
config.headers['Authorization'] = 'Bearer ' + token
config.baseURL = '' // 请求重试时，url已包含baseURL
resolve(service(config))
})
}))
}
} else {
Message({
message: msg || '系统出错',
type: 'error',
duration: 5 * 1000
})
}
}
return {code, msg, data}
},
error => {
return Promise.reject(error)
}
)
 */

// 导出 axios 实例
export default service;
