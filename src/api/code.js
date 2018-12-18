/**
 * 获取蓝牙开锁码、通行码相关api
 */
import axios from 'axios'
axios.defaults.baseURL = 'http://10.30.30.9:8585';
let config = { headers:{ 'content-type': 'application/json;charset=UTF-8' } };

export const getBluetoothCode = params =>{return axios.post('/api/code/generateBluetoothCode', {params}, config).then(res => res.data)};
export const getDoorCode = params =>{return axios.post('/api/code/generateDoorCode', {params}, config).then(res => res.data)};
