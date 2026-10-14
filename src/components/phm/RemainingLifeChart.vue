<script setup>
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      months: [],
      actual: [],
      predicted: [],
      threshold: 60,
    }),
  },
})

const chartRef = ref(null)

let chart = null
let resizeObserver = null

function renderChart() {
  if (!chartRef.value) {
    return
  }

  if (!chart) {
    chart = echarts.init(
      chartRef.value,
    )
  }

  const months =
    props.data?.months ?? []

  const actual =
    props.data?.actual ?? []

  const predicted =
    props.data?.predicted ?? []

  const threshold =
    props.data?.threshold ?? 60

  chart.setOption({
    animationDuration: 600,

    tooltip: {
      trigger: 'axis',

      backgroundColor:
        'rgba(2, 27, 48, 0.96)',

      borderColor: '#0a739e',

      borderWidth: 1,

      textStyle: {
        color: '#d9f7ff',
        fontSize: 10,
      },

      formatter(params) {
        let html =
          `${params[0]?.axisValue ?? ''}<br>`

        params.forEach((item) => {
          if (
            item.value !== null &&
            item.value !== undefined
          ) {
            html +=
              `${item.marker}${item.seriesName}：${item.value}%<br>`
          }
        })

        return html
      },
    },

    legend: {
      top: 8,
      right: 12,

      itemWidth: 14,
      itemHeight: 3,

      textStyle: {
        color: '#759bb3',
        fontSize: 9,
      },

      data: [
        '实测健康度',
        '预测健康度',
        '寿命阈值',
      ],
    },

    grid: {
      left: 42,
      right: 20,
      top: 46,
      bottom: 28,
    },

    xAxis: {
      type: 'category',

      boundaryGap: false,

      data:
        months.map(
          (item) =>
            `第${item}月`,
        ),

      axisLine: {
        lineStyle: {
          color: '#285779',
        },
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: '#6f96ae',
        fontSize: 9,
      },

      splitLine: {
        show: true,

        lineStyle: {
          color:
            'rgba(28, 92, 132, 0.10)',
        },
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
        color: '#6f96ae',
        fontSize: 9,

        formatter(value) {
          return `${value}%`
        },
      },

      splitLine: {
        lineStyle: {
          color:
            'rgba(39, 97, 137, 0.18)',
        },
      },
    },

    series: [
      {
        name: '实测健康度',

        type: 'line',

        data: actual,

        connectNulls: false,

        smooth: false,

        symbol: 'circle',

        symbolSize: 5,

        lineStyle: {
          width: 2,

          color: '#0be5f4',

          shadowBlur: 5,

          shadowColor:
            'rgba(11, 229, 244, 0.35)',
        },

        itemStyle: {
          color: '#0be5f4',

          borderColor: '#032f4e',

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
                  'rgba(0, 220, 238, 0.30)',
              },
              {
                offset: 1,
                color:
                  'rgba(0, 220, 238, 0.03)',
              },
            ],
          },
        },
      },

      {
        name: '预测健康度',

        type: 'line',

        data: predicted,

        connectNulls: false,

        smooth: false,

        symbol: 'circle',

        symbolSize: 5,

        lineStyle: {
          width: 2,

          type: 'dashed',

          color: '#ffae00',
        },

        itemStyle: {
          color: '#ffae00',

          borderColor: '#3c2b00',

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
                  'rgba(255, 174, 0, 0.18)',
              },
              {
                offset: 1,
                color:
                  'rgba(255, 174, 0, 0.02)',
              },
            ],
          },
        },
      },

      {
        name: '寿命阈值',

        type: 'line',

        symbol: 'none',

        data:
          months.map(
            () => threshold,
          ),

        lineStyle: {
          width: 1.5,

          type: 'dashed',

          color: '#ff536a',
        },

        itemStyle: {
          color: '#ff536a',
        },
      },
    ],
  })
}

watch(
  () => props.data,
  () => {
    renderChart()
  },
  {
    deep: true,
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
    class="life-chart"
  ></div>
</template>

<style scoped>
.life-chart {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}
</style>