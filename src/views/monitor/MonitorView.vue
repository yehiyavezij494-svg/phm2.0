<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AlarmPanel from '@/components/monitor/AlarmPanel.vue'
import DeviceSidebar from '@/components/monitor/DeviceSidebar.vue'
import ParameterPanel from '@/components/monitor/ParameterPanel.vue'
import TrendChart from '@/components/monitor/TrendChart.vue'
import { deviceGroups as mockDeviceGroups } from '@/mocks/monitor'
import {
  getDeviceGroups,
  getDeviceParameters,
  getDeviceAlarms,
  getDeviceTrends,
} from '@/api/monitor'

// 已配置接口的四台设备
const configuredCodes = new Set(['BD-001', 'BD-002', 'GT-011', 'GT-012'])

// 设备列表
const deviceGroups = ref([])
const deviceImages = Object.fromEntries(mockDeviceGroups.map((group) => [group.name, group.image]))
const selectedDeviceCode = ref('')
const deviceLoadError = ref('')

async function loadDeviceGroups() {
  try {
    deviceLoadError.value = ''
    const groups = await getDeviceGroups()
    if (!Array.isArray(groups)) throw new Error('设备列表接口返回格式错误')

    deviceGroups.value = groups.map((group) => ({
      ...group,
      image: group.image || deviceImages[group.name] || '',
      devices: Array.isArray(group.devices) ? group.devices : [],
    }))

    const firstGroup = deviceGroups.value.find((group) => group.devices.length > 0)
    selectedDeviceCode.value = firstGroup?.devices[0]?.code ?? ''
  } catch (error) {
    deviceGroups.value = []
    deviceLoadError.value = '设备列表加载失败，请检查 Apifox Mock 服务'
    console.error('获取设备列表失败：', error)
  }
}

// 当前设备信息
const currentDevice = computed(() => {
  for (const group of deviceGroups.value) {
    const device = group.devices.find((item) => item.code === selectedDeviceCode.value)
    if (device) {
      return {
        ...device,
        type: group.name,
        image: device.image || group.image || '',
      }
    }
  }
  return { name: '', code: '', score: 0, status: '', type: '', image: '' }
})

// 实时监测参数
const apiMonitorData = ref(null)
const PARAMETER_REFRESH_MS = 5000
let parameterTimer = null
let parameterRequestId = 0

const currentMonitorData = computed(() => {
  return (
    apiMonitorData.value ?? {
      leftPanel: { title: '实时检测 · 参数', items: [] },
      rightPanel: { title: '实时检测 · 状态', items: [] },
    }
  )
})

async function loadDeviceParameters() {
  const code = selectedDeviceCode.value
  const requestId = ++parameterRequestId

  if (!configuredCodes.has(code)) {
    apiMonitorData.value = null
    return
  }

  try {
    const data = await getDeviceParameters(code)
    if (requestId !== parameterRequestId || code !== selectedDeviceCode.value) return

    if (
      !data?.leftPanel ||
      !Array.isArray(data.leftPanel.items) ||
      !data?.rightPanel ||
      !Array.isArray(data.rightPanel.items)
    ) {
      throw new Error('监测参数接口返回格式错误')
    }

    apiMonitorData.value = data
  } catch (error) {
    if (requestId !== parameterRequestId) return
    apiMonitorData.value = null
    console.error(`获取 ${code} 监测参数失败：`, error)
  }
}

// 实时告警
const currentAlarms = ref([])
const ALARM_REFRESH_MS = 15000
let alarmTimer = null
let alarmRequestId = 0

function formatAlarmTime(time) {
  const date = new Date(time)
  return Number.isNaN(date.getTime())
    ? String(time ?? '')
    : date.toLocaleString('zh-CN', { hour12: false })
}

async function loadDeviceAlarms() {
  const code = selectedDeviceCode.value
  const requestId = ++alarmRequestId

  if (!configuredCodes.has(code)) {
    currentAlarms.value = []
    return
  }

  try {
    const items = await getDeviceAlarms(code)
    if (requestId !== alarmRequestId || code !== selectedDeviceCode.value) return

    if (!Array.isArray(items) || items.some((item) => item.deviceCode !== code)) {
      throw new Error('告警接口返回格式错误或设备编号不匹配')
    }

    currentAlarms.value = items.map((item) => ({
      ...item,
      time: formatAlarmTime(item.time),
    }))
  } catch (error) {
    if (requestId !== alarmRequestId) return
    currentAlarms.value = []
    console.error(`获取 ${code} 实时告警失败：`, error)
  }
}

// 趋势图：完全使用 Apifox 接口数据
const trendCharts = ref([])
const TREND_REFRESH_MS = 10000
let trendTimer = null
let trendRequestId = 0

// 将 collectTime + value 转换为 ECharts 使用的格式
function formatTrendData(items) {
  if (!Array.isArray(items)) return []

  const points = new Map()

  for (const item of items) {
    const time = Date.parse(item.collectTime)
    const value = Number(item.value)
    if (Number.isFinite(time) && Number.isFinite(value)) {
      points.set(time, value)
    }
  }

  return Array.from(points, ([time, value]) => [time, value]).sort((a, b) => a[0] - b[0])
}

async function loadTrends() {
  const code = selectedDeviceCode.value
  const requestId = ++trendRequestId

  if (!configuredCodes.has(code)) {
    trendCharts.value = []
    return
  }

  try {
    const result = await getDeviceTrends(code)
    if (requestId !== trendRequestId || code !== selectedDeviceCode.value) return

    if (result?.deviceCode !== code || !Array.isArray(result.charts)) {
      throw new Error('趋势接口返回格式错误或设备编号不匹配')
    }

    const charts = result.charts
      .filter((chart) => chart && ['health', 'secondary'].includes(chart.key))
      .sort((a, b) => (a.key === 'health' ? -1 : 1))
      .map((chart) => ({
        ...chart,
        data: formatTrendData(chart.data),
      }))

    trendCharts.value = charts.slice(0, 2)
  } catch (error) {
    if (requestId !== trendRequestId) return
    trendCharts.value = []
    console.error(`获取 ${code} 趋势数据失败：`, error)
  }
}

// 切换设备时，刷新对应设备的所有数据
watch(selectedDeviceCode, () => {
  ++parameterRequestId
  ++alarmRequestId
  ++trendRequestId

  apiMonitorData.value = null
  currentAlarms.value = []
  trendCharts.value = []

  if (!selectedDeviceCode.value) return

  loadDeviceParameters()
  loadDeviceAlarms()
  loadTrends()
})

function handleSelectDevice(device) {
  selectedDeviceCode.value = device.code
}

// 系统提示
const systemMessage = computed(() => {
  if (deviceLoadError.value) return deviceLoadError.value

  const { name, status } = currentDevice.value
  if (status === '正常') return `${name}运行状态正常，当前未发现明显异常。`
  if (status === '预警') return `${name}当前处于预警状态，请关注相关监测参数变化。`
  if (status === '异常') return `${name}当前处于异常状态，请及时检查设备及相关监测参数。`
  return '系统运行中。'
})

// 系统时间
const currentTime = ref('')
const currentDate = ref('')
let clockTimer = null

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })

  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  currentDate.value = `${year}-${month}-${day} ${weeks[now.getDay()]}`
}

// 页面加载
onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)

  parameterTimer = setInterval(() => {
    if (configuredCodes.has(selectedDeviceCode.value)) loadDeviceParameters()
  }, PARAMETER_REFRESH_MS)

  alarmTimer = setInterval(() => {
    if (configuredCodes.has(selectedDeviceCode.value)) loadDeviceAlarms()
  }, ALARM_REFRESH_MS)

  trendTimer = setInterval(() => {
    if (configuredCodes.has(selectedDeviceCode.value)) loadTrends()
  }, TREND_REFRESH_MS)

  loadDeviceGroups()
})

// 页面销毁
onBeforeUnmount(() => {
  ++parameterRequestId
  ++alarmRequestId
  ++trendRequestId

  clearInterval(clockTimer)
  clearInterval(parameterTimer)
  clearInterval(alarmTimer)
  clearInterval(trendTimer)
})
</script>

<template>
  <div class="monitor-page">
    <main class="dashboard">
      <!-- 左侧设备列表 -->
      <DeviceSidebar
        :device-groups="deviceGroups"
        :selected-device-code="selectedDeviceCode"
        @select-device="handleSelectDevice"
      />

      <section class="main-content">
        <!-- 上部设备监测 -->
        <section class="main-monitor panel">
          <div class="monitor-title">
            <div class="device-title">
              <strong>{{ currentDevice.name }}</strong>
              <span>{{ currentDevice.code }}</span>
            </div>
            <div class="runtime">
              运行状态
              <span
                :class="{
                  statusNormal: currentDevice.status === '正常',
                  statusWarning: currentDevice.status === '预警',
                  statusDanger: currentDevice.status === '异常',
                }"
                >{{ currentDevice.status }}</span
              >
            </div>
          </div>

          <div class="monitor-body">
            <!-- 左侧实时参数 -->
            <ParameterPanel
              :title="currentMonitorData.leftPanel.title"
              :items="currentMonitorData.leftPanel.items"
            />

            <!-- 中间设备图片 -->
            <div class="device-image-area">
              <div class="grid-bg"></div>
              <img
                v-if="currentDevice.image"
                :key="currentDevice.image"
                :src="currentDevice.image"
                :alt="currentDevice.name"
                class="device-image"
                draggable="false"
              />
            </div>

            <!-- 右侧实时参数 -->
            <ParameterPanel
              :title="currentMonitorData.rightPanel.title"
              :items="currentMonitorData.rightPanel.items"
            />
          </div>
        </section>

        <!-- 底部趋势图和实时告警 -->
        <section class="bottom-panels">
          <TrendChart
            v-for="chart in trendCharts"
            :key="`${selectedDeviceCode}-${chart.key}`"
            :title="chart.title"
            :subtitle="chart.subtitle"
            :series-name="chart.seriesName"
            :unit="chart.unit"
            :data="chart.data"
            :window-hours="chart.windowHours"
            :threshold="chart.threshold"
            :y-min="chart.yMin"
            :y-max="chart.yMax"
          />

          <!-- 未配置趋势接口的设备，保留两张图的位置 -->
          <div
            v-for="index in Math.max(0, 2 - trendCharts.length)"
            :key="`empty-${index}`"
            class="trend-empty"
          >
            <div class="trend-empty-title">设备趋势</div>
            <div class="trend-empty-text">暂无趋势数据</div>
          </div>

          <!-- 当前设备的实时告警 -->
          <AlarmPanel :alarms="currentAlarms" />
        </section>
      </section>
    </main>

    <!-- 底部状态栏 -->
    <footer class="footer-bar">
      <div class="system-message">
        <span class="message-icon">🔔</span>
        系统提示：{{ systemMessage }}
      </div>
      <div class="footer-time">
        ◷ {{ currentTime }}
        <span>{{ currentDate }}</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 页面 */
.monitor-page {
  width: 100%;
  min-width: 1200px;
  min-height: calc(100vh - 64px);
  padding: 10px 12px;
  box-sizing: border-box;
  overflow-x: hidden;
  color: #d9f5ff;
  background:
    linear-gradient(rgba(4, 34, 62, 0.88), rgba(1, 18, 34, 0.97)),
    linear-gradient(90deg, rgba(0, 204, 255, 0.04) 1px, transparent 1px),
    linear-gradient(rgba(0, 204, 255, 0.04) 1px, transparent 1px);
  background-color: #03182b;
  background-size:
    auto,
    24px 24px,
    24px 24px;
  font-family: 'Source Han Sans SC', 'Noto Sans SC', sans-serif;
}

/* 页面主体 */
.dashboard {
  width: 100%;
  min-height: 720px;
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
  box-sizing: border-box;
}

/* 右侧布局 */
.main-content {
  min-width: 0;
  min-height: 720px;
  display: grid;
  grid-template-rows: minmax(0, 1fr) 200px;
  gap: 10px;
}

/* 公共面板 */
.panel {
  min-width: 0;
  min-height: 0;
  background: rgba(1, 29, 52, 0.88);
  border: 1px solid #075786;
  box-shadow: inset 0 0 24px rgba(0, 137, 202, 0.05);
}

/* 上部监测 */
.main-monitor {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/* 设备标题 */
.monitor-title {
  height: 40px;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #09558e, #07345c);
  border-bottom: 1px solid rgba(26, 133, 190, 0.5);
}

.device-title {
  display: flex;
  align-items: center;
}

.device-title strong {
  color: #e8faff;
  font-size: 16px;
}

.device-title span {
  margin-left: 8px;
  color: #5795ba;
  font-size: 11px;
}

/* 运行状态 */
.runtime {
  display: flex;
  align-items: center;
  color: #5899bb;
  font-size: 11px;
}

.runtime span {
  margin-left: 8px;
  padding: 3px 9px;
  border: 1px solid;
}

.runtime .statusNormal {
  color: #21edc0;
  border-color: #16997d;
  background: rgba(0, 161, 123, 0.12);
}

.runtime .statusWarning {
  color: #ffbb19;
  border-color: #b67e00;
  background: rgba(161, 99, 0, 0.15);
}

.runtime .statusDanger {
  color: #ff607d;
  border-color: #ba3956;
  background: rgba(189, 38, 67, 0.14);
}

/* 参数 + 图片 + 参数 */
.monitor-body {
  height: calc(100% - 40px);
  min-height: 0;
  padding: 8px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 245px minmax(360px, 1fr) 245px;
  gap: 8px;
  overflow: hidden;
}

/* 中间设备图片 */
.device-image-area {
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #052f54, #041f39);
  border: 1px solid #064a78;
}

.grid-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(27, 115, 172, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(27, 115, 172, 0.09) 1px, transparent 1px);
  background-size: 22px 22px;
}

.device-image {
  position: relative;
  z-index: 2;
  width: 82%;
  height: 82%;
  object-fit: contain;
  object-position: center;
  user-select: none;
}

/* 底部三个面板 */
.bottom-panels {
  min-width: 0;
  min-height: 0;
  height: 200px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

/* 没有趋势数据时的占位面板 */
.trend-empty {
  min-width: 0;
  height: 200px;
  background: rgba(1, 29, 52, 0.88);
  border: 1px solid #075786;
}

.trend-empty-title {
  height: 32px;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  color: #e0f8ff;
  font-size: 12px;
  background: linear-gradient(90deg, #075184, #063457);
  border-bottom: 1px solid #075786;
}

.trend-empty-text {
  height: calc(100% - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6ca0bd;
  font-size: 12px;
}

/* 底部状态栏 */
.footer-bar {
  width: 100%;
  min-height: 34px;
  margin-top: 8px;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6da3c4;
  font-size: 11px;
  background: rgba(1, 36, 62, 0.95);
  border: 1px solid #064d79;
}

.system-message {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.message-icon {
  margin-right: 3px;
}

.footer-time {
  flex-shrink: 0;
  margin-left: 20px;
  color: #10d7ff;
  font-size: 15px;
  font-weight: bold;
}

.footer-time span {
  margin-left: 10px;
  color: #6a9ab6;
  font-size: 11px;
  font-weight: normal;
}

/* 中等屏幕 */
@media (max-width: 1500px) {
  .dashboard {
    grid-template-columns: 215px minmax(0, 1fr);
  }

  .monitor-body {
    grid-template-columns: 220px minmax(300px, 1fr) 220px;
  }
}
</style>
