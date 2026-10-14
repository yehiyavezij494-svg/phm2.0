// PHM - 可靠性评估页面模拟数据
// 后续接入 Java 后端后，可直接替换为接口数据

export const phmReliabilityData = {
  'BD-001': {
    mtbf: 12560,
    mttr: 2.8,
    availability: 99.82,
    failureRate: 0.42,
    decayRate: 0.0000092,
    threshold: 60,
  },

  'BD-002': {
    mtbf: 8620,
    mttr: 3.6,
    availability: 99.62,
    failureRate: 0.68,
    decayRate: 0.0000133,
    threshold: 60,
  },

  'GT-011': {
    mtbf: 13860,
    mttr: 2.2,
    availability: 99.88,
    failureRate: 0.35,
    decayRate: 0.0000086,
    threshold: 60,
  },

  'GT-012': {
    mtbf: 11980,
    mttr: 2.6,
    availability: 99.79,
    failureRate: 0.48,
    decayRate: 0.0000102,
    threshold: 60,
  },

  'CT-021': {
    mtbf: 10840,
    mttr: 2.9,
    availability: 99.73,
    failureRate: 0.53,
    decayRate: 0.000011,
    threshold: 60,
  },

  'PT-022': {
    mtbf: 7280,
    mttr: 4.2,
    availability: 99.41,
    failureRate: 0.82,
    decayRate: 0.0000158,
    threshold: 60,
  },

  'BL-031': {
    mtbf: 13220,
    mttr: 2.1,
    availability: 99.84,
    failureRate: 0.39,
    decayRate: 0.000009,
    threshold: 60,
  },

  'PR-001': {
    mtbf: 5160,
    mttr: 5.3,
    availability: 98.96,
    failureRate: 1.26,
    decayRate: 0.000019,
    threshold: 60,
  },
}

export const defaultPhmReliabilityData = {
  mtbf: 0,
  mttr: 0,
  availability: 0,
  failureRate: 0,
  decayRate: 0.000013,
  threshold: 60,
}