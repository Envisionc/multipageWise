import { base_url } from "./base";
import axios from "axios";

let baseUrl
console.log(location.hostname, "location.hostname")
if (location.hostname == 'https://api-fat.yoowang.com') { //测试环境
    baseUrl = 'https://api-fat.yoowang.com';
} else if (location.hostname == 'https://api.yoowang.com') { //正式环境
    baseUrl = 'https://api.yoowang.com';
} else { //开发环境
    baseUrl = '/api'
}
axios.defaults.baseURL = baseUrl;

//设置超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const url_map = {
    login_url: `${base_url}/mde-person/campus/app/login`,
    gateSummary_url: `${base_url}/mde-person/campus/app/gateAttendanceRecord/gateSummary`,
    allOrg_url: `${base_url}/mde-person/campus/app/organization/queryAllOrg`,
    queryRecords_url: `${base_url}/mde-person/campus/app/gateAttendanceRecord/queryRecords`,
    recordsDetail_url: `${base_url}/mde-person/campus/app/gateAttendanceRecord/queryRecordsDetail`,
}

export default {
    // 登录获取token
    getLogin(params) {
        return axios.post(url_map.login_url, params).then(res => res.data)
    },
    // 校门考勤汇总
    gateSummary(params) {
        return axios.post(url_map.gateSummary_url, params).then(res => res.data);
    },
    // 获取树形组织架构APP
    getAllOrg(params) {
        return axios.post(url_map.allOrg_url, params).then(res => res.data);
    },
    // 校门考勤记录列表筛选接口
    getQueryRecords(params) {
        return axios.post(url_map.queryRecords_url, params).then(res => res.data)
    },
    // 每一条记录的详情
    getRecordsDetail(params) {
        return axios.post(url_map.recordsDetail_url, params).then(res => res.data)
    }
}