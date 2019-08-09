<template>
    <div class="content">
        <div class="main">
            <h3 class="title">设置学校组织架构</h3>
            <div class="add" @click="addOrg()" v-if="showFlag">新增组织架构</div>
            <el-table
                :data="org_list"
                border
                stripe
                style="width: 80%;margin-left: 50%;transform: translatex(-50%);"
                v-if="org_list.length">
                <el-table-column
                    prop="orgName"
                    label="组织架构名称"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <div class="btn del" @click="delOrg(scope.$index, org_list)">删除</div>
                    </template>
                </el-table-column>
            </el-table>
            <p class="tip" v-if="org_list.length">组织架构设置完成将不可更改</p>
            <div class="submit" v-if="!org_list.length || showFlag" @click="submitOrg()">保存</div>
        </div>
        <el-dialog
        title="新增组织架构"
        :visible.sync="dialogVisible"
        width="50%">
            <div class="add-org clearfix">
                <p class="name">选择组织架构</p>
                <el-select v-model="orgValue" placeholder="请选择" popper-class='org-sel'>
                <el-option
                    v-for="item in orgOptions"
                    :key="item.orgId"
                    :label="item.orgName"
                    :value="item.orgId"
                    :disabled="item.disabled">
                </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrgSel()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import axios from  'axios'
import uuid from '../../../utils/common'
import api from '../../../api/pc/index'
export default {
    data () {
        return {
            showFlag: true, //组织架构 true时可添加，false只做展示
            // org_list: [
            //     {
            //         orgId: '1',
            //         orgName: '年级'
            //     },
            //     {
            //         orgId: '2',
            //         orgName: '班级'
            //     }
            // ],
            org_list: [],
            dialogVisible: false, // dailog默认不显示
            orgValue: '',
            orgOptions: '',
            isFrist: true
        }
    },
    mounted () {
        if (this.isFrist) {
            this.getLogin()
            this.isFrist = !this.isFrist
        }
        setInterval(() => { this.getLogin() }, 86400000)
        this.showOrg()
    },
    methods: {
        // 获取登录信息
        getLogin () {
            let _this = this
            let requestId = uuid.createUUID()
            let randomToken = uuid.createUUID()
            let params = {}
            let iframeEl = document.getElementsByClassName("js-app-detail-iframe")
            console.log(iframeEl, "1")
            if ( iframeEl.length > 0 ) {
                let iframeSrc = iframeEl[0].src
                let obj = {}
                let splitArr = []
                splitArr = iframeSrc.split("?")
                let littleArr = splitArr[1].split("&")
                for (let i=0; i<littleArr.length; i++) {
                    let arr = littleArr[i].split("=")
                    obj[arr[0]] = arr[1]
                }
                params = {
                "requestId": requestId,
                "authToken": randomToken,
                "userToken": randomToken,
                "data": {
                    "timestamp": obj.timestamp,
                    "openAppId": obj.openAppId,
                    "objectId": obj.objectid,
                    "objType": obj.objType,
                    "userId": obj.userid,
                    "sign": obj.sign
                }
                }
                console.log(params, "pc-----")
            } 
            else {
                params = {
                    "requestId": requestId,
                    "authToken": randomToken,
                    "userToken": randomToken,
                    "data": {
                        "timestamp": 1563266036,
                        "openAppId": 366528156203,
                        "objectId": "EzQ319HuHN8done",
                        "objType": 2,
                        "userId": "nHoIlS9HDYodone",
                        "sign": "9CE35CE985015BA81ECE7515D470CB10"
                    }
                }
            }
            console.log(params, "登录参数")
            api.getLogin(params).then(res => {
                if (res.code === 0) {
                    const token = res.data.userToken
                    window.localStorage.setItem('token', token)
                    const Token = window.localStorage.getItem("token")
                } else {
                    this.$message.error(res.message)
                }
            })
            // axios({
            //     url:'/api/mde-person/campus/app/login',
            //     method: 'post',
            //     data: params,
            //     headers:{
            //         'Content-Type':'application/json'
            //     }		
            // }).then((res)=>{
            //     console.log(res)
            //     if (res.data.code == 0) {
            //     console.log(res.data.data.userToken, "12222")
            //     const token = res.data.data.userToken
            //     window.localStorage.setItem('token', token)
            //     // const Token = window.localStorage.getItem("token")
            //     // console.log(Token)
            //     console.log(window.location.pathname, "pathname")
            //     // window.location.pathname = 'p_index.html#/organizationalStructure'
            //     }
            // })
        },
        // 学校组织架构-查看详情
        showOrg () {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID()
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {}
            }
            api.showOrg(params).then(res => {
                if (res.code === 0) {
                    this.showFlag = res.data.showFlag
                    let list = res.data.orgName
                    list.forEach((item, index) => {
                        let temp = {
                            id: index,
                            orgName: item
                        }
                        this.org_list.push(temp)
                    })
                } else {
                    this.$message.error(res.messsage)
                }
            })
        },
        // 新增学校组织架构-组织类型下拉展示
        addOrg () {
            this.dialogVisible = true
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID()
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {}
            }
            console.log(params,"///")
            api.getOrgList(params).then(res => {
                console.log(res, "返回的结果")
                if (res.code === 0) {
                    this.orgOptions = res.data
                    this.orgOptions.forEach((item, index) => {
                        this.org_list.forEach((val, i) => {
                            if (item.orgName == val.orgName) {
                                item.disabled = true
                            }
                        })
                    })
                } else {
                    this.$message.error(res.messsage)
                }
            })
        },
        // 删除
        delOrg (index, rows) {
            this.$confirm('此操作将删除该组织架构, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (let item of this.org_list) {
                    if (item.id == rows[index].id) {
                        item.disabled = false
                        break;
                    }
                }
                rows.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!',
                    duration: 800
            });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: 800
                });         
            })
        },
        // 保存 由showFlag判断是否有保存按钮等操作
        submitOrg () {
            let _arr = []
            for(let item of this.org_list){
                _arr.push(item.id)
            }
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID()
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {
                "orgIds": _arr
                }
            }
            api.addOrg(params).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: '提交成功',
                        type: 'success',
                        duration: 800
                    })
                    this.showOrg()
                } else {
                    this.$message.error(res.messsage)
                }
            })
        },
        // 添加组织架构
        addOrgSel () {
            for (let item of this.orgOptions) {
                if (item.orgId == this.orgValue) {
                    let temp = {
                        id: item.orgId,
                        orgName: item.orgName
                    }
                    console.log(item, "00---------00")
                    this.org_list.unshift(temp)
                }
            }
            this.dialogVisible = false
            this.orgValue = ''
        }
    }
}
</script>

<style scoped>
.main{
    margin: 0 auto;
    padding: 0 80px;
  }
  .title{
    font-size: 18px;
    margin: 40px 0 40px;
    text-align: left;
  }
  .add{
    padding: 4px 15px;
    margin-bottom: 30px;
    width: 160px;
    text-align: center;
    color: #409eff;
    border: 1px solid #409eff;
    border-radius: 30px;
    cursor: pointer;
  }
  .tip{
    width: 80%;
    margin: 10px 50%;
    transform: translatex(-50%);
    text-align: left;
    color: red;
  }
  .submit{
    /* padding: 5px 16px;
    margin-bottom: 30px;
    margin-left: 15%;
    width: 160px; */
    width: 80px;
    height: 40px;
    line-height: 40px;
    margin: 10px 50%;
    transform: translatex(-50%);
    text-align: center;
    color: #fff;
    background-color: #0cb181;
    border-radius: 4px;
    cursor:pointer;
  }
  .btn.del {
      color: #0cb181;
  }
  /* .submit:hover{
    background-color: #2084eb;
  } */
  .add-org .name{
    margin-right: 20px;
    float: left;
    line-height: 40px;
  }
  .add-org .el-select {
      float: left;
  }
  .org-sel{
    float: left;
  }
</style>
