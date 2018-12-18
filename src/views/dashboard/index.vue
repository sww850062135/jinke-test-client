<template>
  <div class="dashboard-container">
    <!--功能栏-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-select v-model="JKCommunity" filterable allowCreate clearable defaultFirstOption
                   placeholder="请选择小区名称" @change="selectCommunityCode" style="padding-top: 20px; padding-left: 20px">
          <el-option
            v-for="item in Community_options"
            :key="item.project_id"
            :label="item.project_name"
            :value="item.project_id">
          </el-option>
        </el-select>
        <el-select v-model="JKBuilding" filterable allowCreate clearable defaultFirstOption
                   placeholder="请选择楼栋"  @change="selectUnitIdAndName" style="padding-top: 20px; padding-left: 20px">
          <el-option
            v-for="item in Building_options"
            :key="item.build_id"
            :label="item.build_name"
            :value="item.build_id">
          </el-option>
        </el-select>
        <el-select
          v-model="JKUnit" filterable allowCreate clearable defaultFirstOption
                   placeholder="请选择单元" @change="selectHouseIdAndName" style="padding-top: 20px; padding-left: 20px">
          <el-option
            v-for="item in Unit_options"
            :key="item.unit_id"
            :label="item.unit_name"
            :value="item.unit_id">
          </el-option>
        </el-select>
        <el-select v-model="JKHouse" filterable allowCreate clearable defaultFirstOption
                   placeholder="请选择房屋" @change="selectRoomCode" style="padding-top: 20px; padding-left: 20px">
          <el-option
            v-for="item in House_options"
            :key="item.house_id"
            :label="item.house_name"
            :value="item.house_id">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="start_date"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始日期时间"
          default-time="12:00:00">
        </el-date-picker>
        <el-date-picker
          v-model="end_date"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束日期时间"
          default-time="12:00:00">
        </el-date-picker>
        <el-form-item style="padding-top: 20px; padding-left: 50px">
          <el-button type="primary" @click="handle">获取</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div>
      <span style="font-size: 30px">获取蓝牙开锁码:</span>
      <div class="dashboard-text">community_code:{{ community_code }}</div>
      <div class="dashboard-text">room_code:{{ room_code }}</div>
      <div class="dashboard-text">end_date:{{ end_date }}</div>
      <div class="dashboard-text">bluetooth_code:{{ bluetooth_code }}</div>
    </div>
    <div style="padding-top: 50px;">
      <span style="font-size: 30px;">获取通行码:</span>
      <div class="dashboard-text">community_code:{{ community_code }}</div>
      <div class="dashboard-text">room_code:{{ room_code }}</div>
      <div class="dashboard-text">start_date:{{ start_date }}</div>
      <div class="dashboard-text">end_date:{{ end_date }}</div>
      <div class="dashboard-text">door_code:{{ door_code }}</div>
      <!--<div class="dashboard-text">state:{{ state }}</div>-->
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getJKCommunityIdAndNameList, getJKBuildingIdAndNameList, getJKUnitIdAndNameList, getJKHouseIdAndNameList,} from '@/api/jinke'
  import { getCommunityCodeByJKCommunityId, getRoomCodeByJKHouseId } from '@/api/ajb'
  import { getBluetoothCode, getDoorCode} from '@/api/code'
  export default {
    name: 'dashboard',
    computed: {
      ...mapGetters([
        'name',
        'roles',
      ]),
    },
    data() {
      return {
        community_code: '',
        room_code: '',
        start_date: '',
        end_date: '',
        door_code: '',
        bluetooth_code: '',
        state: '', //开锁码状态 是否失效
        code_count: 0,
        filters: {},
        JKCommunity: [],
        JKBuilding: [],
        JKUnit: [],
        JKHouse: [],
        Community_options: [],
        Building_options: [],
        Unit_options: [],
        House_options: [],
      }
    },
    created() {
      this.selectCommunityIdAndName();
    },
    methods: {
      handle() {
        this.generateBluetoothCode();
        this.generateDoorCode();
      },
      //获取蓝牙开锁码
      generateBluetoothCode: function () {
        const that = this;
        const params = {
          community_code: that.community_code,
          room_code: that.room_code,
          end_date: that.end_date,
        };
        getBluetoothCode(params).then(data =>{
          if (params.community_code !=='' || params.room_code !== '') {
            const {status, msg, result} = data;
            if (status === "success") {
              that.bluetooth_code = result;
              that.$message({message: msg, type: 'success', center: true});
            }else {
              that.$message({message: msg, type: 'error', center: true});
            }
          }else {
            that.$message({message: '请先选择小区、楼栋房号!', type: 'warning', center: true});
          }
        });
      },
      //获取通行码
      generateDoorCode: function () {
        const that = this;
        const params = {
          community_code: that.community_code,
          room_code: that.room_code,
          start_date: that.start_date,
          end_date: that.end_date,
          code_count: that.code_count
        };
        getDoorCode(params).then(data => {
          if (params.community_code !== '' || params.room_code !== '') {
            const {result} = data;
            that.door_code = result;
          }else {
            that.$message({message: '请先选择小区、楼栋房号!', type: 'warning', center: true});
          }
        });
      },

      //获取安居宝community_code
      selectCommunityCode() {
        const params = {
          projectId: this.JKCommunity,
        };
        getCommunityCodeByJKCommunityId(params).then(data =>{
          if (params.projectId !== '') {
            const {status, msg, result} = data;
            if (status === "success" && result !== '') {
              console.log(result);
              this.community_code = result;
            } else {
              this.$message({message: msg, type: 'warning', center: true});
            }
          }else {
            this.$message({message: '请先选择小区!', type: 'warning', center: true});
          }
        });
        getJKBuildingIdAndNameList(params).then(data => {
          if (params.projectId !== '') {
            const {status, msg, result} = data;
            if (status === 'success' && result !== null) {
              this.Building_options = result;
              console.log(this.Building_options);
            } else {
              this.$message({message: msg, type: 'warning', center: true});
            }
          }else {
            this.$message({message: '请先选择小区!', type: 'warning', center: true});
          }
        });
      },

      //获取安居宝房屋编码room_code
      selectRoomCode() {
        const params = {
          jkHouseId: this.JKHouse,
        };
        getRoomCodeByJKHouseId(params).then(data =>{
          console.log("传递的房屋id参数:",params);
          if (params.jkHouseId !== '') {
            const {status, msg, result} = data;
            if (status === "success" && result !== '') {
              console.log("安居宝房屋编码是: ",result);
              this.room_code = result;
            } else {
              this.$message({message: msg, type: 'warning', center: true});
            }
          }else {
            this.$message({message: '请先选择房屋!', type: 'warning', center: true});
          }
        });
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
          if (status === 'success') {
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 20px;
      line-height: 46px;
    }
  }

</style>
