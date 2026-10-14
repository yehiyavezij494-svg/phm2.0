// PHM - 风险性评估页面模拟数据
// 风险值 = 发生概率 × 严重程度
// 当前页面采用全站风险汇总方式

export const phmRiskData = {
  probabilityThreshold: 3,
  severityThreshold: 3,

  risks: [
    {
      name: '2#主变压器油温超限',
      probability: 4,
      severity: 4,
      risk: 16,
      level: '紧急',
    },
    {
      name: '继电保护装置通信中断',
      probability: 3,
      severity: 4,
      risk: 12,
      level: '紧急',
    },
    {
      name: '2#电压互感器介质损耗',
      probability: 4,
      severity: 3,
      risk: 12,
      level: '重要',
    },
    {
      name: '局部放电幅值上升',
      probability: 3,
      severity: 3,
      risk: 9,
      level: '重要',
    },
    {
      name: '冷却风机效率下降',
      probability: 3,
      severity: 2,
      risk: 6,
      level: '一般',
    },
    {
      name: '1#避雷器泄漏电流',
      probability: 2,
      severity: 2,
      risk: 4,
      level: '一般',
    },
  ],
}