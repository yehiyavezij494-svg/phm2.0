// =====================================================
// 设备管理 - 设备履历
// =====================================================

export const deviceResumeSummary = {
  totalCount: 286,
  monthlyCount: 12,
  pendingCount: 3,
  archivedCount: 271,
}


export const deviceResumeRecords = [
  {
    id: 1,

    time: '2026-09-24 14:32',

    device: '2#主变压器',

    deviceCode: 'BD-002',

    type: '缺陷',

    content:
      '油温78.2℃超过上限75℃，持续30分钟',

    operator: '系统',

    status: '处理中',
  },

  {
    id: 2,

    time: '2026-09-15 14:20',

    device: '2#电压互感器',

    deviceCode: 'PT-022',

    type: '试验',

    content:
      '介质损耗试验，结果0.62% 略高注意值',

    operator: '王工',

    status: '已完成',
  },

  {
    id: 3,

    time: '2026-08-30 09:00',

    device: '1#主变压器',

    deviceCode: 'BD-001',

    type: '投运',

    content:
      '1#主变压器正式投入运行',

    operator: '赵工',

    status: '已归档',
  },

  {
    id: 4,

    time: '2026-08-22 15:40',

    device: '1#避雷器',

    deviceCode: 'BL-031',

    type: '试验',

    content:
      '泄漏电流例行测试，数值正常',

    operator: '王工',

    status: '已归档',
  },

  {
    id: 5,

    time: '2026-08-10 11:15',

    device: '2#主变压器',

    deviceCode: 'BD-002',

    type: '技改',

    content:
      '加装超声局放在线监测装置',

    operator: '李工',

    status: '已完成',
  },
]
// =====================================================
// 设备管理 - 设备管理
// =====================================================

export const deviceManageSummary = {
  totalCount: 128,
  normalCount: 118,
  warningCount: 8,
  faultCount: 2,
}


export const deviceManageRecords = [
  {
    id: 1,
    code: 'BD-001',
    name: '1#主变压器',
    type: '牵引变压器',
    station: '石家庄牵引变电所',
    model: 'SZ11-40000/110',
    commissionDate: '2018-06-15',
    health: 96,
    status: '正常',
  },

  {
    id: 2,
    code: 'BD-002',
    name: '2#主变压器',
    type: '牵引变压器',
    station: '石家庄牵引变电所',
    model: 'SZ11-40000/110',
    commissionDate: '2018-06-15',
    health: 82,
    status: '预警',
  },

  {
    id: 3,
    code: 'GT-011',
    name: '1#隔离开关',
    type: '高压开关',
    station: '石家庄牵引变电所',
    model: 'GW4-110D',
    commissionDate: '2018-06-20',
    health: 94,
    status: '正常',
  },

  {
    id: 4,
    code: 'GT-012',
    name: '2#隔离开关',
    type: '高压开关',
    station: '石家庄牵引变电所',
    model: 'GW4-110D',
    commissionDate: '2018-06-20',
    health: 91,
    status: '正常',
  },

  {
    id: 5,
    code: 'CT-021',
    name: '1#电流互感器',
    type: '互感器',
    station: '石家庄牵引变电所',
    model: 'LB6-110',
    commissionDate: '2018-06-25',
    health: 89,
    status: '正常',
  },

  {
    id: 6,
    code: 'PT-022',
    name: '2#电压互感器',
    type: '互感器',
    station: '石家庄牵引变电所',
    model: 'JDZX9-35',
    commissionDate: '2018-06-25',
    health: 76,
    status: '预警',
  },

  {
    id: 7,
    code: 'BL-031',
    name: '1#避雷器',
    type: '避雷器',
    station: '石家庄牵引变电所',
    model: 'YH5WZ-51/134',
    commissionDate: '2018-07-01',
    health: 93,
    status: '正常',
  },

  {
    id: 8,
    code: 'BD-101',
    name: '1#主变压器',
    type: '牵引变压器',
    station: '正定分区所',
    model: 'SZ11-25000/110',
    commissionDate: '2019-03-20',
    health: 92,
    status: '正常',
  },

  {
    id: 9,
    code: 'GT-111',
    name: '1#隔离开关',
    type: '高压开关',
    station: '正定分区所',
    model: 'GW4-110D',
    commissionDate: '2019-03-22',
    health: 88,
    status: '正常',
  },
]
// =====================================================
// 设备管理 - 部件管理
// =====================================================

export const partManageSummary = {
  totalCount: 46,
  normalCount: 39,
  warningCount: 5,
  replaceCount: 2,
}


export const partManageRecords = [
  {
    id: 1,
    code: 'PT-001',
    name: '油箱',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    model: 'WL-A-220',
    life: 15,
    health: 86,
    status: '正常',
  },

  {
    id: 2,
    code: 'PT-002',
    name: '绕组',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    model: 'WL-B-220',
    life: 15,
    health: 82,
    status: '正常',
  },

  {
    id: 3,
    code: 'PT-003',
    name: '铁芯接地',
    device: '2#主变压器',
    deviceCode: 'BD-002',
    model: 'WL-C-220',
    life: 15,
    health: 84,
    status: '正常',
  },

  {
    id: 4,
    code: 'PT-020',
    name: '套管',
    device: '2#电压互感器',
    deviceCode: 'PT-022',
    model: 'JDZX9-35',
    life: 20,
    health: 76,
    status: '预警',
  },
]