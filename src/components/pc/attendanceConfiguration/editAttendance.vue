<template>
  <div class="bg">
    <div class="config-content clearfix">
      <div class="group-table">
        <div class="back-btn"><i class="el-icon-back back-ico" @click="back()">&nbsp;&nbsp;返回</i></div>
        <h4 class="add-title">编辑考勤项</h4>
        <div class="add-line clearfix">
          <p class="add-name">考勤组名称</p>
          <el-input v-model="attendenceName" placeholder="请输入内容"></el-input>
        </div>
        <!-- <div class="add-line clearfix">
          <p class="add-name">是否住校</p>
          <template>
            <p style="text-align:left" v-if="!inResidence" >是</p>
            <p style="text-align:left" v-else >否</p>
          </template>
        </div> -->
        <template v-if="inResidence == 0">
          <div class="add-line clearfix">
            <p class="add-name">在校时间</p>
            <div class="add-time-block">
              <div v-for="(time, index) in schedule" :key="index" class="add-time-row">
                <el-time-picker
                  is-range
                  v-model="schedule[index]"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  :editable='false'
                  format="HH:mm">
                </el-time-picker>
                <i v-show="schedule.length > 1" class="el-icon-circle-close time-del" @click="delTime(index)"></i>
              </div>
            </div>
          </div>
          <p class="add-time" @click='addTime()'>增加在校时间段</p>
        </template>
        <template v-if="inResidence == 1">
          <div class="add-line clearfix">
            <p class="add-name">选择入校时间</p>
            <template>
              <div class="add-popper fl">
                <el-select v-model="enterValue" placeholder="请选择">
                  <el-option
                    v-for="item in weekOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
            <div class="add-timmer fl" style="margin-left: 20px">
              <el-time-picker
                v-model="enterTime"
                :editable='false'
                format="HH:mm">
              </el-time-picker>
            </div>
          </div>
          <div class="add-line clearfix">
            <p class="add-name">选择离校时间</p>
            <template>
              <div class="add-popper fl">
                <el-select v-model="leaveValue" placeholder="请选择">
                  <el-option
                    v-for="item in weekOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
              </div>
            </template>
            <div class="add-timmer fl" style="margin-left: 20px">
              <el-time-picker
                v-model="leaveTime"
                :editable='false'
                format="HH:mm">
              </el-time-picker>
            </div>
          </div>
        </template>
        <div class="add-line clearfix" v-if="inResidence == 0">
          <p class="add-name">选择日期</p>
          <template>
            <el-checkbox-group v-model="workday">
              <el-checkbox :label="1">周一</el-checkbox>
              <el-checkbox :label="2">周二</el-checkbox>
              <el-checkbox :label="3">周三</el-checkbox>
              <el-checkbox :label="4">周四</el-checkbox>
              <el-checkbox :label="5">周五</el-checkbox>
              <el-checkbox :label="6">周六</el-checkbox>
              <el-checkbox :label="7">周日</el-checkbox>
            </el-checkbox-group>
          </template>
        </div>
        <div class="add-line clearfix">
          <p class="add-name">适用人员</p>
          <p class="add-check" @click="showUsers(1)">查看</p>
          <p class="add-select" @click="openSelectPersonDlg">选择人员</p>
        </div>
        <div class="add-line clearfix">
          <p class="add-name">状态</p>
          <template>
            <el-radio v-model="status" label="0">启用</el-radio>
            <el-radio v-model="status" label="1">关闭</el-radio>
          </template>
        </div>
        <div class="add-line clearfix">
          <el-button type="primary" @click="checkPerson">确定</el-button>
          <el-button @click="back">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="查看适用人员" :visible.sync="dialogTableVisible">
      <el-table :data="selectPerson">
        <el-table-column property="name" label="姓名" width="150"></el-table-column>
        <el-table-column property="personNo" label="学/工号" width="200"></el-table-column>
        <el-table-column property="type" label="身份">
          <template slot-scope="scope">
            <span>{{["其他", "学生", "教职工", "访客", "校友"][scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column property="orgName" label="所在分组"></el-table-column>
        <el-table-column>
          <template slot-scope = "scope">
            <span><i class="el-icon-delete del-ico" @click="deleteLine(scope.$index)"></i></span>
          </template>
        </el-table-column>
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
    <select-person-dlg
      ref="seldlg"
      :tmpSelectPerson="selectPerson"
      @indedPerson="indedSelectPerson"
      @closeDialog="closeDialog"
      :dialogShow="dialogTableSelect"
      ></select-person-dlg>
  </div>
</template>
<script>
  // import api from "@/api/attendance.js"
//   import uuid from 'node-uuid'
//   import YHeader from './component/yHeader'
  import selectPersonDlg from '../component/selectPersonDlg'
  import DateUtil from '../../../utils/DateUtil'
import axios from "axios"
import uuid from "../../../utils/common"
  const weekMap2 = {"周一": 1, "周二": 2, "周三": 3, "周四": 4, "周五": 5, "周六": 6, "周日": 7}

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
    components: {
      "select-person-dlg": selectPersonDlg
    },
    data() {
      return {
        id: 0,
        // 入校时间  星期
        enterValue: 1,
        // 离校时间  星期
        leaveValue: 5,
        // 入校时间  时分
        enterTime: new Date(),
        // 离校时间  时分
        leaveTime: new Date(),
        weekOptions: [{
          value: 1,
          label: '周一'
        }, {
          value: 2,
          label: '周二'
        }, {
          value: 3,
          label: '周三'
        }, {
          value: 4,
          label: '周四'
        }, {
          value: 5,
          label: '周五'
        }, {
          value: 6,
          label: '周六'
        }, {
          value: 7,
          label: '周日'
        }],
        // 考勤组名称
        attendenceName: '',
        // 是否住校
        inResidence: '1',
        status: '1',
        schedule: [
          [new Date(), new Date()]
        ],
        workday: [],
        count: 1,
        isShow1: false,
        isShow2: false,
        dialogTableVisible: false,
        dialogTableSelect: false,
        addSelected: 0,
        addTotal: 10,
        gridData: [
        ],
        selectPerson: [
        ],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        keyword: '',
        checkedOrgId: 0,
        isAjax: false,
        totalPerson: 1,
        page: 1,
        total: 0,
        pageSize: 1,
        totalP: 0,
        cachePeople: {},
        totalselPerson: 0,
        selPersonPageSize: 0,
        requestId: '', //必要入参
        groupId: '', //考勤组id
      }
    },
    created() {
      let id = this.$route.query.id
      if (!id) {
        this.$router.back();
      } else {
        this.gateDetail(id);
      }
    },
    computed: {
    },
    methods: {
      // 关闭弹层
      closeDialog() {
        console.log("11111")
      },
      // 查看适用人员
      showUsers(page) {
        this.dialogTableVisible = true
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "id": this.groupId
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
            // console.log(obj)
            if (obj.list) {
              this.selectPerson = obj.list
            }
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      changePage(page) {
        // console.log(page)
        this.showUsers(page)
      },
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
          url: '/api/mde-person/campus/back/gateAttendanceGroup/showDetail',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
          // console.log(res)
          if (res.data.code == 0) {
            let obj = res.data.data
            // console.log(obj, "1111")
            this.groupId = obj.groupId
            this.inResidence = ""+ obj.inResidence;
            this.status = ""+ obj.status;
            // TODO 
            // this.selectPerson = obj.persons;
            this.schedule = this.transSchedule(obj.groupTimes);
            if (this.inResidence == 1) {
              let week = JSON.parse(obj.workDay);
              this.enterValue = +week[0]
              this.leaveValue = +week[1]
            } else {
              this.workday = this.transWeek(obj.workDay)
            }
            this.attendenceName = obj.groupName;
          } else {
            this.$message.error(res.data.message)
          }
        })
        // api.getGateDetail(id).then(data => {
        //   if (data.code == 0) {
            // this.inResidence = ""+data.data.inResidence;
            // this.status = ""+data.data.status;
            // this.selectPerson = data.data.persons;
            // this.schedule = this.transSchedule(data.data.groupTimes);
            // if (this.inResidence == 1) {
            //   let week = JSON.parse(data.data.workDay);
            //   this.enterValue = +week[0]
            //   this.leaveValue = +week[1]
            // } else {
            //   this.workday = this.transWeek(data.data.workDay)
            // }
            // this.attendenceName = data.data.groupName;
        //   } else {
        //     this.$message.error(data.message)
        //   }
        // })
      },
      transWeek(workday) {
        return JSON.parse(workday);
      },
      transSchedule(list) {
        let arr = [];
        for (let item of list) {
          arr.push([new Date("2016-1-1 " + item.startTime), new Date("2016-1-1 " + item.endTime)])
        }
        return arr;
      },
      // 打开选择人员弹层
      openSelectPersonDlg() {
        // console.log(this.$refs['seldlg'])
        this.$refs['seldlg'].showDlg();
      },
      indedSelectPerson(persons) {
        console.log(persons)
        this.selectPerson = persons;
      },
      back() {
        this.$router.go(-1);
      },
      addTime() {
        if (this.schedule.length >= 3) {
          this.$message.error('最多只能增加3个时间段')
        } else {
          this.schedule.push([new Date(), new Date()])
        }
      },
      getData() {
        let param = {};
        param.id = this.id;
        param.name = this.attendenceName;
        param.inResidence = this.inResidence
        param.workday = this.getWeek()
        param.status = this.status
        let ids = [];
        for (let i of this.selectPerson) {
          ids.push(i.personId)
        }
        param.choosePersonIds = ids
        param.scheduleParamList = this.getSchedule();
        return param
      },
      addGate(){
        if (this.isAjax) return ;
        let param = this.getData();
        this.isAjax = true;
        // api.gateUpdate(param).then(data => {
        //   if (data.code == 0) {
        //     this.back();
        //   } else {
        //     this.isAjax = false
        //     this.$message.error(data.message);
        //   }
        // })
      },
      checkPerson() {
        let param = {};
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        console.log(this.getData(), "*******")
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": this.getData()
        }
        axios({
          url: '/api/mde-person/campus/back/gateAttendanceGroup/update',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            this.back()
          } else {
            this.$message.error(res.data.message)
          }
        })
        // api.checkGate(this.getData()).then(data => {
        //   if (data.code==0) {
        //     if (data.data.length == 0) {
        //       this.addGate();
        //     } else {
        //       let names = [];
        //       for (let i of data.data) {
        //         names.push(i.name);
        //       }
        //       this.$confirm(names.join(',') + ';以上人员存在时间冲突，是否继续？', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //       }).then(()=>{
        //         this.addGate();
        //       })
        //     }
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // })
      },
      getWeek() {
        if (this.inResidence == 1) {
          return JSON.stringify([this.enterValue, this.leaveValue]);
        } else {
          let week = [];
          for (let i of this.workday) {
            week.push(+i)
          }
          return JSON.stringify(week)
        }
      },
      deleteLine(idx){
        this.$confirm('此操作将删除该人员，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.selectPerson.splice(idx,1)
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 600
          })
        })
      },
      getSchedule() {
        let arr = [];
        if (this.inResidence == 1) {
          arr = [{
                startTime: DateUtil.format(this.enterTime, "hh:mm"), 
                endTime: DateUtil.format(this.leaveTime, "hh:mm")
              }];
        } else {
          let schedule = this.schedule;
          console.log(schedule[0],schedule.length, "schedule.length")
          if (!schedule[0]) {
            this.$message({
              type: 'warning',
              message: '没有选择一个时间段!'
            })
          } else {
            for (let date of schedule) {
              arr.push({
                    startTime: DateUtil.format(date[0], "hh:mm"), 
                    endTime: DateUtil.format(date[1], "hh:mm")})
            }
          }
        }
        return arr;
      },
      delTime(index) {
        this.$confirm('此操作将删除该时间段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let schedule = this.schedule
          schedule.splice(index, 1)
          this.schedule = schedule
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch((e) => {
          // console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
  }
</script>
<style scoped>
  .fl {
    float: left;
  }
  .group-table{
    float: left;
    padding-left: 8%;
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
    margin-bottom: 10px;
  }
  .add-line>p{
    float: left;
    width: 140px;
    line-height: 40px;
  }
  .add-line>.el-input{
    width: 220px;
    float: left;
  }
  .add-line>.el-checkbox-group{
    float: left;
  }
  .add-line .el-radio,.add-line .el-checkbox{
    margin-top: 11.5px;
    float: left;
  }
  html,body{
    min-width: 100%;
    min-height: 100%;
  }
  .add-time{
    color: #50bfff;
    margin: 5px 0 0 140px;
    cursor: pointer;
    position: relative;
    left: -100px;
  }
  .add-time-block {
    float: left;
  }
  .add-time-line{
    margin-left: 140px;
    margin-top: 16px;
  }
  .add-time-row{
    margin-bottom: 10px;
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
  .time-del{
    position: relative;
    top: 3px;
    margin-left: 8px;
    font-size: 20px;
    cursor: pointer;
  }
  .time-del:hover{
    color: #2087f3;
  }
</style>