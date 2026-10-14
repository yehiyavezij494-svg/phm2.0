<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import {
  storeToRefs,
} from 'pinia'

import MetricCards
  from '@/components/common/MetricCards.vue'

import ReliabilityCurve
  from '@/components/phm/ReliabilityCurve.vue'

import {
  phmReliabilityData,
  defaultPhmReliabilityData,
} from '@/mocks/phmReliability'

import {
  usePhmStore,
} from '@/stores/phm'


/* =====================================================
   当前设备
===================================================== */

const phmStore =
  usePhmStore()


const {
  selectedDeviceCode,
} = storeToRefs(
  phmStore,
)


const currentData =
  computed(() => {
    return (
      phmReliabilityData[
        selectedDeviceCode.value
      ] ??
      defaultPhmReliabilityData
    )
  })


/* =====================================================
   可靠性指标卡
===================================================== */

const metrics =
  computed(() => {
    return [
      {
        key: 'mtbf',

        icon: '◷',

        value:
          currentData.value.mtbf,

        unit: 'h',

        label:
          '平均无故障时间 MTBF',

        theme:
          'cyan',
      },

      {
        key: 'mttr',

        icon: '↻',

        value:
          currentData.value.mttr,

        unit: 'h',

        label:
          '平均修复时间 MTTR',

        theme:
          'cyan',
      },

      {
        key: 'availability',

        icon: '✓',

        value:
          currentData.value.availability,

        unit: '%',

        label:
          '设备可用率',

        theme:
          'green',
      },

      {
        key: 'failureRate',

        icon: '!',

        value:
          currentData.value.failureRate,

        unit: '次/年',

        label:
          '年故障率',

        theme:
          'orange',
      },
    ]
  })


/* =====================================================
   时间
===================================================== */

const currentTime =
  ref('')

const currentDate =
  ref('')

let timer = null


function updateTime() {
  const now =
    new Date()


  currentTime.value =
    now.toLocaleTimeString(
      'zh-CN',
      {
        hour12: false,
      },
    )


  const weekdays = [
    '周日',
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
  ]


  const year =
    now.getFullYear()


  const month =
    String(
      now.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )


  const day =
    String(
      now.getDate(),
    ).padStart(
      2,
      '0',
    )


  currentDate.value =
    `${year}-${month}-${day} ${weekdays[now.getDay()]}`
}


onMounted(() => {
  updateTime()


  timer =
    setInterval(
      updateTime,
      1000,
    )
})


onBeforeUnmount(() => {
  if (timer) {
    clearInterval(
      timer,
    )
  }
})
</script>


<template>
  <section class="reliability-view">

    <!-- =================================================
         顶部公共指标
    ================================================== -->

    <MetricCards
      :items="metrics"
      :columns="4"
      variant="compact"
    />


    <!-- =================================================
         可靠度衰减曲线
    ================================================== -->

    <section class="curve-panel">

      <div class="panel-title">

        <strong>
          可靠度 R(t) 衰减曲线
        </strong>

        <span>
          运行时间 / 千小时
        </span>

      </div>


      <div class="curve-content">

        <ReliabilityCurve
          :decay-rate="
            currentData.decayRate
          "
          :threshold="
            currentData.threshold
          "
        />

      </div>

    </section>


    <!-- =================================================
         底部状态栏
    ================================================== -->

    <footer class="reliability-footer">

      <div class="footer-status">

        <span class="status-icon">
          ♧
        </span>

        <span>
          PHM 模型已完成更新，剩余寿命预测精度提升至 94.2%。
        </span>

      </div>


      <div class="footer-time">

        <span class="clock-icon">
          ◷
        </span>

        <strong>
          {{ currentTime }}
        </strong>

        <span class="date-text">
          {{ currentDate }}
        </span>

      </div>

    </footer>

  </section>
</template>


<style scoped>
.reliability-view {
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 706px;

  display: grid;

  grid-template-rows:
    64px
    minmax(0, 1fr)
    31px;

  gap: 10px;
}


/* =====================================================
   主曲线
===================================================== */

.curve-panel {
  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background:
    rgba(
      1,
      26,
      48,
      0.92
    );

  border:
    1px solid
    #075786;

  box-shadow:
    inset
    0
    0
    25px
    rgba(
      0,
      132,
      198,
      0.035
    );
}


/* =====================================================
   标题
===================================================== */

.panel-title {
  height:
    36px;

  padding:
    0 10px;

  box-sizing:
    border-box;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  background:
    linear-gradient(
      90deg,
      #075184,
      #063457
    );

  border-bottom:
    1px solid
    #075786;
}


.panel-title strong {
  display:
    flex;

  align-items:
    center;

  color:
    #e4f8ff;

  font-size:
    13px;

  font-weight:
    600;
}


.panel-title strong::before {
  content:
    "";

  width:
    3px;

  height:
    22px;

  margin-right:
    7px;

  background:
    #16dcef;

  box-shadow:
    0
    0
    5px
    rgba(
      22,
      220,
      239,
      0.42
    );
}


.panel-title span {
  color:
    #6698b5;

  font-size:
    9px;
}


/* =====================================================
   图表
===================================================== */

.curve-content {
  width:
    100%;

  height:
    calc(
      100% - 36px
    );

  min-height:
    0;
}


/* =====================================================
   底部
===================================================== */

.reliability-footer {
  min-width:
    0;

  height:
    31px;

  padding:
    0 12px;

  box-sizing:
    border-box;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  color:
    #75a0b9;

  font-size:
    10px;

  background:
    linear-gradient(
      90deg,
      rgba(
        3,
        47,
        78,
        0.88
      ),
      rgba(
        2,
        31,
        54,
        0.90
      )
    );

  border:
    1px solid
    #075786;
}


.footer-status {
  display:
    flex;

  align-items:
    center;

  gap:
    7px;
}


.status-icon {
  color:
    #ffd20a;

  font-size:
    12px;
}


.footer-time {
  display:
    flex;

  align-items:
    center;

  gap:
    7px;
}


.clock-icon {
  color:
    #4bc6ef;

  font-size:
    12px;
}


.footer-time strong {
  color:
    #15e8f5;

  font-size:
    14px;

  letter-spacing:
    1px;
}


.date-text {
  color:
    #73a0ba;
}


/* =====================================================
   中等屏幕
===================================================== */

@media (
  max-width: 1500px
) {
  .reliability-view {
    grid-template-rows:
      60px
      minmax(0, 1fr)
      31px;
  }
}
</style>