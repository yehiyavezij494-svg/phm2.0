<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '近24小时' },
  seriesName: { type: String, default: '监测值' },
  data: { type: Array, default: () => [] },
  windowHours: { type: Number, default: 24 },
  threshold: { type: Number, default: 70 },
  thresholdName: { type: String, default: '预警阈值' },
  unit: { type: String, default: '%' },
  yMin: { type: Number, default: 50 },
  yMax: { type: Number, default: 100 },
})

const chartRef = ref(null)
let chart = null
let resizeObserver = null

const TWO_HOURS = 2 * 60 * 60 * 1000
const EAST_EIGHT_OFFSET = 8 * 60 * 60 * 1000

// 最新采集时间
const latestTime = computed(() => {
  if (!props.data.length) return Date.now()
  return props.data[props.data.length - 1][0]
})

// 最近24小时窗口
const startTime = computed(() => {
  return latestTime.value - props.windowHours * 60 * 60 * 1000
})

function pad(value) {
  return String(value).padStart(2, '0')
}

// 统一按东八区显示采集时间
function formatTooltipTime(timestamp) {
  const date = new Date(timestamp + EAST_EIGHT_OFFSET)

  return (
    `${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:` +
    `${pad(date.getUTCSeconds())}`
  )
}

function formatHour(timestamp) {
  const date = new Date(timestamp + EAST_EIGHT_OFFSET)
  return `${pad(date.getUTCHours())}:00`
}

// 生成与真实时间轴严格对应的偶数整点标签
const timeTicks = computed(() => {
  if (!props.data.length) return []

  const start = startTime.value
  const end = latestTime.value
  const duration = end - start

  if (duration <= 0) return []

  const firstTick =
    Math.ceil((start + EAST_EIGHT_OFFSET) / TWO_HOURS) * TWO_HOURS - EAST_EIGHT_OFFSET

  const ticks = []

  for (let time = firstTick; time <= end; time += TWO_HOURS) {
    const percent = ((time - start) / duration) * 100

    ticks.push({
      time,
      label: formatHour(time),
      percent,
      transform:
        percent <= 4 ? 'translateX(0)' : percent >= 96 ? 'translateX(-100%)' : 'translateX(-50%)',
    })
  }

  // 保留最多12个标签，避免窗口边界同时出现13个
  return ticks.slice(-12)
})

function renderChart() {
  if (!chartRef.value) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  chart.setOption({
    backgroundColor: 'transparent',

    animation: true,
    animationDuration: 350,
    animationDurationUpdate: 850,
    animationEasingUpdate: 'linear',

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(2, 25, 45, 0.96)',
      borderColor: '#0d7eae',
      borderWidth: 1,
      textStyle: {
        color: '#d8f5ff',
        fontSize: 10,
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(44, 220, 255, 0.35)',
          type: 'dashed',
        },
      },
      formatter(params) {
        const item = params.find((value) => value.seriesName === props.seriesName)
        if (!item) return ''

        const time = formatTooltipTime(item.value[0])
        const value = item.value[1]

        return `${time}<br>` + `${props.seriesName}：${value} ${props.unit}`
      },
    },

    legend: {
      top: 5,
      right: 10,
      itemWidth: 18,
      itemHeight: 7,
      textStyle: {
        color: '#7ca6c0',
        fontSize: 9,
      },
      data: [props.seriesName, props.thresholdName],
    },

    grid: {
      left: 46,
      right: 26,
      top: 44,
      bottom: 30,
    },

    // 真实采集时间轴
    xAxis: {
      type: 'time',
      min: startTime.value,
      max: latestTime.value,
      boundaryGap: false,
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#315574' },
      },
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      min: props.yMin,
      max: props.yMax,
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#84a7c5',
        fontSize: 9,
        formatter(value) {
          return `${value}${props.unit}`
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(53, 106, 151, 0.18)',
        },
      },
    },

    series: [
      // 主趋势
      {
        name: props.seriesName,
        type: 'line',
        data: props.data,
        smooth: 0.28,
        smoothMonotone: 'x',
        showSymbol: false,
        symbol: 'none',
        clip: true,
        lineStyle: {
          width: 2,
          color: '#13dff5',
          shadowColor: 'rgba(19, 223, 245, 0.35)',
          shadowBlur: 5,
        },
        itemStyle: {
          color: '#13dff5',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(19, 223, 245, 0.25)',
            },
            {
              offset: 0.55,
              color: 'rgba(19, 223, 245, 0.08)',
            },
            {
              offset: 1,
              color: 'rgba(19, 223, 245, 0.01)',
            },
          ]),
        },
        animationDurationUpdate: 850,
        animationEasingUpdate: 'linear',
      },

      // 预警阈值线
      {
        name: props.thresholdName,
        type: 'line',
        data: [
          [startTime.value, props.threshold],
          [latestTime.value, props.threshold],
        ],
        showSymbol: false,
        symbol: 'none',
        lineStyle: {
          width: 1.3,
          type: 'dashed',
          color: '#f4a51c',
        },
        animation: false,
      },
    ],
  })
}

// 接口数据变化时自动更新曲线
watch(
  () => [
    props.data,
    props.threshold,
    props.thresholdName,
    props.windowHours,
    props.yMin,
    props.yMax,
    props.unit,
    props.seriesName,
  ],
  renderChart,
  { deep: true },
)

// 页面及容器尺寸变化时重绘
function resizeChart() {
  chart?.resize()
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resizeChart)

  if (chartRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resizeChart)
    resizeObserver.observe(chartRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
  resizeObserver = null
})
</script>

<template>
  <div class="trend-panel">
    <!-- 标题 -->
    <div class="section-title">
      <strong>{{ title }}</strong>
      <span>{{ subtitle }}</span>
    </div>

    <div class="chart-wrapper">
      <!-- ECharts 绘图区 -->
      <div ref="chartRef" class="chart"></div>

      <!-- 与真实时间轴对应的时间标签 -->
      <div class="fixed-x-axis">
        <div
          v-for="tick in timeTicks"
          :key="tick.time"
          class="time-tick"
          :style="{ left: `${tick.percent}%` }"
        >
          <span class="tick-line"></span>
          <span class="tick-text" :style="{ transform: tick.transform }">
            {{ tick.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 趋势图面板 */
.trend-panel {
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
  background: rgba(1, 29, 52, 0.88);
  border: 1px solid #075786;
}

/* 标题栏 */
.section-title {
  height: 32px;
  padding: 0 9px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #075184, #063457);
  border-bottom: 1px solid #075786;
}

.section-title strong {
  padding-left: 7px;
  color: #e0f8ff;
  font-size: 12px;
  border-left: 3px solid #14d9f5;
}

.section-title span {
  color: #6ca0bd;
  font-size: 9px;
}

/* 图表主体 */
.chart-wrapper {
  position: relative;
  width: 100%;
  height: calc(100% - 32px);
}

.chart {
  width: 100%;
  height: 100%;
}

/* 时间标签覆盖层：与ECharts的grid一致 */
.fixed-x-axis {
  position: absolute;
  z-index: 5;
  top: 44px;
  right: 26px;
  bottom: 0;
  left: 46px;
  pointer-events: none;
}

.time-tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
}

/* 竖向辅助线 */
.tick-line {
  position: absolute;
  top: 0;
  bottom: 30px;
  left: 0;
  width: 1px;
  background: rgba(53, 106, 151, 0.1);
}

/* 时间文字 */
.tick-text {
  position: absolute;
  left: 0;
  bottom: 7px;
  color: #7f9fb8;
  font-size: 8px;
  line-height: 1;
  white-space: nowrap;
  transform: translateX(-50%);
}
</style>
