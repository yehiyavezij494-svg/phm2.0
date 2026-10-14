<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import * as echarts from 'echarts'

const props = defineProps({
  decayRate: {
    type: Number,
    default: 0.000013,
  },

  threshold: {
    type: Number,
    default: 60,
  },
})

const chartRef = ref(null)

let chart = null
let resizeObserver = null

const curveData = computed(() => {
  const result = []

  for (let hour = 0; hour <= 60000; hour += 6000) {
    const reliability =
      Math.exp(
        -props.decayRate * hour,
      ) * 100

    result.push([
      hour / 1000,
      Number(
        reliability.toFixed(1),
      ),
    ])
  }

  return result
})

function renderChart() {
  if (!chartRef.value) {
    return
  }

  if (!chart) {
    chart = echarts.init(
      chartRef.value,
    )
  }

  chart.setOption({
    animationDuration: 600,

    tooltip: {
      trigger: 'axis',

      backgroundColor:
        'rgba(2, 27, 48, 0.96)',

      borderColor:
        '#0a739e',

      borderWidth: 1,

      textStyle: {
        color: '#d9f7ff',
        fontSize: 10,
      },

      formatter(params) {
        const item = params[0]

        if (!item) {
          return ''
        }

        return (
          `运行时间：${item.value[0]}千小时<br>` +
          `可靠度：${item.value[1]}%`
        )
      },
    },

    grid: {
      left: 43,
      right: 24,
      top: 28,
      bottom: 34,
    },

    xAxis: {
      type: 'value',

      min: 0,
      max: 60,
      interval: 6,

      axisLine: {
        lineStyle: {
          color: '#285879',
        },
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: '#6d96ae',
        fontSize: 9,
      },

      splitLine: {
        show: true,

        lineStyle: {
          color:
            'rgba(35, 93, 132, 0.09)',
        },
      },

      name: 'kh',

      nameLocation: 'end',

      nameGap: 6,

      nameTextStyle: {
        color: '#6d96ae',
        fontSize: 8,
      },
    },

    yAxis: {
      type: 'value',

      min: 0,
      max: 100,
      interval: 20,

      axisLine: {
        show: false,
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: '#6d96ae',
        fontSize: 9,

        formatter(value) {
          return `${value}%`
        },
      },

      splitLine: {
        lineStyle: {
          color:
            'rgba(35, 93, 132, 0.14)',
        },
      },
    },

    series: [
      {
        name: '可靠度',

        type: 'line',

        data: curveData.value,

        smooth: 0.25,

        symbol: 'circle',

        symbolSize: 5,

        lineStyle: {
          width: 2,

          color: '#36e3a6',

          shadowBlur: 7,

          shadowColor:
            'rgba(54, 227, 166, 0.4)',
        },

        itemStyle: {
          color: '#36e3a6',

          borderColor: '#064b4d',

          borderWidth: 1,
        },

        areaStyle: {
          color: {
            type: 'linear',

            x: 0,
            y: 0,
            x2: 0,
            y2: 1,

            colorStops: [
              {
                offset: 0,
                color:
                  'rgba(47, 218, 165, 0.30)',
              },
              {
                offset: 0.55,
                color:
                  'rgba(25, 174, 151, 0.13)',
              },
              {
                offset: 1,
                color:
                  'rgba(10, 92, 108, 0.02)',
              },
            ],
          },
        },

        markLine: {
          silent: true,

          symbol: 'none',

          lineStyle: {
            color: '#d5a317',
            type: 'dashed',
            width: 1,
          },

          label: {
            show: true,

            position: 'end',

            color: '#e0ad1d',

            fontSize: 9,

            formatter:
              `可接受阈值 ${props.threshold}%`,
          },

          data: [
            {
              yAxis:
                props.threshold,
            },
          ],
        },
      },
    ],
  })
}

watch(
  () => [
    props.decayRate,
    props.threshold,
  ],
  () => {
    renderChart()
  },
)

onMounted(() => {
  renderChart()

  resizeObserver =
    new ResizeObserver(() => {
      chart?.resize()
    })

  if (chartRef.value) {
    resizeObserver.observe(
      chartRef.value,
    )
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()

  chart?.dispose()

  chart = null
})
</script>

<template>
  <div
    ref="chartRef"
    class="reliability-chart"
  ></div>
</template>

<style scoped>
.reliability-chart {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}
</style>