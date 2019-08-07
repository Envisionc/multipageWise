<template>
    <el-dialog title="选择适用人员" :visible.sync="show" 
        width="80%" custom-class="select-dialog"
        @close="closeDlg"
    >
      <div class="add-select-box clearfix">
        <div style='width: 25%;float: left; overflow-y: scroll;max-height: 400px;' class='clearfix'>
          <el-tree 
            :props="defaultProps" 
            :load="loadNode"
            lazy
            @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="add-select-table" style='width: 75%;float: right;max-height: 400px;padding:10px;'>
          <el-input style="float:left;margin-left:30px;" clearable v-model="keyword" placeholder="姓名/学号" ></el-input>
          <el-button type="success search" @click="searchPerson">搜索</el-button>
          <div class="add-tip">
            <i class="el-icon-warning"></i>当前已选择<span class="add-selected">{{addSelected}}</span>人,&nbsp;根据架构查询的总人数<span>{{totalRows}}人</span>
          </div>
          <el-checkbox style="float:left;margin-top:10px;" v-model="selectAll" @change="selectAllPerson">全选</el-checkbox>
          <el-table 
            ref="multipleTable"
            :data="gridData" 
            :row-class-name="renderRow"
            height="255px">
            <el-table-column width="55">
              <template slot-scope="scope">
                <el-checkbox 
                  v-model="scope.row.checked"
                  @change="handleSelectionChange(scope.row, scope.$index)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column property="name" label="姓名" width="130"></el-table-column>
            <el-table-column property="personNo" label="学/工号" width="150"></el-table-column>
            <el-table-column label="身份">
              <template slot-scope="scope">
                <span>{{['其他','学生','教职工','访客','校友'][scope.row.type]}}</span>
              </template>
            </el-table-column>
            <el-table-column property="orgName" label="所在分组"></el-table-column>
          </el-table>
          <div class="add-pagi">
            <el-pagination
              background
              @current-change="changePersonPage"
              :current-page="page"
              :page-count="pageNums"
              layout="prev, pager, next"
              :total="totalRows" :page-size="pageSize">
            </el-pagination>
          </div>
        </div>
      </div>
      
      <div class="el-dialog-footer">
        <el-button @click="closeDlg()">关闭</el-button>
        <el-button @click="commit()" type="primary">提交</el-button>
      </div>
    </el-dialog>
</template>

<script>
  // import api from '@/api/attendance.js'
import axios from "axios"
import uuid from "../../../utils/common"
import api from '../../../api/pc/index'
  export default {
    name: 'select-person-dlg',
    // props: ["tmpSelectPerson"],
    props: {
      tmpSelectPerson: Array,
      total:Number, //总条目数
      pagecount: Number, //总页数
      pagesize: Number// 页容量
    },
    data() {
      return {
        keyword: "",
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        selectPerson: [],
        checkedOrgId: 0,
        gridData: [],
        totalRows: 0,
        pageSize: 0,
        pageNums: 0,
        cachePeople: {},
        show: false,
        page: 1,
        // selectAll: '',
        requestId: '', //必要参数
      }
    },
    watch: {
      // tmpSelectPerson(b, f) {
      //   console.log(b,f, "b.f")
      //   this.gridData = b
      //   let ids = [];
      //   let arr = [];
      //   for (let i of f) {
      //     arr.push(i.personId);
      //     this.cachePeople["" + i.personId] = i;
      //   }
      //   console.log(this.gridData, "watch")
      //   for (let i=0,len=this.gridData.length; i<len; i++) {
      //     if (-1 != $.inArray(this.gridData[i].personId, arr)) {
      //       this.gridData[i].checked = true;
      //     } else {
      //       this.gridData[i].checked = false;
      //     }
      //   }
      //   this.selectPerson = arr
      // },
      total(o,n) {
        this.totalRows = o
        console.log(o,n, "[]")
      },
      pagecount(v,l) {
        this.pageNums = v
        console.log(v,l, "77")
      },
      pagesize(a,b) {
        this.pageSize = a
        console.log(a,b, "11")
      }
    },
    computed: {
      addSelected(vm) {
        return vm.selectPerson.length
      },
      selectAll(vm) {
        console.log('aaaa',vm)
        if (vm.gridData.length == 0) return false 
        for (let i of vm.gridData){
          if (!i.checked) {
            return false
          }
        }
        return true
      }
    },
    created() {

    },
    methods: {
      showDlg() {
        this.show = true;
        let arr = [];
        let grid = [];
        let newArr = JSON.parse(JSON.stringify(this.tmpSelectPerson))
        if (newArr) {
          for (let i of newArr) {
            arr.push(i.personId);
            i.checked = true;
            grid.push(i)
            this.cachePeople["" + i.personId] = i;
          }
          this.gridData = grid;
          this.selectPerson = arr
          
        }
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
            url: '/mde-person/campus/back/organization/queryAllOrg',
            method: 'post',
            data: params,
            headers:{
              'Content-Type':'application/json'
            }	
          }).then(res => {
            if (res.data.code == 0) {
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
        // 查询组织架构所属人员
        this.loadOrgUsers(item.orgId, 1);
      },
      handleSelectionChange(val, i) {
        if (val.checked) {
          this.cachePeople["" + val.personId].checked = true
          let arr = this.selectPerson;
          arr.push("" + val.personId);
          this.selectPerson = [...(new Set(arr))];
          console.log("select!", this.selectPerson)
        } else {
          console.log(this.gridData, "false")
          this.cachePeople["" + val.personId].checked = false
          let arr = [];
          for (let i of this.selectPerson) {
            if (i != val.personId) {
              arr.push(i)
            }
          }
          this.selectPerson = arr;
        }
      },
      renderRow(data) {
      },
      changePersonPage(page) {
        console.log(this.checkedOrgId, "xuan")
        this.loadOrgUsers(this.checkedOrgId, page);
      },
      // 按学号或者名字模糊搜索成员
      searchPerson() {
        let keyword = this.keyword;
        // /mde-person/campus/back/person/searchPerson
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID()
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "inputText": this.keyword
          }
        }
        api.searchPerson(params).then(res => {
          if (res.code == 0) {
            let users = []
            for (let i of res.data.list) {
              users.push({
                  name: i.name, 
                  checked: $.inArray("" + i.id, this.selectPerson) != -1, 
                  personId: '' + i.id,
                  personNo: i.personNo,
                  orgName: i.org,
                  type: i.type
                })
              this.cachePeople[""+i.id] = {
                  name: i.name, 
                  checked: $.inArray("" + i.id, this.selectPerson) != -1, 
                  personId: '' + i.id,
                  personNo: i.personNo,
                  orgName: i.org,
                  type: i.type
                }
            }
            this.gridData = users;
            this.totalRows = res.data.list.length
            this.pageSize = 99999999999
          }
        })
        // api.searchPerson(keyword).then(data => {
        //   if (data.code == 0) {
        //     let users = []
        //     for (let i of data.data.list) {
        //       users.push({
        //           name: i.name, 
        //           checked: $.inArray("" + i.id, this.selectPerson) != -1, 
        //           personId: '' + i.id,
        //           personNo: i.personNo,
        //           orgName: i.org,
        //           type: i.type
        //         })
        //       this.cachePeople[""+i.id] = {
        //           name: i.name, 
        //           checked: $.inArray("" + i.id, this.selectPerson) != -1, 
        //           personId: '' + i.id,
        //           personNo: i.personNo,
        //           orgName: i.org,
        //           type: i.type
        //         }
        //     }
        //     this.gridData = users;
        //     this.totalRows = data.data.list.length
        //     this.pageSize = 99999999999
        //   }
        // })
      },
      loadOrgUsers(orgid, pageNo) {
        console.log(orgid, pageNo, "loadOrgUsers")
        const token = window.localStorage.getItem("token")
        let requestId = uuid.createUUID() 
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {
            "orgId": orgid,
            "pageNo": pageNo
          }
        }
        axios({ // 查询组织架构所属人员
          url: '/mde-person/campus/back/person/queryPerson',
          method: 'post',
          data: params,
          headers:{
              'Content-Type':'application/json'
          }	
        }).then(res => {
          if (res.data.code == 0) {
            let obj = res.data.data
              let users = []
              for (let i of obj.list) {
                users.push({
                    name: i.name, 
                    checked: $.inArray("" + i.id, this.selectPerson) != -1, 
                    personId: i.id,
                    personNo: i.personNo,
                    orgName: i.org,
                    type: i.type
                  })
                this.cachePeople[""+i.id] = {
                    name: i.name, 
                    checked: $.inArray("" + i.id, this.selectPerson) != -1, 
                    personId: i.id,
                    personNo: i.personNo,
                    orgName: i.org,
                    type: i.type
                  }
              }
              this.checkedOrgId = orgid
              this.gridData = users
              this.totalRows = obj.pageBean.rowCount
              this.pageSize = obj.pageBean.maxResults
              this.page = pageNo
          } else {
            this.$message.error(res.data.message)
          }
        })
        // api.getOrgUsers(orgid, pageNo).then(data => {
          // let users = []
          // for (let i of data.data.list) {
          //   users.push({
          //       name: i.name, 
          //       checked: $.inArray("" + i.id, this.selectPerson) != -1, 
          //       personId: i.id,
          //       personNo: i.personNo,
          //       orgName: i.org,
          //       type: i.type
          //     })
          //   this.cachePeople[""+i.id] = {
          //       name: i.name, 
          //       checked: $.inArray("" + i.id, this.selectPerson) != -1, 
          //       personId: i.id,
          //       personNo: i.personNo,
          //       orgName: i.org,
          //       type: i.type
          //     }
          // }
          // this.checkedOrgId = orgid;
          // this.gridData = users;
          // this.totalRows = data.data.pageBean.rowCount
          // this.pageSize = data.data.pageBean.maxResults
          // this.page = pageNo
        // })
      },
      commit() {
        let persons = [];
        for (let i of this.selectPerson) {
          console.log(i)
          persons.push(this.cachePeople[i])
        }
        console.log(persons);
        this.$emit('indedPerson', persons);
        this.show = false
      },
      closeDlg() {
        this.show = false
        let ids = [];
        if (this.tmpSelectPerson) {
          for (let i of this.tmpSelectPerson) {
            ids.push(i.personId);
          }
        }
        for (let i=0;i<this.gridData.length;i++) {
          if ($.inArray(this.gridData[i].personId, ids) == -1) {
            this.gridData[i].checked = false
          } else {
            this.gridData[i].checked = true
          }
        }
        this.$emit('closeDialog');
      },
      selectAllPerson(val) {
        let arr = this.selectPerson;
        let tmp_arr = [];
        $.each(this.gridData, (k, i) => {
          this.gridData[k].checked = val
          this.cachePeople["" + i.personId].checked = val
          if (val) {
            arr.push("" + i.personId);
          } else {
            tmp_arr.push(i.personId)
          }
        })
        if (val) {
          this.selectPerson = [...(new Set(arr))];
        } else {
          let new_arr = [];
          for (let i of arr) {
            if ($.inArray(i, tmp_arr) == -1) {
              new_arr.push(i);
            }
          }
          this.selectPerson = new_arr
        }
      }
    },
  }
</script>
<style scoped>
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
  .add-select-box {
    margin-bottom: 20px;
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
    text-align: left; 
  }
  .add-tip i{
    margin-right: 5px;
    color: #409EFF;
  }
  .add-selected{
    color: #409EFF;
    font-weight: bold;
  }
  .el-tree {
    background: #fafafa;
  }
  .search {
    width: 120px;
    position: relative;
    left: -100px;
  }
  .add-pagi {
    margin-top: 10px;
    text-align: right;
  }
</style>