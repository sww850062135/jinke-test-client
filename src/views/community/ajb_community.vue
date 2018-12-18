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
          <el-button type="primary" @click="mappedOneData">数据映射</el-button>
        </el-form-item>
        <el-form-item style="padding-top: 20px; padding-left: 20px">
          <el-button type="primary" @click="mappedData">数据全部映射</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="ajbcommunitys" highlightCurrentRow @selection-change="selsChange" height="600" border style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="id" label="id" width="180" sortable></el-table-column>
      <el-table-column prop="communityCode" label="community_code" width="190" sortable></el-table-column>
      <el-table-column prop="communityName" label="community_name" width="190" sortable></el-table-column>
      <el-table-column prop="provinceName" label="province_name" width="150" sortable></el-table-column>
      <el-table-column prop="cityName" label="city_name" width="120" sortable></el-table-column>
      <el-table-column prop="districtName" label="district_name" width="140" sortable></el-table-column>
      <el-table-column prop="createdTime" label="created_time" width="180" sortable></el-table-column>
      <el-table-column prop="updateTime" label="update_time"  width="180" sortable></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="medium" icon="el-icon-edit" >编辑</el-button>
        </template>

      </el-table-column>
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
        :total="ajbcommunitys.length"
        style="float:left;">
      </el-pagination>
    </el-col>
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" labelWidth="80px" ref="editForm">
        <el-form-item label="id">
          <el-input v-model="editForm.id" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="小区编码">
          <el-input v-model="editForm.communityCode" style="font-size: 15px"></el-input>
        </el-form-item>
        <el-form-item label="小区名字">
          <el-input v-model="editForm.communityName" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="editForm.provinceName" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="editForm.cityName" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="editForm.districtName" style="font-size: 15px" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible= false">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import { getJKCommunityIdAndNameList } from '@/api/jinke'
  import { getAJBCommunityList, getAJBCommunityByProjectId} from '@/api/ajb'
  import ElDialog from "../../../node_modules/_element-ui@2.4.11@element-ui/packages/dialog/src/component.vue";
  import ElForm from "../../../node_modules/_element-ui@2.4.11@element-ui/packages/form/src/form.vue";
  import ElFormItem from "../../../node_modules/_element-ui@2.4.11@element-ui/packages/form/src/form-item.vue";
  import ElInput from "../../../node_modules/_element-ui@2.4.11@element-ui/packages/input/src/input.vue";
  import ElButton from "../../../node_modules/_element-ui@2.4.11@element-ui/packages/button/src/button.vue";
  export default {
    components: {
      ElButton,
      ElInput,
      ElFormItem,
      ElForm,
      ElDialog},
    data: function () {
      return {
        filters: {},
        JKCommunity: '', //金科小区
        Community_options: [], //小区名称选项
        ajbcommunitys: [],
        pageSize: 10,   //每页数据大小
        currentPage:1,  //当前页
        sels:[],
        editForm: {
          id: '',
          communityCode: '',
          communityName: '',
          provinceName: '',
          cityName: '',
          districtName: '',
        },
        editFormVisible:false,
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
          getAJBCommunityList(params).then(data => {
            const {status, msg, result} = data;
            console.log(data);
            if (status === 'success' && result !==null) {
              that.ajbcommunitys = result;
            }else {
              that.$message( {message: msg,type: 'error', center: true } );
            }
          })
        }
        if (params.projectId!==""){
          //根据金科小区id 查询安居宝小区数据
          getAJBCommunityByProjectId (params).then(data =>{
            const {status, msg, result} = data;
            console.log(data);
            if (status === 'success'&& result !==null) {
              that.ajbcommunitys = result;
            } else {
              that.$message({message: msg, type: 'error', center: true} );
            }
          })
        }
      },
      //编辑
      handleEdit (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      editSubmit () {

      },
      getNewData () {
      },
      mappedOneData () {

      },
      mappedData () {

      },
      //查询金科小区id和name列表
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
</style>
