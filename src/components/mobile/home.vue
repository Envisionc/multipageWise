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
                {{selectClassName ? selectClassName: '选择班级'}}<i class="el-icon-arrow-up" v-if="classShow"></i><i class="el-icon-arrow-down" v-else></i>
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
                  <span class="statis-link" ><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line">
                  <span class="statis-name">早退</span>
                  <span class="statis-num">{{gateSummary.leftEarly}}</span>
                  <span class="statis-link" ><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line">
                  <span class="statis-name">旷课</span>
                  <span class="statis-num">{{gateSummary.absentee}}</span>
                  <span class="statis-link" ><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line">
                  <span class="statis-name">异常</span>
                  <span class="statis-num">{{gateSummary.abnormal}}</span>
                  <span class="statis-link" ><i class="el-icon-d-arrow-right"></i></span>
                </div>
                <div class="statis-line"><span class="statis-name">晚未出</span>
                  <span class="statis-num">{{gateSummary.notLeave}}</span>
                  <span class="statis-link" ><i class="el-icon-d-arrow-right"></i></span>
                </div>
              </div>
            </div>
            <p class="statis-all">校门考勤统计&nbsp;<span class="statis-link" >详情<i class="el-icon-d-arrow-right"></i></span></p>
          </div>
        </div>
      </div>
      <selectClass />
    </div>
</template>

<script>
import echarts from 'echarts'
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
    }
  },
  components: {
    selectClass
  },
  created() {
    this.getGateSummary()
  },
  mounted () {
    console.log(window.localStorage.getItem("token"), "token")
  },
  methods: {
    updateData() {

    },
    getGateSummary() {
      let requestId = uuid.createUUID()
      let token = window.localStorage.getItem("token")
      let params = {
        "requestId": requestId,
        "authToken": token,
        "userToken": token,
        "data": {}
      }
      api.gateSummary(params).then(res => {
        if (res.code == 0) {
          console.log(res.data, "f返回的结果")
          this.gateSummary = res.data
          let myChart = echarts.init(document.getElementById('gate-charts'))
          myChart.setOption(this.getOptions(
            ['迟到', "早退", "旷课", '晚未出'],
            [res.data.comeLate, res.data.leftEarly, res.data.absentee, res.data.notLeave]
          ))
        } else {
          this.$message.error(res.message)
          
        }
      })
      // api.gateSummary(param).then(data => {
      //   if (data.code == 0) {
      //     this.gateSummary = data.data;
      //     let myChart = echarts.init(document.getElementById('gate-charts'))
      //     myChart.setOption(this.getOptions(
      //       ['迟到', "早退", "旷课", '晚未出'],
      //       [data.data.comeLate, data.data.leftEarly, data.data.absentee, data.data.notLeave]
      //     ))
      //   } else {
      //     this.$message.error(data.message);
      //   }

      // });
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
                type : 'value',
                minInterval: 1
            }
        ],
        xAxis : [
            {
                type : 'category',
                data : head,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                  margin: 7,
                  fontSize: 11,
                  interval: 0
                }
            }
        ],
        series : [
            {
                type:'bar',
                data: _data,
                barWidth: '15'
            }
        ]
      }
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
    linkToStasticDetail(type) {
      let param = this.getParam();
      if (type !== '') {
        param.type = type
      }
      this.$router.push({path: '/attendance/statisDetail', query: param});
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
  width: 320px;
  height: 288px;
  float: left;
}
.statis-detail{
  float: left;
  margin-left: 24px;
  padding-top: 48px;
}
.statis-line{
  margin-bottom: 4.8px;
}
.statis-name{
  width: 88px;
  display: inline-block;
}
.statis-link{
  color: #50bfff;
  font-weight: bold;
  /*margin-left: 16px;*/
}
.statis-link .el-icon-d-arrow-right{
  margin-left: 9.6px;
  font-size: 24px;
  font-weight: bold;
}
.statis-all{
  margin-top: 16px;
  text-align: center;
}
.class-statistical{
  margin: 16px auto 48px;
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
.tab-content .index-state{
  margin-left: 16px;
  width: 120px;
  font-size: 19.2px;
}
.tab-content .index-state .el-input--suffix .el-input__inner{
  padding: 0 6.4px;
  font-size: 19.2px;
}
.tab-content .index-class{
  margin-left: 9.6px;
  font-size: 19.2px;
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
}
.statis-num{
  display: inline-block;
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
