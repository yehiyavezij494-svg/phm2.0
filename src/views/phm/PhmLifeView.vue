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

import RemainingLifeChart
  from '@/components/phm/RemainingLifeChart.vue'

import {
  phmLifeData,
  defaultPhmLifeData,
} from '@/mocks/phmLife'

import {
  usePhmStore,
} from '@/stores/phm'


const phmStore =
  usePhmStore()

const {
  selectedDeviceCode,
} = storeToRefs(
  phmStore,
)


const currentLifeData =
  computed(() => {
    return (
      phmLifeData[
        selectedDeviceCode.value
      ] ??
      defaultPhmLifeData
    )
  })


const currentTime = ref('')
const currentDate = ref('')

let timer = null


function getLifeClass(value) {
  if (value <= 1.5) {
    return 'life-danger'
  }

  if (value <= 4.9) {
    return 'life-warning'
  }

  return 'life-normal'
}


function getHealthClass(value) {
  if (value < 60) {
    return 'health-danger'
  }

  if (value < 80) {
    return 'health-warning'
  }

  return 'health-normal'
}


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
  <section class="life-view">

    <section class="life-main">

      <!-- 左侧 -->
      <section class="life-panel chart-panel">

        <div class="panel-title">

          <strong>
            健康度衰减与剩余寿命预测
          </strong>

          <span>
            模型
            {{ currentLifeData.model }}
          </span>

        </div>

        <div class="chart-content">

          <RemainingLifeChart
            :data="
              currentLifeData.chart
            "
          />

        </div>

      </section>


      <!-- 右侧 -->
      <section class="life-panel estimate-panel">

        <div class="panel-title">

          <strong>
            剩余寿命估算
          </strong>

          <span>
            共
            {{ currentLifeData.estimates.length }}
            台
          </span>

        </div>


        <div class="estimate-table">

          <div class="table-header">

            <span>设备</span>

            <span>
              健康度
            </span>

            <span>
              剩余寿命
            </span>

            <span>
              置信度
            </span>

          </div>


          <div
            v-for="item in currentLifeData.estimates"
            :key="item.name"
            class="table-row"
          >

            <strong class="device-name">
              {{ item.name }}
            </strong>

            <span
              class="health-value"
              :class="
                getHealthClass(
                  item.health,
                )
              "
            >
              {{ item.health }}

              <small>
                %
              </small>
            </span>

            <strong
              class="life-value"
              :class="
                getLifeClass(
                  item.life,
                )
              "
            >
              {{ item.life }}

              <small>
                年
              </small>
            </strong>

            <span class="confidence-value">
              {{ item.confidence }}%
            </span>

          </div>

        </div>

      </section>

    </section>


    <!-- 底部状态 -->
    <footer class="life-footer">

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
.life-view {
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

.life-main {
  min-width: 0;
  min-height: 0;

  display: grid;

  grid-template-columns:
    minmax(0, 1.6fr)
    minmax(340px, 1fr);

  gap: 10px;
}


/* =====================================================
   面板
===================================================== */

.life-panel {
  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background:
    rgba(1, 26, 48, 0.92);

  border:
    1px solid
    #075786;
}


/* =====================================================
   标题
===================================================== */

.panel-title {
  height: 36px;

  padding: 0 10px;

  box-sizing:
    border-box;

  display: flex;

  align-items: center;

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

  background:
    #16dcef;

  box-shadow:
    0 0 5px
    rgba(
      22,
      220,
      239,
      0.42
    );
}


.panel-title span {
  color: #6296b7;

  font-size: 9px;
}


/* =====================================================
   图表
===================================================== */

.chart-content {
  width: 100%;

  height:
    calc(
      100% - 36px
    );

  min-height: 0;
}


/* =====================================================
   表格
===================================================== */

.estimate-table {
  width: 100%;
}


.table-header,
.table-row {
  display: grid;

  grid-template-columns:
    minmax(120px, 1.6fr)
    minmax(70px, 0.8fr)
    minmax(90px, 0.9fr)
    minmax(70px, 0.7fr);

  align-items: center;
}


.table-header {
  height: 32px;

  padding:
    0 12px;

  box-sizing:
    border-box;

  color: #6591ac;

  font-size: 9px;

  background:
    rgba(
      4,
      49,
      82,
      0.52
    );

  border-bottom:
    1px solid
    rgba(
      26,
      85,
      123,
      0.28
    );
}


.table-row {
  min-height: 45px;

  padding:
    0 12px;

  box-sizing:
    border-box;

  border-bottom:
    1px dashed
    rgba(
      33,
      88,
      123,
      0.23
    );
}


.device-name {
  color: #d5edf5;

  font-size: 10px;

  font-weight: 600;
}


.health-value {
  font-size: 12px;

  font-weight: 600;
}


.health-value small,
.life-value small {
  font-size: 8px;

  font-weight: normal;
}


.health-normal {
  color: #0ee2ef;
}


.health-warning {
  color: #ffae00;
}


.health-danger {
  color: #ff526c;
}


.life-value {
  font-size: 12px;
}


.life-normal {
  color: #29e3a6;
}


.life-warning {
  color: #ffb10e;
}


.life-danger {
  color: #ff5570;
}


.confidence-value {
  color: #9bb7c9;

  font-size: 10px;
}


/* =====================================================
   底部状态
===================================================== */

.life-footer {
  min-width: 0;

  height: 31px;

  padding:
    0 12px;

  box-sizing:
    border-box;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  color: #75a0b9;

  font-size: 10px;

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
        0.9
      )
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
  .life-main {
    grid-template-columns:
      minmax(0, 1.5fr)
      minmax(320px, 1fr);
  }
}
</style>