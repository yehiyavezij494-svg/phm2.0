export const phmHealthData = {
  'BD-001': {
    overallHealth: 95.4,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '铁芯', max: 100 },
        { name: '绕组', max: 100 },
        { name: '油箱', max: 100 },
        { name: '套管', max: 100 },
      ],
      values: [96, 94, 95, 97],
    },

    components: [
      {
        name: '铁芯',
        score: 96,
      },
      {
        name: '绕组',
        score: 94,
      },
      {
        name: '油箱',
        score: 95,
      },
      {
        name: '套管',
        score: 97,
      },
    ],
  },

  'BD-002': {
    overallHealth: 82.6,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '铁芯', max: 100 },
        { name: '绕组', max: 100 },
        { name: '油箱', max: 100 },
        { name: '套管', max: 100 },
      ],
      values: [88, 74, 81, 92],
    },

    components: [
      {
        name: '铁芯',
        score: 88,
      },
      {
        name: '绕组',
        score: 74,
      },
      {
        name: '油箱',
        score: 81,
      },
      {
        name: '套管',
        score: 92,
      },
    ],
  },

  'GT-011': {
    overallHealth: 94.2,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '触头', max: 100 },
        { name: '操动机构', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '回路', max: 100 },
      ],
      values: [95, 92, 96, 94],
    },

    components: [
      {
        name: '触头',
        score: 95,
      },
      {
        name: '操动机构',
        score: 92,
      },
      {
        name: '绝缘',
        score: 96,
      },
      {
        name: '回路',
        score: 94,
      },
    ],
  },

  'GT-012': {
    overallHealth: 91.0,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '触头', max: 100 },
        { name: '操动机构', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '回路', max: 100 },
      ],
      values: [89, 92, 91, 92],
    },

    components: [
      {
        name: '触头',
        score: 89,
      },
      {
        name: '操动机构',
        score: 92,
      },
      {
        name: '绝缘',
        score: 91,
      },
      {
        name: '回路',
        score: 92,
      },
    ],
  },

  'CT-021': {
    overallHealth: 89.1,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '绕组', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '测量误差', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [88, 92, 90, 87],
    },

    components: [
      {
        name: '绕组',
        score: 88,
      },
      {
        name: '绝缘',
        score: 92,
      },
      {
        name: '测量误差',
        score: 90,
      },
      {
        name: '温升',
        score: 87,
      },
    ],
  },

  'PT-022': {
    overallHealth: 76.4,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '绕组', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '测量误差', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [74, 69, 78, 85],
    },

    components: [
      {
        name: '绕组',
        score: 74,
      },
      {
        name: '绝缘',
        score: 69,
      },
      {
        name: '测量误差',
        score: 78,
      },
      {
        name: '温升',
        score: 85,
      },
    ],
  },

  'BL-031': {
    overallHealth: 93.0,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '泄漏电流', max: 100 },
        { name: '阻性电流', max: 100 },
        { name: '绝缘', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [94, 92, 95, 91],
    },

    components: [
      {
        name: '泄漏电流',
        score: 94,
      },
      {
        name: '阻性电流',
        score: 92,
      },
      {
        name: '绝缘',
        score: 95,
      },
      {
        name: '温升',
        score: 91,
      },
    ],
  },

  'PR-001': {
    overallHealth: 58.3,
    model: 'PHM-HM v2.3',

    radar: {
      indicators: [
        { name: '通信', max: 100 },
        { name: '采样', max: 100 },
        { name: '自检', max: 100 },
        { name: '温升', max: 100 },
      ],
      values: [48, 65, 52, 70],
    },

    components: [
      {
        name: '通信',
        score: 48,
      },
      {
        name: '采样',
        score: 65,
      },
      {
        name: '自检',
        score: 52,
      },
      {
        name: '温升',
        score: 70,
      },
    ],
  },
}

export const defaultPhmHealthData = {
  overallHealth: 0,
  model: 'PHM-HM v2.3',

  radar: {
    indicators: [],
    values: [],
  },

  components: [],
}