<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
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
    chart = echarts.init(chartRef.value)
  }

  const sortedData = [...props.data].sort(
    (a, b) => b.value - a.value,
  )

  const names = sortedData.map(
    (item) => item.name,
  )

  const values = sortedData.map(
    (item) => item.value,
  )

  chart.setOption({
    backgroundColor: 'transparent',

    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 450,
    animationEasingUpdate: 'cubicOut',

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },

      backgroundColor: 'rgba(2, 25, 45, 0.96)',
      borderColor: '#0b7fae',
      borderWidth: 1,

      textStyle: {
        color: '#dff8ff',
        fontSize: 11,
      },

      formatter(params) {
        const item = params[0]

        if (!item) {
          return ''
        }

        return (
          `${item.name}<br>` +
          `故障概率：${item.value}%`
        )
      },
    },

    grid: {
      left: 96,
      right: 52,
      top: 24,
      bottom: 22,
      containLabel: false,
    },

    xAxis: {
      type: 'value',
      min: 0,
      max: 100,

      axisLine: {
        show: false,
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: '#547e99',
        fontSize: 9,
        formatter: '{value}%',
      },

      splitLine: {
        lineStyle: {
          color: 'rgba(48, 113, 151, 0.14)',
        },
      },
    },

    yAxis: {
      type: 'category',
      inverse: true,
      data: names,

      axisLine: {
        show: false,
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: '#8eb4ca',
        fontSize: 10,
        width: 78,
        overflow: 'truncate',
      },
    },

    series: [
      {
        name: '故障概率',
        type: 'bar',
        data: values,

        barWidth: 11,

        showBackground: true,

        backgroundStyle: {
          color: 'rgba(37, 93, 126, 0.16)',
          borderRadius: 6,
        },

        itemStyle: {
          borderRadius: 6,

          color: new echarts.graphic.LinearGradient(
            0,
            0,
            1,
            0,
            [
              {
                offset: 0,
                color: '#087db2',
              },
              {
                offset: 0.65,
                color: '#11bcd8',
              },
              {
                offset: 1,
                color: '#19e2ec',
              },
            ],
          ),

          shadowColor:
            'rgba(16, 207, 229, 0.25)',

          shadowBlur: 5,
        },

        label: {
          show: true,
          position: 'right',
          distance: 7,
          color: '#75ddec',
          fontSize: 10,
          formatter: '{c}%',
        },
      },
    ],
  })
}

watch(
  () => props.data,
  renderChart,
  {
    deep: true,
  },
)

function resizeChart() {
  chart?.resize()
}

onMounted(() => {
  renderChart()

  window.addEventListener(
    'resize',
    resizeChart,
  )

  if (
    chartRef.value &&
    typeof ResizeObserver !== 'undefined'
  ) {
    resizeObserver =
      new ResizeObserver(
        resizeChart,
      )

    resizeObserver.observe(
      chartRef.value,
    )
  }
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'resize',
    resizeChart,
  )

  resizeObserver?.disconnect()
  chart?.dispose()

  chart = null
  resizeObserver = null
})
</script>

<template>
  <div class="fault-probability">
    <div
      v-if="data.length"
      ref="chartRef"
      class="probability-chart"
    ></div>

    <div
      v-else
      class="empty-data"
    >
      暂无故障概率数据
    </div>
  </div>
</template>

<style scoped>
.fault-probability {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-image:
    linear-gradient(
      rgba(32, 115, 163, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(32, 115, 163, 0.05) 1px,
      transparent 1px
    );
  background-size: 32px 32px;
}

.probability-chart {
  width: 100%;
  height: 100%;
}

.empty-data {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f809d;
  font-size: 12px;
}
</style>