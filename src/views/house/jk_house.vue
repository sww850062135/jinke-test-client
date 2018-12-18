<template>
  <div class="app-container">
    <!--功能栏-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-select v-model="JKCommunity" filterable allowCreate clearable defaultFirstOption
                   placeholder="请输入小区名称"  @change="selectBuildingIdAndName" style="padding-top: 20px; padding-left: 50px">
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
                   placeholder="请输入单元名称" @change="selectHouseIdAndName" style="padding-top: 20px; padding-left: 50px">
          <el-option
            v-for="item in Unit_options"
            :key="item.unit_id"
            :label="item.unit_name"
            :value="item.unit_id">
          </el-option>
        </el-select>
        <el-select v-model="JKHouse" filterable allowCreate clearable defaultFirstOption
                   placeholder="请输入房屋名称" style="padding-top: 20px; padding-left: 50px">
          <el-option
            v-for="item in House_options"
            :key="item.house_id"
            :label="item.house_name"
            :value="item.house_id">
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
        <el-form-item style="padding-top: 20px; padding-left: 20px">
          <el-button type="primary" @click="mappedData">数据全部映射</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="houses" border highlightCurrentRow @selection-change="changeFun" height="600" border style="width: 100%;">
      <el-table-column type="selection" @selection-change="changeFun" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="houseId" label="house_id" width="200" sortable></el-table-column>
      <el-table-column prop="houseName" label="house_name" width="150" sortable></el-table-column>
      <el-table-column prop="houseType" label="house_type" width="130" sortable></el-table-column>
      <el-table-column prop="unitId" label="unit_id" width="200" sortable></el-table-column>
      <el-table-column prop="unitName" label="unit_name" width="130" sortable></el-table-column>
      <el-table-column prop="buildId" label="build_id" width="200" sortable></el-table-column>
      <el-table-column prop="buildName" label="build_name" width="130" sortable></el-table-column>
      <el-table-column prop="projectId" label="project_id" width="200" sortable></el-table-column>
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
        :total="houses.length"
        style="float:left;">
      </el-pagination>
    </el-col>
  </div>
</template>


<script>
  import { getJKCommunityIdAndNameList, getJKBuildingIdAndNameList, getJKUnitIdAndNameList, getJKHouseIdAndNameList,
           getJKHouseList, getJKHouseByHouseId, mappedAJBHouse } from '@/api/jinke'
  export default {
    data: function () {
      return {
        filters: {},
        JKCommunity: [],
        JKBuilding: [],
        JKUnit: [],
        JKHouse: [],
        houses: [],
        Community_options: [],
        Building_options: [],
        Unit_options: [],
        House_options: [],
        multipleSelection: [],
        jkHouseBaseList: [],
        pageSize: 10,   //每页数据大小
        currentPage: 1,  //当前页
        sels: [],
      }
    },
    created() {
      this.selectCommunityIdAndName();
    },
    methods: {
      handleSizeChange: function (pageSize) {
        this.pageSize = pageSize;
        console.log('每页${pageSize}条');
        this.searchHouse();
      },
      handleCurrentChange: function (currentPage) {
        console.log(`当前页: ${currentPage}`);
        this.currentPage = currentPage;
        this.searchHouse();
      },
      handleSearch() {
        this.currentPage = 1;
        this.searchHouse();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //获取房屋数据
      searchHouse: function () {
        const that = this;
        const params = {
          projectId: that.JKCommunity,
          buildId: that.JKBuilding,
          unitId: that.JKUnit,
          houseId: that.JKHouse
        };
        if (params.projectId === "" || params.buildId === "" || params.unitId === "") {
          this.$message({message: "请输入小区名称、楼栋名称和单元名称", type: 'warning', center: true});
        } else if (params.houseId === "") {
          //查询该单元下的单元房屋数据
          getJKHouseList(params).then(data => {
            console.log(params);
            const {status, msg, result} = data;
            if (status === "success") {
              that.houses = result;
              console.log(result);
            } else {
              that.$message({message: msg, type: 'error', center: true});
              console.log(result);
            }
          });
        } else {
          //根据houseId查询房屋数据
          getJKHouseByHouseId(params).then(data => {
            console.log(params);
            const {status, msg, result} = data;
            if (status === "success") {
              that.houses = result;
              console.log(result);
            } else {
              that.$message({message: msg, type: 'error', center: true});
              console.log(result);
            }
          });
        }
      },
      //复选框状态改变
      changeFun(val) {
        this.multipleSelection = val;
        console.log("所选中的数据是: ", this.multipleSelection);
      },
      getNewData() {
      },
      mappedOneData() {
        const that = this;
        let params = {
          buildId: that.JKBuilding,
          jkHouseBaseList: that.multipleSelection,
        };
        if (params.jkHouseBaseList.length === 0 || params.buildId === '') {
          that.$message({message: "请先选择房屋!", type: 'warning', center: true})
        }else {
          mappedAJBHouse(params).then(data =>{
            console.log("所传递的金科房屋数据是: ",params.jkHouseBaseList);
            const {msg1, result} = data;
            that.$message({message: msg1, type: 'success', center: true});
            console.log("映射好的安居宝房屋数据: ", result);
          });
        }
      },
      mappedData() {
      },
      //复选框状态改变
      changeFun(val) {
        this.multipleSelection = val;
      },
      //查询一个小区的id和name列表
      selectCommunityIdAndName() {
        const params = {};
        getJKCommunityIdAndNameList(params).then(data => {
          const {status, msg, result} = data;
          if (status === 'success') {
            this.Community_options = result;
            console.log(this.Community_options);
          } else {
            this.$message({message: msg, type: 'error', center: true});
          }
        })
      },
      //查询一个小区下的楼栋id和name列表
      selectBuildingIdAndName() {
        const params = {
          projectId: this.JKCommunity,
        };
        getJKBuildingIdAndNameList(params).then(data => {
          const {status, msg, result} = data;
          if (status === 'success' && result !== null) {
            this.Building_options = result;
            console.log(this.Building_options);
          } else {
            this.$message({message: msg, type: 'error', center: true});
          }
        })
      },
      //查询一个楼栋下的单元id和name列表
      selectUnitIdAndName() {
        const params = {
          buildId: this.JKBuilding,
        };
        getJKUnitIdAndNameList(params).then(data => {
          const {status, msg, result} = data;
          if (status === 'success') {
            this.Unit_options = result;
            console.log(this.Unit_options);
          } else {
            this.$message({message: msg, type: 'error', center: true});
          }
        });
      },
      //查询一个单元下的房屋id和name列表
      selectHouseIdAndName() {
        const params = {
          buildId: this.JKBuilding,
          unitId: this.JKUnit,
        };
        getJKHouseIdAndNameList(params).then(data => {
          console.log("房屋的楼栋和单元参数是:",params);
          const {status, msg, result} = data;
          if (status === 'success' && result !==null) {
            this.House_options = result;
            console.log(this.House_options);
          } else {
            this.$message({message: msg, type: 'error', center: true});
          }
        });
      },
    },
  }
</script>


<style>
</style>
