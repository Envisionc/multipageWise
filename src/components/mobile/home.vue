<template>
    <div class="container">
      <div class="content">
        <div class="top">
          <div class="class-statistical">
            <div class="tab-content clearfix">
              <div class="index-timmer clearfix">
                <el-date-picker
                  v-model="date"
                  type="date"
                  @change="updateData"
                  :editable="false"
                  placeholder="">
                </el-date-picker>
              </div>
              <div class="index-state">
                <el-select v-model="type" placeholder="请选择" @change="updateData">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="index-class"  @click="changeClassShow()" style="width: 155.2px;">
                {{selectClassName ? selectClassName: '选择班级'}}
                <!-- <i class="el-icon-arrow-up" v-if="classShow"></i><i class="el-icon-arrow-down" v-else></i> -->
              </div>
            </div>
            <div class="clearfix gate-line">
              <div id="gate-charts" class="statis-charts"></div>
              <div class="statis-detail">
                <div class="statis-line">
                  <span class="statis-name">总人数</span>
                  <span class="statis-num">{{gateSummary.total}}</span>
                </div>
                <div class="statis-line">
                  <span class="statis-name">迟到</span>
                  <span class="statis-num">{{gateSummary.comeLate}}</span>
                  <span class="statis-link" @click="linkToStasticDetail(1)"><span>详情</span><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line">
                  <span class="statis-name">早退</span>
                  <span class="statis-num">{{gateSummary.leftEarly}}</span>
                  <span class="statis-link" @click="linkToStasticDetail(2)"><span>详情</span><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line">
                  <span class="statis-name">旷课</span>
                  <span class="statis-num">{{gateSummary.absentee}}</span>
                  <span class="statis-link" @click="linkToStasticDetail(5)"><span>详情</span><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line">
                  <span class="statis-name">异常</span>
                  <span class="statis-num">{{gateSummary.abnormal}}</span>
                  <span class="statis-link" @click="linkToStasticDetail(4)"><span>详情</span><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line"><span class="statis-name">晚未出</span>
                  <span class="statis-num">{{gateSummary.notLeave}}</span>
                  <span class="statis-link" @click="linkToStasticDetail(6)"><span>详情</span><i class="el-icon-d-arrow-right"></i></span>
                </div>
              </div>
            </div>
            <p class="statis-all">校门考勤统计&nbsp;<span class="statis-link-all" @click="linkToStasticDetail('')">详情<i class="el-icon-d-arrow-right"></i></span></p>
          </div>
        </div>
      </div>
      <selectClass :classShow="classShow" @doSelectClass="doSelectClass" />
    </div>
</template>

<script>
import echarts from 'echarts'
import DateUtil from '../../utils/DateUtil'
import api from '../../api/mobile/index'
import uuid from '../../utils/common'
import selectClass from './component/selectClazz'
export default {
  name: 'home',
  data () {
    return {
      msg: '我是手机端我是手机端我是手机端',
      today: '2019-07-30',
      date: new Date(),
      type: 0,
      orgId: '',
      typeOptions: [
        {
          value: 0,
          label: '请选择'
        },
        {
          value: 1,
          label: '学生'
        },
        {
          value: 2,
          label: '教职工'
        }
      ],
      selectClassName: '',
      classShow: false,
      gateSummary: {},
      mockData: {
        abnormal: 20,
        absentee: 25,
        comeLate: 30,
        leftEarly: 15,
        normal: 45,
        notLeave: 30,
        total: 1650
      },
      isFrist: true
    }
  },
  components: {
    selectClass
  },
  created() {
    if (this.isFrist) {
        this.getLogin()
        this.isFrist = !this.isFrist
    }
    setInterval(() => { this.getLogin() }, 86400000)
  },
  mounted () {
    
  },
  methods: {
    getLogin() {
      let requestId = uuid.createUUID()
      let randomToken = uuid.createUUID()
      let localHref = window.location.href
      // let newHref = 'https://wisecampus-fat.yoowang.com/p_index.html#/pc_attendance?openAppID=366528156203&objectid=EzQ319HuHN8done&objType=2&userid=nHoIlS9HDYodone&timestamp=1564643606&sign=3E878B018401A60A4D56EAFCC546DCF9'
      let params = {}
      if (localHref.indexOf('?') != -1) {
        let obj = {}
        let splitArr = []
        splitArr = localHref.split("?")
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
              "openAppId": "366528156203",
              "objectId": obj.objectid,
              "objType": obj.objType,
              "userId": obj.userid,
              "sign": obj.sign
          }
        }
      } else {
        params = {
          "requestId": requestId,
          "authToken": randomToken,
          "userToken": randomToken,
          "data": {
              "timestamp": "1564643606",
              "openAppId": "366528156203",
              "objectId": "EzQ319HuHN8done",
              "objType": "2",
              "userId": "nHoIlS9HDYodone",
              "sign": "3E878B018401A60A4D56EAFCC546DCF9"
          }
        }
      }
      api.getLogin(params).then(res => {
        if (res.code === 0) {
          const token = res.data.userToken
          window.localStorage.setItem('Token', token)
          const Token = window.localStorage.getItem("Token")
          if (Token) {
            this.getGateSummary()
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    updateData() {
      let token = window.localStorage.getItem("Token")
      if (token) {
        this.getGateSummary()
      }
      
    },
    getGateSummary() {
      let requestId = uuid.createUUID()
      let token = window.localStorage.getItem("Token")
      let orgId
      let type
      if (this.orgId) orgId = this.orgId;
      if (this.type) type = this.type;
      let date = DateUtil.format(this.date, 'yyyy-MM-dd')
      let params = {
        "requestId": requestId,
        "authToken": token,
        "userToken": token,
        "data": {
          "orgId": orgId,
          "type": type,
          "date": date
        }
      }
      api.gateSummary(params).then(res => {
        if (res.code == 0) {
          console.log(res.data, "f返回的结果")
          this.gateSummary = res.data
          // this.gateSummary = this.mockData
          let myChart = echarts.init(document.getElementById('gate-charts'))
          myChart.setOption(this.getOptions(
            ['迟到', "早退", "旷课", '晚未出'],
            [res.data.comeLate, res.data.leftEarly, res.data.absentee,res.data.abnormal, res.data.notLeave]
            // [this.mockData.comeLate, this.mockData.leftEarly, this.mockData.absentee,this.mockData.abnormal, this.mockData.notLeave]
          ))
        } else {
          this.$message.error(res.message)
          
        }
      })
    },
    getOptions(head, data) {
      let _data = [];
      let color = ['94bdb1', '956151', 'e1bf98', 'acc7d9', 'ecdedc', 'e1bf98']
      for (let item of data) {
        _data.push({
          value: item,
          itemStyle: {
            color: '#'+color[Math.floor(Math.random() * color.length)]
          }
        })
      }
      return {
        // color: ['#b55b56','#54616c','#81a7ac'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: '3%',
            left: '20%',
            right: '4%',
            bottom: '10%',
        },
        yAxis : [
          {
            type : 'category',
            data : ['迟到','早退','旷课','异常','晚未出']
          }
        ],
        xAxis : [
          {
            type : 'value',
            boundaryGap : [0, 0.01]
          }
        ],
        // yAxis : [
        //     {
        //         type : 'value',
        //         minInterval: 1
        //     }
        // ],
        // xAxis : [
        //     {
        //         type : 'category',
        //         data : head,
        //         axisTick: {
        //             alignWithLabel: true
        //         },
        //         axisLabel: {
        //           margin: 7,
        //           fontSize: 11,
        //           interval: 0
        //         }
        //     }
        // ],
        series : [
            {
                type:'bar',
                data: _data,
                barWidth: '15'
            }
        ]
      }
    },
    doSelectClass(orgId, className) {
      this.orgId = orgId
      this.selectClassName = className
      this.classShow = false
      this.updateData()
    },
    linkToStasticDetail(type) {
      let param = this.getParam();
      if (type !== '') {
        param.type = type
      }
      this.$router.push({path: '/attendanceInfo/statisDetail', query: param});
    },
    getParam() {
      let param = {
          date: DateUtil.format(this.date, 'yyyy-MM-dd'),
          orgId: this.orgId,
          personType: this.type,
          classname: this.selectClassName
        }
      if (this.curIndex == 1) {
        param.dormId = this.floorId
      }
      return param
    },
    changeClassShow() {
      this.classShow = this.classShow ? false : true
    },
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

}
.top {
  width: 100%;
  height: 100%;
  padding: 15px;
}
.currDate {
  width: 80px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #333;
  border: 1px solid #333;
  border-radius: 10px;
}
.class-statistical{
  font-size: 22.4px;
}
.statis-charts{
  /* flex: 1; */
  width: 170px;
  height: 200px;
  float: left;
}
.statis-detail{
  float: left;
  margin-left: 8px;
  padding-top: 8px;
}
.statis-line{
  display: flex;
  line-height: 28px;
  margin-bottom: 4.8px;
}
.statis-name{
  width: 48px;
  font-size: 14px;
  display: inline-block;
}
.statis-link{
  font-size: 14px;
  color: #5CB85C;
  /* color: #50bfff; */
  font-weight: bold;
  /*margin-left: 16px;*/
}
.statis-link-all {
  font-size: 18px;
  color: #5CB85C;
}
.statis-link .el-icon-d-arrow-right{
  margin-left: 9.6px;
  font-size: 14px;
  font-weight: bold;
}
.statis-all{
  margin-top: 16px;
  text-align: center;
}
.class-statistical{
  margin: 0px auto 48px;
}
html,body{
  background-color: #fff!important;
}
.index-tab-item{
  width: 200px;
  float: left;
  height: 80px;
  line-height: 80px;
  font-size: 22.4px;
  text-align: center;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.index-tab-item.active{
  background-color: #50bfff;
  color: #fff;
  font-weight: bold;
}
.index-tab-item:last-child{
  border-right: 0;
}
.tab-content {
  display: flex;
}
.tab-content .index-timmer .el-input{
  width: 120px;
}
.tab-content .index-timmer .el-input{
  width: 120px;
}
.tab-content .index-timmer .el-input__inner{
  padding: 0 6.4px;
}
.el-input--suffix .el-input__inner {
  padding-right: 10px;
}
.tab-content .index-state{
  margin-left: 16px;
  width: 120px;
  font-size: 19.2px;
}
.tab-content .index-state .el-input--suffix .el-input__inner{
  padding: 0 6.4px;
  padding-right: 10px;
  font-size: 19.2px;
}
.tab-content .index-class{
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  border: 1px solid #333;
  border-radius: 10px;
  margin-left: 9.6px;
  font-size: 14px;
  padding: 0 4.8px;
}
.ph-index-tabs .el-tabs__item{
  width: 33.33%;
  padding: 0;
  text-align: center;
}
.ph-index-tabs .el-tabs__nav{
  width: 100%;
}
.ph-index-tabs .el-tabs__nav-wrap.is-scrollable{
  padding: 0;
}
/*@media screen and (max-width: 320px) {
  .ph-index-tabs .el-tabs__nav-wrap.is-scrollable{
    padding: 0rem;
  }
  .ph-index-tabs .el-tabs__item{
    padding: 0 .185rem;
    font-size: 22.4px;
  }
}*/
.el-tabs__nav-next,.el-tabs__nav-prev{
  display: none;
}
.gate-line{
  margin-top: 15px;
  background: #fafafa;
  display: flex;
}
.statis-num{
  display: inline-block;
  font-size: 14px;
  width: 48px;
}
.shadow-divide{
  width: 100%;
  height: 1px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}
.el-tabs--border-card>.el-tabs__content{
  padding: 12px;
}
.el-message{
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  transform: none;
  padding: 10px;
}
.el-message .el-icon-error{
  font-size: 16px
}
.el-tabs--bottom .el-tabs--left .el-tabs__item:nth-child(2), .el-tabs--bottom .el-tabs--right .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--border-card .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--card .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--left .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--right .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--border-card .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--card .el-tabs__item:nth-child(2){
  padding-left: 0;
}
.el-tabs--bottom .el-tabs--left .el-tabs__item:last-child, .el-tabs--bottom .el-tabs--right .el-tabs__item:last-child, .el-tabs--bottom.el-tabs--border-card .el-tabs__item:last-child, .el-tabs--bottom.el-tabs--card .el-tabs__item:last-child, .el-tabs--top .el-tabs--left .el-tabs__item:last-child, .el-tabs--top .el-tabs--right .el-tabs__item:last-child, .el-tabs--top.el-tabs--border-card .el-tabs__item:last-child, .el-tabs--top.el-tabs--card .el-tabs__item:last-child{
  padding-right: 0;
}
</style>
