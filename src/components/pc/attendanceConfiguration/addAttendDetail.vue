<template>
  <div>
    <div class="config-content clearfix">
      <div class="group-table">
        <div class="back-btn"><i class="el-icon-back back-ico" @click="back()">&nbsp;&nbsp;返回</i></div>
        <h4 class="add-title">考勤项详情</h4>
        <div class="add-line clearfix">
          <p class="add-name">考勤组名称</p>
          <p>{{name}}</p>
        </div>
        <div class="add-line clearfix">
          <p class="add-name">在校时间</p>
          <div class="add-time-block">
            <div v-for="(time, index) in schedule" :key="index" class="add-time-row">
              <el-time-picker
                is-range
                v-model="schedule[index]"
                readonly
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                :editable='false'
                format="HH:mm">
              </el-time-picker>
            </div>
          </div>
        </div>
        <div class="add-line clearfix">
          <p class="add-name">选择日期</p>
          <!-- <template v-if="inResidence == 0"> -->
          <template>
            <el-checkbox-group v-model="workDay">
              <el-checkbox disabled label="周一"></el-checkbox>
              <el-checkbox disabled label="周二"></el-checkbox>
              <el-checkbox disabled label="周三"></el-checkbox>
              <el-checkbox disabled label="周四"></el-checkbox>
              <el-checkbox disabled label="周五"></el-checkbox>
              <el-checkbox disabled label="周六"></el-checkbox>
              <el-checkbox disabled label="周日"></el-checkbox>
            </el-checkbox-group>
          </template>
          <!-- <template v-if="inResidence == 1">
            <div>
              {{startDay}}
            </div>
            <div>
              {{endDay}}
            </div>
          </template> -->
        </div>
        <div class="add-line clearfix">
          <p class="add-name">适用人员</p>
          <p class="add-check" @click="showUsers(1)">查看</p>
        </div>
        <!-- <div class="add-line clearfix">
          <p class="add-name">是否住校</p>
          <template>
            <p>{{['否', "是"][inResidence]}}</p>
          </template>
        </div> -->
        <div class="add-line clearfix">
          <p class="add-name">状态</p>
          <template>
            <p>{{['启用', "禁用"][status]}}</p>
          </template>
        </div>
        <!-- <div class="add-line clearfix">
          <el-button type="primary">确定</el-button>
          <el-button>取消</el-button>
        </div> -->
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
          @current-change="changePage"
          layout="prev, pager, next"
          :total="total" :page-size="pageSize">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import api from "@/api/attendance.js"
  import DateUtil from '../../../utils/DateUtil'
import axios from "axios"
import uuid from "../../../utils/common"
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
        id: 0,
        name: '',
        inResidence: 1,
        status: 1,
        schedule: [
        ],
        workDay: [],
        count: 1,
        isShow1: false,
        isShow2: false,
        dialogTableVisible: false,
        dialogTableSelect: false,
        addSelected: 0,
        addTotal: 10,
        gridData: [
        ],
        page: 1,
        total: 0,
        pageSize: 0,
        requestId: '', //必要入参
        applyPersons: [], //适用人员
      }
    },
    computed: {
      startDay: (vm) => {
        if (vm.workDay.length == 0 || vm.schedule.length == 0) {
          return "";
        }
        return weekMap[vm.week[0]]+"——"+DateUtil.format(vm.schedule[0][0], 'hh:mm')
      },
      endDay: (vm) => {
        if (vm.workDay.length == 0 || vm.schedule.length == 0) {
          return "";
        }
        return weekMap[vm.week[1]]+"——"+DateUtil.format(vm.schedule[0][1], 'hh:mm')
      }
    },
    created() {
      let id = this.$route.query.id
      this.id = id
      if (!id) {
        this.$router.back();
      } else {
        this.gateDetail(id);
      }
    },
    methods: {
      showUsers(page) {
        this.dialogTableVisible = true // 显示dialog
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID() 
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "id": this.id
          }
        }
        axios({
          url: '/mde-person/campus/back/gateAttendanceGroup/queryPersons',
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
        // api.gateQueryPersons(this.id, page).then(data => {
        //   if (data.code==0) {
        //     this.page = page
        //     this.dialogTableVisible = true
        //     this.gridData = data.data.list;
        //     this.total = data.data.pageBean.rowCount
        //     this.pageSize = data.data.pageBean.maxResults
        //   } else {
        //     this.$message.error(data.message)
        //   }
        // })
      },
      changePage(page) {
        console.log(page)
        this.showUsers(page)
      },
      // 详情
      gateDetail(id) {
        this.id = id;
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "groupId": this.id
          }
        }
        axios({
          url: '/mde-person/campus/back/gateAttendanceGroup/showDetail',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            let obj = res.data.data
            this.inResidence = obj.inResidence;
            this.status = obj.status;
            this.personIds = obj.personIds;
            console.log("时间组数", obj.groupTimes)
            this.schedule = this.transSchedule(obj.groupTimes);
            this.week = JSON.parse(obj.workDay)
            this.workDay = this.transWorkDay(obj.workDay);
            this.name = obj.groupName;
          } else {
            this.$message.error(res.message)
          }
        })
        // api.getGateDetail(id).then(data => {
        //   if (data.code == 0) {
            // this.inResidence = data.data.inResidence;
            // this.status = data.data.status;
            // this.personIds = data.data.personIds;
            // this.schedule = this.transSchedule(data.data.groupTimes);
            // this.week = JSON.parse(data.data.workDay)
            // this.workDay = this.transWorkDay(data.data.workDay);
            // this.name = data.data.groupName;
        //   } else {
        //     this.$message.error(data.message)
        //   }
        // })
      },
      transWorkDay(workDay) {
        workDay = JSON.parse(workDay);
        let arr = [];
        for (let day of workDay) {
          arr.push(weekMap[day]);
        }
        return arr;
      },
      transSchedule(list) {
        let arr = [];
        for (let item of list) {
          arr.push([new Date("2016-1-1 " + item.startTime), new Date("2016-1-1 " + item.endTime)])
        }
        return arr;
      },
      back() {
        this.$router.go(-1);
      },
      handleNodeClick(data) {
        console.log(data)
      },
      handleSelectionChange(val) {
        this.addSelected = val.length
      }
    }
  }
</script>
<style scoped>
  .add-time-block {
    float: left;
  }
  .group-table{
    float: left;
    padding-left: 8%;
    width: 65%;
  }
  .group-button{
    margin-top: 30px;
    width: 160px;
    text-align: center;
    height: 36px;
    line-height: 36px;
    background-color: #fff;
    border-radius: 30px;
    border: 1px solid #50bfff;
    color: #50bfff;
    font-weight: bold;
    cursor: pointer;
  }
  .group-form{
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
  .back-btn {
    text-align: left;
  }
  .back-ico{
    margin-top: 30px;
    font-size: 18px;
    cursor: pointer;
  }
  .add-title{
    margin: 20px 0 30px;
    font-size: 20px;
    text-align: left;
  }
  .add-line{
    margin-bottom: 30px;
  }
  .add-line>.add-name{
    float: left;
    width: 140px;
    line-height: 40px;
  }
  .add-line>p{
    line-height: 40px;
  }
  .add-line p:nth-of-type(2) {
    text-align: left;
  }
  .add-line>span {
    float: left;
  }
  .add-line>.el-input{
    width: 220px;
  }
  .add-line>.el-checkbox-group{
    float: left;
  }
  .add-line .el-radio,.add-line .el-checkbox{
    margin-top: 11.5px;
  }
  html,body{
    min-width: 100%;
    min-height: 100%;
  }
  .add-time{
    color: #50bfff;
    margin: 5px 0 0 140px;
    cursor: pointer;
  }
  .add-time-line{
    margin-left: 140px;
    margin-top: 16px;
  }
  .add-check, .add-select{
    color: #50bfff;
    cursor: pointer;
  }
  .add-line .el-button{
    margin-top: 20px;
    width: 120px;
    border-radius: 10px;
  }
  .add-line .el-button--primary{
    margin-left: 120px;
  }
  .add-pagi{
    margin: 20px 15px 15px 0;
    text-align: right;
  }
  .add-select-box .el-tree{
    width: 25%;
    float: left;
  }
  .add-select-box .add-select-table{
    padding-left: 15px;
    width: 70%;
    float: left;
    border-left: 1px solid #eee;
  }
  .select-dialog{
    border-radius: 5px;
  }
  .select-dialog .el-dialog__header{
    border-bottom: 1px solid #eee;
  }
  .add-select-table .el-input{
    width: 40%;
    margin-right: 10px;
  }
  .add-select-box .el-tree-node__label
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-dialog-footer{
    padding-top: 15px;
    border-top: 1px solid #eee;
    text-align: right;
  }
  .select-dialog .el-dialog__body{
    padding: 30px 20px 15px 20px;
  }
  .add-tip{
    margin-top: 10px;
  }
  .add-tip i{
    margin-right: 5px;
    color: #409EFF;
  }
  .add-selected{
    color: #409EFF;
    font-weight: bold;
  }
  .add-time-row{
    margin-bottom: 10px;
  }
</style>