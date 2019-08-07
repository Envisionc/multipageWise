import { base_url } from "./base";
import axios from "axios";
import config from '../../../config'

let baseUrl;
console.log(location.hostname, "location.hostname")
if (location.hostname == 'https://api-fat.yoowang.com') { //测试环境
    baseUrl = 'https://api-fat.yoowang.com';
} else if (location.hostname == 'https://api.yoowang.com') { //正式环境
    baseUrl = 'https://api.yoowang.com';
} else { //开发环境
    baseUrl = '/api'
}
console.log(baseUrl)
// axios.defaults.baseURL = config.urlData.server_url;
axios.defaults.baseURL = base_url;
//设置超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const url_map = {
    login_url: config.urlData.server_url + "/mde-person/campus/back/login",
    orgList_url: config.urlData.server_url + "/mde-person/campus/back/org/showOrgList",
    showOrg_url: config.urlData.server_url + "/mde-person/campus/back/org/showOrg",
    orgAdd_url: config.urlData.server_url + "/mde-person/campus/back/org/add",
    organization_url: config.urlData.server_url + "/mde-person/campus/back/organization/queryAllOrg",
    personList_url: config.urlData.server_url + "/mde-person/campus/back/person/queryPage",
    querySub_url: config.urlData.server_url + "/mde-person/campus/back/organization/querySubOrg",
    searchPerson_url: config.urlData.server_url + "/mde-person/campus/back/person/searchPerson",
    queryPersons_url: config.urlData.server_url + "/mde-person/campus/back/gateAttendanceGroup/queryPersons",
}
console.log(url_map, "-----------1--------")
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
    },
    // 人员管理-根据学号姓名查询人员
    searchPerson(params) {
        return axios.post(url_map.searchPerson_url, params).then(res => res.data)
    },
    // 考勤-查询选中人员
    queryPersons(params) {
        return axios.post(url_map.queryPersons_url, params).then(res => res.data)
    }
}