import { computed, ref, unref, watch } from 'vue'

// =====================================================
// 设备列表
// =====================================================

export const deviceGroups = [
  {
    name: '牵引变压器',
    image: '/images/devices/transformer.webp',
    devices: [
      { name: '1#主变压器', code: 'BD-001', score: 70, status: '预警' },
      { name: '2#主变压器', code: 'BD-002', score: 75, status: '预警' },
    ],
  },
  {
    name: '高压开关',
    image: '/images/devices/switch.webp',
    devices: [
      { name: '1#隔离开关', code: 'GT-011', score: 94, status: '正常' },
      { name: '2#隔离开关', code: 'GT-012', score: 91, status: '正常' },
    ],
  },
  {
    name: '互感器',
    image: '/images/devices/instrument-transformer.webp',
    devices: [
      { name: '1#电流互感器', code: 'CT-021', score: 89, status: '正常' },
      { name: '2#电压互感器', code: 'PT-022', score: 76, status: '预警' },
    ],
  },
  {
    name: '避雷器',
    image: '/images/devices/arrester.webp',
    devices: [{ name: '1#避雷器', code: 'BL-031', score: 93, status: '正常' }],
  },
  {
    name: '二次设备',
    image: '/images/devices/relay-protection.png',
    devices: [{ name: '继电保护装置', code: 'PR-001', score: 58, status: '异常' }],
  },
]

// =====================================================
// 不同设备对应实时监测参数
// =====================================================

export const deviceMonitorData = {
  'BD-001': {
    leftPanel: {
      title: '实时检测 · 电气参数',
      items: [
        { name: 'A相电压', value: '27.6', unit: 'kV', percent: 88, warn: false },
        { name: 'B相电压', value: '27.4', unit: 'kV', percent: 86, warn: false },
        { name: 'C相电压', value: '27.5', unit: 'kV', percent: 87, warn: false },
        { name: 'A相电流', value: '301', unit: 'A', percent: 76, warn: false },
        { name: 'B相电流', value: '298', unit: 'A', percent: 74, warn: false },
        { name: 'C相电流', value: '305', unit: 'A', percent: 78, warn: false },
        { name: '频率', value: '50.01', unit: 'Hz', percent: 90, warn: false },
        { name: '功率因数', value: '0.99', unit: '', percent: 95, warn: false },
      ],
    },
    rightPanel: {
      title: '实时检测 · 状态参数',
      items: [
        { name: '高频局放1', value: '42', unit: 'pC', percent: 52, warn: false },
        { name: '高频局放2', value: '46', unit: 'pC', percent: 55, warn: false },
        { name: '超声1', value: '3', unit: 'dB', percent: 41, warn: false },
        { name: '超声2', value: '4', unit: 'dB', percent: 43, warn: false },
        { name: '铁芯接地', value: '6', unit: 'mA', percent: 40, warn: false },
        { name: 'C2H2', value: '0.08', unit: 'μL/L', percent: 34, warn: false },
        { name: 'H2', value: '0.05', unit: 'μL/L', percent: 31, warn: false },
      ],
    },
  },

  'BD-002': {
    leftPanel: {
      title: '实时检测 · 电气参数',
      items: [
        { name: 'A相电压', value: '27.5', unit: 'kV', percent: 88, warn: false },
        { name: 'B相电压', value: '27.3', unit: 'kV', percent: 86, warn: false },
        { name: 'C相电压', value: '27.6', unit: 'kV', percent: 90, warn: false },
        { name: 'A相电流', value: '320', unit: 'A', percent: 82, warn: false },
        { name: 'B相电流', value: '328', unit: 'A', percent: 92, warn: true },
        { name: 'C相电流', value: '315', unit: 'A', percent: 80, warn: false },
        { name: '频率', value: '50.02', unit: 'Hz', percent: 90, warn: false },
        { name: '功率因数', value: '0.98', unit: '', percent: 94, warn: false },
      ],
    },
    rightPanel: {
      title: '实时检测 · 状态参数',
      items: [
        { name: '高频局放1', value: '78', unit: 'pC', percent: 84, warn: true },
        { name: '高频局放2', value: '85', unit: 'pC', percent: 88, warn: true },
        { name: '超声1', value: '8', unit: 'dB', percent: 64, warn: false },
        { name: '超声2', value: '4', unit: 'dB', percent: 58, warn: false },
        { name: '铁芯接地', value: '12', unit: 'mA', percent: 78, warn: true },
        { name: 'C2H2', value: '0.2', unit: 'μL/L', percent: 84, warn: false },
        { name: 'H2', value: '0.1', unit: 'μL/L', percent: 82, warn: false },
      ],
    },
  },

  'GT-011': {
    leftPanel: {
      title: '实时检测 · 电气参数',
      items: [
        { name: 'A相电流', value: '286', unit: 'A', percent: 71, warn: false },
        { name: 'B相电流', value: '291', unit: 'A', percent: 73, warn: false },
        { name: 'C相电流', value: '284', unit: 'A', percent: 70, warn: false },
        { name: '回路电阻', value: '42', unit: 'μΩ', percent: 53, warn: false },
      ],
    },
    rightPanel: {
      title: '实时检测 · 开关状态',
      items: [
        { name: '触头温度', value: '39', unit: '℃', percent: 49, warn: false },
        { name: '机构温度', value: '36', unit: '℃', percent: 45, warn: false },
        { name: '操作次数', value: '126', unit: '次', percent: 42, warn: false },
        { name: '机械状态', value: '正常', unit: '', percent: 90, warn: false },
      ],
    },
  },

  'GT-012': {
    leftPanel: {
      title: '实时检测 · 电气参数',
      items: [
        { name: 'A相电流', value: '295', unit: 'A', percent: 74, warn: false },
        { name: 'B相电流', value: '299', unit: 'A', percent: 75, warn: false },
        { name: 'C相电流', value: '292', unit: 'A', percent: 73, warn: false },
        { name: '回路电阻', value: '45', unit: 'μΩ', percent: 56, warn: false },
      ],
    },
    rightPanel: {
      title: '实时检测 · 开关状态',
      items: [
        { name: '触头温度', value: '41', unit: '℃', percent: 51, warn: false },
        { name: '机构温度', value: '38', unit: '℃', percent: 47, warn: false },
        { name: '操作次数', value: '153', unit: '次', percent: 48, warn: false },
        { name: '机械状态', value: '正常', unit: '', percent: 91, warn: false },
      ],
    },
  },

  'CT-021': {
    leftPanel: {
      title: '实时检测 · 电气参数',
      items: [
        { name: '一次电流', value: '312', unit: 'A', percent: 78, warn: false },
        { name: '二次电流', value: '4.96', unit: 'A', percent: 82, warn: false },
        { name: '变比误差', value: '0.18', unit: '%', percent: 38, warn: false },
        { name: '相位误差', value: '3.2', unit: 'min', percent: 44, warn: false },
      ],
    },
    rightPanel: {
      title: '实时检测 · 绝缘状态',
      items: [
        { name: '介质损耗', value: '0.38', unit: '%', percent: 47, warn: false },
        { name: '绝缘电阻', value: '860', unit: 'MΩ', percent: 86, warn: false },
        { name: '局放量', value: '31', unit: 'pC', percent: 42, warn: false },
        { name: '本体温度', value: '37', unit: '℃', percent: 46, warn: false },
      ],
    },
  },

  'PT-022': {
    leftPanel: {
      title: '实时检测 · 电气参数',
      items: [
        { name: '一次电压', value: '27.4', unit: 'kV', percent: 87, warn: false },
        { name: '二次电压', value: '98.6', unit: 'V', percent: 79, warn: false },
        { name: '电压误差', value: '0.42', unit: '%', percent: 67, warn: true },
        { name: '相位误差', value: '5.4', unit: 'min', percent: 68, warn: true },
      ],
    },
    rightPanel: {
      title: '实时检测 · 绝缘状态',
      items: [
        { name: '介质损耗', value: '0.68', unit: '%', percent: 76, warn: true },
        { name: '绝缘电阻', value: '690', unit: 'MΩ', percent: 69, warn: false },
        { name: '局放量', value: '67', unit: 'pC', percent: 75, warn: true },
        { name: '本体温度', value: '44', unit: '℃', percent: 55, warn: false },
      ],
    },
  },

  'BL-031': {
    leftPanel: {
      title: '实时检测 · 电气参数',
      items: [
        { name: '泄漏电流', value: '0.62', unit: 'mA', percent: 51, warn: false },
        { name: '阻性电流', value: '0.18', unit: 'mA', percent: 45, warn: false },
        { name: '运行电压', value: '27.5', unit: 'kV', percent: 88, warn: false },
      ],
    },
    rightPanel: {
      title: '实时检测 · 运行状态',
      items: [
        { name: '动作次数', value: '8', unit: '次', percent: 40, warn: false },
        { name: '本体温度', value: '35', unit: '℃', percent: 44, warn: false },
        { name: '绝缘状态', value: '正常', unit: '', percent: 92, warn: false },
      ],
    },
  },

  'PR-001': {
    leftPanel: {
      title: '实时检测 · 保护参数',
      items: [
        { name: '采样电压', value: '26.8', unit: 'kV', percent: 71, warn: true },
        { name: '采样电流', value: '342', unit: 'A', percent: 85, warn: true },
        { name: '频率', value: '49.82', unit: 'Hz', percent: 76, warn: true },
        { name: '零序电流', value: '18', unit: 'A', percent: 88, warn: true },
      ],
    },
    rightPanel: {
      title: '实时检测 · 装置状态',
      items: [
        { name: '通信状态', value: '异常', unit: '', percent: 91, warn: true, status: '异常' },
        { name: 'CPU负载', value: '86', unit: '%', percent: 86, warn: true },
        { name: '装置温度', value: '62', unit: '℃', percent: 82, warn: true, status: '异常' },
        { name: '自检状态', value: '告警', unit: '', percent: 95, warn: true, status: '异常' },
      ],
    },
  },
}

// =====================================================
// 实时告警
// 目前暂时没有按照设备区分
// =====================================================

export const alarms = [
  {
    level: '紧急',
    text: '油温连续30分钟超过阈值85℃',
    time: '14:32:18',
  },
  {
    level: '重要',
    text: '介质损耗因数趋势异常，偏差 +12%',
    time: '14:05:41',
  },
  {
    level: '重要',
    text: '高倍中频3次，链路质量下降',
    time: '13:48:07',
  },
  {
    level: '一般',
    text: '泄漏电流轻微上升，建议持续观察',
    time: '12:20:55',
  },
]

// =====================================================
// 趋势图时间配置
// =====================================================

const TREND_WINDOW_HOURS = 24
const POINT_INTERVAL_MINUTES = 30
const REFRESH_MS = 1000
const POINT_INTERVAL_MS = POINT_INTERVAL_MINUTES * 60 * 1000
const TREND_WINDOW_MS = TREND_WINDOW_HOURS * 60 * 60 * 1000

// =====================================================
// 每台设备的趋势类型 + 固定静态数据

// =====================================================

const deviceTrendProfiles = {
  'BD-001': {
    type: 'transformer',
    health: [70, 71, 70, 69, 70, 71, 72, 71],
    secondary: [40, 42, 44, 43, 46, 45, 42, 41],
  },

  'BD-002': {
    type: 'transformer',
    health: [75, 76, 75, 74, 73, 74, 75, 74],
    secondary: [72, 75, 78, 80, 76, 82, 79, 78],
  },

  'GT-011': {
    type: 'switch',
    health: [94, 94, 93, 94, 95, 94, 94, 93],
    secondary: [38, 39, 40, 39, 41, 40, 39, 38],
  },

  'GT-012': {
    type: 'switch',
    health: [91, 92, 91, 90, 91, 92, 91, 91],
    secondary: [40, 41, 42, 41, 43, 42, 41, 40],
  },

  'CT-021': {
    type: 'ct',
    health: [89, 89, 90, 89, 88, 89, 90, 89],
    secondary: [0.34, 0.36, 0.38, 0.37, 0.39, 0.38, 0.36, 0.35],
  },

  'PT-022': {
    type: 'pt',
    health: [76, 77, 76, 75, 76, 75, 74, 75],
    secondary: [0.62, 0.65, 0.68, 0.66, 0.7, 0.69, 0.67, 0.68],
  },

  'BL-031': {
    type: 'arrester',
    health: [93, 94, 93, 92, 93, 94, 93, 93],
    secondary: [0.56, 0.58, 0.6, 0.62, 0.61, 0.6, 0.59, 0.58],
  },

  'PR-001': {
    type: 'relay',
    health: [58, 59, 58, 57, 58, 56, 57, 58],
    secondary: [78, 82, 84, 86, 83, 88, 85, 86],
  },
}

// =====================================================
// 第二张趋势图配置
// 不同设备类型使用不同标题、单位、阈值和Y轴
// =====================================================

const secondaryTrendTemplates = {
  transformer: {
    key: 'secondary',
    title: '局放1趋势',
    subtitle: '近24小时',
    seriesName: '高频局放1',
    unit: 'pC',
    windowHours: 24,
    threshold: 80,
    yMin: 0,
    yMax: 120,
  },

  switch: {
    key: 'secondary',
    title: '触头温度趋势',
    subtitle: '近24小时',
    seriesName: '触头温度',
    unit: '℃',
    windowHours: 24,
    threshold: 70,
    yMin: 0,
    yMax: 100,
  },

  ct: {
    key: 'secondary',
    title: '介质损耗趋势',
    subtitle: '近24小时',
    seriesName: '介质损耗',
    unit: '%',
    windowHours: 24,
    threshold: 0.5,
    yMin: 0,
    yMax: 1,
  },

  pt: {
    key: 'secondary',
    title: '介质损耗趋势',
    subtitle: '近24小时',
    seriesName: '介质损耗',
    unit: '%',
    windowHours: 24,
    threshold: 0.5,
    yMin: 0,
    yMax: 1,
  },

  arrester: {
    key: 'secondary',
    title: '泄漏电流趋势',
    subtitle: '近24小时',
    seriesName: '泄漏电流',
    unit: 'mA',
    windowHours: 24,
    threshold: 1,
    yMin: 0,
    yMax: 1.5,
  },

  relay: {
    key: 'secondary',
    title: 'CPU负载趋势',
    subtitle: '近24小时',
    seriesName: 'CPU负载',
    unit: '%',
    windowHours: 24,
    threshold: 80,
    yMin: 0,
    yMax: 100,
  },
}

// =====================================================
// 根据设备编号取得趋势图配置
// =====================================================

export function getDeviceTrendConfigs(deviceCode) {
  if (!deviceCode) return []

  const profile = deviceTrendProfiles[deviceCode]
  if (!profile) return []

  const secondaryTemplate = secondaryTrendTemplates[profile.type]

  if (!secondaryTemplate) return []

  const healthConfig = {
    key: 'health',
    title: '设备健康度趋势',
    subtitle: '近24小时',
    seriesName: '综合健康度',
    unit: '%',
    windowHours: 24,
    threshold: 80,
    yMin: 50,
    yMax: 100,
    values: profile.health,
  }

  const secondaryConfig = {
    ...secondaryTemplate,
    values: profile.secondary,
  }

  return [healthConfig, secondaryConfig]
}

// =====================================================
// 根据固定数组创建最近24小时的数据
// =====================================================

function createStaticSeries(values, endTime) {
  const result = []

  const pointCount = (TREND_WINDOW_HOURS * 60) / POINT_INTERVAL_MINUTES + 1

  for (let i = 0; i < pointCount; i++) {
    const time = endTime - (pointCount - 1 - i) * POINT_INTERVAL_MS

    const value = values[i % values.length]

    result.push([time, value])
  }

  return result
}

// =====================================================
// 固定数据循环趋势
// =====================================================

export function useRealtimeTrendMock(selectedDeviceCode) {
  const realtimeHealthData = ref([])
  const realtimeSecondaryData = ref([])

  let simulatedNow = Date.now()
  let trendTimer = null

  let healthIndex = 0
  let secondaryIndex = 0

  const currentDeviceCode = computed(() => {
    return unref(selectedDeviceCode) || ''
  })

  const currentTrendConfigs = computed(() => {
    return getDeviceTrendConfigs(currentDeviceCode.value)
  })

  const trendCharts = computed(() => {
    return currentTrendConfigs.value.map((config, index) => ({
      key: config.key,
      title: config.title,
      subtitle: config.subtitle,
      seriesName: config.seriesName,
      unit: config.unit,
      windowHours: config.windowHours,
      threshold: config.threshold,
      yMin: config.yMin,
      yMax: config.yMax,
      data: index === 0 ? realtimeHealthData.value : realtimeSecondaryData.value,
    }))
  })

  // ===================================================
  // 初始化最近24小时固定趋势
  // ===================================================

  function initRealtimeTrend() {
    const configs = currentTrendConfigs.value

    if (configs.length < 2) {
      realtimeHealthData.value = []
      realtimeSecondaryData.value = []
      return
    }

    simulatedNow = Date.now()

    realtimeHealthData.value = createStaticSeries(configs[0].values, simulatedNow)

    realtimeSecondaryData.value = createStaticSeries(configs[1].values, simulatedNow)

    const pointCount = (TREND_WINDOW_HOURS * 60) / POINT_INTERVAL_MINUTES + 1

    healthIndex = pointCount % configs[0].values.length

    secondaryIndex = pointCount % configs[1].values.length
  }

  // ===================================================
  // 每次加入固定数组里的下一个值
  // ===================================================

  function pushRealtimeTrend() {
    const configs = currentTrendConfigs.value

    if (configs.length < 2) return

    simulatedNow += POINT_INTERVAL_MS

    const healthValues = configs[0].values

    const secondaryValues = configs[1].values

    const healthValue = healthValues[healthIndex]

    const secondaryValue = secondaryValues[secondaryIndex]

    healthIndex = (healthIndex + 1) % healthValues.length

    secondaryIndex = (secondaryIndex + 1) % secondaryValues.length

    realtimeHealthData.value = [...realtimeHealthData.value, [simulatedNow, healthValue]]

    realtimeSecondaryData.value = [...realtimeSecondaryData.value, [simulatedNow, secondaryValue]]

    const cutoffTime = simulatedNow - TREND_WINDOW_MS

    realtimeHealthData.value = realtimeHealthData.value.filter(([time]) => time >= cutoffTime)

    realtimeSecondaryData.value = realtimeSecondaryData.value.filter(([time]) => time >= cutoffTime)
  }

  // ===================================================
  // 开始循环
  // ===================================================

  function startTrendMock() {
    stopTrendMock()
    initRealtimeTrend()

    trendTimer = setInterval(pushRealtimeTrend, REFRESH_MS)
  }

  // ===================================================
  // 停止循环
  // ===================================================

  function stopTrendMock() {
    if (!trendTimer) return

    clearInterval(trendTimer)

    trendTimer = null
  }

  // ===================================================
  // 切换设备后重新读取该设备静态数据
  // ===================================================

  watch(currentDeviceCode, () => {
    if (trendTimer) {
      initRealtimeTrend()
    }
  })

  return {
    trendCharts,
    realtimeHealthData,
    realtimeSecondaryData,

    // 兼容你之前的变量名
    realtimePartialData: realtimeSecondaryData,

    startTrendMock,
    stopTrendMock,
  }
}
