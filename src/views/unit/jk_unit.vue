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
                   placeholder="请输入楼栋名称"  @change="selectUnitIdAndName" style="padding-top: 20px; padding-left: 50px">
          <el-option
            v-for="item in Building_options"
            :key="item.build_id"
            :label="item.build_name"
            :value="item.build_id">
          </el-option>
        </el-select>
        <el-select v-model="JKUnit" filterable allowCreate clearable defaultFirstOption
                   placeholder="请输入单元名称" style="padding-top: 20px; padding-left: 50px">
          <el-option
            v-for="item in Unit_options"
            :key="item.unit_id"
            :label="item.unit_name"
            :value="item.unit_id">
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
    <el-table :data="units" highlightCurrentRow @selection-change="changeFun" height="600" border style="width: 100%;">
      <el-table-column type="selection" @selection-change="changeFun" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="unitId" label="unit_id" width="300" sortable></el-table-column>
      <el-table-column prop="unitName" label="unit_name" width="200" sortable></el-table-column>
      <el-table-column prop="buildId" label="build_id" width="300" sortable></el-table-column>
      <el-table-column prop="buildName" label="build_name" width="200" sortable></el-table-column>
      <el-table-column prop="projectId" label="project_id" width="300" sortable></el-table-column>
      <el-table-column prop="projectName" label="project_name" sortable></el-table-column>
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
        :total="units.length"
        style="float:left;">
      </el-pagination>
    </el-col>
  </div>
</template>


<script>
  import { getJKCommunityIdAndNameList, getJKBuildingIdAndNameList, getJKUnitByJKBuildId, getJKUnitIdAndNameList,
           getJKUnitByUnitId, mappedAJBUnit } from '@/api/jinke'
  import {mappedAJBBuilding, mappedAJBCommunity} from "../../api/jinke";
  export default {
    data: function () {
      return {
        filters: {},
        JKCommunity: [],
        JKBuilding: [],
        JKUnit: [],
        units:[],
        Community_options: [],
        Building_options: [],
        Unit_options: [],
        multipleSelection: [],
        jkCommunityBaseList: [],
        jkBuildingBaseList: [],
        jkUnitBaseList: [],
        pageSize: 10,   //每页数据大小
        currentPage: 1,  //当前页
        sels: [],
      }
    },
    created (){
      this.selectCommunityIdAndName();
    },
    methods: {
      handleSizeChange: function (pageSize) {
        this.pageSize = pageSize;
        console.log('每页${pageSize}条');
        this.searchUnit();
      },
      handleCurrentChange: function (currentPage) {
        console.log(`当前页: ${currentPage}`);
        this.currentPage = currentPage;
        this.searchUnit();
      },
      handleSearch() {
        this.currentPage = 1;
        this.searchUnit();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },

      //获取单元数据
      searchUnit: function () {
        const that = this;
        const params = {
          projectId: that.JKCommunity,
          buildId: that.JKBuilding,
          unitId: that.JKUnit
        };
        if (params.projectId === "" || params.buildId === "") {
          this.$message({message: "请输入小区名称和楼栋名称", type: 'warning', center: true});
        }else if (params.unitId === "") {
          //查询该楼栋下的单元数据
          getJKUnitByJKBuildId(params).then(data =>{
            console.log(params);
            const {status, msg, result} = data;
            if (status === "success"){
              that.units = result;
              console.log(result);
            }else {
              that.$message( {message: msg, type: 'error', center: true } );
              console.log(result);
            }
          });
        }else {
          //根据unitId查询单元数据
          getJKUnitByUnitId(params).then(data =>{
            console.log(params);
            const {status, msg, result} = data;
            if (status === "success"){
              that.units = result;
              console.log(result);
            }else {
              that.$message( {message: msg, type: 'error', center: true } );
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

      //拉取金科单元数据
      getNewData() {
      },

      //映射金科单元数据
      mappedOneData() {
        const that = this;
        let params = {
          buildId: that.JKBuilding,
          jkUnitBaseList: that.multipleSelection,
        };
        if (params.jkUnitBaseList.length === 0 || params.buildId === '') {
          that.$message({message: "请先选择单元!", type: 'warning', center: true})
        }else {
          mappedAJBUnit(params).then(data =>{
            console.log("所传递的金科单元数据是: ",params.jkUnitBaseList);
            const {msg, msg1, status, status1, result, result1} = data;
            if (status === 'success') {
              if (status1 === 'success') {
                that.$message({message: msg1, type: 'success', center: true});
                console.log("映射好的安居宝单元数据: ", result);
              } else {
                that.$confirm('映射失败,该单元上的小区或楼栋还未映射!是否先映射该小区或楼栋?', '提示', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'warning'
                }).then(() => {
                  const params = {
                    jkCommunityBaseList: result,   //后端返回的单元对应的小区数据
                    jkBuildingBaseList: result1,   //后端返回的单元对应的楼栋数据
                    projectId: that.JKCommunity,   //该金科单元对应的金科小区号
                  };
                  //映射单元对应的小区
                  mappedAJBCommunity(params).then(data => {
                    console.log("所传递的金科小区数据是: ", params.jkCommunityBaseList);
                    const {msg, msg1, status, result} = data;
                    if (status === 'success') {
                      //that.$message({message: msg1, type: 'success', center: true});
                      console.log("映射好的安居宝小区数据: ", result);
                      //映射单元对应的楼栋
                      mappedAJBBuilding(params).then(data => {
                        console.log("所传递的金科楼栋数据是: ", params.jkBuildingBaseList);
                        const {msg, msg1, status, result} = data;
                        if (status === 'success') {
                          //that.$message({message: msg1, type: 'success', center: true});
                          that.$confirm('该单元上的小区或楼栋已完成映射!可继续映射单元操作!', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                          }).then(() => {
                            that.$message({message: '该单元上的小区或楼栋已完成映射!可继续映射单元操作!', type: 'success', center: true});
                          });
                          console.log("映射好的安居宝楼栋数据: ", result);
                        } else {
                          that.$message({message: msg, type: 'error', center: true});
                        }
                      });
                    } else {
                      that.$message({message: msg, type: 'error', center: true});
                    }
                  });
                }).catch(() => {
                  that.$message({message: '已取消先映射该小区或楼栋!', type: 'warning', center: true});
                });
              }
            }else {
              that.$message({message: msg, type: 'error', center: true});
            }
          });
        }
      },

      /*//映射全部数据
      mappedData() {
      },*/

      //查询一个小区的id和name列表
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
          if (status === 'success' && result !== null) {
            this.Building_options = result;
            console.log(this.Building_options);
          }else {
            this.$message({message: msg, type: 'error', center: true});
          }
        })
      },

      //查询一个楼栋下的单元id和name列表
      selectUnitIdAndName (){
        const params = {
          buildId: this.JKBuilding,
        };
        getJKUnitIdAndNameList(params).then(data =>{
          const {status, msg, result} = data;
          if (status === 'success') {
            this.Unit_options = result;
            console.log(this.Unit_options);
          }else {
            this.$message({message: msg, type: 'error', center: true});
          }
        })
      },
    },
  }
</script>


<style>
</style>
