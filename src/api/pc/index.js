import { base_url } from "./base";
import axios from "axios";

//设置超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const url_map = {
    login_url: `${base_url}/api/mde-person/campus/app/login`,
    orgList_url: `${base_url}/api/mde-person/campus/back/org/showOrgList`,
    showOrg_url: `${base_url}/api/mde-person/campus/back/org/showOrg`,
    orgAdd_url: `${base_url}/api/mde-person/campus/back/org/add`,
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
    }
}