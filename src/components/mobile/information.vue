<template>
  <div class="information">
    <div class="info-state">{{title}}</div>
    <div class="info-line clearfix">
      <div class="info-name">姓名</div>
      <div class="info-text">{{name}}</div>
    </div>
    <div class="info-line clearfix">
      <div class="info-name">人员类型</div>
      <div class="info-text">{{personTypeList[personType]}}</div>
    </div>
    <div class="info-line clearfix" v-if="clazzName">
      <div class="info-name">班级</div>
      <div class="info-text">{{clazzName}}</div>
    </div>
    <div class="info-line clearfix">
      <div class="info-name">学号</div>
      <div class="info-text">{{personNo}}</div>
    </div>
    <div class="info-line clearfix" v-if="shootTime">
      <div class="info-name">拍照时间</div>
      <div class="info-text">{{shootTime}}</div>
    </div>
    <div class="info-line clearfix" v-if="recordTime">
      <div class="info-name">记录时间</div>
      <div class="info-text">{{recordTime}}</div>
    </div>
    <div class="info-line clearfix">
      <div class="info-name">方向</div>
      <div class="info-text">{{accessTypeList[accessType]}}</div>
    </div>
    <div class="info-line clearfix" v-if="personImgUrl">
      <div class="info-name">登记照片</div>
      <div class="info-text">
        <div class='img-container'>
          <img :src="personImgUrl" class="info-img">
        </div>
      </div>
    </div>
    <div class="info-line clearfix" v-if="deviceScreenImgUrl">
      <div class="info-name">设备照片</div>
      <div class="info-text">
        <div class='img-container'>
          <img :src="deviceScreenImgUrl" class="info-img">
        </div>
      </div>
    </div>
    <div class="info-line clearfix" v-if="registerImgUrl">
      <div class="info-name">登记照片</div>
      <div class="info-text">
        <div class='img-container'>
          <img :src="registerImgUrl" class="info-img">
        </div>
      </div>
    </div>
    <div class="info-line clearfix" v-if="recordImgUrl">
      <div class="info-name">记录照片</div>
      <div class="info-text">
        <div class='img-container'>
          <img :src="recordImgUrl" class="info-img">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../api/mobile/index'
  import remConfig from '../../utils/remConfig'
  import uuid from '../../utils/common'
let actionMap = {
    'gate': api.getRecordsDetail
  }
  export default {
    mounted() {
      remConfig()
    },
    data() {
      return {
        personTypeList: ['其他', '学生','教职工','访客', '校友'],
        attendanceStatusList: {
              'dorm': ['正常', '未出寝', '延迟', '未归', '异常', '旷课'],
              // 0:正常 1:未出寝 2:延迟 3:未归 4:异常 5:旷课
              'gate': ['正常', '迟到', '早退', '请假', '异常', '旷课', '晚未出'],
        },
        accessTypeList: ['入', '出'],
        accessType: 0,
        clazzName: '',
        name: '',
        title: '',
        personType: 0,
        attendanceStatus: 0,
        personNo: '',
        recordTime: '',
        personImgUrl: '',
        deviceScreenImgUrl: '',
        dormRoomName: '',
        id: 0,
        type: 'gate',
        personName: '',
        shootTime: '',
        registerImgUrl: '',
        recordImgUrl: '',
      }
    },
    created() {
      let id = this.$route.query.id;
      let type = this.$route.query.type
      if (!id) {
        this.back()
      }
      if (type != 'gate' && type != 'dorm' && type != 'canteen') {
        this.back()
      }
      this.id = id;
      this.type = type;
      this.detail()
    },
    methods: {
      detail() {
            let requestId = uuid.createUUID()
            let token = window.localStorage.getItem("Token")
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {
                    "id": this.id
                }
            }
        actionMap[this.type](params).then(data => {
          if (data.code == 0) {
            this.personNo = data.data.personNo
            this.accessType = data.data.accessType
            this.personType = data.data.personType
            if (this.type == 'dorm') {
              this.title = data.data.dormRoomName
            }
            if (this.type == 'gate' || this.type == 'dorm') {
              this.name = data.data.name
              this.clazzName = data.data.clazzName
              this.attendanceStatus = data.data.attendanceStatus
              this.recordTime = data.data.recordTime
              this.personImgUrl = data.data.personImgUrl
              this.deviceScreenImgUrl = data.data.deviceScreenImgUrl
              this.title = this.attendanceStatusList[this.type][this.attendanceStatus]
            } else{
              this.shootTime = data.data.shootTime
              this.registerImgUrl = data.data.registerImgUrl
              this.recordImgUrl = data.data.recordImgUrl
              this.name = data.data.personName
              this.title = '食堂考勤记录详情'
            }
          } else {
            this.$message.error(data.message);
          }
        })
      },
      back() {
        this.$router.go(-1);
      }
    }
  }
</script>
<style>
  .info-name,.info-text{
    float: left;
  }
  .info-state{
    margin-bottom: .25rem;
    width: 100%;
    height: .5rem;
    line-height: .5rem;
    text-align: center;
    font-size: .15rem;
    font-weight: bold;
    background-color: #ecf8ff;
  }
  .img-container {
    width: 1.5rem;
    height: 1.5rem;
  }
  .info-line{
    padding: 0 .2rem;
    margin-bottom: .15rem;
    font-size: .15rem;
  }
  .info-name{
    width: 1rem;
  }
  .info-img{
    width: 100%;
    height: 100%;
  }
  html,body{
    background-color: #fff!important;
  }
</style>