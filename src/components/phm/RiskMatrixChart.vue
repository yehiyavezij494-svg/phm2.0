<script setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import * as echarts from 'echarts'


// =====================================================
// 接收数据
// =====================================================

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },

  // 这两个参数暂时保留
  // 因为父页面目前还在传
  // 但本组件已经不再绘制固定阈值线
  probabilityThreshold: {
    type: Number,
    default: 3,
  },

  severityThreshold: {
    type: Number,
    default: 3,
  },

  selectedName: {
    type: String,
    default: '',
  },
})


const emit = defineEmits([
  'select',
])


const chartRef = ref(null)

let chart = null

let resizeObserver = null


// =====================================================
// 当前选中的风险项
// =====================================================

const selectedRisk = computed(() => {
  return props.data.find(
    (item) =>
      item.name ===
      props.selectedName,
  )
})


// =====================================================
// 风险等级颜色
// =====================================================

function getPointColor(level) {
  if (level === '紧急') {
    return '#ff5b6d'
  }

  if (level === '重要') {
    return '#ffae18'
  }

  return '#14dcec'
}


// =====================================================
// 所有风险点
// =====================================================

function getSeriesData() {
  return props.data.map(
    (item) => {
      const isSelected =
        item.name ===
        props.selectedName

      return {
        name: item.name,

        value: [
          item.probability,
          item.severity,
          item.risk,
        ],

        level: item.level,

        raw: item,

        itemStyle: {
          color:
            getPointColor(
              item.level,
            ),

          shadowBlur:
            isSelected
              ? 18
              : 8,

          shadowColor:
            getPointColor(
              item.level,
            ),

          borderColor:
            isSelected
              ? '#ffffff'
              : 'rgba(255,255,255,0.35)',

          borderWidth:
            isSelected
              ? 2
              : 1,
        },
      }
    },
  )
}


// =====================================================
// 当前风险点定位线
//
// 只在选中风险点之后出现
//
// 横线：Y轴 -> 风险点
// 竖线：X轴 -> 风险点
// =====================================================

function getLocatorLines() {
  const item =
    selectedRisk.value

  if (!item) {
    return []
  }

  return [
    // =========================
    // 横向定位线
    // =========================
    [
      {
        coord: [
          0,
          item.severity,
        ],

        lineStyle: {
          color: '#20dfff',
          width: 1.4,
          type: 'dashed',
        },

        label: {
          show: false,
        },
      },

      {
        coord: [
          item.probability,
          item.severity,
        ],

        lineStyle: {
          color: '#20dfff',
          width: 1.4,
          type: 'dashed',
        },

        label: {
          show: false,
        },
      },
    ],


    // =========================
    // 竖向定位线
    // =========================
    [
      {
        coord: [
          item.probability,
          0,
        ],

        lineStyle: {
          color: '#20dfff',
          width: 1.4,
          type: 'dashed',
        },

        label: {
          show: false,
        },
      },

      {
        coord: [
          item.probability,
          item.severity,
        ],

        lineStyle: {
          color: '#20dfff',
          width: 1.4,
          type: 'dashed',
        },

        label: {
          show: false,
        },
      },
    ],
  ]
}


// =====================================================
// 绘制图表
// =====================================================

function renderChart() {
  if (!chartRef.value) {
    return
  }


  if (!chart) {
    chart =
      echarts.init(
        chartRef.value,
      )
  }


  const item =
    selectedRisk.value


  chart.setOption(
    {
      animationDuration: 400,


      // =================================================
      // 提示框
      // =================================================

      tooltip: {
        trigger: 'item',

        backgroundColor:
          'rgba(2, 26, 47, 0.96)',

        borderColor:
          '#0a729e',

        borderWidth: 1,

        textStyle: {
          color: '#def7ff',
          fontSize: 10,
        },

        formatter(params) {
          const raw =
            params.data?.raw

          if (!raw) {
            return ''
          }

          return (
            `${raw.name}<br>` +
            `发生概率：${raw.probability}<br>` +
            `严重程度：${raw.severity}<br>` +
            `风险值：${raw.risk}<br>` +
            `风险等级：${raw.level}`
          )
        },
      },


      // =================================================
      // 图表区域
      // =================================================

      grid: {
        left: 50,
        right: 45,
        top: 38,
        bottom: 40,
      },


      // =================================================
      // X轴
      // =================================================

      xAxis: {
        type: 'value',

        min: 0,
        max: 5,
        interval: 1,

        name: '发生概率',

        nameLocation: 'end',

        nameGap: 8,

        nameTextStyle: {
          color: '#7298af',
          fontSize: 9,
        },

        axisLine: {
          lineStyle: {
            color: '#285879',
          },
        },

        axisTick: {
          show: false,
        },

        axisLabel: {
          color: '#7398af',
          fontSize: 9,
        },

        splitLine: {
          lineStyle: {
            color:
              'rgba(34, 95, 134, 0.15)',
          },
        },
      },


      // =================================================
      // Y轴
      // =================================================

      yAxis: {
        type: 'value',

        min: 0,
        max: 5,
        interval: 1,

        name: '严重程度',

        nameLocation: 'end',

        nameGap: 9,

        nameTextStyle: {
          color: '#7298af',
          fontSize: 9,
        },

        axisLine: {
          lineStyle: {
            color: '#285879',
          },
        },

        axisTick: {
          show: false,
        },

        axisLabel: {
          color: '#7398af',
          fontSize: 9,
        },

        splitLine: {
          lineStyle: {
            color:
              'rgba(34, 95, 134, 0.15)',
          },
        },
      },


      // =================================================
      // 数据
      // =================================================

      series: [

        // ===============================================
        // 第一层：所有风险点
        //
        // 注意：
        // 这里已经彻底删除原来的固定 markLine
        // 所以不会再出现：
        // 概率阈值3
        // 严重度阈值3
        // ===============================================

        {
          name: '风险项',

          type: 'scatter',

          data:
            getSeriesData(),

          symbol: 'circle',

          z: 5,

          symbolSize(
            value,
            params,
          ) {
            const isSelected =
              params.data?.name ===
              props.selectedName

            if (isSelected) {
              return (
                15 +
                value[2] * 0.65
              )
            }

            return (
              9 +
              value[2] * 0.55
            )
          },

          emphasis: {
            scale: 1.2,
          },

          label: {
            show: false,
          },
        },


        // ===============================================
        // 第二层：当前选中风险点
        //
        // 这一层只在点击以后出现
        //
        // 负责：
        // 1. 高亮点
        // 2. 风险值标签
        // 3. 横纵定位线
        // ===============================================

        {
          name: '当前风险',

          type: 'scatter',

          silent: true,

          z: 10,

          data:
            item
              ? [
                  {
                    value: [
                      item.probability,
                      item.severity,
                      item.risk,
                    ],

                    itemStyle: {
                      color:
                        getPointColor(
                          item.level,
                        ),

                      borderColor:
                        '#ffffff',

                      borderWidth: 2,

                      shadowBlur: 20,

                      shadowColor:
                        getPointColor(
                          item.level,
                        ),
                    },

                    label: {
                      show: true,

                      position: 'top',

                      distance: 10,

                      formatter:
                        `风险值 ${item.risk}`,

                      color: '#ffffff',

                      fontSize: 10,

                      fontWeight: 600,

                      backgroundColor:
                        'rgba(3, 31, 53, 0.88)',

                      borderColor:
                        getPointColor(
                          item.level,
                        ),

                      borderWidth: 1,

                      borderRadius: 2,

                      padding: [
                        4,
                        7,
                      ],
                    },
                  },
                ]
              : [],


          symbolSize:
            item
              ? (
                  16 +
                  item.risk * 0.65
                )
              : 0,


          // =============================================
          // 这里只保留点击后的定位线
          // =============================================

          markLine: {
            silent: true,

            symbol: [
              'none',
              'none',
            ],

            label: {
              show: false,
            },

            lineStyle: {
              color: '#20dfff',
              width: 1.4,
              type: 'dashed',
            },

            data:
              getLocatorLines(),
          },
        },
      ],
    },

    true,
  )
}


// =====================================================
// 点击风险点
// =====================================================

function handleChartClick(
  params,
) {
  // 只允许点击原始风险点
  if (
    params.seriesName !==
    '风险项'
  ) {
    return
  }


  const item =
    params.data?.raw


  if (!item) {
    return
  }


  emit(
    'select',
    item,
  )
}


// =====================================================
// 数据变化重新绘图
// =====================================================

watch(
  () => [
    props.data,
    props.selectedName,
  ],

  () => {
    renderChart()
  },

  {
    deep: true,
  },
)


// =====================================================
// 挂载
// =====================================================

onMounted(() => {
  renderChart()


  chart?.on(
    'click',
    handleChartClick,
  )


  resizeObserver =
    new ResizeObserver(
      () => {
        chart?.resize()
      },
    )


  if (
    chartRef.value
  ) {
    resizeObserver.observe(
      chartRef.value,
    )
  }
})


// =====================================================
// 销毁
// =====================================================

onBeforeUnmount(() => {
  resizeObserver?.disconnect()


  if (chart) {
    chart.off(
      'click',
      handleChartClick,
    )

    chart.dispose()

    chart = null
  }
})
</script>


<template>
  <div
    ref="chartRef"
    class="risk-matrix-chart"
  ></div>
</template>


<style scoped>
.risk-matrix-chart {
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;
}
</style>