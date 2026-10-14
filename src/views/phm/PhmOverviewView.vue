<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import AlarmPanel from '@/components/monitor/AlarmPanel.vue'
import PhmKpiCards from '@/components/phm/PhmKpiCards.vue'
import HealthRadar from '@/components/phm/HealthRadar.vue'
import FaultProbability from '@/components/phm/FaultProbability.vue'

import {
  phmDeviceData,
  defaultPhmData,
} from '@/mocks/phm'

import { usePhmStore } from '@/stores/phm'

const phmStore = usePhmStore()

const {
  selectedDeviceCode,
} = storeToRefs(phmStore)

const currentPhmData = computed(() => {
  return (
    phmDeviceData[
      selectedDeviceCode.value
    ] ??
    defaultPhmData
  )
})

const highestFaultProbability = computed(() => {
  const data =
    currentPhmData.value.faultProbability

  if (!data?.length) {
    return 0
  }

  return Math.max(
    ...data.map(
      (item) => item.value,
    ),
  )
})
</script>

<template>
  <div class="overview-page">

    <!-- KPI -->
    <PhmKpiCards
      :data="currentPhmData"
    />

    <!-- 中间三块 -->
    <section class="overview-main">

      <!-- 综合健康评估 -->
      <div class="phm-panel">
        <div class="panel-title">
          <strong>
            综合健康评估
          </strong>

          <span>
            {{
              currentPhmData
                .healthRadar
                .indicators
                .length
            }}
            个指标
          </span>
        </div>

        <div class="panel-body">
          <HealthRadar
            :data="
              currentPhmData.healthRadar
            "
          />
        </div>
      </div>

      <!-- 故障模式概率 -->
      <div class="phm-panel">
        <div class="panel-title">
          <strong>
            故障模式概率
          </strong>

          <span>
            最高
            {{ highestFaultProbability }}%
          </span>
        </div>

        <div class="panel-body">
          <FaultProbability
            :data="
              currentPhmData
                .faultProbability
            "
          />
        </div>
      </div>

      <!-- 关键预警 -->
      <AlarmPanel
        title="关键预警"
        :alarms="
          currentPhmData.warnings
        "
      />

    </section>

    <!-- 底部功能卡 -->
    <section class="function-area">

      <div class="function-card danger-card">
        <span>超限报警</span>
        <strong>
          {{ currentPhmData.alarmCount }}
          <small>项</small>
        </strong>
      </div>

      <div class="function-card warning-card">
        <span>健康评估</span>
        <strong>
          {{ currentPhmData.healthScore }}
          <small>分</small>
        </strong>
      </div>

      <div class="function-card warning-card">
        <span>剩余寿命</span>
        <strong>
          {{ currentPhmData.remainingLife }}
          <small>年</small>
        </strong>
      </div>

      <div class="function-card danger-card">
        <span>故障诊断</span>
        <strong>
          {{ currentPhmData.predictedFaultCount }}
          <small>类</small>
        </strong>
      </div>

      <div class="function-card danger-card">
        <span>故障预测</span>
        <strong>
          {{ highestFaultProbability }}
          <small>%</small>
        </strong>
      </div>

      <div class="function-card success-card">
        <span>可靠性评估</span>
        <strong>
          {{ currentPhmData.reliability }}
          <small>%</small>
        </strong>
      </div>

      <div class="function-card danger-card">
        <span>风险性评估</span>
        <strong>
          {{ currentPhmData.maxRisk }}
        </strong>
      </div>

    </section>

  </div>
</template>

<style scoped>
.overview-page {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 706px;
  display: grid;
  grid-template-rows:
    64px
    minmax(430px, 1fr)
    72px;
  gap: 10px;
}

.overview-main {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns:
    minmax(0, 0.95fr)
    minmax(0, 0.95fr)
    minmax(300px, 1.05fr);
  gap: 10px;
}

.phm-panel {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background:
    rgba(1, 29, 52, 0.9);
  border: 1px solid #075786;
  box-shadow:
    inset 0 0 24px
    rgba(0, 137, 202, 0.04);
}

.panel-title {
  height: 32px;
  padding: 0 9px;
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
  border-bottom: 1px solid #075786;
}

.panel-title strong {
  padding-left: 7px;
  color: #e0f8ff;
  font-size: 12px;
  font-weight: 600;
  border-left: 3px solid #14d9f5;
}

.panel-title span {
  color: #6c9dbb;
  font-size: 9px;
}

.panel-body {
  width: 100%;
  height: calc(100% - 32px);
  min-height: 0;
  overflow: hidden;
}

.function-area {
  min-width: 0;
  display: grid;
  grid-template-columns:
    repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.function-card {
  position: relative;
  min-width: 0;
  height: 72px;
  padding: 9px 12px;
  box-sizing: border-box;
  overflow: hidden;
  background:
    rgba(2, 34, 59, 0.92);
  border: 1px solid #075786;
}

.function-card::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background: currentColor;
}

.function-card span {
  display: block;
  color: #79a2bd;
  font-size: 10px;
}

.function-card strong {
  display: block;
  margin-top: 6px;
  font-size: 20px;
}

.function-card small {
  margin-left: 2px;
  font-size: 9px;
  font-weight: normal;
}

.danger-card {
  color: #ff506d;
}

.warning-card {
  color: #ffad1a;
}

.success-card {
  color: #35e6af;
}

@media (max-width: 1500px) {
  .overview-page {
    grid-template-rows:
      60px
      minmax(420px, 1fr)
      68px;
  }

  .overview-main {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1fr)
      minmax(280px, 1fr);
  }

  .function-card {
    height: 68px;
    padding: 8px 9px;
  }

  .function-card strong {
    font-size: 17px;
  }
}
</style>