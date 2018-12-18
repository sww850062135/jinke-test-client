/**
 * 安居宝小区管理相关api
 */
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8585';
let config = { headers:{ 'content-type': 'application/json;charset=UTF-8' } };

/**
 * 获取安居宝小区数据
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getAJBCommunityList = params => {return axios.get('/api/base/selectAJBcommunitylist', {params}, config).then(res => res.data)};
export const getAJBCommunityByProjectId = params => {return axios.get('/api/base/getAJBcommunityByProjectId', {params}, config).then(res => res.data)};

/**
 * 获取安居宝楼栋数据
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getAJBBuilding = params => {return axios.get('/api/base/getAJBbuildingByProjectId', {params}, config).then(res => res.data)};
export const getAJBBuildingByJKbuildId = params =>{return axios.get('/api/base/selectAJBbuildlistByJKbuildId', {params}, config).then(res => res.data)};
/**
 * 获取安居宝单元数据
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getAJBUnitListByJKBuildId = params =>{return axios.get('/api/base/selectAJBunitlistByJKBuildId', {params}, config).then(res => res.data)};
export const getAJBUnitByJKUnitId = params =>{return axios.get('/api/base/selectAJBUnitByJKUnitId', {params}, config).then(res => res.data)};
/**
 * 获取安居宝房屋数据
 * @param params
 * @returns {Promise.<TResult>}
 */

export const getAJBHouseByJKHouseId = params =>{return axios.get('/api/base/selectAJBHouseByJKHouseId', {params}, config).then(res => res.data)};
export const getAJBHouseListByJKUnitId = params =>{return axios.get('/api/base/selectAJBHouselistByJKUnitId', {params}, config).then(res => res.data)};

/**
 * 获取安居宝小区编码
 * @param params
 * @returns {Promise.<TResult>}
 */

export const getCommunityCodeByJKCommunityId = params =>{return axios.get('/api/base/selectAJBCommunityCode', {params}, config).then(res => res.data)};

/**
 * 获取安居宝房屋编码
 * @param params
 * @returns {Promise.<TResult>}
 */

export const getRoomCodeByJKHouseId = params =>{return axios.get('/api/base/selectAJBHouseCode', {params}, config).then(res => res.data)};
