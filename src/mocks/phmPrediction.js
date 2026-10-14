// PHM - 故障预测页面模拟数据
// 当前页面按照全站设备进行未来7天故障概率预测

export const phmPredictionData = {
  title: '未来7天故障概率预测',

  warningThreshold: 60,

  predictions: [
    {
      name: '继电保护装置',
      probability: 78,
      window: '5天内',
      level: 'danger',
    },
    {
      name: '2#电压互感器',
      probability: 64,
      window: '2天内',
      level: 'warning',
    },
    {
      name: '2#主变压器',
      probability: 58,
      window: '3天内',
      level: 'warning',
    },
    {
      name: '冷却风机组',
      probability: 35,
      window: '3天内',
      level: 'normal',
    },
    {
      name: '1#避雷器',
      probability: 22,
      window: '3天内',
      level: 'normal',
    },
  ],
}