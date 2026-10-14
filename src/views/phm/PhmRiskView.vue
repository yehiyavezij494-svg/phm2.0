<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue'

import RiskMatrixChart
  from '@/components/phm/RiskMatrixChart.vue'

import RiskList
  from '@/components/phm/RiskList.vue'

import {
  phmRiskData,
} from '@/mocks/phmRisk'


// =====================================================
// 当前选中的风险项
// 默认选择风险值最高的一项
// =====================================================

const highestRisk =
  [...phmRiskData.risks]
    .sort(
      (a, b) =>
        b.risk - a.risk,
    )[0]


const selectedRiskName =
  ref(
    highestRisk?.name ?? '',
  )


function handleSelectRisk(item) {
  selectedRiskName.value =
    item.name
}


// =====================================================
// 当前时间
// =====================================================

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
    clearInterval(timer)
  }
})
</script>

<template>
  <section class="risk-view">

    <!-- =================================================
         主体
    ================================================== -->

    <section class="risk-main">

      <!-- 左侧风险矩阵 -->
      <section class="risk-panel">

        <div class="panel-title">

          <strong>
            风险矩阵分布
          </strong>

          <span>
            横轴：发生概率 /
            纵轴：严重程度
          </span>

        </div>


        <div class="matrix-content">

          <RiskMatrixChart
            :data="
              phmRiskData.risks
            "
            :probability-threshold="
              phmRiskData.probabilityThreshold
            "
            :severity-threshold="
              phmRiskData.severityThreshold
            "
            :selected-name="
              selectedRiskName
            "
            @select="
              handleSelectRisk
            "
          />

        </div>

      </section>


      <!-- =================================================
           右侧风险清单
      ================================================== -->

      <section class="risk-panel">

        <div class="panel-title">

          <strong>
            风险项清单
          </strong>

          <span>
            共
            {{ phmRiskData.risks.length }}
            项
          </span>

        </div>


        <div class="list-content">

          <RiskList
            :data="
              phmRiskData.risks
            "
            :selected-name="
              selectedRiskName
            "
            @select="
              handleSelectRisk
            "
          />

        </div>

      </section>

    </section>


    <!-- =================================================
         底部状态栏
    ================================================== -->

    <footer class="risk-footer">

      <div class="footer-status">

        <span class="status-icon">
          ♧
        </span>

        <span>
          系统提示：2#牵引变压器油温持续偏高，请关注冷却系统运行状态。
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
.risk-view {
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

.risk-main {
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

.risk-panel {
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
    0 0 25px
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
  height: 36px;

  padding:
    0 10px;

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
  color: #6296b5;

  font-size: 9px;
}


/* =====================================================
   风险矩阵
===================================================== */

.matrix-content {
  width: 100%;

  height:
    calc(
      100% - 36px
    );

  min-height: 0;
}


/* =====================================================
   风险列表
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
   底部
===================================================== */

.risk-footer {
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
        0.90
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


@media (
  max-width: 1500px
) {
  .risk-main {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1fr);
  }
}
</style>