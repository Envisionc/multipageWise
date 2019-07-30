<template>
  <div class="content clearfix">
    <!-- <lefttree /> -->
    <div class="sub-list sub-list-bg">
      <el-tree 
        :data="data"
        :props="defaultProps" 
        :load="loadNode"
        lazy
        :default-expanded-keys="expandedKeys"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="main">
      <p class="back" @click="back()"><i class="el-icon-back"></i>返回</p>
      <h4 class="title">学生详情</h4>
      <div class="item-line clearfix">
        <p class="name">姓名</p>
        <p class="item">{{name}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">身份类型</p>
        <p class="item">{{['其他','学生','教职工','访客','校友'][type]}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">性别</p>
        <p class="item">{{['未知','男','女'][gender]}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">学号</p>
        <p class="item">{{studentId}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">入学年份</p>
        <p class="item">{{entryYear}}年{{entryMonth}}月</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">联系方式</p>
        <p class="item">{{telPhone}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">组织架构</p>
        <p class="item">{{orgArchi}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">人脸识别照片</p>
        <p class="item facePic">
          <img :src="imgUrl" v-if="imgUrl">
          <span v-else>暂未上传照片</span>
        </p>
      </div>
      <div class="item-line clearfix">
        <p class="name">民族</p>
        <p class="item">{{nation}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">证件类型</p>
        <p class="item">{{['身份证','回乡证','台胞证','外国护照','其他'][idType]}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">证件号码</p>
        <p class="item">{{idNo}}</p>
      </div>
      <div class="item-line clearfix">
        <p class="name">国籍</p>
        <p class="item">{{country}}</p>
      </div>
    </div>
  </div>
</template>
<script>
//   import api from "api/admin.js";
import axios from 'axios'
// import lefttree from '../component/left-tree'
import uuid from '../../../utils/common'
  export default {
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        id: '',
        name: '',
        type: 0,
        gender: 0,
        studentId: '',
        telPhone: '',
        orgArchi: '',
        entryYear: '', //入学年份
        entryMonth: '', // 入学月份
        imgUrl: '', //人脸照片
        nation: '',
        idType: '',
        idNo: '',
        country: '',
        expandedKeys: [],
        requestId: ''
      }
    },
    created() {
      if (!this.$route.query.id) {
        this.back()
      }
      this.getDetail(this.$route.query.id)
      // this.getTree()
    },
    methods: {
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
        axios({
          url: '/api/mde-person/campus/back/organization/queryAllOrg',
          method: 'post',
          data: params,
          headers:{
            'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            this.data = res.data.data
            this.orgId = res.data.data[0].orgId
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      getDetail(id) {
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "id": id
          }
        }
        axios({
        url: '/api/mde-person/campus/back/person/queryDetail',
        method: 'post',
        data: params,
        headers:{
            'Content-Type':'application/json'
        }	
        }).then(res => {
            if (res.statusText === "OK") {
              let obj = res.data.data
              this.name = obj.name
              this.type = obj.personType
              this.gender = obj.gender
              this.studentId = obj.personNo
              this.entryYear = obj.entranceYear
              this.entryMonth = obj.entranceMonth
              this.telPhone = obj.phone
              this.orgArchi = obj.orgs[obj.orgs.length - 1].orgAllName
              this.imgUrl = obj.imgUrl
              this.nation = obj.nation
              this.country = obj.nationality
              this.idType = obj.cardType
              this.idNo = obj.idNumber
              this.country = obj.nationality
              console.log(res.data)
            } else {
              this.$message.error(res.message);
            }
        })
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
          axios({
            url: '/api/mde-person/campus/back/organization/querySubOrg',
            method: 'post',
            data: params,
            headers:{
              'Content-Type':'application/json'
            }	
          }).then(res => {
            if(res.data.code == 0){
              resolve(res.data.data)
              if(res.data.data.length > 0) {
                this.orgId = res.data.data[0].orgId
              }
            }else {
              this.$message.error(res.data.messsage)
            }
          })
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
          axios({
            url: '/api/mde-person/campus/back/organization/querySubOrg',
            method: 'post',
            data: params,
            headers:{
              'Content-Type':'application/json'
            }	
          }).then(res => {
              if (res.data.code == 0){
                console.log(res.data, "1111")
                resolve(res.data.data);
              } else {
                this.$message.error(res.data.messsage)
              }
          })
        }
      },
      
      handleNodeClick(item) {
        console.log(item.orgId, "0000")
        this.$confirm('此操作将离开该页面, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({path: '/person', query: {orgId: item.orgId}})
        }).catch(() => {
                  
        });
        
      },
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .main{
    float: right;
    padding: 30px 15px;
    width: 70%;
  }
  .content{
    min-width: 780px;
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
  .back{
    cursor: pointer;
    margin-bottom: 20px;
    text-align: left;
  }
  .back i{
    margin-right: 10px;
  }
  .title{
    margin-bottom: 20px;
    font-size: 20px;
    text-align: left;
  }
  .item-line{
    margin-bottom: 25px;
  }
  .item-line .name,.item-line .item{
    float: left;
  }
  .item-line .name{
    width: 130px;
  }
  .facePic {
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px solid #eee;
    box-sizing: border-box;
  }
  .facePic>img {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>