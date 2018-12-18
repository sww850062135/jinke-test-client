/**
 * 金科小区管理相关api
 */
import axios from 'axios'
axios.defaults.baseURL = 'http://10.30.30.9:8585';
let config = { headers:{ 'content-type': 'application/json;charset=UTF-8' } };

/**
 * 获取金科小区数据列表
 * @param params 分页大小 pageNum, pageSize
 * @returns {Promise.<TResult>}
 */
export const getJKCommunityList = params => {return axios.get('/api/base/selectJKcommunitylist', {params}, config).then(res => res.data)};
export const getJKCommunityByProjectId = params => {return axios.get('/api/base/getJKcommunityByProjectId', {params}, config).then(res => res.data)};
export const getJKCommunityIdAndNameList = params =>{return axios.get('/api/base/getjkcommunityIdAndNamelist', {params}, config).then(res => res.data)};
/**
 * 获取金科楼栋数据
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getJKBuilding = params => {return axios.get('/api/base/getJKbuildingByProjectId', {params}, config).then(res => res.data)};
export const getJKBuildingIdAndNameList = params =>{return axios.get('/api/base/getjkbuildIdAndNamelist', {params}, config).then(res => res.data)};
export const getJKBuildingByJKbuildId = params =>{return axios.get('/api/base/selectJKbuildlistByJKbuildId', {params}, config).then(res => res.data)};
/**
 * 获取金科单元数据
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getJKUnitByJKBuildId = params =>{return axios.get('/api/base/selectJKunitByBuildId', {params}, config).then(res => res.data)};
export const getJKUnitIdAndNameList = params =>{return axios.get('/api/base/selectJKUnitIdAndNamelist', {params}, config).then(res => res.data)};
export const getJKUnitByUnitId = params =>{return axios.get('/api/base/selectJKUnitByUnitId', {params}, config).then(res => res.data)};
/**
 * 获取金科房屋数据
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getJKHouseIdAndNameList = params =>{return axios.get('/api/base/selectJKHouseIdAndNamelist', {params}, config).then(res => res.data)};
export const getJKHouseByHouseId = params =>{return axios.get('/api/base/selectJKHouseByHouseId', {params}, config).then(res => res.data)};
export const getJKHouseList = params =>{return axios.get('/api/base/selectJKHouselist', {params}, config).then(res => res.data)};

/**
 * 映射金科数据
 * @param params
 * @returns {Promise.<TResult>}
 */
export const mappedAJBCommunity = params =>{return axios.post('/api/ajb/mappedAJBCommunity', {params}, config).then(res => res.data)};
export const mappedAJBBuilding = params =>{return axios.post('/api/ajb/mappedAJBBuilding', {params}, config).then(res => res.data)};
export const mappedAJBUnit = params =>{return axios.post('/api/ajb/mappedAJBUnit', {params}, config).then(res => res.data)};
export const mappedAJBHouse = params =>{return axios.post('/api/ajb/mappedAJBHouse', {params}, config).then(res => res.data)};
