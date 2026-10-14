// PHM - 故障诊断页面模拟数据
// 后续接 Java 后端时，可以直接替换为接口数据

export const phmDiagnosisData = {
  'BD-001': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '绕组过热',
        value: 12,
      },
      {
        name: '绝缘老化',
        value: 8,
      },
      {
        name: '局部放电',
        value: 6,
      },
      {
        name: '铁芯多点接地',
        value: 4,
      },
      {
        name: '冷却器故障',
        value: 3,
      },
    ],

    conclusions: [
      {
        name: '绕组过热',
        confidence: 42,
        level: 'normal',
        evidence:
          '绕组温度及油温存在轻微波动，当前未超过主要报警阈值',
        advice:
          '保持当前监测频率，继续观察绕组温度变化趋势',
      },
    ],
  },

  'BD-002': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '绕组过热',
        value: 42,
      },
      {
        name: '局部放电',
        value: 23,
      },
      {
        name: '绝缘老化',
        value: 18,
      },
      {
        name: '铁芯多点接地',
        value: 11,
      },
      {
        name: '冷却器故障',
        value: 6,
      },
    ],

    conclusions: [
      {
        name: '绕组过热',
        confidence: 92,
        level: 'danger',
        evidence:
          '油温78℃连续30min超阈值，绕组温度85℃，负载率82%',
        advice:
          '立即检查冷却器运行状态，必要时降载运行并安排停电检查',
      },
      {
        name: '绝缘老化',
        confidence: 76,
        level: 'warning',
        evidence:
          '介质损耗因数较基线提升12%，油中溶解气体CO/CO₂比值异常',
        advice:
          '加强油质跟踪检测，建议30天内安排油取样色谱分析',
      },
      {
        name: '局部放电',
        confidence: 68,
        level: 'warning',
        evidence:
          '局放幅值12pC持续偏高，PRPD图谱呈典型尖端放电特征',
        advice:
          '加强局部放电监测，结合带电检测定位放电点',
      },
    ],
  },

  'GT-011': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '触头过热',
        value: 14,
      },
      {
        name: '机构卡涩',
        value: 9,
      },
      {
        name: '绝缘劣化',
        value: 7,
      },
      {
        name: '接触不良',
        value: 5,
      },
    ],

    conclusions: [
      {
        name: '触头过热',
        confidence: 38,
        level: 'normal',
        evidence:
          '触头温度存在轻微波动，但当前温升仍处于允许范围',
        advice:
          '保持在线监测，重点观察高负荷工况下触头温升变化',
      },
    ],
  },

  'GT-012': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '触头过热',
        value: 20,
      },
      {
        name: '机构卡涩',
        value: 14,
      },
      {
        name: '接触不良',
        value: 10,
      },
      {
        name: '绝缘劣化',
        value: 7,
      },
    ],

    conclusions: [
      {
        name: '触头过热',
        confidence: 55,
        level: 'normal',
        evidence:
          '触头温升较历史均值有所增加，暂未达到报警条件',
        advice:
          '建议结合巡视检查触头及连接部位状态',
      },
    ],
  },

  'CT-021': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '绕组异常',
        value: 18,
      },
      {
        name: '绝缘劣化',
        value: 14,
      },
      {
        name: '测量误差异常',
        value: 9,
      },
      {
        name: '本体过热',
        value: 5,
      },
    ],

    conclusions: [
      {
        name: '绕组异常',
        confidence: 48,
        level: 'normal',
        evidence:
          '绕组相关监测指标存在小幅波动，当前整体运行稳定',
        advice:
          '继续跟踪绕组状态及测量误差变化',
      },
    ],
  },

  'PT-022': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '绝缘老化',
        value: 38,
      },
      {
        name: '介质损耗异常',
        value: 31,
      },
      {
        name: '绕组异常',
        value: 17,
      },
      {
        name: '本体过热',
        value: 8,
      },
    ],

    conclusions: [
      {
        name: '绝缘老化',
        confidence: 84,
        level: 'danger',
        evidence:
          '介质损耗持续升高，绝缘健康评分下降至69%',
        advice:
          '建议尽快开展绝缘专项检测并结合试验结果安排检修',
      },
      {
        name: '介质损耗异常',
        confidence: 78,
        level: 'warning',
        evidence:
          '介质损耗测量值偏离历史基线，近期呈持续上升趋势',
        advice:
          '提高检测频率，并分析环境温湿度及绝缘介质状态',
      },
    ],
  },

  'BL-031': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '泄漏电流异常',
        value: 13,
      },
      {
        name: '绝缘劣化',
        value: 8,
      },
      {
        name: '受潮',
        value: 6,
      },
      {
        name: '热故障',
        value: 4,
      },
    ],

    conclusions: [
      {
        name: '泄漏电流异常',
        confidence: 36,
        level: 'normal',
        evidence:
          '泄漏电流存在轻微上升，但仍处于正常运行范围',
        advice:
          '保持监测并关注雷雨天气后的泄漏电流变化',
      },
    ],
  },

  'PR-001': {
    engine: 'FD-2024',

    probabilities: [
      {
        name: '通信异常',
        value: 63,
      },
      {
        name: '采样异常',
        value: 48,
      },
      {
        name: '装置自检异常',
        value: 42,
      },
      {
        name: '装置过热',
        value: 19,
      },
    ],

    conclusions: [
      {
        name: '通信异常',
        confidence: 94,
        level: 'danger',
        evidence:
          '通信中断次数超过阈值，链路质量持续下降',
        advice:
          '立即检查通信接口、光纤链路及交换设备运行状态',
      },
      {
        name: '装置自检异常',
        confidence: 82,
        level: 'warning',
        evidence:
          '装置自检连续出现异常记录，部分功能状态不稳定',
        advice:
          '安排保护装置专项检查并核验自检记录',
      },
    ],
  },
}

export const defaultPhmDiagnosisData = {
  engine: 'FD-2024',
  probabilities: [],
  conclusions: [],
}