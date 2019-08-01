import { base_url } from "./base";
import axios from "axios";

let baseUrl;
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
    login_url: `${base_url}/mde-person/campus/back/login`,
    orgList_url: `${base_url}/mde-person/campus/back/org/showOrgList`,
    showOrg_url: `${base_url}/mde-person/campus/back/org/showOrg`,
    orgAdd_url: `${base_url}/mde-person/campus/back/org/add`,
    organization_url: `${base_url}/mde-person/campus/back/organization/queryAllOrg`,
    personList_url: `${base_url}/mde-person/campus/back/person/queryPage`,
    querySub_url: `${base_url}/mde-person/campus/back/organization/querySubOrg`,
}
export default {
    // 登录获取token
    getLogin(params) {
        return axios.post(url_map.login_url, params).then(res => res.data)
    },
    // 获取新增组织架构下拉选项
    getOrgList(params) {
        return axios.post(url_map.orgList_url, params).then(res => res.data)
    },
    // 获取当前页面显示的组织架构
    showOrg (params) {
        return axios.post(url_map.showOrg_url, params).then(res => res.data)
    },
    // 保存添加的组织架构
    addOrg(params) {
        return axios.post(url_map.orgAdd_url, params).then(res => res.data)
    },
    // 获取组织架构树形结构
    getTreeOrg(params) {
        return axios.post(url_map.organization_url, params).then(res => res.data)
    },
    // 获取搜索人员管理-人员列表
    getPersonList(params) {
        return axios.post(url_map.personList_url, params).then(res => res.data)
    },
    // 查询下属组织架构
    querySubOrg(params) {
        return axios.post(url_map.querySub_url, params).then(res => res.data)
    }
}