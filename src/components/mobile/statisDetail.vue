<template>
  <div class="pc-index">
    <div class="index-header clearfix">
      <div class="index-choose" @click="changeSelectShow()">
        筛选<i class="el-icon-arrow-down"></i>
      </div>
      <div class="index-class txt-l" @click="changeClassShow()" style="max-width: .84rem;">
        {{selectClassName ? selectClassName : '班级'}}<i class="el-icon-arrow-down"></i>
      </div>
      <div class="index-search">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="keyword"
          @change="search(1)"
          >
        </el-input>
      </div>
    </div>
    <select-class class="class-select" :classShow="classShow" @doSelectClass="doSelectClass"></select-class>
    <div class="class-select" v-show='chooseShow'>
      <h5 class="choose-name">时间</h5>
      <div class="choose-area choose-one clearfix">
        <div class="choose-item" :class="{active: dateType == 1}" @click="chooseDate(1)">今日</div>
        <div class="choose-item" :class="{active: dateType == 2}" @click="chooseDate(2)">最近七天</div>
        <div class="choose-item" :class="{active: dateType == 3}" @click="chooseDate(3)">最近一个月</div>
      </div>
      <div class="choose-timmer clearfix">
        <div class="choose-timmer-block">
          <el-date-picker
            v-model="beginDate"
            type="date"
            size="mini"
            style="width: 100%"
            :editable="false"
            placeholder="开始日期">
          </el-date-picker></div>
        <div class="choose-timmer-block text">至</div>
        <div class="choose-timmer-block">
          <el-date-picker
            v-model="endDate"
            type="date"
            size="mini"
            style="width: 100%"
            :editable="false"
            placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <h5 class="choose-name">考勤状态</h5>
      <div class="choose-area clearfix">
        <div v-for="(item, index) in attendanceStatusList" :key="index" class="choose-item" :class="{active: index == attendanceStatus}" @click="attendanceStatus == index? attendanceStatus = -1 : attendanceStatus = index">{{item}}</div>
      </div>
      <h5 class="choose-name">人员类型</h5>
      <div class="choose-area clearfix">
        <div v-for="(item, index) in personTypeList" :key="index" class="choose-item" :class="{active: index == personType}" @click="personType = index">{{item}}</div>
      </div>
      <div class="class-select-btn clearfix">
        <div class="reset-btn" @click="reset">重置</div>
        <div class="confirm-btn" @click="search(1);chooseShow = false">确定</div>
      </div>
    </div>
    <scroller noDataText="" ref="myscroller" class="statis-detail-table" :on-infinite="scroll">
      <el-table
        :data="tableData"
        style="width: 100%"
        size="medium"
        border
        stripe
        :fit="false"
        :row-class-name="tableHeaderClass"
        :header-cell-style="{background:'#F3F4F7',color:'#555'}">
        <el-table-column
          :width="columnWidth[0]"
          label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="班级" 
          :width="columnWidth[1]">
          <template slot-scope="scope" >
            <span>{{ scope.row.clazzName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="类型" 
          :width="columnWidth[2]">
          <template slot-scope="scope">
            <span>{{ personTypeList[scope.row.personType] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态" 
          :width="columnWidth[3]">
          <template slot-scope="scope">
            <span>{{ attendanceStatusList[scope.row.attendanceStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" 
          :width="columnWidth[4]">
          <template slot-scope="scope">
            <span class="check-btn" @click="handleCheck(scope.row.id)">查看</span>
          </template>
        </el-table-column>
      </el-table>
    </scroller>
  </div>
</template>
<script>
  import remConfig from '../../utils/remConfig'
  import api from '../../api/mobile/index'
  import DateUtil from '../../utils/DateUtil'
  import uuid from '../../utils/common'
  import selectClass from "./component/selectClazz"


  let scroll_timmer;

  export default {
    components: {
      'select-class': selectClass
    },
    beforeCreate() {
    },
    mounted() {
      remConfig();
      this.resizeTable();
      window.onresize = () => {
        this.resizeTable();
      }
      window.addEventListener('scroll', this.handleScroll);
    },
    data() {
      return {
        personTypeList: ['请选择', '学生','教职工'],
        attendanceStatusList: ['正常', '迟到', '早退', '请假', '异常', '旷课', '晚未出'],
        columnWidth: [190, 228, 114, 114, 114],
        stateValue: '外出',
        classShow: false,
        chooseShow: false,
        beginDate: new Date(),
        endDate: new Date(),
        tableData: [],
        tableHeaderClass: 'tableHeaderClass',
        personType: 0,
        keyword: '',
        selectClassName: '',
        attendanceStatus: 0,
        orgId: 0,
        page: 1,
        rowCount: 8,
        empty: false,
        // 1 今天 2 最近七天 3 最近一个月
        dateType: 0,
        totalPage: 1,
        hasLoad: false,
        loading: false
      }
    },
    activated() {
      if(this.scroll > 0){
        window.scrollTo(0, this.scroll);
        this.scroll = 0;
        window.addEventListener('scroll', this.handleScroll);
      }
    },
    beforeRouteEnter(to, from ,next) {
      console.log('beforeRouteEnter')
      if (from.path == '/attendance/phone/index') {
        next((vm) => {
          if (vm.hasLoad) return 
          vm.init()
          vm.hasLoad = true;
        })
      } else {
        next()
      }
    },
    beforeRouteLeave(to, from, next){
      console.log('beforeRouteLeave')
      this.keyword = '';
      this.loading = false
      this.hasLoad = false
      next()
    },
    deactivated(){
     window.removeEventListener('scroll', this.handleScroll);
    },
    created() {
      if (this.hasLoad) return 
      this.hasLoad = true
      this.init()
    },
    methods: {
      init() {
        this.personType = this.$route.query.personType ? this.$route.query.personType : 0;
        this.orgId = this.$route.query.orgId ? this.$route.query.orgId : 0,
        this.attendanceStatus = this.$route.query.type ? this.$route.query.type : -1;
        this.selectClassName = this.$route.query.classname ? this.$route.query.classname : ''
        let date = this.$route.query.date ? new Date(this.$route.query.date) : new Date();
        if (date.toString() == "Invalid Date") {
          date = new Date() 
        }
        this.beginDate = date;
        this.endDate = date;
        console.log(date)
        this.search(1)
      },
      reset() {
        this.personType = 0
        this.attendanceStatus = -1
        let date = new Date();
        this.beginDate = date;
        this.endDate = date;
        this.dateType = 0
      },
      handleScroll() {
        this.scroll = document.documentElement && document.documentElement.scrollTop
      },
      doSelectClass(orgId, className) {
        this.orgId = orgId
        this.selectClassName = className
        this.classShow = false
        this.search(1)
      },
      getParam() {
        let param = {};
        if (this.personType != 0) param.personType = this.personType;
        param.nameOrPersonNo = this.keyword;
        if (this.attendanceStatus != -1) param.attendanceStatus = this.attendanceStatus;
        param.orgIds = this.orgId != 0 ? [this.orgId] : [];
        param.startTime = DateUtil.format(this.beginDate, 'yyyy-MM-dd 00:00:00');
        param.endTime = DateUtil.format(this.endDate, 'yyyy-MM-dd 23:59:59');
        return param;
        console.log(param, "param")
      },
      search(page) {
        console.log(page, "page")
        if (this.loading) return 
        this.loading = true
        let requestId = uuid.createUUID()
        let token = window.localStorage.getItem("Token")
        let personType
        if (this.personType != 0) personType = this.personType
        let nameOrPersonNo = this.keyword
        let attendanceStatus
        if (this.attendanceStatus != -1) attendanceStatus = this.attendanceStatus
        let orgIds = this.orgId != 0 ? [this.orgId] : []
        let startTime = DateUtil.format(this.beginDate, 'yyyy-MM-dd 00:00:00')
        let endTime = DateUtil.format(this.endDate, 'yyyy-MM-dd 23:59:59')
        let pageNo
        if (page) {
          if (page > this.totalPage) {
            this.loading = false;
            this.$refs.myscroller.finishInfinite(2);
            return false;
          }
          pageNo = page;
        } else {
          pageNo = 1
        }
        if (pageNo == 1) {
          this.tableData = [];
        }
        let params = {
            "requestId": requestId,
            "authToken": token,
            "userToken": token,
            "data": {
                "personType": personType,
                "nameOrPersonNo": nameOrPersonNo,
                "attendanceStatus": attendanceStatus,
                "orgIds": orgIds,
                "startTime": startTime,
                "endTime": endTime
            }
        }
        
        console.log(params, "params")
        api.getQueryRecords(params).then(res => {
            console.log(res, "-----------")
            this.loading = false
            this.$refs.myscroller.finishInfinite(2)
            if (res.code == 0) {
              this.tableData = this.tableData.concat(res.data.list)
              if (res.data.list.length != 0) {
                this.page = res.data.pageBean.pageNo
                this.totalPage = res.data.pageBean.totalPage
              }
            } else {
              this.$message.error(res.message)
            }
        })
        console.log(page, this.totalPage);
        
        // api.gateList(param).then(data => {
        //   this.loading = false;
        //   this.$refs.myscroller.finishInfinite(2);
        //   if (data.code == 0) {
        //     this.tableData = this.tableData.concat(data.data.list);
        //     if (data.data.list.length != 0) {
        //       this.page = data.data.pageBean.pageNo;
        //       this.totalPage = data.data.pageBean.totalPage;
        //     }
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // })
      },
      changePage() {
        if (this.loading) {
          return ;
        }
        console.log('loadData...')
        this.search(this.page + 1);
      },

      resizeTable() {
        let width = window.document.body.clientWidth;
        let tmp_arr = [];
        tmp_arr[0] = Math.floor(width * 0.25);
        tmp_arr[1] = Math.floor(width * 0.30);
        tmp_arr[2] = Math.floor(width * 0.15);
        tmp_arr[3] = Math.floor(width * 0.15);
        tmp_arr[4] = Math.floor(width * 0.15);
        this.columnWidth = tmp_arr;
      },
      changeClassShow() {
        this.chooseShow = false;
        this.classShow = this.classShow ? false : true
      },
      selectItem() {
        $(this.target).addClass('active')
      },
      changeSelectShow() {
        this.classShow = false;
        this.chooseShow = this.chooseShow ? false : true
      },
      chooseDate(type) {
        let date = new Date();
        this.endDate = date;
        if (type == 1) {
          this.beginDate = date;
        } else if (type == 2) {
          this.beginDate = DateUtil.weekBefore(date);
        } else if (type == 3) {
          this.beginDate = DateUtil.monthBefore(date);
        }
        this.dateType = type
      },
      selectItemDivision(idx) {
        for(var i = 0;i < this.division.length;i++){
          this.division[i].check = false
        }
        this.division[idx].check = true
      },
      selectItemGrade(idx) {
        for(var i = 0;i < this.grade.length;i++){
          this.grade[i].check = false
        }
        this.grade[idx].check = true
      },
      selectItemClass(idx) {
        for(var i = 0;i < this.classArr.length;i++){
          this.classArr[i].check = false
        }
        this.classArr[idx].check = true
      },
      resetSelect(){
        for(var i = 0;i < this.division.length;i++){
          this.division[i].check = false
        }
        for(var i = 0;i < this.grade.length;i++){
          this.grade[i].check = false
        }
        for(var i = 0;i < this.classArr.length;i++){
          this.classArr[i].check = false
        }
      },
      handleCheck(id) {
        this.$router.push({path: '/attendance/information', query: {type: 'gate', id: id}})
      },
      scroll(event) {
        this.changePage();
      }
    }
  }
</script>
<style scoped>
.pc-index{
  font-size: 0;
}
.index-header{
  width: 100%;
  padding: .1rem;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 0;
  z-index: 1;
  background: white;
}
.index-timmer .el-input{
  width: 1.2rem;
  float: left;
  font-size: .14rem;
}
.index-timmer .el-input__prefix{
  display: none;
}
.index-timmer .el-input__inner{
  padding: 0 .2rem;
}
.index-timmer .el-input__suffix{
  display: none;
}
.index-state{
  margin-left: .2rem;
  font-size: .14rem;
  float: left;
  width: .9rem;
}
.index-class{
  margin-left: .2rem;
  font-size: .14rem;
  float: left;
  /*width: .8rem;*/
  height: 40px;
  line-height: 40px;
  text-align: right;
}
.index-choose{
  font-size: .14rem;
  float: left;
  width: .8rem;
  height: 40px;
  line-height: 40px;
}
.index-class i,.index-choose i{
  margin-left: .1rem;
}
.class-select{
  position: fixed;
  width: 100%;
  height: 400px;
  /* height: 100%; */
  padding-top: 10px;
  z-index: 2;
  font-size: .15rem;
  background-color: #fff;
}
.class-select-area{
  height: 100%;
}
.class-select-item{
  float: left;
  padding-left: .2rem;
  padding-bottom: .7rem;
  width: 30%;
  height: 100%;
  border-right: 1px solid #eee;
}
.class-select-item:last-child{
  border-right: 0;
}
.class-select-btn{
  /* position: fixed; */
  width: 100%;
  height: .48rem;
  background-color: #fff;
  /* bottom: 0;
  left: 0;
  z-index: 4; */
  border-top: 1px solid #e1e1e1;
}
.class-select-btn div{
  width: 50%;
  float: left;
  text-align: center;
  line-height: .48rem;
}
.confirm-btn{
  background-color: #5CB85C;
  /* background-color: #50bfff; */
  color: #fff;
  border-left: 1px solid #e1e1e1;
}
.class-select-item .active{
  color: #5CB85C;
  font-weight: bold;
}
.class-statistical{
  font-size: .14rem;
}
.statis-charts{
  width: 1.8rem;
  height: 1.8rem;
  background-color: #eee;
  float: left;
}
.statis-detail{
  float: left;
  margin-left: .15rem;
  padding-top: .25rem;
}
.statis-name{
  width: .7rem;
  display: inline-block;
}
.statis-link{
  color: #50bfff;
  font-weight: bold;
  margin-left: .1rem;
}
.statis-link .anticon-double-right{
  margin-left: .08rem;
}
.statis-all{
  margin-top: .1rem;
  text-align: center;
}
.class-statistical{
  margin: .1rem auto .3rem;
}
.index-search{
  float: right;
  width: 1.5rem;
  margin-left: .2rem;
}
.txt-l{
  text-align: left!important;
}
.statis-detail-table{
  position: absolute;
  padding-top: .7rem;
  font-size: .13rem;
  height: 100%;
  overflow-x: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}
.statis-detail-table .ant-table-thead > tr > th,.statis-detail-table .ant-table-tbody > tr > td{
  padding: .08rem;
  text-align: center;
}
.choose-name{
  font-size: .16rem;
  margin: 0 0 .2rem .23rem;
}
.choose-item{
  float: left;
  width: .9rem;
  height: .26rem;
  line-height: .26rem;
  background-color: #eee;
  border-radius: .5rem;
  text-align: center;
  margin: 0 0 .15rem .2rem;
  font-size: .13rem;
}
.choose-item.active{
  background-color: #5CB85C;
  /* background-color: #50bfff; */
  color: #fff;
}
.choose-timmer{
  width: 3.2rem;
  margin: .1rem auto .25rem;
}
.choose-timmer .el-date-editor{
  width: 3.2rem;
}
.statis-detail-table .el-table .cell,.statis-detail-table .el-table th div,.statis-detail-table .el-table--border td:first-child .cell,.statis-detail-table .el-table--border th:first-child .cell{
  padding: 0 .05rem;
  font-size: .12rem;
}
.tableHeaderClass{
  background-color: #eee;
}
.el-input--suffix .el-input__inner {
  padding-right: 15px;
}
.choose-timmer-block{
  float: left;
  width: 1.35rem;
}
.choose-timmer-block.text{
  width: .4rem;
  line-height: .3rem;
  text-align: center;
}
.check-btn{
  color: #50bfff;
}
html,body{
  background-color: #fff!important;
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
</style>
