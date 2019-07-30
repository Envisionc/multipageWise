<template>
    <div class="class-select" v-show='classShow'>
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
</template>

<script>
  // import api from '../../api/admin.js'

  export default {
    props: {
      classShow: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        classList: [],
        division: [],
        grade: [],
        classArr: [],
        classTree: [],
        hackClass: true,
        orgId: 0,
        className: '',
      }
    },
    created() {
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
        $('.class-select-area').width(240 * new_arr.length)
      },  
      getClassTree(){
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
  overflow-x: auto;
}
.class-select-area{
  height: 100%;
}
.class-select-item{
  float: left;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 112px;
  overflow-y: auto;
  width: 240px;
  height: 100%;
  border-right: 1px solid #eee;
}
.class-select-item p {
  border-bottom: 1px solid #eee;
}

.class-select-item:last-child{
  /*border-right: 0;*/
}
.class-select-btn{
  position: fixed;
  width: 100%;
  height: 96px;
  background-color: #fff;
  bottom: 0;
  left: 0;
  z-index: 4;
  border-top: 1px solid #e1e1e1;
}
.class-select-btn div{
  width: 50%;
  float: left;
  text-align: center;
  line-height: 96px;
}
.confirm-btn{
  background-color: #50bfff;
  color: #fff;
  border-left: 1px solid #e1e1e1;
}
.class-select-item .active{
  color: #50bfff;
  font-weight: bold;
}
.class-select-item p{
  margin-top: 28.8px;
}
</style>