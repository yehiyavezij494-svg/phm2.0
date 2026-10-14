<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      indicators: [],
      values: [],
    }),
  },
})

const chartRef = ref(null)

let chart = null
let resizeObserver = null

function renderChart() {
  if (!chartRef.value) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const indicators = props.data.indicators.map((item) => ({
    name: item.name,
    max: item.max ?? 100,
  }))

  chart.setOption({
    backgroundColor: 'transparent',

    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(2, 25, 45, 0.96)',
      borderColor: '#0b7fae',
      borderWidth: 1,
      textStyle: {
        color: '#dff8ff',
        fontSize: 11,
      },
      formatter() {
        const lines = props.data.indicators.map((item, index) => {
          return `${item.name}：${props.data.values[index]}分`
        })

        return lines.join('<br>')
      },
    },

    radar: {
      center: ['50%', '53%'],
      radius: '61%',
      shape: 'polygon',
      splitNumber: 4,

      indicator: indicators,

      axisName: {
        color: '#8bb2c9',
        fontSize: 11,
      },

      axisLine: {
        lineStyle: {
          color: 'rgba(20, 150, 205, 0.35)',
        },
      },

      splitLine: {
        lineStyle: {
          color: [
            'rgba(17, 116, 167, 0.40)',
            'rgba(17, 116, 167, 0.32)',
            'rgba(17, 116, 167, 0.25)',
            'rgba(17, 116, 167, 0.18)',
          ],
        },
      },

      splitArea: {
        areaStyle: {
          color: [
            'rgba(0, 142, 190, 0.02)',
            'rgba(0, 142, 190, 0.04)',
            'rgba(0, 142, 190, 0.06)',
            'rgba(0, 142, 190, 0.08)',
          ],
        },
      },
    },

    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,

        data: [
          {
            value: props.data.values,
            name: '健康评分',

            lineStyle: {
              width: 2,
              color: '#12dff5',
              shadowColor: 'rgba(18, 223, 245, 0.55)',
              shadowBlur: 8,
            },

            itemStyle: {
              color: '#13e5fa',
              borderColor: '#b8fbff',
              borderWidth: 1,
            },

            areaStyle: {
              color: 'rgba(11, 211, 239, 0.18)',
            },
          },
        ],

        animationDuration: 650,
        animationDurationUpdate: 500,
        animationEasingUpdate: 'cubicOut',
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
    resizeObserver = new ResizeObserver(resizeChart)

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
  <div class="health-radar">
    <div
      ref="chartRef"
      class="radar-chart"
    ></div>

    <div class="radar-score">
      <span>综合评分</span>

      <strong>
        {{
          Math.round(
            data.values.reduce(
              (sum, value) => sum + value,
              0,
            ) /
              (data.values.length || 1),
          )
        }}
      </strong>
    </div>
  </div>
</template>

<style scoped>
.health-radar {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-image:
    linear-gradient(
      rgba(32, 115, 163, 0.055) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(32, 115, 163, 0.055) 1px,
      transparent 1px
    );
  background-size: 32px 32px;
}

.radar-chart {
  width: 100%;
  height: 100%;
}

.radar-score {
  position: absolute;
  left: 14px;
  bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 6px;
  pointer-events: none;
}

.radar-score span {
  color: #5e91af;
  font-size: 10px;
}

.radar-score strong {
  color: #18dcf5;
  font-size: 18px;
  text-shadow: 0 0 7px rgba(24, 220, 245, 0.4);
}
</style>