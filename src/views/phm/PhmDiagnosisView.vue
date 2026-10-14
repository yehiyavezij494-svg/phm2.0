<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import { storeToRefs } from 'pinia'

import FaultProbability
  from '@/components/phm/FaultProbability.vue'

import DiagnosisAdviceList
  from '@/components/phm/DiagnosisAdviceList.vue'

import {
  phmDiagnosisData,
  defaultPhmDiagnosisData,
} from '@/mocks/phmDiagnosis'

import {
  usePhmStore,
} from '@/stores/phm'


const phmStore = usePhmStore()

const {
  selectedDeviceCode,
} = storeToRefs(phmStore)


const currentDiagnosisData = computed(() => {
  return (
    phmDiagnosisData[
      selectedDeviceCode.value
    ] ??
    defaultPhmDiagnosisData
  )
})


const currentTime = ref('')
const currentDate = ref('')

let timer = null


function updateTime() {
  const now = new Date()

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
    clearInterval(timer)
  }
})
</script>

<template>
  <section class="diagnosis-view">

    <section class="diagnosis-main">

      <!-- 左侧：故障模式概率 -->
      <section class="diagnosis-panel">

        <div class="panel-title">

          <strong>
            故障模式概率分布
          </strong>

          <span>
            诊断引擎
            {{ currentDiagnosisData.engine }}
          </span>

        </div>

        <div class="probability-content">

          <FaultProbability
            :data="
              currentDiagnosisData.probabilities
            "
          />

        </div>

      </section>


      <!-- 右侧：结论 -->
      <section class="diagnosis-panel">

        <div class="panel-title">

          <strong>
            诊断结论与处置建议
          </strong>

          <span>
            共
            {{ currentDiagnosisData.conclusions.length }}
            条
          </span>

        </div>

        <div class="advice-content">

          <DiagnosisAdviceList
            :data="
              currentDiagnosisData.conclusions
            "
          />

        </div>

      </section>

    </section>


    <!-- 底部 -->
    <footer class="diagnosis-footer">

      <div class="footer-status">

        <span class="status-icon">
          ♧
        </span>

        <span>
          今日计划检修3项，请检修班组及时确认工单。
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
.diagnosis-view {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 706px;

  display: grid;

  grid-template-rows:
    minmax(0, 1fr)
    31px;

  gap: 10px;
}


/* =====================================================
   主体
===================================================== */

.diagnosis-main {
  min-width: 0;
  min-height: 0;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  gap: 10px;
}


/* =====================================================
   面板
===================================================== */

.diagnosis-panel {
  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background:
    rgba(1, 26, 48, 0.92);

  border:
    1px solid
    #075786;

  box-shadow:
    inset
    0 0 24px
    rgba(0, 133, 199, 0.035);
}


/* =====================================================
   标题
===================================================== */

.panel-title {
  height: 36px;

  padding: 0 10px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

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
  display: flex;
  align-items: center;

  color: #e4f7fe;

  font-size: 13px;
  font-weight: 600;
}

.panel-title strong::before {
  content: "";

  width: 3px;
  height: 22px;

  margin-right: 7px;

  background: #15daee;

  box-shadow:
    0 0 5px
    rgba(21, 218, 238, 0.42);
}

.panel-title span {
  color: #6092b0;
  font-size: 9px;
}


/* =====================================================
   左侧图表
===================================================== */

.probability-content {
  width: 100%;

  height:
    calc(100% - 36px);

  min-height: 0;
}


/* =====================================================
   右侧结果
===================================================== */

.advice-content {
  width: 100%;

  height:
    calc(100% - 36px);

  min-height: 0;
}


/* =====================================================
   底部状态栏
===================================================== */

.diagnosis-footer {
  min-width: 0;

  height: 31px;

  padding: 0 12px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: space-between;

  color: #75a0b9;

  font-size: 10px;

  background:
    linear-gradient(
      90deg,
      rgba(3, 47, 78, 0.88),
      rgba(2, 31, 54, 0.90)
    );

  border:
    1px solid
    #075786;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 7px;
}

.status-icon {
  color: #ffd20a;
  font-size: 12px;
}

.footer-time {
  display: flex;
  align-items: center;
  gap: 7px;
}

.clock-icon {
  color: #4bc6ef;
  font-size: 12px;
}

.footer-time strong {
  color: #15e8f5;

  font-size: 14px;

  letter-spacing: 1px;
}

.date-text {
  color: #73a0ba;
}

@media (max-width: 1500px) {
  .diagnosis-main {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1fr);
  }
}
</style>