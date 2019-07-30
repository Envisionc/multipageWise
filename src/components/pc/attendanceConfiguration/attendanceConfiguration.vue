<template>
  <div>
    <!-- <y-header></y-header> -->
    <div class="config-content clearfix">
      <div class="group-table">
        <!-- <h3 class="router-title">校门考勤设置</h3> -->
        <router-link tag="div" class="group-button" to="/attendance/addAttendance">新增考勤组</router-link>
        <div class="group-form">
          <el-table
            :data="table_data"
            border>
            <el-table-column min-width="200" label="考勤组名称">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="80"  label="适用人员">
              <template slot-scope="scope">
                <span class="check" @click="checkPerson(1, scope.row.id)">查看</span>
              </template>
            </el-table-column>
            <el-table-column  label="状态" min-width="70">
              <template slot-scope="scope">
                <span>{{['开启', '关闭'][scope.row.status]}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column  label="是否住校" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.aboard}}</span>
              </template>
            </el-table-column> -->
            <el-table-column  label="考勤日" min-width="300">
              <template slot-scope="scope">
                <span>{{scope.row.attendence}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="操作" min-width="210">
              <template slot-scope="scope">
                <span class="cursor btn default" @click="checkOperate(scope.row.id)">查看</span>
                <span class="cursor btn default" @click="edit(scope.row.id)">编辑</span>
                <span class="cursor btn default" @click="cancel(scope.row.id)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
    <el-dialog title="查看适用人员" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="name" label="姓名" width="150"></el-table-column>
        <el-table-column property="personNo" label="学/工号" width="200"></el-table-column>
        <el-table-column property="type" label="身份">
          <template slot-scope="scope">
            <span>{{["其他", "学生", "教职工", "访客", "校友"][scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column property="orgName" label="所在分组"></el-table-column>
      </el-table>
      <div class="add-pagi">
        <el-pagination
          background
          :current-page="page"
          @current-change="changePage"
          layout="prev, pager, next"
          :total="total" :page-size="pageSize">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import api from "@/api/attendance.js";
//   import YHeader from './component/yHeader.vue'
import axios from 'axios'
import uuid from '../../../utils/common'
const weekMap = {
    1: "周一",
    2: "周二",
    3: "周三",
    4: "周四",
    5: "周五",
    6: "周六",
    7: "周日"
  };
  export default {
    data() {
      return {
        tableData: [],
        table_data: [],
        dialogTableVisible: false,
        gridData: [
          {
            name: '海伦',
            number: '15821667065',
            id: '学生',
            group: '一年级'
          }
        ],
        page: 1,
        total: 0,
        pageSize: 0,
        selectId: 0,
        workDayStr: '' //考勤日字符串拼接
      }
    },
    created() {
      this.getUserList()
      this.getAttendanceList()
      // this.viewApplicablePerson()
    },
    methods: {
      // 考勤配置-考勤组展示
      getAttendanceList() {
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {}
        }
        axios({
          url: '/api/mde-person/campus/back/gateAttendanceGroup/showGroups',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.statusText === "OK") {
            let obj = res.data.data
            // this.table_data = obj
            let arr = []
            for (let item of obj) {
              let workDay = JSON.parse(item.workDay)
              arr.push({
                id: item.groupId,
                name: item.groupName,
                personIds: item.personIds,
                workDay: workDay,
                inResidence: item.inResidence,
                status: item.status,
                state: item.status ? "关闭" : "开启",
                aboard: item.inResidence ? "是" : "否",
                attendence: this.makeWorkDay(workDay)
              })
            }
            this.table_data = arr;
          }
        })
      },
      // 查看适用人员
      // viewApplicablePerson() {
      //   const token = window.localStorage.getItem("token")
      //   let params = {
      //     "requestId": requestId,
      //     "authToken": token,
      //     "userToken": token,
      //     "data": {}
      //   }
      //   axios({
      //     url: '/api/mde-person/campus/back/gateAttendanceGroup/queryPersons',
      //     method: 'post',
      //     data: params,
      //     headers:{
      //         'Content-Type':'application/json'
      //     }	
      //   }).then(res => {
      //     if (res.statusText === "OK") {
      //       let obj = res.data.data

      //       console.log(res.data, "OK")
      //     }
      //   })
      // },
      getUserList() {
        // api.groupList().then(data => {
        //   let list = data.data;
        //   let arr = [];
        //   for (let item of list) {
        //     let workDay = JSON.parse(item.workDay)
        //     arr.push({
        //       id: item.groupId,
        //       name: item.groupName,
        //       personIds: item.personIds,
        //       workDay: workDay,
        //       inResidence: item.inResidence,
        //       status: item.status,
        //       state: item.status ? "关闭" : "开启",
        //       aboard: item.inResidence ? "是" : "否",
        //       attendence: this.makeWorkDay(workDay)
        //     })
        //   }
        //   this.tableData = arr;
        // })
      },
      makeWorkDay(week) {
        let arr = [];
        console.log(week)
        for (let item of week) {
          arr.push(weekMap[item]);
        }
        return arr.join(",")
      },
      // 删除
      cancel(id) {
        this.$confirm('此操作将删除该考勤组，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          const token = window.localStorage.getItem("token")
          let requestId = uuid.createUUID()
          let params = {
            "requestId": requestId,
            "authToken": token,
            "userToken": token,
            "data": {
              "groupId": id
            }
          }
          axios({
            url: '/api/mde-person/campus/back/gateAttendanceGroup/delete',
            method: 'post',
            data: params,
            headers:{
                'Content-Type':'application/json'
            }	
          }).then(res => {
            if (res.data.code == 0) {
              // let obj = res.data.data
              this.$message({
                type: 'success',
                message: '删除成功！',
                duration: 600
              })
              this.getAttendanceList()
            } else {
              this.$message.error(res.data.message)
            }
          })
          // api.delGate(id).then(data => {
          //   if (data.code == 0) {
              // this.$message({
              //   type: 'success',
              //   message: '删除成功！',
              //   duration: 600
              // })
          //     this.getUserList();
          //   } else {
          //     this.$message.error(data.message);
          //   }
          // })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 600
          })
        })
      },
      changePage(page) {
        this.checkPerson(page, this.selectId)
      },
      // 查看适用人员
      checkPerson(page, id) {
        this.dialogTableVisible = true
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID() 
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "id": id.toString()
          }
        }
        axios({
          url: '/api/mde-person/campus/back/gateAttendanceGroup/queryPersons',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            let obj = res.data.data
            this.gridData = obj.list
            this.total = obj.pageBean.rowCount
            this.pageSize = obj.pageBean.maxResults
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      checkOperate(id) {
        this.$router.push({path: '/attendance/addAttendDetail', query: {id: id}})
      },
      edit(id) {
        this.$router.push({path: '/attendance/editAttendance', query: {id: id}})
      }
    },
  }
</script>
<style scoped>
  .el-table .cell {
    white-space: nowrap;
  }
  .group-table{
    float: left;
    padding-left: 8%;
    width: 85%;
  }
  .group-button{
    margin-top: 30px;
    width: 160px;
    text-align: center;
    height: 36px;
    line-height: 36px;
    background-color: #0cb181;
    border-radius: 4px;
    border: 1px solid #0cb181;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
  .group-form{
    width: 941px;
    margin-top: 30px;
  }
  .line .name{
    width: 130px;
  }
  .line .person{
    width: 100px;
  }
  .line .state{
    width: 80px;
  }
  .line .aboard{
    width: 90px;
  }
  .line .attendence{
    width: 340px;
  }
  .line .operation{
    width: 180px;
  }
  .line .check{
    color: #50bfff;
    font-weight: bold;
    cursor: pointer;
  }
  .operation span{
    margin-right: 8px;
    cursor: pointer;
  }
  .line>div{
    float: left;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  .group-form .check{
    cursor: pointer;
    color: #50bfff;
    font-weight: bold;
  }
   .add-pagi{
    margin: 20px 15px 15px 0;
    text-align: right;
  }
    .btn{
    display: inline-block;
    padding: 3px 8px;
    margin-right: 10px;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
  }
  .btn.primary{
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
  }
  .btn.primary:hover{
    color: #fff;
    background-color: #286090;
    border-color: #204d74;
  }
  .btn.info{
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .btn.info:hover{
    color: #fff;
    background-color: #31b0d5;
    border-color: #269abc;
  }
  .btn.danger{
    color: #fff;
    background-color: #d9534f;
    border-color: #d43f3a;
  }
  .btn.danger:hover{
    color: #fff;
    background-color: #c9302c;
    border-color: #ac2925;
  }
  .router-title{
    margin-top: 20px;
  }
  @media screen and (max-width: 1200px) {
    .group-table {
        width: 95%;
    }
  }
  @media screen and (max-width: 1050px) {
    .group-table {
        width: 98%;
    }
  }
</style>
