// =====================================================
// 历史记录 - 采集数据记录
// =====================================================

export const collectionSummary = {
  todayPoints: 184320,
  successRate: 99.87,
  onlineChannels: 128,
  abnormalCount: 6,
}


export const collectionRecords = [
  {
    id: 1,

    time: '14:32:18',

    device: '2#主变压器',

    deviceCode: 'BD-002',

    values: {
      绕组温度: '74℃',
      油温: '48℃',
    },
  },
]


// =====================================================
// 历史记录 - 报警记录
// =====================================================

export const alarmSummary = {
  todayAlarmCount: 18,
  unhandledCount: 4,
  handledCount: 13,
  alarmRate: 2.6,
}


export const alarmRecords = [
  {
    id: 1,

    time: '14:32:18',

    device: '2#主变压器',

    deviceCode: 'BD-002',

    content:
      '油温78.2℃超过上限75℃，且持续30分钟',

    level: '紧急',

    status: '未处理',
  },

  {
    id: 2,

    time: '14:05:41',

    device: '2#电压互感器',

    deviceCode: 'PT-022',

    content:
      '介质损耗因数趋势异常，偏差 +12%',

    level: '重要',

    status: '未处理',
  },

  {
    id: 3,

    time: '13:48:07',

    device: '继电保护装置',

    deviceCode: 'PR-001',

    content:
      '通信中断3次，链路质量下降',

    level: '重要',

    status: '处理中',
  },

  {
    id: 4,

    time: '12:20:55',

    device: '1#避雷器',

    deviceCode: 'BL-031',

    content:
      '泄漏电流轻微上升，建议持续观察',

    level: '一般',

    status: '处理中',
  },

  {
    id: 5,

    time: '11:02:33',

    device: '2#主变压器',

    deviceCode: 'BD-002',

    content:
      '局放幅值12.3pC超过注意值10pC',

    level: '重要',

    status: '已处理',
  },

  {
    id: 6,

    time: '09:41:12',

    device: '冷却风机组',

    deviceCode: 'FAN-002',

    content:
      '风机#2电流偏低，疑似堵转',

    level: '一般',

    status: '已处理',
  },

  {
    id: 7,

    time: '22:15:07',

    device: '1#主变压器',

    deviceCode: 'BD-001',

    content:
      'A相电压短时波动 ±3%',

    level: '一般',

    status: '已处理',
  },
]
// =====================================================
// 历史记录 - 故障记录
// =====================================================

export const faultSummary = {
  totalFaultCount: 37,
  monthlyFaultCount: 3,
  averageHandleTime: 3.6,
  repeatedFaultCount: 1,
}


export const faultRecords = [
  {
    id: 470,

    device: '1#主变压器',

    deviceCode: 'BD-001',

    faultType:
      '变压器存在严重放电情况',

    startTime:
      '2026-09-20 08:12:03',

    recoverTime:
      '2026-09-20 10:05:41',

    duration:
      '53 min',

    status:
      '已恢复',
  },

  {
    id: 471,

    device: '1#主变压器',

    deviceCode: 'BD-001',

    faultType:
      '变压器可能存在过载或短路情况',

    startTime:
      '2026-09-18 16:40:22',

    recoverTime:
      '2026-09-18 18:12:05',

    duration:
      '1.5 h',

    status:
      '已恢复',
  },

  {
    id: 472,

    device: '1#主变压器',

    deviceCode: 'BD-001',

    faultType:
      '变压器有轻微异常，放电位置在超声波传感器1为球心半径为0.1米的区域内',

    startTime:
      '2026-09-15 08:30:00',

    recoverTime:
      '2026-09-15 14:20:00',

    duration:
      '5.8 h',

    status:
      '已恢复',
  },

  {
    id: 473,

    device: '1#主变压器',

    deviceCode: 'BD-001',

    faultType:
      '变压器可能存在过载或短路情况',

    startTime:
      '2026-09-24 13:58:41',

    recoverTime:
      '--',

    duration:
      '进行中',

    status:
      '处理中',
  },

  {
    id: 474,

    device: '1#主变压器',

    deviceCode: 'BD-001',

    faultType:
      '变压器放电较严重，放电位置在超声波传感器1为球心半径为0.1米的区域内',

    startTime:
      '2026-09-24 11:20:10',

    recoverTime:
      '--',

    duration:
      '待处理',

    status:
      '待处理',
  },
]