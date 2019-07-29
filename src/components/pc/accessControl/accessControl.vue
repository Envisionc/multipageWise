<template>
    <div class="content">
        <div class="main">
            <div class="add-btn" @click="goAddPage">新增人员权限</div>
            <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%;margin-top: 50px;">
                <el-table-column
                    prop="personName"
                    label="人员姓名"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="personNo"
                    label="学/工号"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <div class="btn default" @click="editOrg(scope.row)">编辑</div>
                        <div class="btn default" @click="lookOrg(scope.row)">查看</div>
                        <div class="btn default" @click="delOrg(scope.row)">删除</div>
                    </template>
                </el-table-column>
            </el-table>
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
import axios from "axios"
import uuid from '../../utils/common'
export default {
    data () {
        return {
            tableData: [
                {
                    name: '张三',
                    number: '125465'
                }
            ],
            pageSize: 5,
            total: 4,
            requestId: '', //必要参数
        }
    },
    mounted() {
        this.personList()
    },
    methods: {
        personList() {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID()
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {}
            }
            axios({
                url: '/api/mde-person/campus/back/person/personOrgList',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    let obj = res.data.data
                    this.tableData = obj.personRoleListViews
                    console.log(obj)
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        changePage () {
            console.log("page")
        },
        editOrg(row) {
            console.log(row)
            this.$router.push({ path:'/manage/editControl', query: {id: row.orgManagerId}})
        },
        lookOrg(row) {
            this.$router.push({ path:'/manage/detailControl', query: {id: row.orgManagerId}})
        },
        // 删除
        delOrg(row) {
            console.log(row, "----")
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID() 
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {
                    "orgManagerId": row.orgManagerId
                }
            }
            axios({
                url: '/api/mde-person/campus/back/person/authority/delete',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    this.personList()
                    this.$message({
                        message: '删除成功!',
                        type: 'success'
                    })
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        goAddPage () {
            this.$router.push({ path:'/manage/addControl'  })
        }
    }
}
</script>

<style scoped>
.main {
    padding: 50px;
}
.add-btn {
    width: 120px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 14px;
    background-color: #0cb181;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}
.default {
    color: #0cb181;
}
.pagi {
    margin: 50px 0;
}
</style>
