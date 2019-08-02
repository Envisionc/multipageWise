<template>
  <div class="bg">
    <!-- <y-header></y-header> -->
    <div class="config-content clearfix">
      <div class="group-table">
        <i class="el-icon-back back-ico" @click="back()">&nbsp;&nbsp;返回</i>
        <h4 class="add-title">添加考勤项</h4>
        <div class="add-line clearfix">
          <p class="add-name">考勤组名称</p>
          <el-input v-model="attendenceName" placeholder="请输入内容"></el-input>
        </div>
        <!-- <div class="add-line clearfix">
          <p class="add-name">是否住校</p>
          <template>
            <el-radio v-model="inResidence" label="1">是</el-radio>
            <el-radio v-model="inResidence" label="0">否</el-radio>
          </template>
        </div> -->
        <template>
          <div class="add-line clearfix" style="margin-bottom: 10px">
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
                  format="HH:mm"
                  :editable='false'
                  align="left">
                </el-time-picker>
                <i v-show="schedule.length > 1" class="el-icon-circle-close del-icon" @click="delTime(index)"></i>
              </div>
            </div>
          </div>
          <p class="add-time" @click='addTime()'>+增加在校时间段</p>
        </template>
        <!-- <template v-if="inResidence == 1">
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
            <div class="add-timmer fl">
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
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
            <div class="add-timmer fl">
              <el-time-picker
                v-model="leaveTime"
                :editable='false'
                format="HH:mm">
              </el-time-picker>
            </div>
          </div>
        </template> -->
        <div class="add-line clearfix">
          <p class="add-name">选择日期</p>
          <template>
            <el-checkbox-group fill="#0cb181" v-model="workday">
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
          <p class="add-check" @click="dialogTableVisible = true">查看</p>
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
          <el-button type="primary" @click="savePerson">保存</el-button>
          <el-button @click="back">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="查看适用人员" :visible.sync="dialogTableVisible">
      <el-table :data="selectPerson">
        <el-table-column label="姓名" width='150'>
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="学/工号" width='200'>
          <template slot-scope="scope">
            <span>{{scope.row.personNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份">
          <template slot-scope="scope">
            <span>{{['其他','学生','教职工','访客','校友'][scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在分组">
          <template slot-scope="scope">
            <span>{{scope.row.orgName}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope = "scope">
            <span><i class="el-icon-delete del-ico" @click="deleteLine(scope.$index)"></i></span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <select-person-dlg
      ref="seldlg"
      :tmpSelectPerson="selectPerson"
      @indedPerson="indedSelectPerson"
      ></select-person-dlg>
  </div>
</template>
<script>
  // import api from "@/api/attendance.js"
  import axios from 'axios'
  import selectPersonDlg from '../component/selectPersonDlg'
//   import YHeader from './component/yHeader.vue'
  import DateUtil from '../../../utils/DateUtil'
  import uuid from '../../../utils/common'


  export default {
    components: {
      selectPersonDlg,
    //   YHeader
    },
    data() {
      return {
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
        // 是否住校 0 不 1 是
        inResidence: '0',
        status: '1',
        schedule: [
          [new Date(), new Date()]
        ],
        workday: [],
        dialogTableVisible: false,
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
        pageSize: 1,
        totalP: 0,
        cachePeople: {},
        requestId: '', //必要入参
      }
    },
    methods: {
      openSelectPersonDlg() {
        this.$refs.seldlg.showDlg();
      },
      indedSelectPerson(persons) {
        this.selectPerson = persons;
      },
      back() {
        this.$router.go(-1);
      },
    //   添加在校时间段
      addTime() {
        if (this.schedule.length >= 3) {
          this.$message.error('最多只能增加3个时间段')
        } else {
          this.schedule.push([new Date(), new Date()])
        }
      },
    //   删除在校时间段
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
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      getWeeks() {
        if (this.inResidence == 1) {
          return JSON.stringify([this.enterValue, this.leaveValue]);
        } else {
          return JSON.stringify(this.workday)
        }
      },
      getData() {
        let param = {};
        param.name = this.attendenceName;
        param.inResidence = this.inResidence
        param.workday = this.getWeeks()
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
        // api.addGate(param).then(data => {
        //   if (data.code == 0) {
        //     this.back();
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // })
      },
      getSchedule() {
        let arr = [];
        // 住校
        // if (this.inResidence == 1) {
        //   arr = [{
        //         startTime: DateUtil.format(this.enterTime, 'hh:mm'), 
        //         endTime: DateUtil.format(this.leaveTime, 'hh:mm')
        //       }];
        // } else { // 不住校
        //   let schedule = this.schedule;
        //   for (let date of schedule) {
        //     arr.push({
        //           startTime: DateUtil.format(date[0], 'hh:mm'),
        //           endTime: DateUtil.format(date[1], 'hh:mm')
        //     })
        //   }
        // }
        let schedule = this.schedule;
        for (let date of schedule) {
        arr.push({
          startTime: DateUtil.format(date[0], 'hh:mm'),
          endTime: DateUtil.format(date[1], 'hh:mm')
        })
        }
        return arr;
      },
      // 保存新增考勤组
      savePerson() {
        let ids = [];
        for (let i of this.selectPerson) {
          ids.push(i.personId)
        }
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID() 
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "name": this.attendenceName,
            "inResidence": this.inResidence,
            "workday": this.getWeeks(),
            "status": this.status,
            "choosePersonIds": ids,
            "scheduleParamList": this.getSchedule()
          }
        }
        axios({
          url: '/mde-person/campus/back/gateAttendanceGroup/add',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            this.$message.success("保存成功!")
            this.back();
            console.log(res.data.message)
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
      }
    }
  }
</script>
<style scoped>
  .fl {
    float: left;
  }
  .group-table{
    float: left;
    padding-left: 8%;
    width: 85%;
    text-align: left;
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
  .back-ico{
    margin-top: 30px;
    font-size: 18px;
    cursor: pointer;
    
  }
  .add-title{
    margin: 20px 0 30px;
    font-size: 20px;
  }
  .add-line{
    margin-bottom: 30px;
  }
  .add-line>p{
    float: left;
    line-height: 40px;
  }
  .add-line>.el-input{
    width: 400px;
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
    /* color: #50bfff; */
    color: #0cb181;
    margin: 5px 0 30px 140px;
    cursor: pointer;
  }
  .add-time-block {
    float: left;
    width: 425px;
  }
  .add-time-row {
      width: 100%;
  }
  .del-icon {
      color: #1296db;
      cursor: pointer;
  }
  .add-time-line{
    margin-left: 140px;
    margin-top: 16px;
  }
  .add-name {
      width: 140px;
  }
  .add-check, .add-select{
    /* color: #50bfff; */
    width: 100px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
  }
  .add-check {
      color: #333;
      background: #bcbcbc;
      margin-right: 40px;
  }
  .add-select {
      color: #fff;
      background: #0cb181;
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
  .del-ico{
    cursor: pointer;
    color: #50bfff;
  }
  .add-popper{
    margin-right: 20px;
  }
  .add-time-row{
    margin-bottom: 10px;
  }
  /* .add-time-row .el-date-editor{
    width: 300px;
  } */
  .add-line .el-select{
    width: auto;
  }
  .add-timmer .el-date-editor.el-input,.add-timmer  .el-date-editor.el-input__inner{
    width: 220px;
  }
  .add-time-block .el-date-editor.el-input,.add-time-block  .el-date-editor.el-input__inner{
    /* width: 220px; */
    width: 400px;
  }
  .add-time-block .el-range-editor .el-range-input{
    text-align: left;
  }
  .add-time-block .el-date-editor .el-range-separator{
    margin-right: 30px;
  }
</style>