import { base_url } from "./base";
import axios from "axios";
import {baseUrl} from '../index'
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