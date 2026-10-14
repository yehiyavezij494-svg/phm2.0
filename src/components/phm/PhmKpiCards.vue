<script setup>
import { computed } from 'vue'

import MetricCards
  from '@/components/common/MetricCards.vue'


const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      healthScore: 0,
      alarmCount: 0,
      predictedFaultCount: 0,
      maxRisk: 0,
      remainingLife: 0,
    }),
  },
})


/* =====================================================
   综合健康颜色
===================================================== */

function getHealthTheme(value) {
  if (value < 60) {
    return 'red'
  }

  if (value < 85) {
    return 'orange'
  }

  return 'green'
}


/* =====================================================
   风险颜色
===================================================== */

function getRiskTheme(value) {
  if (value >= 12) {
    return 'red'
  }

  if (value >= 6) {
    return 'orange'
  }

  return 'green'
}


/* =====================================================
   剩余寿命颜色
===================================================== */

function getLifeTheme(value) {
  if (value <= 1.5) {
    return 'red'
  }

  if (value <= 4) {
    return 'orange'
  }

  return 'green'
}


/* =====================================================
   PHM概览指标
===================================================== */

const metrics = computed(() => {
  return [
    {
      key: 'health',

      icon: '◎',

      value:
        props.data.healthScore ?? 0,

      unit: '',

      label:
        '综合健康分值',

      theme:
        getHealthTheme(
          props.data.healthScore ?? 0,
        ),
    },

    {
      key: 'alarm',

      icon: '!',

      value:
        props.data.alarmCount ?? 0,

      unit: '项',

      label:
        '超限报警',

      theme:
        (props.data.alarmCount ?? 0) > 0
          ? 'red'
          : 'green',
    },

    {
      key: 'prediction',

      icon: '⌁',

      value:
        props.data.predictedFaultCount ?? 0,

      unit: '项',

      label:
        '预测故障',

      theme:
        (props.data.predictedFaultCount ?? 0) > 0
          ? 'red'
          : 'green',
    },

    {
      key: 'risk',

      icon: '!',

      value:
        props.data.maxRisk ?? 0,

      unit: '',

      label:
        '最高风险值',

      theme:
        getRiskTheme(
          props.data.maxRisk ?? 0,
        ),
    },

    {
      key: 'life',

      icon: '◷',

      value:
        props.data.remainingLife ?? 0,

      unit: '年',

      label:
        '剩余寿命约',

      theme:
        getLifeTheme(
          props.data.remainingLife ?? 0,
        ),
    },
  ]
})
</script>


<template>
  <MetricCards
    :items="metrics"
    :columns="5"
    variant="phm"
  />
</template>