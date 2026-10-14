<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import FaultProbability
  from '@/components/phm/FaultProbability.vue'

import PredictionList
  from '@/components/phm/PredictionList.vue'

import {
  phmPredictionData,
} from '@/mocks/phmPrediction'


const chartData = computed(() => {
  return phmPredictionData.predictions.map(
    (item) => ({
      name: item.name,
      value: item.probability,
    }),
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
  <section class="prediction-view">

    <section class="prediction-main">

      <!-- 左侧：未来7天故障概率 -->
      <section class="prediction-panel">

        <div class="panel-title">

          <strong>
            未来7天故障概率预测
          </strong>

          <span>
            预警阈值
            {{ phmPredictionData.warningThreshold }}%
          </span>

        </div>

        <div class="chart-content">

          <FaultProbability
            :data="chartData"
          />

        </div>

      </section>


      <!-- 右侧：预测清单 -->
      <section class="prediction-panel">

        <div class="panel-title">

          <strong>
            预测故障清单
          </strong>

          <span>
            共
            {{ phmPredictionData.predictions.length }}
            项
          </span>

        </div>

        <div class="list-content">

          <PredictionList
            :data="
              phmPredictionData.predictions
            "
          />

        </div>

      </section>

    </section>


    <!-- 底部状态栏 -->
    <footer class="prediction-footer">

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
.prediction-view {
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

.prediction-main {
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

.prediction-panel {
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
    0 0 25px
    rgba(0, 132, 198, 0.035);
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
  color: #6093b0;

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
   预测清单
===================================================== */

.list-content {
  width: 100%;

  height:
    calc(
      100% - 36px
    );

  min-height: 0;
}


/* =====================================================
   底部状态栏
===================================================== */

.prediction-footer {
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
  .prediction-main {
    grid-template-columns:
      minmax(0, 1.55fr)
      minmax(320px, 1fr);
  }
}
</style>