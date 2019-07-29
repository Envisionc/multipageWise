<template>
  <div class="content clearfix">
    <div class="sub-list sub-list-bg">
        <el-tree 
          :data="treeDatas"
          :props="defaultProps" 
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="main">
      <p class="back" @click="back()"><i class="el-icon-back"></i>返回</p>
      <h4 class="title">导入人员</h4>
      <div class="import-content clearfix">
        <el-upload
          class="upload-excel"
          drag
          :limit="1"
          action=""
          :http-request="nothing"
          :on-change="importExcel"
          multiple>
          <i class="el-icon-document-delete blue"></i>
          <div class="el-upload__text">
            <p class="tip">点击上传Excel</p>
            <p class="tip-gray">请务必按照我们的标准模板填写信息（可拖动上传）</p>
          </div>
        </el-upload>
        <p class="download" @click="download">下载模板</p>
      </div>
      <div class="import" @click="doImport">开始导入</div>

      <el-table
        :data="table_data"
        border
        stripe
        height="400"
        id="export-table">
        <el-table-column
          fixed
          v-for='(item,index) in table_header'
          :key="index"
          :prop="item"
          :label="item"
          >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
//   import api from "api/admin.js";
import axios from 'axios'
import uuid from '../../utils/common'
import XLSX from 'xlsx'
import util from '../../utils/excelUtil'
  export default {
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        table_header: [],
        table_data: [],
        requestId: '',
        randomToken: '',
        personList: [], // 人员列表
        treeDatas: [], // 组织架构树形数据
        orgId: '', //当前节点的id
      }
    },
    mounted() {
      this.getTree()
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
          if (res.statusText === "OK") {
            console.log(res.data, "treeDatas")
            this.treeDatas = res.data.data
            this.orgId = res.data.data[0].orgId
          }
        })
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          // api.getOrgList([]).then(data => {
          //   if (data.code == 0){
          //     resolve(data.data);
          //   } else {
          //     this.$message.error(data.messsage)
          //   }
          // })
        } else {
          console.log(node.data.orgId)
          // api.getOrgList(node.data.orgId).then(data => {
          //   if (data.code == 0){
          //     resolve(data.data);
          //   } else {
          //     this.$message.error(data.messsage)
          //   }
          // })
        }
      },
      handleNodeClick(item) {

      },
      importExcel(file) {
        setTimeout(() => {
          let wb = "";
          let _this = this;
          let f = file.raw
          _this.fileName=f.name;
          var reader = new FileReader();
          reader.onload = function(e) {
            let opts = {};
            opts.type = 'binary';
            opts.raw = true
            const wb = XLSX.read(e.target.result, opts);
            let xlArr = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
            let row_data = xlArr.split("\n");
            let header;
            do {
              header = row_data.shift().split(',');
            } while (!header[1]);
            _this.table_header = header
            let body = [];
            for (let i of row_data) {
              let tmp_arr = i.split(',');
              let obj = {};
              for (let j=0; j < header.length; j++) {
                obj[header[j]] = tmp_arr[j]
              }
              body.push(obj);
            }
            _this.table_data = body;
          };
          reader.readAsBinaryString(f);
        })
      },
      doImport() {
        this.$confirm('已核对数据，并确认导入', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let header = [];
          header.push(this.table_header);
          for (let i of this.table_data) {
            let all_null = true;
            console.log(i)
            let values = Object.values(i)
            for (let j of values) {
              if (j) {
                all_null = false;
                break;
              }
            }
            if (!all_null) {
              header.push(values);
            }
          }
          console.log("---", header)
          const token = window.localStorage.getItem("token")
          let requestId = uuid.createUUID()
          let params = {
            "requestId": requestId,
            "authToken": token,
            "userToken": token,
            "data": {
              "orgContents": header
            }
          }
          axios({
            url: '/api/mde-person/campus/back/orgArchitect/import',
            method: 'post',
            data: params,
            headers:{
              'Content-Type':'application/json'
            }	
          }).then(res => {
            if (res.statusText === "OK") {
              console.log(res.data, "treeDatas")
            }
          })
          // api.importExcel({orgContents: header}).then((data) => {
          //   if (data.code == 0) {
          //     this.$message.success("导入成功！");
          //   } else {
          //     this.$message.error(data.message);
          //   }
          // })
        })
      },
      nothing() {},
      // 下载模板
      download() {
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {}
        }
        axios({
          url: '/api/mde-person/campus/back/person/downloadImportTemplate',
          method: 'post',
          data: params,
          headers:{
            'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.statusText === "OK") {
            // console.log(res.data, "---------------")
            let obj = res.data.data
            
            let comment = obj.headContent.join('<br/>');
            let header = obj.schoolField
            let body = []
            console.log(comment, "--------2-------")
            console.log(header, "--------3-------")
            util.exportExcel(header, body, '人员导入模板', comment)
          }
        })
        // api.download().then((data) => {
        //   console.log(data)
        //   if (data.code == 0) {
        //     let comment = data.data.headContent.join('<br/>');
        //     let header = data.data.schoolField
        //     let body = [];
        //     exportExcel(header, body, '人员导入模板', comment)
        //   } else {
        //     this.$message.error(data.message)
        //   }
        // });
      },
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .sub-list{
    float: left;
    padding: 30px 35px;
    width: 25%;
  }
  .main{
    float: right;
    padding: 30px 15px;
    width: 70%;
  }
  .content{
    min-width: 780px;
  }
  .back{
    text-align: left;
    cursor: pointer;
    margin-bottom: 20px;
  }
  .back i{
    margin-right: 10px;
  }
  .title{
    text-align: left;
    margin-bottom: 20px;
    font-size: 20px;
  }
  .el-icon-document-delete.blue{
    /* color: #409eff; */
    color: #0cb181;
    font-size: 40px;
    margin: 20px 0;
  }
  .el-upload__text .tip{
    font-size: 20px;
    margin-bottom: 15px;
  }
  .el-upload__text .tip-gray{
    color: #a7a7a7;
  }
  .upload-excel{
    /* width: 75%; */
    /* width: 500px; */
    float: left;
    background: #fafafa;
  }
  .el-upload {
    /* width: 500px; */
    display: block;
    float: left;
  }
  .el-upload .el-upload-dragger {
    /* width: 100%; */
    
  }
  .download{
    float: left;
    margin: 163px 0 0 15px;
    color: #353535;
    cursor: pointer;
  }
  .download:hover{
    color: #2084eb;
  }
  .import{
    margin: 20px 0;
    width: 500px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    background-color: #409eff;
    border-radius: 3px;
    cursor: pointer;
    transition: all .1s linear;
  }
  .import:hover{
    background-color: #2084eb;
  }
</style>