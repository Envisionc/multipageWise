import { base_url } from "./base";
import axios from "axios";

//设置超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const url_map = {
    login_url: `${base_url}/mde-person/campus/app/login`,
}

export default {
    getLogin(params) {
        return axios.post(url_map.login_url, params).then(res => res.data)
    }
}