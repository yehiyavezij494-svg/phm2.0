// PHM 页面模拟数据
// 后续接 Java 后端后，可以逐步替换为接口数据

export const phmDeviceData = {
  'BD-001': {
    healthScore: 96.2,
    alarmCount: 1,
    predictedFaultCount: 0,
    maxRisk: 4,
    remainingLife: 8.6,
    reliability: 99.82,

    healthRadar: {
      indicators: [
        { name: '铁芯', max: 100 },
        { name: '套管', max: 100 },
        { name: '油箱', max: 100 },
        { name: '绕组', max: 100 },
      ],
      values: [96, 95, 97, 94],
    },

    faultProbability: [
      { name: '绕组过热', value: 8 },
      { name: '局部放电', value: 6 },
      { name: '铁芯过热', value: 5 },
      { name: '套管异常', value: 3 },
      { name: '绝缘劣化', value: 2 },
    ],

    warnings: [
      {
        level: '一般',
        text: '套管温度存在轻微波动，建议持续观察',
        time: '10:18:23',
      },
    ],
  },

  'BD-002': {
    healthScore: 83.8,
    alarmCount: 5,
    predictedFaultCount: 5,
    maxRisk: 16,
    remainingLife: 3.6,
    reliability: 96.42,

    healthRadar: {
      indicators: [
        { name: '铁芯', max: 100 },
        { name: '套管', max: 100 },
        { name: '油箱', max: 100 },
        { name: '绕组', max: 100 },
      ],
      values: [82, 91, 78, 84],
    },

    faultProbability: [
      { name: '绕组过热', value: 42 },
      { name: '局部放电', value: 23 },
      { name: '铁芯过热', value: 18 },
      { name: '套管异常', value: 11 },
      { name: '绝缘劣化', value: 6 },
    ],

    warnings: [
      {
        level: '紧急',
        text: '绕组温度持续偏高，请重点关注',
        time: '10:42:18',
      },
      {
        level: '重要',
        text: '绕组过热故障概率升高至42%',
        time: '10:25:36',
      },
      {
        level: '重要',
        text: '局部放电故障概率呈上升趋势',
        time: '10:08:21',
      },
      {
        level: '一般',
        text: '油箱健康评分低于设备平均水平',
        time: '09:46:07',
      },
      {
        level: '一般',
        text: '铁芯相关监测参数存在轻微波动',
        time: '09:31:42',
      },
    ],
  },

  'GT-011': {
    healthScore: 94.3,
    alarmCount: 0,
    predictedFaultCount: 0,
    maxRisk: 3,
    remainingLife: 9.1,
    reliability: 99.71,

    healthRadar: {
      indicators: [
        { name: '触头', max: 100 },
        { name: '机构', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '回路', max: 100 },
      ],
      values: [95, 93, 96, 93],
    },

    faultProbability: [
      { name: '触头过热', value: 7 },
      { name: '机构异常', value: 5 },
      { name: '绝缘劣化', value: 4 },
      { name: '拒动故障', value: 3 },
      { name: '回路异常', value: 2 },
    ],

    warnings: [],
  },

  'GT-012': {
    healthScore: 91.1,
    alarmCount: 1,
    predictedFaultCount: 1,
    maxRisk: 6,
    remainingLife: 7.8,
    reliability: 99.16,

    healthRadar: {
      indicators: [
        { name: '触头', max: 100 },
        { name: '机构', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '回路', max: 100 },
      ],
      values: [89, 92, 91, 90],
    },

    faultProbability: [
      { name: '触头过热', value: 18 },
      { name: '机构异常', value: 11 },
      { name: '回路异常', value: 8 },
      { name: '绝缘劣化', value: 6 },
      { name: '拒动故障', value: 3 },
    ],

    warnings: [
      {
        level: '一般',
        text: '触头温度较历史平均值略有上升',
        time: '10:11:26',
      },
    ],
  },

  'CT-021': {
    healthScore: 89.4,
    alarmCount: 1,
    predictedFaultCount: 1,
    maxRisk: 7,
    remainingLife: 6.9,
    reliability: 98.83,

    healthRadar: {
      indicators: [
        { name: '绝缘', max: 100 },
        { name: '绕组', max: 100 },
        { name: '误差', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [91, 88, 90, 89],
    },

    faultProbability: [
      { name: '绝缘劣化', value: 16 },
      { name: '绕组异常', value: 10 },
      { name: '误差超限', value: 8 },
      { name: '局部放电', value: 5 },
      { name: '温升异常', value: 4 },
    ],

    warnings: [
      {
        level: '一般',
        text: '绕组状态评分存在下降趋势',
        time: '09:58:14',
      },
    ],
  },

  'PT-022': {
    healthScore: 76.3,
    alarmCount: 4,
    predictedFaultCount: 3,
    maxRisk: 14,
    remainingLife: 4.2,
    reliability: 95.18,

    healthRadar: {
      indicators: [
        { name: '绝缘', max: 100 },
        { name: '绕组', max: 100 },
        { name: '误差', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [68, 79, 72, 86],
    },

    faultProbability: [
      { name: '绝缘劣化', value: 38 },
      { name: '误差超限', value: 27 },
      { name: '绕组异常', value: 19 },
      { name: '局部放电', value: 12 },
      { name: '温升异常', value: 8 },
    ],

    warnings: [
      {
        level: '紧急',
        text: '绝缘健康评分下降至68分',
        time: '10:34:55',
      },
      {
        level: '重要',
        text: '绝缘劣化故障概率达到38%',
        time: '10:20:37',
      },
      {
        level: '重要',
        text: '电压误差存在持续增大趋势',
        time: '10:02:18',
      },
      {
        level: '一般',
        text: '局部放电水平较历史均值上升',
        time: '09:40:06',
      },
    ],
  },

  'BL-031': {
    healthScore: 93.1,
    alarmCount: 0,
    predictedFaultCount: 0,
    maxRisk: 4,
    remainingLife: 8.4,
    reliability: 99.38,

    healthRadar: {
      indicators: [
        { name: '泄漏电流', max: 100 },
        { name: '阻性电流', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [94, 92, 95, 91],
    },

    faultProbability: [
      { name: '泄漏电流异常', value: 9 },
      { name: '阻性电流异常', value: 6 },
      { name: '绝缘老化', value: 5 },
      { name: '受潮异常', value: 3 },
      { name: '温升异常', value: 2 },
    ],

    warnings: [],
  },

  'PR-001': {
    healthScore: 58.6,
    alarmCount: 7,
    predictedFaultCount: 4,
    maxRisk: 19,
    remainingLife: 1.8,
    reliability: 88.73,

    healthRadar: {
      indicators: [
        { name: '采样', max: 100 },
        { name: '通信', max: 100 },
        { name: '自检', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [65, 48, 52, 70],
    },

    faultProbability: [
      { name: '通信异常', value: 56 },
      { name: '采样异常', value: 41 },
      { name: '自检异常', value: 35 },
      { name: '电源异常', value: 21 },
      { name: '定值异常', value: 14 },
    ],

    warnings: [
      {
        level: '紧急',
        text: '通信状态异常，数据链路稳定性下降',
        time: '10:51:28',
      },
      {
        level: '紧急',
        text: '通信异常故障概率达到56%',
        time: '10:43:12',
      },
      {
        level: '重要',
        text: '采样异常故障概率达到41%',
        time: '10:28:07',
      },
      {
        level: '重要',
        text: '装置自检状态异常',
        time: '10:14:36',
      },
      {
        level: '重要',
        text: 'CPU负载持续处于较高水平',
        time: '09:58:24',
      },
      {
        level: '一般',
        text: '装置温度存在持续上升趋势',
        time: '09:42:17',
      },
      {
        level: '一般',
        text: '采样通道波动幅度增大',
        time: '09:23:51',
      },
    ],
  },
}

export const defaultPhmData = {
  healthScore: 0,
  alarmCount: 0,
  predictedFaultCount: 0,
  maxRisk: 0,
  remainingLife: 0,
  reliability: 0,

  healthRadar: {
    indicators: [
      { name: '指标1', max: 100 },
      { name: '指标2', max: 100 },
      { name: '指标3', max: 100 },
      { name: '指标4', max: 100 },
    ],
    values: [0, 0, 0, 0],
  },

  faultProbability: [],

  warnings: [],
}
// =====================================================
// 超限报警页面数据
// =====================================================

export const overlimitAlarmRecords = [
  {
    point: '油温',
    device: '2#主变压器',
    value: 78,
    limit: 75,
    unit: '℃',
    overRate: 4,
    level: '紧急',
  },

  {
    point: '局放数值',
    device: '2#主变压器',
    value: 12,
    limit: 10,
    unit: 'pC',
    overRate: 20,
    level: '重要',
  },

  {
    point: '介质损耗',
    device: '2#电压互感器',
    value: 0.62,
    limit: 0.5,
    unit: '%',
    overRate: 24,
    level: '重要',
  },

  {
    point: 'B相电流',
    device: '2#主变压器',
    value: 328,
    limit: 320,
    unit: 'A',
    overRate: 3,
    level: '一般',
  },

  {
    point: '通信中断',
    device: '继电保护装置',
    value: 3,
    limit: 2,
    unit: '次',
    overRate: 50,
    level: '一般',
  },
]

export const overlimitAlarmUpdatedAt = '17:20:54'