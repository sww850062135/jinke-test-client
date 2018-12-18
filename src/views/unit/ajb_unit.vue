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
          <el-button type="primary" @click="mappedOneData">数据映射</el-button>
        </el-form-item>
        <el-form-item style="padding-top: 20px; padding-left: 20px">
          <el-button type="primary" @click="mappedData">数据全部映射</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="ajbunits" highlightCurrentRow @selection-change="selsChange" height="600" border style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="id" label="id" width="250" sortable></el-table-column>
      <el-table-column prop="communityId" label="community_id" width="250" sortable></el-table-column>
      <el-table-column prop="buildingId" label="building_id" width="300" sortable></el-table-column>
      <el-table-column prop="unitName" label="unit_name" width="180" sortable></el-table-column>
      <el-table-column prop="unitCode" label="unit_code" width="180" sortable></el-table-column>
      <el-table-column prop="createdTime" label="created_time" width="200" sortable></el-table-column>
      <el-table-column prop="updateTime" label="update_time" width="200" sortable></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="medium" icon="el-icon-edit" >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑弹窗-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" labelWidth="80px" ref="editForm">
        <el-form-item label="id">
          <el-input v-model="editForm.id" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="小区ID">
          <el-input v-model="editForm.communityId" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="楼栋ID">
          <el-input v-model="editForm.buildingId" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单元编码">
          <el-input v-model="editForm.unitCode" style="font-size: 15px"></el-input>
        </el-form-item>
        <el-form-item label="单元名称">
          <el-input v-model="editForm.unitName" style="font-size: 15px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible= false">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>
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
        :total="ajbunits.length"
        style="float:left;">
      </el-pagination>
    </el-col>
  </div>
</template>


<script>
  import { getJKCommunityIdAndNameList, getJKBuildingIdAndNameList, getJKUnitIdAndNameList } from '@/api/jinke'
  import { getAJBUnitListByJKBuildId, getAJBUnitByJKUnitId} from '@/api/ajb'
  export default {
    data: function () {
      return {
        filters: {},
        JKCommunity: [],
        JKBuilding: [],
        JKUnit: [],
        ajbunits:[],
        Community_options: [],
        Building_options: [],
        Unit_options: [],
        pageSize: 10,   //每页数据大小
        currentPage: 1,  //当前页
        sels: [],
        editForm: {
          id: '',
          communityId: '',
          buildingId: '',
          unitName: '',
          unitCode: '',
        },
        editFormVisible:false,
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
          jkBuildId: that.JKBuilding,
          jkUnitId: that.JKUnit
        };
        if (params.projectId === "" || params.jkBuildId === "") {
          this.$message({message: "请输入小区名称和楼栋名称", type: 'warning', center: true});
        }else if (params.jkUnitId === "") {
          //查询该金科楼栋id下映射的安居宝单元数据
          getAJBUnitListByJKBuildId(params).then(data =>{
            console.log(params);
            const {status, msg, result} = data;
            if (status === "success" && result !== null){
              that.ajbunits = result;
              console.log(result);
            }else {
              that.$message( {message: msg, type: 'error', center: true } );
              console.log(result);
            }
          });
        }else {
          //根据该金科unitId查询映射的安居宝单元数据
          getAJBUnitByJKUnitId(params).then(data =>{
            console.log(params);
            const {status, msg, result} = data;
            if (status === "success" && result !== null){
              that.ajbunits = result;
              console.log(result);
            }else {
              that.$alert( msg, '提示',);
              console.log(result);
            }
          });
        }
      },
      //编辑
      handleEdit (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      getNewData() {
      },
      mappedOneData() {

      },
      mappedData() {

      },

      //查询金科一个小区的id和name列表
      selectCommunityIdAndName (){
        const params ={};
        getJKCommunityIdAndNameList(params).then(data =>{
          const {status, msg, result} = data;
          if (status === 'success'&& result !== null) {
            this.Community_options = result;
            console.log(this.Community_options);
          }else {
            this.$message({message: msg, type: 'error', center: true});
          }
        })
      },
      //查询金科一个小区下的楼栋id和name列表
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
      //查询金科一个楼栋下的单元id和name列表
      selectUnitIdAndName (){
        const params = {
          buildId: this.JKBuilding,
        };
        getJKUnitIdAndNameList(params).then(data =>{
          const {status, msg, result} = data;
          if (status === 'success' && result !== null) {
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
