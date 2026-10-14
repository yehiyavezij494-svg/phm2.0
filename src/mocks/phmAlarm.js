// PHM - 超限报警页面模拟数据
// 后续接 Java 后端后，可以直接替换成接口数据

export const overlimitAlarmRecords = [
  {
    point: '油温',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    value: 78,
    limit: 75,
    unit: '℃',
    overRate: 4,
    level: '紧急',
  },

  {
    point: '局放数值',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    value: 12,
    limit: 10,
    unit: 'pC',
    overRate: 20,
    level: '重要',
  },

  {
    point: '介质损耗',
    device: '2#电压互感器',
    deviceCode: 'PT-022',
    value: 0.62,
    limit: 0.5,
    unit: '%',
    overRate: 24,
    level: '重要',
  },

  {
    point: 'B相电流',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    value: 328,
    limit: 320,
    unit: 'A',
    overRate: 3,
    level: '一般',
  },

  {
    point: '通信中断',
    device: '继电保护装置',
    deviceCode: 'PR-001',
    value: 3,
    limit: 2,
    unit: '次',
    overRate: 50,
    level: '一般',
  },
]

export const overlimitAlarmUpdatedAt = '17:20:54'