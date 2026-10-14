<script setup>
import { computed } from 'vue'

import MetricCards
  from '@/components/common/MetricCards.vue'


const props = defineProps({
  records: {
    type: Array,
    default: () => [],
  },

  updatedAt: {
    type: String,
    default: '--:--:--',
  },
})


/* =====================================================
   顶部统计
===================================================== */

const summaryCards = computed(() => {
  const emergencyCount =
    props.records.filter(
      (item) =>
        item.level === '紧急',
    ).length

  const importantCount =
    props.records.filter(
      (item) =>
        item.level === '重要',
    ).length

  const normalCount =
    props.records.filter(
      (item) =>
        item.level === '一般',
    ).length


  return [
    {
      key: 'total',

      icon: '!',

      value:
        props.records.length,

      unit: '项',

      label:
        '超限总数',

      theme:
        'cyan',
    },

    {
      key: 'emergency',

      icon: '×',

      value:
        emergencyCount,

      unit: '项',

      label:
        '紧急',

      theme:
        'red',
    },

    {
      key: 'important',

      icon: '!',

      value:
        importantCount,

      unit: '项',

      label:
        '重要',

      theme:
        'orange',
    },

    {
      key: 'normal',

      icon: 'i',

      value:
        normalCount,

      unit: '项',

      label:
        '一般',

      theme:
        'green',
    },
  ]
})


/* =====================================================
   等级样式
===================================================== */

function getLevelClass(level) {
  if (level === '紧急') {
    return 'level-danger'
  }

  if (level === '重要') {
    return 'level-warning'
  }

  return 'level-normal'
}


function getValueClass(level) {
  if (level === '紧急') {
    return 'value-danger'
  }

  if (level === '重要') {
    return 'value-warning'
  }

  return 'value-normal'
}


function getBarClass(level) {
  if (level === '紧急') {
    return 'bar-danger'
  }

  if (level === '重要') {
    return 'bar-warning'
  }

  return 'bar-normal'
}


function getBarWidth(value) {
  return `${
    Math.max(
      3,
      Math.min(
        value,
        100,
      ),
    )
  }%`
}
</script>


<template>
  <section class="alarm-page">

    <!-- =================================================
         顶部公共指标卡
    ================================================== -->

    <MetricCards
      :items="summaryCards"
      :columns="4"
      variant="phm"
    />


    <!-- =================================================
         超限明细
    ================================================== -->

    <section class="detail-panel">

      <div class="panel-title">

        <strong>
          超限明细
        </strong>

        <span>
          最近更新
          {{ updatedAt }}
        </span>

      </div>


      <div class="detail-table">

        <!-- 表头 -->
        <div class="table-header">

          <span>
            测点
          </span>

          <span>
            所属设备
          </span>

          <span>
            实时值
          </span>

          <span>
            限值
          </span>

          <span>
            超限幅度
          </span>

          <span>
            等级
          </span>

        </div>


        <!-- 数据 -->
        <div class="table-body">

          <div
            v-for="(item, index) in records"
            :key="
              `${item.deviceCode}-${item.point}-${index}`
            "
            class="table-row"
          >

            <!-- 测点 -->
            <span class="point-name">
              {{ item.point }}
            </span>


            <!-- 所属设备 -->
            <span class="device-name">
              {{ item.device }}
            </span>


            <!-- 实时值 -->
            <span
              class="realtime-value"
              :class="
                getValueClass(
                  item.level,
                )
              "
            >
              {{ item.value }}

              <small>
                {{ item.unit }}
              </small>
            </span>


            <!-- 限值 -->
            <span class="limit-value">
              {{ item.limit }}

              <small>
                {{ item.unit }}
              </small>
            </span>


            <!-- 超限幅度 -->
            <div class="over-range">

              <div class="progress-track">

                <div
                  class="progress-value"
                  :class="
                    getBarClass(
                      item.level,
                    )
                  "
                  :style="{
                    width:
                      getBarWidth(
                        item.overRate,
                      ),
                  }"
                ></div>

              </div>


              <strong
                :class="
                  getValueClass(
                    item.level,
                  )
                "
              >
                +{{ item.overRate }}%
              </strong>

            </div>


            <!-- 等级 -->
            <span
              class="level-tag"
              :class="
                getLevelClass(
                  item.level,
                )
              "
            >
              {{ item.level }}
            </span>

          </div>


          <div
            v-if="!records.length"
            class="empty-data"
          >
            当前无超限报警
          </div>

        </div>

      </div>

    </section>

  </section>
</template>


<style scoped>
.alarm-page {
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 706px;

  display: grid;

  grid-template-rows:
    64px
    minmax(0, 1fr);

  gap: 10px;
}


/* =====================================================
   明细面板
===================================================== */

.detail-panel {
  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background:
    rgba(
      1,
      29,
      52,
      0.9
    );

  border:
    1px solid
    #075786;

  box-shadow:
    inset
    0
    0
    26px
    rgba(
      0,
      130,
      200,
      0.03
    );
}


/* =====================================================
   标题
===================================================== */

.panel-title {
  height: 36px;

  padding:
    0 11px;

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
  padding-left:
    7px;

  color:
    #e0f8ff;

  font-size:
    13px;

  border-left:
    3px solid
    #14d9f5;
}


.panel-title span {
  color:
    #6997b4;

  font-size:
    9px;
}


/* =====================================================
   表格整体
===================================================== */

.detail-table {
  height:
    calc(
      100% - 36px
    );

  min-height: 0;

  display: flex;

  flex-direction:
    column;
}


.table-header,
.table-row {
  display: grid;

  grid-template-columns:
    90px
    minmax(160px, 1fr)
    90px
    90px
    minmax(250px, 1.7fr)
    70px;

  align-items:
    center;
}


/* =====================================================
   表头
===================================================== */

.table-header {
  height:
    30px;

  flex-shrink:
    0;

  padding:
    0 10px;

  box-sizing:
    border-box;

  color:
    #6694af;

  font-size:
    9px;

  background:
    rgba(
      7,
      54,
      90,
      0.72
    );

  border-bottom:
    1px solid
    rgba(
      35,
      102,
      143,
      0.28
    );
}


/* =====================================================
   表体
===================================================== */

.table-body {
  min-height: 0;

  flex: 1;

  overflow-y:
    auto;
}


.table-body::-webkit-scrollbar {
  width:
    4px;
}


.table-body::-webkit-scrollbar-track {
  background:
    transparent;
}


.table-body::-webkit-scrollbar-thumb {
  background:
    #075786;
}


.table-row {
  min-height:
    42px;

  padding:
    0 10px;

  box-sizing:
    border-box;

  color:
    #9dbdce;

  font-size:
    10px;

  border-bottom:
    1px solid
    rgba(
      27,
      82,
      119,
      0.21
    );
}


.table-row:nth-child(odd) {
  background:
    rgba(
      5,
      45,
      76,
      0.14
    );
}


.table-row:hover {
  background:
    rgba(
      14,
      77,
      115,
      0.18
    );
}


/* =====================================================
   测点
===================================================== */

.point-name {
  color:
    #d6eff8;

  font-weight:
    600;
}


/* =====================================================
   设备
===================================================== */

.device-name {
  color:
    #8eb0c4;
}


/* =====================================================
   实时值
===================================================== */

.realtime-value {
  font-size:
    13px;

  font-weight:
    600;
}


.realtime-value small,
.limit-value small {
  margin-left:
    1px;

  font-size:
    8px;

  font-weight:
    normal;
}


/* =====================================================
   限值
===================================================== */

.limit-value {
  color:
    #6391aa;
}


/* =====================================================
   超限幅度
===================================================== */

.over-range {
  min-width:
    0;

  padding-right:
    18px;

  display:
    flex;

  align-items:
    center;

  gap:
    8px;
}


.progress-track {
  height:
    4px;

  min-width:
    0;

  flex:
    1;

  overflow:
    hidden;

  background:
    rgba(
      14,
      74,
      111,
      0.65
    );
}


.progress-value {
  height:
    100%;

  min-width:
    3px;

  border-radius:
    2px;
}


.over-range strong {
  width:
    42px;

  flex-shrink:
    0;

  text-align:
    right;

  font-size:
    10px;
}


/* =====================================================
   进度颜色
===================================================== */

.bar-danger {
  background:
    linear-gradient(
      90deg,
      #ff365d,
      #ff6781
    );

  box-shadow:
    0
    0
    6px
    rgba(
      255,
      67,
      100,
      0.45
    );
}


.bar-warning {
  background:
    linear-gradient(
      90deg,
      #dc8700,
      #ffc329
    );

  box-shadow:
    0
    0
    6px
    rgba(
      255,
      183,
      27,
      0.35
    );
}


.bar-normal {
  background:
    linear-gradient(
      90deg,
      #078fc4,
      #19ddef
    );

  box-shadow:
    0
    0
    6px
    rgba(
      25,
      221,
      239,
      0.3
    );
}


/* =====================================================
   数值颜色
===================================================== */

.value-danger {
  color:
    #ff5571;
}


.value-warning {
  color:
    #ffb51e;
}


.value-normal {
  color:
    #20d9ef;
}


/* =====================================================
   等级
===================================================== */

.level-tag {
  justify-self:
    start;

  min-width:
    34px;

  padding:
    2px 5px;

  box-sizing:
    border-box;

  text-align:
    center;

  font-size:
    8px;

  border:
    1px solid;
}


.level-danger {
  color:
    #ff536f;

  border-color:
    rgba(
      255,
      83,
      111,
      0.7
    );

  background:
    rgba(
      255,
      83,
      111,
      0.07
    );
}


.level-warning {
  color:
    #ffb41f;

  border-color:
    rgba(
      255,
      180,
      31,
      0.7
    );

  background:
    rgba(
      255,
      180,
      31,
      0.07
    );
}


.level-normal {
  color:
    #25cfee;

  border-color:
    rgba(
      37,
      207,
      238,
      0.65
    );

  background:
    rgba(
      37,
      207,
      238,
      0.06
    );
}


/* =====================================================
   空数据
===================================================== */

.empty-data {
  height:
    100%;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  color:
    #507d98;

  font-size:
    11px;
}


/* =====================================================
   中等屏幕
===================================================== */

@media (
  max-width: 1500px
) {
  .alarm-page {
    grid-template-rows:
      60px
      minmax(0, 1fr);
  }


  .table-header,
  .table-row {
    grid-template-columns:
      75px
      minmax(130px, 1fr)
      75px
      75px
      minmax(190px, 1.5fr)
      58px;
  }
}
</style>