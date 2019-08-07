<template>
    <div class="class-select" v-show='classShow' :style="{height:selectHeight + 'px'}">
      <div class="select-wrap">
        <div class="class-select-area clearfix">
          <div class="class-select-item" v-for="(classes, index1) in classList" :key="index1">
            <p v-for="(item, index) in classes" :key="index" @click="selectItem(index, index1, item)" :class="{active: item.check}">{{item.name}}</p>
          </div>
        </div>
        <div class="class-select-btn clearfix">
          <div class="reset-btn" @click="resetSelect()">重置</div>
          <div class="confirm-btn" @click="doSelectItemClass">确定</div>
        </div>
      </div>
    </div>
</template>

<script>
import api from '../../../api/mobile/index'
import uuid from '../../../utils/common'
  export default {
    props: {
      classShow: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
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
        division: [],
        grade: [],
        classArr: [],
        classTree: [],
        hackClass: true,
        orgId: 0,
        className: '',
        selectHeight: 0
      }
    },
    created() {
      this.selectHeight = window.screen.height - 60
      this.getClassTree();
    },
    methods: {
      resetSelect(){
        this.orgId = 0;
        this.className = '';
        this.setClassTree()
      },
      setClassTree() {
        let arr = [];
        arr[0] = this.classTree
        for (let i=0;i<arr[0].length;i++) {
          arr[0][i].check = false
        }
        this.classList = arr;
      },
      selectItem(index1, index2, item) {
        let arr = this.classList;
        let new_arr = [];
        for (let i=0,len = index2+1;i <= len;i++) {
          if (len == i) {
            if (!item.check) {
              if (item.subOrg.length > 0) {
                let sub_arr = item.subOrg
                for (let j=0;j<sub_arr.length;j++) {
                  sub_arr[j].check = false
                }
                new_arr[i] = sub_arr
              }
            }
            break;
          } else {
            new_arr[i] = arr[i]
          }
        }
        for (let i=0;i<new_arr[index2].length;i++) {
          new_arr[index2][i].check = i==index1 && !new_arr[index2][i].check
        }
        if (!new_arr[index2][index1].check) {
          // 取消选中
          this.orgId = 0;
          this.className = ''
        } else {
          this.orgId = item.orgId;
          this.className = item.name;
        }
        this.classList = new_arr;
        // $('.class-select-area').width(200 * new_arr.length)
      },  
      getClassTree(){
        let requestId = uuid.createUUID()
        let token = window.localStorage.getItem("Token")
        let params = {
          "requestId": requestId,
          "authToken": token,
          "userToken": token,
          "data": {}
        }
        if (token) {
          api.getAllOrg(params).then(res => {
            console.log(res.data[0])
            if (res.code == 0) {
              this.classTree = res.data[0].subOrg
              // this.classTree = this.classList
              this.setClassTree()
            } else {
              this.$message.error(res.message)
            }
          })
        }
        
        // api.allOrg().then(data => {
        //   if (data.code == 0) {
        //     this.classTree = data.data[0].subOrg;
        //     this.setClassTree()
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // });
      },
      doSelectItemClass() {
        this.$emit('doSelectClass', this.orgId, this.className);
      }
    }
  }
</script>

<style scope>
.class-select {
  width: 100%;
  position: absolute;
  top: 60px;
  left: 0;
}
.select-wrap {
  width: 100%;
  height: 400px;
  background: #FCFCFC;
  position: fixed;
  top: 72px;
  left: 0;
  z-index: 99;
}
.class-select-area{
  width: 100%;
  height: 352px;
}
.class-select-item{
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
  height: 30px;
  line-height: 30px;
  /* border-bottom: 1px solid #eee; */
}

.class-select-item:last-child{
  /*border-right: 0;*/
}
.class-select-btn{
  width: 100%;
  height: 48px;
  font-size: 14px;
  background-color: #fff;
  /* border-top: 1px solid #e1e1e1; */
}
.class-select-btn div{
  width: 50%;
  float: left;
  text-align: center;
  line-height: 48px;
  border: 1px solid #797979;
}
.class-select-btn .confirm-btn{
  /* background-color: #50bfff; */
  background-color: #5CB85C;
  color: #333;
  /* border-left: 1px solid #e1e1e1; */
  border-left: none;
}
.class-select-item .active{
  color: #50bfff;
  /* font-weight: bold; */
}
.class-select-item p{
  width: 140px;
  font-size: 14px;
  /* margin-top: 28.8px; */
}
</style>