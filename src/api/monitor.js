import axios from 'axios'

// 获取在线监测设备列表
export async function getDeviceGroups() {
  const response = await axios.get('/api/monitor/devices')
  return response.data
}
// 获取指定设备的监测参数
export async function getDeviceParameters(code) {
  const response = await axios.get(`/api/monitor/devices/${encodeURIComponent(code)}/parameters`)
  return response.data
}
// 获取指定设备的实时告警
export async function getDeviceAlarms(code) {
  const response = await axios.get(`/api/monitor/devices/${encodeURIComponent(code)}/alarms`)
  return response.data
}
// 获取设备趋势数据
export async function getDeviceTrends(code) {
  const response = await axios.get(`/api/monitor/devices/${encodeURIComponent(code)}/trends`)
  return response.data
}
