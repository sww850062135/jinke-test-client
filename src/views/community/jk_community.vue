<template>
  <div class="app-container">
    <!--功能栏-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-select v-model="JKCommunity" filterable allowCreate clearable defaultFirstOption
                   placeholder="请输入小区名称" style="padding-top: 20px; padding-left: 200px">
            <el-option
              v-for="item in Community_options"
              :key="item.project_id"
              :label="item.project_name"
              :value="item.project_id">
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
    <el-table :data="communitys" highlightCurrentRow @selection-change="changeFun" height="600" border style="width: 100%;">
      <el-table-column type="selection" @selection-change="changeFun" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="projectId" label="project_id" width="300" sortable></el-table-column>
      <el-table-column prop="projectName" label="project_id" width="160" sortable></el-table-column>
      <el-table-column prop="provinceName" label="province_name" width="150" sortable></el-table-column>
      <el-table-column prop="cityName" label="city_name" width="120" sortable></el-table-column>
      <el-table-column prop="districtName" label="district_name" width="140" sortable></el-table-column>
      <el-table-column prop="companyId" label="company_id" width="140" sortable></el-table-column>
      <el-table-column prop="companyName" label="company_name" width="160" sortable></el-table-column>
      <el-table-column prop="houseTotal" label="house_total" width="140" sortable></el-table-column>
      <el-table-column prop="houseNum" label="house_num" width="140" sortable></el-table-column>
      <el-table-column prop="syncTime" label="sync_time" width="140" sortable></el-table-column>
      <el-table-column prop="syncStatus" label="sync_status" width="140" sortable></el-table-column>
      <el-table-column prop="syncMsg" label="sync_msg" width="200" sortable></el-table-column>
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
        :total="communitys.length"
        style="float:left;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import { getJKCommunityList, getJKCommunityByProjectId, getJKCommunityIdAndNameList, mappedAJBCommunity } from '@/api/jinke'
export default {
  data: function () {
    return {
      filters: {},
      JKCommunity: '', //金科小区
      Community_options: [], //小区名称选项
      communitys: [],
      multipleSelection: [], //多选框所选中行的数据
      jkCommunityList: [],   //映射数据传递的小区参数
      pageSize: 10,   //每页数据大小
      currentPage:1,  //当前页
      sels:[],
    }
  },
  created (){
    this.selectCommunityIdAndName();
  },
  methods:{
    handleSizeChange: function(pageSize){
      this.pageSize = pageSize;
      console.log('每页${pageSize}条');
      this.searchCommunity();
    },
    handleCurrentChange: function(currentPage) {
      console.log(`当前页: ${currentPage}`);
      this.currentPage = currentPage;
      this.searchCommunity();
    },
    handleSearch(){
      this.currentPage = 1;
      this.searchCommunity();
    },
    selsChange: function (sels) {
      this.sels = sels;
    },

    /*获取小区数据*/
    searchCommunity: function () {
      const that = this;
      const params = {
        pageNum: that.currentPage,
        pageSize: that.pageSize,
        projectId: that.JKCommunity
      };
      console.log(params);
      if (params.projectId ==="") {
        //查询所有小区数据
        getJKCommunityList(params).then(data => {
          const {status, msg, result} = data;
          if (status === 'success') {
            that.communitys = result;
          }else {
            that.$message( {message: msg,type: 'error', center: true } );
          }
        })
      }
      if (params.projectId!==""){
        //根据小区id 查询小区数据
        getJKCommunityByProjectId (params).then(data =>{
          const {status, msg, result} = data;
          console.log(data);
          if (status === 'success') {
            that.communitys = result;
          } else {
            that.$message({message: msg, type: 'error', center: true} );
            console.log(result);
          }
        })
      }
    },

    //复选框状态改变
    changeFun(val) {
      this.multipleSelection = val;
      console.log("所选中的数据是: ",this.multipleSelection);
    },
    getNewData () {
    },
    //数据映射
    mappedOneData () {
      const that = this;
      let params = {
        jkCommunityBaseList: that.multipleSelection,
      };
      if (params.length === 0) {
        that.$message({message: "请先选择小区数据!", type: 'warning', center: true})
      }else {
        mappedAJBCommunity(params).then(data =>{
          console.log("所传递的金科小区数据是: ",params.jkCommunityBaseList);
          const {msg, msg1, status, result} = data;
          if (status === 'success') {
            that.$message({message: msg1, type: 'success', center: true});
            console.log("映射好的安居宝小区数据: ", result);
          }else {
            that.$message({message: msg, type: 'error', center: true});
          }
        });
      }
    },

    /*//映射全部小区数据
    mappedData () {
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
          console.log(result);
        }
      })
    },
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
    margin-left: 140px;
  }
  .demo-table-expand label {
    width: 140px;
    color: #95a9bd;
  }
</style>
