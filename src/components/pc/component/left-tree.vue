<template>
    <div class="container">
        <div class="sub-list sub-list-bg">
            <el-tree 
                :data="treeDatas" 
                :load="loadNode" 
                ref="tree"
                lazy 
                :props="defaultProps" 
                @node-click="handleNodeClick">
            </el-tree>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import uuid from '../../utils/common'
export default {
    data() {
        return {
            treeDatas: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            requestId: ''
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
                    "data": {
                        "orgId": this.orgId
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
                    // console.log(res, "718")
                })
            } else {
                const token = window.localStorage.getItem("token")
                let requestId = uuid.createUUID()
                let params = {
                    "requestId": requestId,
                    "authToken": token,
                    "userToken": token,
                    "data": {
                    "orgId": this.orgId
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
                    if (res.statusText === "OK") {
                    resolve(res.data.data)
                    }
                    this.treeDatas = res.data.data
                })
            }
        },
        handleNodeClick(item) {
            this.orgId = item.orgId
            this.name = ''
            this.no = ''
            this.typeValue = ''
            this.search(1)
        },
        search(page) {

        }
    }
}
</script>

<style scoped>
.container {
    /* width: 100%;
    height: 40px; */
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
}
.sub-list .el-tree-node__label{
    width: 19%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
