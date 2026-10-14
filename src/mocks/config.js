// =====================================================
// 所亭管理
// =====================================================

export const stationSummary = {
  totalCount: 8,
  normalCount: 7,
  maintenanceCount: 1,
  deviceCount: 128,
}

export const stationRecords = [
  {
    id: 1,
    code: 'SS-001',
    name: '石家庄牵引变电所',
    line: '京广线',
    mileage: 'K268+120',
    deviceCount: 32,
    status: '正常',
  },
  {
    id: 2,
    code: 'SS-002',
    name: '正定分区所',
    line: '京广线',
    mileage: 'K291+450',
    deviceCount: 18,
    status: '正常',
  },
]

// =====================================================
// 监测项管理
// =====================================================

export const monitorItemSummary = {
  totalCount: 128,
  enabledCount: 120,
  disabledCount: 8,
  limitConfiguredCount: 24,
}

export const monitorItemRecords = [
  {
    id: 1,
    code: 'PT-001',
    name: 'A相电压',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    type: '电气量',
    unit: 'kV',
    upperLimit: 30,
    lowerLimit: 25,
    status: '启用',
  },
  {
    id: 2,
    code: 'PT-002',
    name: 'B相电压',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    type: '电气量',
    unit: 'kV',
    upperLimit: 30,
    lowerLimit: 25,
    status: '启用',
  },
  {
    id: 3,
    code: 'PT-003',
    name: 'C相电压',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    type: '电气量',
    unit: 'kV',
    upperLimit: 30,
    lowerLimit: 25,
    status: '启用',
  },
  {
    id: 4,
    code: 'PT-010',
    name: '油温',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    type: '温度量',
    unit: '℃',
    upperLimit: 75,
    lowerLimit: -20,
    status: '启用',
  },
  {
    id: 5,
    code: 'PT-011',
    name: '绕组温度',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    type: '温度量',
    unit: '℃',
    upperLimit: 85,
    lowerLimit: -20,
    status: '启用',
  },
  {
    id: 6,
    code: 'PT-020',
    name: '局放幅值',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    type: '局放量',
    unit: 'pC',
    upperLimit: 10,
    lowerLimit: 0,
    status: '启用',
  },
  {
    id: 7,
    code: 'PT-030',
    name: '介质损耗',
    device: '2#电压互感器',
    deviceCode: 'PT-022',
    type: '电气量',
    unit: '%',
    upperLimit: 0.5,
    lowerLimit: 0,
    status: '启用',
  },
  {
    id: 8,
    code: 'PT-060',
    name: '泄漏电流',
    device: '1#避雷器',
    deviceCode: 'BL-031',
    type: '电气量',
    unit: 'mA',
    upperLimit: 1,
    lowerLimit: 0,
    status: '启用',
  },
]
