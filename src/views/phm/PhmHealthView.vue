<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import { storeToRefs } from 'pinia'

import HealthRadar
  from '@/components/phm/HealthRadar.vue'

import ComponentHealthDetail
  from '@/components/phm/ComponentHealthDetail.vue'

import {
  phmHealthData,
  defaultPhmHealthData,
} from '@/mocks/phmHealth'

import {
  usePhmStore,
} from '@/stores/phm'

const phmStore = usePhmStore()

const {
  selectedDeviceCode,
} = storeToRefs(phmStore)

const currentHealthData = computed(() => {
  return (
    phmHealthData[
      selectedDeviceCode.value
    ] ??
    defaultPhmHealthData
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
  <section class="health-view">

    <section class="health-main">

      <!-- 左侧雷达 -->
      <section class="health-panel">

        <div class="panel-title">
          <strong>
            部件健康度雷达
          </strong>

          <span>
            综合健康度
            {{ currentHealthData.overallHealth }}%
          </span>
        </div>

        <div class="radar-content">
          <HealthRadar
            :data="currentHealthData.radar"
          />
        </div>

      </section>

      <!-- 右侧健康度明细 -->
      <section class="health-panel">

        <div class="panel-title">
          <strong>
            部件健康度明细
          </strong>

          <span>
            模型
            {{ currentHealthData.model }}
          </span>
        </div>

        <div class="detail-content">
          <ComponentHealthDetail
            :data="currentHealthData.components"
          />
        </div>

      </section>

    </section>

    <!-- 底部状态 -->
    <footer class="health-footer">

      <div class="footer-status">
        <span class="status-icon">
          ♧
        </span>

        <span>
          通信链路正常，全网128台在线测点数据采集稳定。
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
.health-view {
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

.health-main {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);
  gap: 10px;
}

.health-panel {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background:
    rgba(1, 26, 48, 0.92);
  border: 1px solid #075786;
  box-shadow:
    inset
    0 0 26px
    rgba(0, 131, 196, 0.035);
}

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
    1px solid #075786;
}

.panel-title strong {
  display: flex;
  align-items: center;
  color: #e5f9ff;
  font-size: 13px;
  font-weight: 600;
}

.panel-title strong::before {
  content: "";
  width: 3px;
  height: 22px;
  margin-right: 7px;
  background: #16dcef;
  box-shadow:
    0 0 5px
    rgba(22, 220, 239, 0.42);
}

.panel-title span {
  color: #6296b7;
  font-size: 9px;
}

.radar-content {
  width: 100%;
  height:
    calc(100% - 36px);
  min-height: 0;
}

.detail-content {
  width: 100%;
  height:
    calc(100% - 36px);
  min-height: 0;
  overflow-y: auto;
}

.health-footer {
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
      rgba(2, 31, 54, 0.9)
    );
  border: 1px solid #075786;
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
  .health-main {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1fr);
  }
}
</style>