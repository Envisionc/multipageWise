<template>
    <div class="content">
        <div class="main">
            <div class="fuzzy-search">
                <p class="back" @click="back()"><i class="el-icon-back"></i>返回</p>
                <div class="item-line clearfix">
                    <p class="title"><span>*</span> 管理员姓名：</p>
                    <div class="label">
                        <p>{{personName}}</p>
                    </div>
                </div>
                <!-- :style="{display:isFocus?'block':'none'}" -->
                <div class="search-list" :style="{display:isFocus?'block':'none'}">
                    <div class="search-list-item" v-for="(item,index) in modalList" :key="index" @click="addAdmin(item)">
                        <img src="@/assets/img/person-icon.png" class="per-ico" />
                        {{item.name}} -
                        <span>{{item.personNo}}</span>
                        <i class="el-icon-check" v-if="item.checked"></i> 
                    </div>
                </div>
                <div class="structure">
                    <p class="title bold"><span>*</span> 组织架构权限</p>
                </div>
                <div class="tree-box clearfix">
                    <div class="left-tree">
                        <p class="text">选择人员范围</p>
                        <el-tree
                            :data="treeDatas"
                            :load="loadNode"
                            node-key="id"
                            ref="tree"
                            show-checkbox
                            highlight-current
                            lazy
                            :props="defaultProps"
                            @check-change="checkChange">
                        </el-tree>
                    </div>
                    <div class="right-item">
                        <p class="text">已选择</p>
                        <div class="check-list" ref="selectBox clearfix">
                            <div class="check-item" v-for="(item, index) in selectNodes" :key="index">
                                {{item.orgName}}
                                <i @click="delAccess(item, index)" class="el-icon-close"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn save" @click="save()">保存</div>
            </div>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import uuid from '../../../utils/common'
export default {
    data () {
        return {
            modalList: [],
            no: '',
            treeData: [
                {
                    id: 1,
                    label: '一级 1',
                    children: [
                        {
                            id: 4,
                            label: '二级 1-1',
                            children: [
                                {
                                    id: 9,
                                    label: '三级 1-1-1'
                                },
                                {
                                    id: 10,
                                    label: '三级 1-1-2'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    label: '一级 2',
                    children: [
                        {
                            id: 5,
                            label: '二级 2-1'
                        },
                        {
                            id: 6,
                            label: '二级 2-2'
                        }
                    ]
                },
                {
                    id: 3,
                    label: '一级 3',
                    children: [
                        {
                            id: 7,
                            label: '二级 3-1'
                        },
                        {
                            id: 8,
                            label: '二级 3-2'
                        }
                    ]
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            checkName: '小新星',
            isFocus: false,
            checked: false,
            treeDatas: [], // 组织架构树形数据
            orgId: '', //当前节点的id
            selectNodes: [], //选中的节点
            checkNodes: [], //左侧选中的权限
            personId: '', // 人的id
            orgManagerId: '', //选中的架构id集合
            personName: '', //人名
        }
    },
    mounted() {
        this.$nextTick(function(){
            $(".el-tree").height(438)
            // this.orgManagerId = this.$route.query.id ? this.$route.query.id : 0
        })
        this.orgManagerId = this.$route.query.id ? this.$route.query.id : 0
        this.getTree()
        // this.getInfo()
        this.getpersonDetail()
    },
    methods: {
        // 获取详情
        getpersonDetail() {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID() 
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {
                    "id": this.orgManagerId
                }
            }
            axios({
                url: '/api/mde-person/campus/back/person/authority/queryDetail',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    let obj = res.data.data
                    this.personName = obj.personName
                    obj.orgs.forEach(element => {
                        this.checkNodes.push(element)
                        this.selectNodes.push(element)
                    })
                    console.log(this.selectNodes, obj, "详情")
                } else {
                    this.$message.error(res.data.message)
                }
        })
        },
        getInfo() {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID() 
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {
                    "inputText": this.no
                }
            }
            axios({
                url: '/api/mde-person/campus/back/person/searchPerson',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    let obj = res.data.data
                    this.modalList = obj.list
                    this.modalList.forEach(item => {
                        item.checked = false
                    })
                    console.log(obj, "724")
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        toFocus() {
            this.isFocus = true
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID() 
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {
                    "inputText": this.no
                }
            }
            axios({
                url: '/api/mde-person/campus/back/person/searchPerson',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    let obj = res.data.data
                    this.modalList = obj.list
                    this.modalList.forEach(item => {
                        item.checked = false
                    })
                    console.log(obj, "724")
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        toBlur() {
            this.isFocus = false
        },
        addAdmin (item) {
            console.log(item)
            this.isFocus = false
            this.no = item.name
            this.personId = item.id
            item.checked = true
        },
        back() {
            this.$router.go(-1)
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
                url: '/api/mde-person/campus/back/organization/queryAllOrg',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.statusText === "OK") {
                    console.log("123456789", res.data.data)
                    this.treeDatas = res.data.data
                    this.orgId = res.data.data[0].orgId
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
                let orgId = Number(node.data.orgId)
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
                        resolve(res.data.data);
                    } else {
                        this.$message.error(res.data.messsage)
                    }
                })
            }
        },
        getCheckedNodes(leafOnly, includeHalfChecked) {
            console.log(leafOnly, includeHalfChecked)
        },
        getCurrentNode(data) {
            console.log(data)
        },
        getCurrentKey(value) {
            console.log(value, "getCurrentKey")
        },
        // 选中节点的操作
        // TODO 选中添加一个权限
        checkChange(item) {
            // let checkNodes = this.$refs.tree.getCheckedNodes()
            this.checkNodes = this.$refs.tree.getCheckedNodes()
            let nodesArr = []
            
            this.checkNodes.forEach(item => {
                let nodesObj = {}
                nodesObj.id = item.id
                nodesObj.checkName = item.name
                nodesObj.orgId = item.orgId
                nodesArr.push(nodesObj)
            })
            this.selectNodes.push(nodesArr)
        },
        // 点击节点的操作
        handleNodeClick(item) {
            console.log(item, "handleNodeClick")
        },
        // 删除选中的节点
        // TODO 删除当前的权限
        delAccess(item,index) {
            console.log(item, "删除")
            let selectNodes = this.selectNodes
            selectNodes.forEach((val,i) => {
                if (i == index) {
                    selectNodes.splice(index, 1)
                }
            })
            console.log(selectNodes, "selectNodes")
            // delete item
            // this.$confirm('此操作将删除选择权限', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(()=>{
            //     this.$message({
            //         type: 'info',
            //         message: '已删除',
            //         duration: 600
            //     })
            // }).catch(()=>{
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除',
            //         duration: 600
            //     })
            // })
        },
        // 保存
        save() {
            const token = window.localStorage.getItem("token")
            let requestId = uuid.createUUID() 
            let arr = []
            this.selectNodes.forEach(item => {
                arr.push(item.orgId)
            })
            console.log(arr)
            let params = {
                "requestId": requestId,
                "authToken": token,
                "userToken": token,
                "data": {
                    "personId": this.personId,
                    "orgIds": arr
                }
            }
            axios({
                url: '/api/mde-person/campus/back/person/authority/add',
                method: 'post',
                data: params,
                headers:{
                    'Content-Type':'application/json'
                }	
            }).then(res => {
                if (res.data.code == 0) {
                    this.$message.success("保存成功!")
                } else {
                    this.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>

<style scoped>
.main {
    padding: 3%;
}
.fuzzy-search {
    width: 60%;
    margin-left: 50%;
    transform: translateX(-50%);
    position: relative;
}
.back {
    margin-bottom: 30px;
    margin-left: 10px;
    text-align: left;
    cursor: pointer;
}
.structure {
    margin-top: 80px;
}
.title, .label {
    float: left;
    height: 40px;
    line-height: 40px;
}
.title {
    width: 140px;
    height: 40px;
    line-height: 40px;
}
.title>span {
    color: red;
}
.label {
    width: 50%;
    text-align: left;
}
.search-list{
    width: 50%;
    height: 365px;
    position: absolute;
    left: 140px;
    overflow-y: scroll;
    z-index: 99;
}
.search-list-item{
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #fafafa;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    text-align: left;
    cursor: pointer;
}
.per-ico{
    width: 22px;
    position: relative;
    top: 6px;
    margin-left: 10px;
}
.search-list-item:hover{
    background-color: #f7f7f7;
}
.search-list-item .el-icon-check{
    float: right;
    color: #50bfff;
    font-size: 18px;
    font-weight: bold;
    margin-top: 11px;
}
.check-title{
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 10px;
}
.check-list {
    height: 438px;
    overflow-y: scroll;
    padding-top: 10px;
}
.check-item{
    margin: 0 8px 8px 0;
    padding: 2px 15px;
    border: 1px solid #eee;
    border-radius: 16px;
    background-color: #eee;
    float: left;
}
.check-item .el-icon-close{
    margin-left: 3px;
    cursor: pointer;
}
.check-item .el-icon-close:hover{
    color: #50bfff;
}
.structure {
    height: 40px;
}
.bold {
    font-weight: bold;
}
.bold>span {
    font-size: 22px;
}
.tree-box {
    width: 70%;
    height: 500px;
    border: 1px solid #333;
    box-sizing: border-box;
}
.left-tree, .right-item {
    float: left;
    width: 50%;
    height: 100%;
    padding: 10px 20px;
}
.right-item {
    border-left: 1px solid #333;
    box-sizing: border-box;
}
.text {
    height: 30px;
    line-height: 30px;
    text-align: left;
}
.el-tree {
    margin-top: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
    background: #fafafa;
}
.el-tree-node__label{
    width: 19%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.save {
    font-size: 16px;
    width: 80px;
    height: 40px;
    margin-top: 10px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #0cb181;
    border-radius: 3px;
    cursor: pointer;
}
</style>
