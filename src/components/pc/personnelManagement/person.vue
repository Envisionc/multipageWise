<template>
  <div class="content clearfix">
    <!-- TODO 后续封装组件 -->
    <!-- <leftTree /> -->
    <div ref="subList" class="sub-list sub-list-bg">
      <el-tree 
        :data="treeDatas" 
        :load="loadNode" 
        ref="tree"
        lazy 
        :props="defaultProps" 
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="main">
      <!-- 此版本暂不放开此功能 -->
      <!-- <router-link tag="div" class="link" to="/person/batchImport">批量导入人员信息</router-link> -->
      <div class="top-operate clearfix">
        <div class="item">
          <p class="name">入学年份：</p>
          <el-select v-model="yearValue" clearable placeholder="请选择">
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <p class="name">身份类型：</p>
          <el-select v-model="typeValue" placeholder="请选择身份类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item add">
          <div class="label">
            <el-input v-model="no" class="add-width" placeholder="请输入用户名/手机号查询"></el-input>
          </div>
        </div>
        <div class="item"><div class="search" @click="search(1)">查询</div></div>
        <div class="item"><div class="search reset" @click="reset()">重置</div></div>
        <div class="item"><div class="search reset" @click="exportSearch()">导出</div></div>
      </div>
      <el-table
        :data="personList"
        border
        stripe
        style="width: 96%"
        id="export-table">
        <el-table-column
          :header-cell-style="{'background-color': '#eee'}"
          prop="personPicture"
          label="人脸识别照片"
          align="center"
          width="150">
          <template slot-scope="scope">
            <span class="btn default" @click="checkImg(scope.row)">查看</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="personName"
          label="姓名"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="personNo"
          label="学/工号"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="center"
          width="100">
          <template slot-scope="scope"><span>{{['','男','女'][scope.row.gender]}}</span></template>
        </el-table-column>
        <el-table-column
          prop="grade"
          label="年级"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="personClass"
          label="班级"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="personType"
          label="身份类型"
          align="center"
          width="100">
          <template slot-scope="scope"><span>{{['其他','学生','教职工','访客','校友'][scope.row.personType]}}</span></template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="entranceYear"
          label="入学年份"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150">
          <template slot-scope="scope">
            <span class="fileinput-button">
              <span>上传人脸照片</span>
              <input type="file" multiple="false" id="upload" ref="facePicture" accept="image/*" @change="uploadFile(scope.row.personId,$event)">
            </span>
            <span class="btn default" @click="checkPerson(scope.row.personId)">详情</span>
            <span class="btn default" @click="editPerson(scope.row.personId)">编辑</span>
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
      <el-dialog width="30%" title="查看人脸识别照片" :visible.sync="dialogTableVisible">
        <div class="img-box" style="width: 100%;height: 300px;">
          <img :src="facePicture" v-if="facePicture" alt="">
          <span v-else>暂无人脸识别照片</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import uuid from '../../../utils/common'
import api from '../../../api/pc/index'
import XLSX from 'xlsx'
import util from '../../../utils/excelUtil'
  export default {
    data() {
      return {
        // data: [],
        data: [
          {
            label: '一级 1',
            children: [{
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1'
              }]
            }]
          }, {
            label: '一级 2',
            children: [{
              label: '二级 2-1',
              children: [{
                label: '三级 2-1-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }]
          }, {
            label: '一级 3',
            children: [{
              label: '二级 3-1',
              children: [{
                label: '三级 3-1-1'
              }]
            }, {
              label: '二级 3-2',
              children: [{
                label: '三级 3-2-1'
              }]
            }]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        name: '',
        no: '',
        yearValue: '',
        typeValue:'',
        yearOptions: [
            {
                value: '0',
                label: '2016'
            },
            {
                value: '1',
                label: '2017'
            },
            {
                value: '2',
                label: '2018'
            },
            {
                value: '3',
                label: '2019'
            },
        ],
        typeOptions: [
          {
            value: '0',
            label: '其他'
          },
          {
            value: '1',
            label: '学生'
          },
          {
            value: '2',
            label: '教职工'
          },
          {
            value: '3',
            label: '访客'
          },
          {
            value: '4',
            label: '校友'
          }
        ],
        exportTable:[
          {
            name: '秦超',
            no: '1233255',
            type: '教职工',
            group: '一年级'
          },
          {
            name: '张三',
            no: '22555666',
            type: '学生',
            group: '二（1）'
          },
          {
            name: '李四',
            no: '2334555',
            type: '教职工',
            group: '后勤部'
          }
        ],
        orgId: 0,
        page: 1,
        total: 0,
        pageSize: 0,
        exportTableModel:[],
        tableData: [
            {
                personId: '3261088884547035424',
                personPicture: '12',
                personName: '张三',
                personNo: '20190710',
                sex: '男',
                grade: '一年级',
                grade_class: '一(二)班',
                personType: 1,
                tellphone: 13655589859,
                enrollmentYear: 2019
            },
            {
                personId: '3261088884547035426',
                personPicture: '12',
                personName: '里四',
                personNo: '20190710',
                sex: '男',
                grade: '五年级',
                grade_class: '五(一)班',
                personType: 1,
                tellphone: 13655589859,
                enrollmentYear: 2014
            },
        ],
        requestId: '',
        randomToken: '',
        personList: [], // 人员列表
        treeDatas: [], // 组织架构树形数据
        orgId: '', //当前节点的id
        dialogTableVisible: false, // 人脸识别照片弹层默认不显示 false
        facePicture: '', // 人脸识别照片
        defaultExpandedKeys: [], //默认展开的节点
        defaultCheckedKeys: [], // 默认选中的节点
      }
    },
    mounted() {
      this.$nextTick(function(){
        var _h = window.innerHeight;
        var box_h = _h - 180
        $(".el-tree").height(box_h)
        this.orgId = this.$route.query.orgId ? this.$route.query.orgId : 0
        // this.$refs.tree.se
        this.search(1)
      })
      console.log(this.$refs.subList.getBoundingClientRect())
      this.randomToken = uuid.createUUID()
      // this.getPersonList()
      // this.getTree()
      this.generateYearList()
      // console.log(location.hostname, "location.hostname")
      // this.getInfo()
    },
    methods: {
      generateYearList() {
        let startYear = 2005
        let currentDate = new Date()
        let thisYear = currentDate.getFullYear()
        let temp = thisYear - startYear
        let arrYear = []
        for(let i=0; i<=temp; i++){
          let obj = {}
          obj.value = i
          obj.label = thisYear--
          arrYear.push(obj)
        }
        this.yearOptions = arrYear
        console.log(arrYear, "................")
      },
      handleRemove(file) {
        console.log(file);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files) {
        // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      // 获取人员管理-人员列表
      getPersonList() {
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID() 
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {}
        }
        axios({
          url:'/mde-person/campus/back/person/queryPage',
          method: 'post',
          data: params,
          headers:{
            'Content-Type':'application/json'
          }		
        }).then((res)=>{
          // console.log(res,"目前的结果")
          if (res.statusText === "OK") {
            this.personList = res.data.data.list
            this.personList.forEach((item) => {
              if (item.personType == 2) {
                item.orgName = ""
              }
            })
          }
        })
      },
      // 获取架构树形结构
      getTree() {
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {}
        }
        api.getTreeOrg(params).then(res => {
          
          if (res.code == 0) {
            this.treeDatas = res.data
            this.orgId = res.data[0].orgId
            this.search(1)
          } else {
            this.$message.error(res.message)
          }
        })
        // axios({
        //   url: '/mde-person/campus/back/organization/queryAllOrg',
        //   method: 'post',
        //   data: params,
        //   headers:{
        //     'Content-Type':'application/json'
        //   }	
        // }).then(res => {
        //   if (res.data.code == 0) {
        //     this.treeDatas = res.data.data
        //     this.orgId = res.data.data[0].orgId
        //     this.search(1)
        //   } else {
        //     this.$message.error(res.data.message)
        //   }
        // })
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          const token = window.localStorage.getItem("token")
          let requestId = uuid.createUUID()
          let params = {
            "requestId": requestId,
            "authToken": token,
            "userToken": token,
            "data": {}
          }
          api.querySubOrg(params).then(res => {
            if(res.code == 0){
              resolve(res.data)
              if(res.data.length > 0) {
                this.orgId = res.data[0].orgId
              }
            }else {
              this.$message.error(res.messsage)
            }
          })
          // axios({
          //   url: '/mde-person/campus/back/organization/querySubOrg',
          //   method: 'post',
          //   data: params,
          //   headers:{
          //     'Content-Type':'application/json'
          //   }	
          // }).then(res => {
          //   if(res.data.code == 0){
          //     resolve(res.data.data)
          //     if(res.data.data.length > 0) {
          //       this.orgId = res.data.data[0].orgId
          //     }
          //   }else {
          //     this.$message.error(res.data.messsage)
          //   }
          // })
        } else {
          let orgId = node.data.orgId
          const token = window.localStorage.getItem("token")
          let requestId = uuid.createUUID()
          let params = {
            "requestId": requestId,
            "authToken": token,
            "userToken": token,
            "data": {
              "orgId": orgId
            }
          }
          api.querySubOrg(params).then(res => {
            if(res.code == 0){
              resolve(res.data)
            }else {
              this.$message.error(res.messsage)
            }
          })

          // axios({
          //   url: '/mde-person/campus/back/organization/querySubOrg',
          //   method: 'post',
          //   data: params,
          //   headers:{
          //     'Content-Type':'application/json'
          //   }	
          // }).then(res => {
          //     if (res.data.code == 0){
          //       resolve(res.data.data);
          //     } else {
          //       this.$message.error(res.data.messsage)
          //     }
          // })
        }
      },
      // {id: "3", personNo: "201804012003", name: "吼吼吼", type: 0, org: "二班"}
      // 点击节点展开
      handleNodeClick(item) {
        console.log(item)
        this.orgId = item.orgId
        this.name = ''
        this.no = ''
        this.typeValue = ''
        this.search(1)
      },
      // 查看详情
      checkPerson(id) {
        this.$router.push({path: 'person/personDetail', query: {id: id}})
      },
      // 编辑
      editPerson(id) {
        this.$router.push({path: 'person/personEdit', query: {id: id}})
      },
      // 查看人脸识别照片 
      checkImg(item) {
        this.dialogTableVisible = true
        this.facePicture = item.imgUrl
      },
      uploadFile(personId,e) {
        let file = e.target.files[0]
        let param = new FormData(); //创建form对象
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        param.append('data',file);//通过append向form对象添加数据 
        param.append('requestId',requestId);//通过append向form对象添加数据 
        param.append('authToken',token);//通过append向form对象添加数据 
        param.append('userToken',token);//通过append向form对象添加数据 
        param.append('userId',personId);//通过append向form对象添加数据
        axios({
          url: '/mde-person/mde/img/upload',
          method: 'post',
          data: param,
          headers:{
            'Content-Type':'multipart/form-data'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            this.search(1)
            this.$notify({
              title: '成功',
              message: '照片上传成功',
              type: 'success'
            });
          } else {
            this.$notify.error({
              title: '失败',
              message: '照片上传失败'
            });
          }
        })
      },
      // 切换分页
      changePage(page) {
        this.search(page)
      },
      // 查询重置
      reset() {
        this.no = ''
        this.typeValue = ''
        this.yearValue = ''
      },
      // 查询
      search(page){
        console.log(axios.defaults.baseURL, "axios")
        let personType // 身份类型，0为其他，1为学生，2为教职工，3为访客，4为校友
        let entranceYear  // 入学年份
        let personNameOrPhone // 学号或手机号
        if (this.no !== '') {
          personNameOrPhone = this.no
        }
        if (this.yearValue !== '') {
          entranceYear = this.yearValue
        }
        if (this.typeValue !== '') {
          personType = this.typeValue
        }
        let orgIds = this.orgId ? [this.orgId] : [];
        let pageNo = page
        console.log(personType, orgIds, pageNo, "人员列表")
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "orgIds": orgIds,
            "personType": personType,
            "entranceYear": entranceYear,
            "personNameOrPhone": personNameOrPhone,
            "pageNo": pageNo
          } 
        }
        api.getPersonList(params).then(res => {
          if (res.code == 0) {
            console.log(res.data)
            this.personList = res.data.list;
            this.total = res.data.pageBean.rowCount;
            console.log(this.total, "查询的条数")
            this.pageSize = res.data.pageBean.maxResults
          } else {
            this.$message.error(res.message)
          }
        })
        // axios({
        //   url:'/mde-person/campus/back/person/queryPage',
        //   method: 'post',
        //   data: params,
        //   headers:{
        //     'Content-Type':'application/json'
        //   }	
        // }).then(res => {
        //   if (res.data.code == 0) {
        //     console.log(res.data)
        //     this.personList = res.data.data.list;
        //     this.total = res.data.data.pageBean.rowCount;
        //     this.pageSize = res.data.data.pageBean.maxResults
        //   } else {
        //     this.$message.error(res.data.message)
        //   }
        // })
        // api.personList(param).then(data => {
        //   if (data.code == 0){
            // this.exportTable = data.data.list;
            // this.total = data.data.pageBean.rowCount;
            // this.pageSize = data.data.pageBean.maxResults
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // })
      },
      // 导出
      exportSearch(){
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let parma = {}
        if ( this.typeValue ) {
          parma["personType"] = this.typeValue
        }
        if ( this.no ) {
          parma["personNameOrPersonNo"] = this.no
        }
        if (this.yearValue) {
          parma["entranceYear"] = this.yearValue
        }
        parma["orgId"] = this.orgId
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": parma
        }
        axios({
          url: '/mde-person/campus/back/exportPerson',
          method: 'post',
          data: params,
          headers:{
            'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            let obj = res.data.data.list
            console.log(obj.length, "导出的条数")
            let header = obj[0]
            let body = []
            for (let i=1; i<obj.length; i++) {
              body.push(obj[i])
            }
            util.exportExcel(header, body, '人员导出表格')
          } else {
            this.$message.error(res.data.message)
          }
        })
        // let param = {}
        // if (this.name !== '') {
        //   param.personName = this.name
        // } 
        // if (this.no !== '') {
        //   param.personNo = this.no
        // }
        // if (this.personType !== '') {
        //   param.personType = this.typeValue
        // }
        // param.orgId = this.orgId;
        // api.personSearch(param).then(data => {
        //   if (data.code == 0){
        //     let header = data.data.list.shift();
        //     exportExcel(header, data.data.list, "人员列表");
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // })
      },
    }
  }
</script>
<style scoped>
  .main{
    float: right;
    padding: 30px 15px;
    width: 78%;
    min-width: 885px;
  }
  .content{
    min-width: 1410px;
    font-size: 0;
  }
  .sub-list{
    float: left;
    padding: 30px 35px;
    width: 20%;
    overflow: hidden;
  }
  .el-tree{
      overflow-y: scroll;
      overflow-x: hidden;
      background: #fafafa;
  }
  .sub-list .el-tree-node__label{
      width: 19%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
  .top-operate {
      margin-bottom: 20px;
  }
  .link{
    margin-bottom: 20px;
    font-size: 16px;
    width: 160px;
    height: 40px;
    /* text-align: left; */
    background: #0cb181;
    border-radius: 4px;
    line-height: 40px;
    color: #fff;
    cursor: pointer;
  }
  /* .link,.export{
    color: #409eff;
    cursor: pointer;
  }
  .link:hover,.export:hover{
    color: #2084eb;
  } */
  .main .item,.label{
    float: left;
  }
  .main .item{
    margin-right: 30px;
  }
  .item .name{
    float: left;
    line-height: 40px;
    /* margin-right: 8px; */
    font-size: 16px;
  }
  .item .label,.item .el-select{
    width: 150px;
  }
  .item.add {
      width: 200px;
  }
  .add-width {
      width: 200px;
  }
  .export{
    display: inline-block;
    margin: 23px 0;
    font-size: 16px;
  }
  .pagi{
    margin-top: 20px;
    padding-right: 20%;
    text-align: right;
  }
  .search{
    font-size: 16px;
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #0cb181;
    border-radius: 3px;
    cursor: pointer;
    user-select:none;
  }
  .reset {
      background-color: #e4e4e4;
      color: black;
  }
  .fileinput-button {
    position: relative;
    top: 7px;
    display: inline-block;
    overflow: hidden;
    color: #00a6ed;
  }
  .fileinput-button input{
    position: absolute;
    left: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
}
.img-box>img {
  width: 100%;
  height: 100%;
  display: block;
}
.layer {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
  display: none;
}
</style>