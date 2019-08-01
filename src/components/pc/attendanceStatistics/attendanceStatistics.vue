<template>
    <div class="content">
        <div class="main">
            <div class="top-operate">
                <div class="item-line clearfix">
                    <div class="item">
                        <p class="name">状态：</p>
                        <el-select v-model="stateValue" clearable placeholder="请选择">
                            <el-option
                            v-for="item in stateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item">
                        <p class="name">人员类型：</p>
                        <el-select v-model="personTypeValue" clearable placeholder="请选择">
                            <el-option
                            v-for="item in identityOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item">
                        <p class="name">方向：</p>
                        <el-select v-model="directionValue" clearable placeholder="请选择">
                            <el-option
                            v-for="item in directionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item">
                        <p class="name">通过时间：</p>
                        <div class="picktime">
                            <el-date-picker
                                v-model="passTime"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="['12:00:00']">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div class="item-line clearfix">
                    <div class="item">
                        <p class="name">选择组织：</p>
                        <!-- <el-select v-model="orgTypeValue" clearable placeholder="请选择">
                            <el-option
                            v-for="item in tissueTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> -->
                        <el-cascader
                            v-model="value"
                            clearable
                            :options="orgOptions"
                            :props="newprops"
                            @change="handleChange">
                        </el-cascader>
                    </div>
                    <div class="item">
                        <div class="label">
                            <el-input v-model="no" class="add-width" placeholder="请输入学生姓名或学/工号查询"></el-input>
                        </div>
                    </div>
                    <div class="item l-margin"><div class="search" @click="doSearch(1)">查询</div></div>
                    <div class="item"><div class="search reset" @click="doReset()">重置</div></div>
                    <div class="item"><div class="search reset" @click="doExport()">导出</div></div>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                style="width: 96%;"
                :header-cell-style="{background:'#fafafa'}"
                id="export-table">
                <el-table-column
                    prop="name"
                    label="姓名"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="personNo"
                    label="学号"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="grade"
                    label="年级"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="personClass"
                    label="班级"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="personType"
                    label="身份类型"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="accessType"
                    label="方向"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="recordTime"
                    label="通过时间"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="attendanceStatus"
                    label="状态"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="抓取照片"
                    align="center">
                    <template slot-scope="scope">
                        <span class="btn conventional" @click="checkPicture(scope.row)">查看</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog width="30%" title="查看抓取照片" :visible.sync="dialogTableVisible">
                <div class="img-box" style="width: 100%;height: 300px;">
                    <img :src="facePicture" v-if="facePicture" >
                    <span v-else>暂无抓取照片</span>
                </div>
            </el-dialog>
            <div class="pagi">
                <el-pagination
                background
                layout="prev, pager, next"
                @current-change="changePage"
                :page-size="pageSize"
                :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import XLSX from 'xlsx'
import uuid from '../../../utils/common'
import util from '../../../utils/excelUtil'
export default {
    data () {
        return {
            stateValue: '',
            personTypeValue: '',
            directionValue: '',
            orgTypeValue: '',
            tableData: [
                {
                    name: '张三',
                    stuNumber: '456126546',
                    stuGrade: '',
                    stuClass: '',
                    identityType: '教师',
                    direction: '进',
                    byTheTime: '2019-05-15 08:51:08',
                    state: '迟到'
                },
                {
                    name: '李四',
                    stuNumber: '586126546',
                    stuGrade: '一年级',
                    stuClass: '一(二)班',
                    identityType: '学生',
                    direction: '进',
                    byTheTime: '2019-05-15 08:51:08',
                    state: '迟到'
                },
                {
                    name: '王五',
                    stuNumber: '5861294146',
                    stuGrade: '二年级',
                    stuClass: '二(五)班',
                    identityType: '学生',
                    direction: '出',
                    byTheTime: '2019-05-19 18:51:08',
                    state: '正常'
                }
            ],
            // 状态 '0:正常 1:迟到 2:早退 3:请假 4:异常 5:旷课 6:晚未出'
            stateOptions: [
                {
                    value: '0',
                    label: '迟到'
                },
                {
                    value: '1',
                    label: '正常'
                },
                {
                    value: '2',
                    label: '早退'
                },
                {
                    value: '3',
                    label: '请假'
                },
                {
                    value: '4',
                    label: '异常'
                },
                {
                    value: '5',
                    label: '旷课'
                },
                {
                    value: '6',
                    label: '晚未出'
                },
            ],
            // 人员类型 0为其他，1为学生，2为教职工，3为访客，4为校友
            identityOptions: [
                {
                    value: '0',
                    label: '其他'
                },
                {
                    value: '1',
                    label: '学生'
                },
                {
                    value: '2',
                    label: '教职工'
                },
                {
                    value: '3',
                    label: '访客'
                },
                {
                    value: '4',
                    label: '校友'
                }
            ],
            // 方向类型
            directionOptions: [
                {
                    value: '0',
                    label: '进'
                },
                {
                    value: '1',
                    label: '出'
                }
            ],
            tissueTypes: [],
            pageSize: 1,
            total: 3,
            passTime: '',
            no: '',
            requestId: '', //必填入参
            facePicture: '', // 抓取照片
            dialogTableVisible: false, //图片dailog默认不显示
            orgOptions: [], //组织架构
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            value: [],
            newprops: {
                label: 'name',
                value: 'orgId',
                children: 'subOrg'
            },
            selectOrgsArr: [], //选择的架构
        }
    },
    mounted() {
        this.getTree()
        // 查询
        this.doSearch(1)
    },
    methods: {
        // 获取架构树形结构
        getTree() {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID()
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {}
            }
            axios({
                url: '/mde-person/campus/back/organization/queryAllOrg',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    let obj = res.data.data[0]
                    let arr = []
                    arr.push(obj)
                    this.options = arr
                    this.newOptions(this.options)
                    this.orgOptions = this.options
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        newOptions(arr) {
            arr.forEach((item) =>{
                if (item.subOrg.length == 0) {
                    delete item.subOrg
                } else {
                    this.newOptions(item.subOrg)
                }
            })
        },
        // 选择组织架构
        handleChange(value) {
            this.selectOrgsArr = value
        },
        // 考勤统计-列表展示 查询
        doSearch(page) {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID()
            let parma = {}
            parma["attendanceStatus"] = this.stateValue
            parma["personType"] = this.personTypeValue
            parma["accessType"] = this.directionValue
            parma["acrossStartTime"] = this.passTime[0]
            parma["acrossEndTime"] = this.passTime[1]
            parma["orgIds"] = this.selectOrgsArr
            parma["nameOrPersonNo"] = this.no
            parma["pageNo"] = page
            console.log(parma, "参数列表")
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": parma
            }
            axios({
                url: '/mde-person/campus/back/gateAttendanceRecord/queryRecordTotals',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    let obj = res.data.data
                    this.tableData = obj.list
                    this.total = obj.pageBean.rowCount;
                    this.pageSize = obj.pageBean.maxResults
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        // 重置查询条件
        doReset() {
            this.value = []
            this.selectOrgsArr = []
            this.stateValue = ''
            this.personTypeValue = ''
            this.directionValue = ''
            this.passTime = ''
            this.no = ''
        },
        // 导出
        doExport() {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID()
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {}
            }
            axios({
                url: '/mde-person/campus/back/gateAttendanceRecord/gateRecordsExport',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                console.log(res)
                if (res.data.data) {
                    if (res.data.code == 0) {
                        let obj = res.data.data
                        
                        let header = obj[0]
                        
                        let body = []
                        for (let i=1; i<obj.length; i++) {
                            body.push(obj[i])
                        }
                        if (obj.length == 0) {
                            this.$message.error('数据是空的，不能执行导出操作')
                        } else {
                            util.exportExcelOther(header,body, '人员考勤统计表格')
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                } else{
                    this.$message.error("无法导出!")
                }
            })
        },
        // 查看照片
        checkPicture(item) {
            console.log(item, "item--")
            this.dialogTableVisible = true
            this.facePicture = item.deviceScreenImgUrl
        },
        changePage (page) {
            this.doSearch(page)
        }
    }
}
</script>

<style scoped>
.main {
    padding-left: 5%;
}
.top-operate {
    margin-top: 30px;
    margin-bottom: 50px;
    /* margin-left: 5%; */
}
.item-line:nth-of-type(2) {
    margin-top: 20px;
}
.item {
    float: left;
    margin-right: 30px;
}
.item .name{
    float: left;
    width: 100px;
    text-align: right;
    line-height: 40px;
    font-size: 16px;
}
.item .label {
    width: 300px;
    margin-left: 100px;
}
.picktime {
    display: inline-block;
}
.item .el-select{
    width: 150px;
}
.item.l-margin {
    margin-left: 150px;
}
.export{
    display: inline-block;
    margin: 23px 0;
    font-size: 16px;
}
.search{
    font-size: 16px;
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #0cb181;
    border-radius: 3px;
    cursor: pointer;
    user-select:none;
}
.reset {
    background-color: #e4e4e4;
    color: black;
}
.pagi {
    margin: 50px 0;
}
.pagi .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #0cb181;
}
.img-box>img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
