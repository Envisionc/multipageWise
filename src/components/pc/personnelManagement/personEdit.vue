<template>
  <div class="content clearfix" @click="handleBodyClick">
    <!-- 左侧组织架构 -->
    <div class="sub-list sub-list-bg">
      <el-tree 
        :data="data"
        :props="defaultProps" 
        :load="loadNode"
        lazy
        @node-click="handleNodeClick">
      </el-tree>
    </div>
    <!-- <lefttree /> -->
    <!-- 内容区 -->
    <div class="main">
      <p class="back" @click="back()"><i class="el-icon-back"></i>返回</p>
      <h4 class="title">编辑人员</h4>
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>身份类型</p>
        <div class="item">
          <el-select v-model="typeValue">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>姓名</p>
        <div class="item"><el-input v-model="name" placeholder="请输入姓名"></el-input></div>
      </div>
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>性别</p>
        <div class="item">
          <el-radio v-model="gender" label="1">男</el-radio>
          <el-radio v-model="gender" label="2">女</el-radio>
        </div>
      </div>
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>学号</p>
        <div class="item"><el-input v-model="studentId" placeholder="请输入学号"></el-input></div>
      </div>
      <!-- add -->
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>手机号</p>
        <div class="item"><el-input v-model="phone" placeholder="请输入手机号"></el-input></div>
      </div>
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>入学时间</p>
        <div class="item">
          <el-date-picker
            type="month"
            v-model="selectMonthYear"
            format="yyyy 年 MM 月"
            value-format="yyyy年MM月"
            placeholder="选择年月">
          </el-date-picker>
        </div>
      </div>
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>联系方式</p>
        <div class="item"><el-input v-model="phone" placeholder="请输入联系方式"></el-input></div>
      </div>
      <div class="item-line clearfix">
        <p class="name"><span class="red">*</span>组织架构</p>
        <div class="item">
          <el-cascader
            v-model="value"
            :options="orgOptions"
            :props="newprops"
            @change="handleChange">
          </el-cascader>
        </div>
      </div>
      <div class="item-line clearfix">
        <p class="name">人脸识别照片</p>
        <!-- TODO 选择哪种方式上传图片 -->
        <div class="item picture-box">
          <div class="face-picture" @mouseenter="pictureEventEnter()">
            <img :src="facePicture">
          </div>
          <div class="layer" v-show="layerShow" @mouseleave="pictureEventLeave()">
            <div class="fileinput-button">
              <span class="el-icon-plus edit-pic"></span>
              <input type="file" multiple="false" id="upload" ref="facePicture" accept="image/*" @change="uploadFile($event)">
            </div>
          </div>
        </div>
      </div>
      <div class="item-line clearfix">
        <p class="name">民族</p>
        <div class="item">
          <el-select v-model="nationalValue">
            <el-option
              v-for="item in nationalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item-line clearfix">
        <p class="name">证件类型</p>
        <div class="item">
          <el-select v-model="certiValue">
            <el-option
              v-for="item in certiOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item-line clearfix">
        <p class="name">证件号码</p>
        <div class="item"><el-input v-model="certiNo" placeholder="请输入证件号码"></el-input></div>
      </div>
      <div class="item-line clearfix">
        <p class="name">国籍</p>
        <div class="item">
          <el-select v-model="countryValue" placeholder="请选择">
            <el-option-group
              v-for="group in countryOptions"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </div>
      </div>
        <el-button style="width: 150px;margin-left: 130px;float: left;" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
  // import api from "../../api/person";
import axios from 'axios'
import uuid from '../../../utils/common'
import {cityList, hotCity,nationList} from '../../../api/pc/city'
  export default {
    mounted() {
    },
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        typeValue: '',
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
          },
        ],
        treeShow: false,
        id: '',
        name: '',
        gender: '',
        studentId: '',
        phone: '',
        orgArchi: '',
        nationalValue: '汉族',
        certiNo: '',
        certiValue: '',
        certiOptions: [
          {
            value: '0',
            label: '身份证'
          },
          {
            value: '1',
            label: '回乡证'
          },
          {
            value: '2',
            label: '台胞证'
          },
          {
            value: '3',
            label: '外国护照'
          },
          {
            value: '4',
            label: '其他'
          }
        ],
        countryValue: '中国',
        countryOptions: [
          {
            label: '热门国家',
            options: hotCity
          }, 
          {
            label: '国家',
            options: cityList
          }
        ],
        newArr: [
            {
                label: "有旺希望小学",
                value: "3407067607393051215",
                children: [
                    {
                        label: "五年级",
                        value: "3407067607393051217",
                        children: [
                            {
                                label: "1班",
                                value: "3407067607393051218"
                            }
                        ] 
                    },
                    {
                        label: "三年级",
                        value: "3407067607393051221",
                        children: [
                            {
                                label: "二班",
                                value: "3407067607393051222"
                            },
                            {
                                label: "三班",
                                value: "3407067607393053814"
                            }
                        ] 
                    }
                ]
            }
        ],
        classList: [
          {
            name: "小学部",
            orgId: "106722",
            subOrg: [
              {
                name: "一年级",
                orgId: "1067222552",
                subOrg: [
                  {
                    name: "一(1)班",
                    orgId: "10622552562",
                    subOrg: []
                  },
                  {
                    name: "一(2)班",
                    orgId: "10622552563",
                    subOrg: []
                  }
                ]
              }
            ]
          }
        ],
        newprops: {
          label: 'name',
          value: 'orgId',
          children: 'subOrg'
        },
        nationalOptions: nationList,
        selectOrgs: [],
        selectOrgsArr: [],
        value: [],
        imageUrl: '',
        requestId: '', // 请求接口必须参数
        selectMonthYear: '', //入学年月
        orgOptions: [],
        facePicture: '', // 人脸识别照片
        layerShow: false, //照片遮罩层
      }
    },
    created() {
      if (!this.$route.query.id) {
        this.back()
      }
      this.getDetail(this.$route.query.id)
      this.getTree()
    },
    methods: {
      pictureEventEnter() {
        this.layerShow = true
      },
      pictureEventLeave() {
        this.layerShow = false
      },
      uploadFile(e) {
        let file = e.target.files[0]
        let param = new FormData(); //创建form对象
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        param.append('data',file);//通过append向form对象添加数据 
        param.append('requestId',requestId);//通过append向form对象添加数据 
        param.append('authToken',token);//通过append向form对象添加数据 
        param.append('userToken',token);//通过append向form对象添加数据 
        param.append('userId',this.id);//通过append向form对象添加数据
        axios({
          url: '/mde-person/mde/img/upload',
          method: 'post',
          data: param,
          headers:{
            'Content-Type':'multipart/form-data'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: '成功',
              message: '照片上传成功',
              type: 'success'
            });
            this.facePicture = res.data.imageUrl
            this.getDetail(this.id)
          } else {
            this.$notify.error({
              title: '失败',
              message: '照片上传失败'
            });
          }
        })
      },
      // on-success 事件
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // before-upload 事件
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 重新选择组织架构
      handleChange(value) {
        console.log(value, "value");
        this.selectOrgsArr = value
      },
      expandChange(value) {
        console.log(value)
      },
      handleBodyClick(e) {
        if(e.target.className !== 'tree-sel'){
          this.treeShow=false
          let _arr = []
          // let _nodes = this.$refs.tree.getCheckedNodes()
          // for(let i of _nodes){
          //   _arr.push({name: i.name, id: i.orgId})
          // }
          this.selectOrgs = _arr;
        }else {
          this.treeShow = true
        }
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
        axios({
          url: '/mde-person/campus/back/organization/queryAllOrg',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
            if (res.data.code == 0) {
              let obj = res.data.data[0]
              let arr = []
              arr.push(obj)
              this.options = arr
              this.newOptions(this.options)
              this.orgOptions = this.options
              // this.classTree = obj.subOrg
              // this.classTree = this.classList
              // this.setClassTree()
            } else {
              this.$message.error(res.data.message)
            }
        })
      },
      newOptions(arr) {
        arr.forEach((item) =>{
          if (item.subOrg.length == 0) {
            delete item.subOrg
          } else {
            this.newOptions(item.subOrg)
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
        url: '/mde-person/campus/back/person/queryDetail',
        method: 'post',
        data: params,
        headers:{
            'Content-Type':'application/json'
        }	
        }).then(res => {
          if (res.statusText === "OK") {
            let obj = res.data.data
            this.id = id
            this.name = obj.name
            this.typeValue = obj.personType
            this.gender = (obj.gender).toString()
            this.studentId = obj.personNo
            this.selectMonthYear = obj.entranceYear + '年' + obj.entranceMonth + '月'
            console.log(obj.entranceYear, obj.entranceMonth, "年月")
            this.phone = obj.phone
            this.facePicture = obj.imgUrl
            let arrOrgs = obj.orgs
            let str = []
            let newValue = []
            let newOrgs = {}
            console.log(arrOrgs, "000000")
            if (arrOrgs.length) {
              
              arrOrgs.forEach(item => {
                newOrgs.name = item.orgName
                newOrgs.orgId = item.orgId
                newValue.push(item.orgId)
              })
              str.push(newOrgs)
            }
            console.log(newValue, "11111111", newValue.join("/"))
            this.value = newValue
            // if (arrOrgs.length > 1) {
              
            //   arrOrgs.forEach(item => {
            //     str.push(item.orgName)
            //     str.join("/")
            //   })
            //   this.value = str
            // } else {
            //   this.value = arrOrgs[0].orgName
            // }
            
            // console.log(this.value)
            // this.value = obj.orgs[obj.orgs.length - 1].orgAllName
            this.imgUrl = obj.imgUrl
            this.nationalValue = obj.nation
            this.certiValue = obj.cardType
            this.certiNo = obj.idNumber
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
            url: '/mde-person/campus/back/organization/querySubOrg',
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
            url: '/mde-person/campus/back/organization/querySubOrg',
            method: 'post',
            data: params,
            headers:{
              'Content-Type':'application/json'
            }	
          }).then(res => {
              if (res.data.code == 0){
                resolve(res.data.data);
              } else {
                this.$message.error(res.data.messsage)
              }
          })
        }
      },
      handleNodeClick(item) {
        this.$confirm('此操作将离开该页面, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({path: '/person', query: {orgId: item.orgId}})
        }).catch(() => {
                  
        });
      },
      handleSelClick(item) {
        console.log(item.orgId)
      },
      back() {
        this.$router.go(-1)
      },
      // 编辑后提交 2019年02月
      submit() {
        console.log(this.value, "组织架构数组")
        if (this.value.length == 0) {
          this.$message.error("组织架构不能为空！")
        } else {
          const token = window.localStorage.getItem("token")
          let requestId = uuid.createUUID()
          let orgId = []
          for (let i of this.selectOrgsArr) {
            orgId.push(i)
          }
          let params = {
            "requestId": requestId,
            "authToken": token,
            "userToken": token,
            "data": {
              "id": this.id,
              "name": this.name,
              "type": this.typeValue,
              "gender": this.gender,
              "personNo": this.studentId,
              "phone": this.phone,
              "nation": this.nationalValue,
              "nationality": this.countryValue,
              "idNumber": this.certiNo,
              "cardType": this.certiValue,
              "entranceTime": this.selectMonthYear,
              "orgId": this.value
            }
          }
          console.log("提交入参", params)
          axios({
            url: '/mde-person/campus/back/person/editPerson',
            method: 'post',
            data: params,
            headers:{
                'Content-Type':'application/json'
            }	
          }).then(res => {
            if (res.data.code == 0) {
              this.$message.success("编辑成功!")
              setTimeout(() => {
                this.back()
              }, 500)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
        
        // let param = {};
        // param.id = this.id
        // param.name = this.name
        // param.type = this.typeValue
        // param.gender = this.gender
        // param.personNo = this.studentId
        // param.phone = this.phone
        // param.nation = this.nationalValue
        // param.cardType = this.certiValue
        // param.idNumber = this.certiNo
        // param.nationality = this.country
        // param.orgId = [];
        // for (let i of this.selectOrgs) {
        //   param.orgId.push(i.id);
        // }
        // api.editPerson(param).then((data) => {
        //   if (data.code == 0) {
        //     this.$message.success("编辑成功!")
        //     setTimeout(() => {
        //       this.back();
        //     }, 500)
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // })
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
  .item .el-radio {
    line-height: 40px;
    float: left;
  }
  .item-line .item{
    width: 400px;
  }
  .item-line .item .el-select{
    width: 400px;
  }
  .item-line .name{
    width: 130px;
    line-height: 40px;
  }
  .item-line .item .el-date-editor.el-input {
    width: 400px;
  }
  .item-line .item .el-cascader {
    width: 400px;
  }
  .item.picture-box {
    position: relative;
  }
  .face-picture {
    width: 120px;
    height: 120px;
    border: 1px solid #eee;
    cursor: pointer;
  }
  .face-picture>img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .layer {
    width: 120px;
    height: 120px;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0, 0.3);
  }
  .fileinput-button {
    width: 100%;
    height: 100%;
    position: relative;
    top: 0px;
    display: inline-block;
    overflow: hidden;
    color: #00a6ed;
  }
  .fileinput-button input{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    opacity: 0;
    cursor: pointer;
    -ms-filter: 'alpha(opacity=0)';
  }
  .edit-pic {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 36px;
    color: #eee;
  }
  .red{
    position: relative;
    top: 2px;
    margin-right: 2px;
    color: red;
  }
  .tree-sel{
    position: relative;
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    min-height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .tree-sel .el-tree{
    position: absolute;
    left: -1px;
    width: 400px;
    min-height: 40px;
    max-height: 350px;
    background-color: #fff;
    z-index: 2;
    overflow-y: scroll;
    border: 1px solid #DCDFE6;
    border-top: 0;
  }
  .face-upload {
    text-align: left;
  }
  .face-upload .el-upload--picture-card {
    float: left;
  }
  .item-line .avatar-uploader .el-upload {
    float: left;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .org-select {
    margin-top: 10px;
    height: 160px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .class-select-area {
    width: 100%;
    height: 100%;
  }
  .class-select-item {
    float: left;
    padding-left: 16px;
    padding-right: 16px;
    /* padding-bottom: 112px; */
    overflow-y: auto;
    width: 33%;
    height: 100%;
    border-right: 1px solid #eee;
  }
  .class-select-item p {
    width: auto;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    color: #2c3e50;
  }
  .class-select-item .active{
    color: #50bfff;
    /* font-weight: bold; */
  }
</style>