import { base_url } from "./base";
import axios from "axios";

//设置超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const url_map = {
    gateSummary_url: `${base_url}/api/mde-person/campus/app/gateAttendanceRecord/gateSummary`,
}

export default {
    gateSummary(params) {
        return axios.post(url_map.gateSummary_url, params).then(res => res.data);
    },
}