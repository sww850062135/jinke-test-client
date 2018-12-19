<template>
  <div class="app-container">
    <!--功能栏-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-select v-model="JKCommunity" filterable allowCreate clearable defaultFirstOption
                   placeholder="请输入小区名称"  @change="selectBuildingIdAndName" style="padding-top: 20px; padding-left: 100px">
          <el-option
            v-for="item in Community_options"
            :key="item.project_id"
            :label="item.project_name"
            :value="item.project_id">
          </el-option>
        </el-select>
        <el-select v-model="JKBuilding" filterable allowCreate clearable defaultFirstOption
                   placeholder="请输入楼栋名称" style="padding-top: 20px; padding-left: 50px">
          <el-option
            v-for="item in Building_options"
            :key="item.build_id"
            :label="item.build_name"
            :value="item.build_id">
          </el-option>
        </el-select>
        <el-form-item style="padding-top: 20px; padding-left: 50px">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item style="padding-top: 20px; padding-left: 20px">
          <el-button type="primary" @click="getNewData">同步数据</el-button>
        </el-form-item>
        <el-form-item style="padding-top: 20px; padding-left: 20px">
          <el-button type="primary" @click="mappedOneData">数据映射</el-button>
        </el-form-item>
        <!--<el-form-item style="padding-top: 20px; padding-left: 20px">
          <el-button type="primary" @click="mappedData">数据全部映射</el-button>
        </el-form-item>-->
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="buildings" highlightCurrentRow @selection-change="changeFun" height="600" border style="width: 100%;">
      <el-table-column type="selection" @selection-change="changeFun" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="buildId" label="build_id" width="300" sortable></el-table-column>
      <el-table-column prop="buildName" label="build_name" width="200" sortable></el-table-column>
      <el-table-column prop="projectId" label="project_id" width="300" sortable></el-table-column>
      <el-table-column prop="projectName" label="project_name" width="300" sortable></el-table-column>
      <el-table-column prop="syncTime" label="sync_time" width="200" sortable></el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        @sie-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current_page="currentPage"
        :page-sizes="[5,10,20,50,100]"
        :page-size="pageSize"
        :total="buildings.length"
        style="float:left;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import { getJKCommunityIdAndNameList, getJKBuilding, getJKBuildingIdAndNameList, getJKBuildingByJKbuildId, mappedAJBBuilding } from '@/api/jinke'
import {mappedAJBCommunity} from "../../api/jinke";

export default {
  data: function () {
    return {
      filters: {},
      JKCommunity: [],
      JKBuilding: [],
      buildings: [],
      Community_options: [],
      Building_options: [],
      multipleSelection: [],
      jkBuildingBaseList: [],
      ConfirmFormVisible: false,
      jkCommunityBaseList: [],         //映射楼栋时对应的上层小区数据
      pageSize: 10,   //每页数据大小
      currentPage:1,  //当前页
      sels:[],
    }
  },
  created (){
    this.selectCommunityIdAndName();
  },
  methods:{
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      console.log('每页${pageSize}条');
      this.searchBuild();
    },
    handleCurrentChange: function (currentPage) {
      console.log(`当前页: ${currentPage}`);
      this.currentPage = currentPage;
      this.searchBuild();
    },
    handleSearch()
    {
      this.currentPage = 1;
      this.searchBuild();
    },
    selsChange: function (sels) {
      this.sels = sels;
    },

    /*获取楼栋数据*/
    searchBuild: function () {
      const that = this;
      const params = {
        projectId : that.JKCommunity,
        buildId: that.JKBuilding,
      };
      if (params.projectId === "") {
        this.$message({message: "请输入小区名称", type: 'warning', center: true});
      }else if (params.buildId === "") {
        //查询一个小区下的所有楼栋数据
        getJKBuilding(params).then(data =>{
          console.log(params);
          const {status, msg, result} = data;
          if (status ==="success" && result!==null) {
            console.log(result);
            that.buildings = result;
          }else {
            that.$message( {message: msg,type: 'error', center: true } );
            console.log(result);
          }
        });
      }else {
        //根据楼栋id查询一个小区下的该楼栋数据
        getJKBuildingByJKbuildId(params).then(data =>{
          const {status, msg, result} =data;
          if (status ==="success") {
            that.buildings = result;
          }else {
            that.$message( {message: msg,type: 'error', center: true } );
            console.log(result);
          }
        });
      }
    },

    //复选框状态改变
    changeFun(val) {
      this.multipleSelection = val;
      console.log("所选中的数据是: ",this.multipleSelection);
    },

    //拉取金科楼栋数据
    getNewData() {
    },

    //映射楼栋
    mappedOneData() {
      const that = this;
      let params = {
        projectId: that.JKCommunity,
        jkBuildingBaseList: that.multipleSelection,
      };
      if (params.jkBuildingBaseList.length === 0 || params.projectId === '') {
        that.$message({message: "请先选择楼栋!", type: 'warning', center: true})
      }else {
        mappedAJBBuilding(params).then(data =>{
          console.log("所传递的映射楼栋数据是: ",params.jkBuildingBaseList);
          const {msg, msg1, status, status1, result} = data;
          if (status === 'success') {
            if (status1 === 'success') {
              that.$message({message: msg1, type: 'success', center: true});
              console.log("映射好的安居宝楼栋数据: ", result);
            } else {
              that.$confirm('映射失败,该楼栋上的小区还未映射!是否先映射该小区?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'error'
              }).then(() => {
                const params = {
                  jkCommunityBaseList: result   //后端返回的楼栋对应的小区数据
                };
                //映射楼栋对应的小区
                mappedAJBCommunity(params).then(data => {
                  console.log("所传递的金科小区数据是: ", params.jkCommunityBaseList);
                  const {msg, msg1, status, result} = data;
                  if (status === 'success') {
                    that.$message({message: msg1, type: 'success', center: true});
                    console.log("映射好的安居宝小区数据: ", result);
                  } else {
                    that.$message({message: msg, type: 'error', center: true});
                  }
                });
              }).catch(() => {
                that.$message({message: '已取消先映射该小区!', type: 'warning', center: true});
              });
            }
          }else {
            that.$message({message: msg, type: 'error', center: true});
          }
        });
      }
    },

    /*//映射全部房屋数据
    mappedData() {
    },*/

    //查询小区id和name列表
    selectCommunityIdAndName (){
      const params ={};
      getJKCommunityIdAndNameList(params).then(data =>{
        const {status, msg, result} = data;
        if (status === 'success') {
          this.Community_options = result;
          console.log(this.Community_options);
        }else {
          this.$message({message: msg, type: 'error', center: true});
        }
      })
    },

    //查询一个小区下的楼栋id和name列表
    selectBuildingIdAndName (){
      const params ={
        projectId: this.JKCommunity,
      };
      getJKBuildingIdAndNameList(params).then(data =>{
        const {status, msg, result} = data;
        if (status === 'success' && result!==null) {
          this.Building_options = result;
          console.log(this.Building_options);
        }else {
          this.$message({message: msg, type: 'error', center: true});
        }
      })
    },
  }

}
</script>

