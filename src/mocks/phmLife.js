export const phmLifeData = {
  'BD-001': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        96, 95, 94, 93, 92, 91,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 91,
        88, 84, 80, 75, 70,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '1#主变压器',
        health: 96,
        life: 8.2,
        confidence: 95,
      },
      {
        name: '铁芯',
        health: 95,
        life: 8.8,
        confidence: 93,
      },
      {
        name: '绕组',
        health: 94,
        life: 7.6,
        confidence: 91,
      },
      {
        name: '油箱',
        health: 97,
        life: 9.1,
        confidence: 94,
      },
      {
        name: '套管',
        health: 96,
        life: 8.9,
        confidence: 92,
      },
    ],
  },

  'BD-002': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        82, 80, 78, 76, 74, 72,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 72,
        68, 63, 58, 52, 47,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '2#主变压器',
        health: 82,
        life: 3.2,
        confidence: 91,
      },
      {
        name: '铁芯',
        health: 76,
        life: 4.6,
        confidence: 88,
      },
      {
        name: '绕组',
        health: 58,
        life: 1.1,
        confidence: 84,
      },
      {
        name: '油箱',
        health: 58,
        life: 1.1,
        confidence: 84,
      },
      {
        name: '套管',
        health: 87,
        life: 5.4,
        confidence: 86,
      },
    ],
  },

  'GT-011': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        94, 93, 92, 91, 90, 89,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 89,
        87, 84, 81, 78, 74,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '1#隔离开关',
        health: 94,
        life: 7.8,
        confidence: 93,
      },
      {
        name: '触头',
        health: 95,
        life: 8.1,
        confidence: 91,
      },
      {
        name: '操动机构',
        health: 92,
        life: 7.2,
        confidence: 89,
      },
      {
        name: '绝缘',
        health: 96,
        life: 8.5,
        confidence: 92,
      },
      {
        name: '回路',
        health: 93,
        life: 7.5,
        confidence: 90,
      },
    ],
  },

  'GT-012': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        91, 90, 89, 88, 87, 86,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 86,
        83, 80, 76, 72, 68,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '2#隔离开关',
        health: 91,
        life: 6.7,
        confidence: 91,
      },
      {
        name: '触头',
        health: 89,
        life: 6.1,
        confidence: 88,
      },
      {
        name: '操动机构',
        health: 92,
        life: 7.0,
        confidence: 89,
      },
      {
        name: '绝缘',
        health: 91,
        life: 6.8,
        confidence: 90,
      },
      {
        name: '回路',
        health: 92,
        life: 7.1,
        confidence: 87,
      },
    ],
  },

  'CT-021': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        89, 88, 87, 86, 85, 84,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 84,
        80, 76, 72, 67, 62,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '1#电流互感器',
        health: 89,
        life: 5.8,
        confidence: 90,
      },
      {
        name: '绕组',
        health: 88,
        life: 5.6,
        confidence: 87,
      },
      {
        name: '绝缘',
        health: 92,
        life: 6.4,
        confidence: 89,
      },
      {
        name: '误差',
        health: 90,
        life: 6.0,
        confidence: 88,
      },
      {
        name: '温升',
        health: 87,
        life: 5.3,
        confidence: 86,
      },
    ],
  },

  'PT-022': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        76, 74, 72, 70, 68, 66,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 66,
        62, 57, 52, 47, 42,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '2#电压互感器',
        health: 76,
        life: 2.5,
        confidence: 88,
      },
      {
        name: '绕组',
        health: 74,
        life: 2.2,
        confidence: 84,
      },
      {
        name: '绝缘',
        health: 69,
        life: 1.7,
        confidence: 83,
      },
      {
        name: '误差',
        health: 78,
        life: 2.8,
        confidence: 85,
      },
      {
        name: '温升',
        health: 85,
        life: 4.2,
        confidence: 87,
      },
    ],
  },

  'BL-031': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        93, 92, 91, 90, 89, 88,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 88,
        85, 82, 79, 75, 71,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '1#避雷器',
        health: 93,
        life: 7.3,
        confidence: 92,
      },
      {
        name: '泄漏电流',
        health: 94,
        life: 7.6,
        confidence: 90,
      },
      {
        name: '阻性电流',
        health: 92,
        life: 7.0,
        confidence: 89,
      },
      {
        name: '绝缘',
        health: 95,
        life: 8.0,
        confidence: 91,
      },
      {
        name: '温升',
        health: 91,
        life: 6.8,
        confidence: 88,
      },
    ],
  },

  'PR-001': {
    model: 'LSTM + 退化模型',

    chart: {
      months: [
        0, 6, 12, 18, 24, 30,
        36, 42, 48, 54, 60,
      ],

      actual: [
        58, 57, 56, 55, 54, 53,
        null, null, null, null, null,
      ],

      predicted: [
        null, null, null, null, null, 53,
        49, 45, 41, 37, 33,
      ],

      threshold: 60,
    },

    estimates: [
      {
        name: '继电保护装置',
        health: 58,
        life: 0.8,
        confidence: 82,
      },
      {
        name: '通信',
        health: 48,
        life: 0.4,
        confidence: 79,
      },
      {
        name: '采样',
        health: 65,
        life: 1.3,
        confidence: 81,
      },
      {
        name: '自检',
        health: 52,
        life: 0.6,
        confidence: 80,
      },
      {
        name: '温升',
        health: 70,
        life: 1.8,
        confidence: 83,
      },
    ],
  },
}

export const defaultPhmLifeData = {
  model: 'LSTM + 退化模型',

  chart: {
    months: [],
    actual: [],
    predicted: [],
    threshold: 60,
  },

  estimates: [],
}