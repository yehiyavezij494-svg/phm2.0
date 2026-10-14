<script setup>
import {
  computed,
  ref,
} from 'vue'

import MetricCards
  from '@/components/common/MetricCards.vue'

import {
  alarmSummary,
  alarmRecords,
} from '@/mocks/history'


// =====================================================
// 顶部指标
// =====================================================

const metrics = computed(() => {
  return [
    {
      key: 'todayAlarm',

      icon: '♧',

      value:
        alarmSummary.todayAlarmCount,

      unit: '条',

      label:
        '今日报警',

      theme:
        'cyan',
    },

    {
      key: 'unhandled',

      icon: '!',

      value:
        alarmSummary.unhandledCount,

      unit: '条',

      label:
        '未处理',

      theme:
        'red',
    },

    {
      key: 'handled',

      icon: '✓',

      value:
        alarmSummary.handledCount,

      unit: '条',

      label:
        '已处理',

      theme:
        'green',
    },

    {
      key: 'alarmRate',

      icon: 'i',

      value:
        alarmSummary.alarmRate,

      unit: '%',

      label:
        '报警率',

      theme:
        'cyan',
    },
  ]
})


// =====================================================
// 本地报警数据
// 做一份可修改副本
// =====================================================

const records = ref(
  alarmRecords.map(
    (item) => ({
      ...item,
    }),
  ),
)


// =====================================================
// 筛选条件
// =====================================================

const levelFilter =
  ref('all')

const statusFilter =
  ref('all')


const filteredRecords =
  computed(() => {
    return records.value.filter(
      (item) => {
        const levelMatch =
          levelFilter.value ===
            'all' ||
          item.level ===
            levelFilter.value

        const statusMatch =
          statusFilter.value ===
            'all' ||
          item.status ===
            statusFilter.value

        return (
          levelMatch &&
          statusMatch
        )
      },
    )
  })


const unhandledVisibleCount =
  computed(() => {
    return records.value.filter(
      (item) =>
        item.status ===
        '未处理',
    ).length
  })


function resetFilter() {
  levelFilter.value =
    'all'

  statusFilter.value =
    'all'
}


// =====================================================
// 等级样式
// =====================================================

function getLevelClass(level) {
  if (level === '紧急') {
    return 'level-danger'
  }

  if (level === '重要') {
    return 'level-warning'
  }

  return 'level-normal'
}


// =====================================================
// 状态样式
// =====================================================

function getStatusClass(status) {
  if (status === '未处理') {
    return 'status-unhandled'
  }

  if (status === '处理中') {
    return 'status-processing'
  }

  return 'status-handled'
}


// =====================================================
// 操作
// =====================================================

function confirmAlarm(item) {
  if (
    item.status !==
    '未处理'
  ) {
    return
  }

  item.status =
    '处理中'
}


function closeAlarm(item) {
  if (
    item.status !==
    '处理中'
  ) {
    return
  }

  item.status =
    '已处理'
}


function getActionText(item) {
  if (
    item.status ===
    '未处理'
  ) {
    return '确认'
  }

  if (
    item.status ===
    '处理中'
  ) {
    return '闭环'
  }

  return '已闭环'
}
</script>


<template>
  <section class="alarm-history-view">

    <!-- =================================================
         顶部公共指标卡
    ================================================== -->

    <MetricCards
      :items="metrics"
      :columns="4"
      variant="compact"
    />


    <!-- =================================================
         报警记录
    ================================================== -->

    <section class="record-panel">

      <!-- 标题 -->
      <div class="panel-title">

        <strong>
          报警记录
        </strong>

        <span>
          未处理
          {{ unhandledVisibleCount }}
          条
        </span>

      </div>


      <!-- =================================================
           筛选栏
      ================================================== -->

      <div class="filter-bar">

        <span class="filter-label">
          等级
        </span>


        <select
          v-model="
            levelFilter
          "
          class="filter-select"
        >
          <option value="all">
            全部
          </option>

          <option value="紧急">
            紧急
          </option>

          <option value="重要">
            重要
          </option>

          <option value="一般">
            一般
          </option>
        </select>


        <span class="filter-label status-label">
          状态
        </span>


        <select
          v-model="
            statusFilter
          "
          class="filter-select"
        >
          <option value="all">
            全部
          </option>

          <option value="未处理">
            未处理
          </option>

          <option value="处理中">
            处理中
          </option>

          <option value="已处理">
            已处理
          </option>
        </select>


        <button
          type="button"
          class="reset-button"
          @click="
            resetFilter
          "
        >
          ↻ 重置
        </button>

      </div>


      <!-- =================================================
           表格
      ================================================== -->

      <div class="alarm-table">

        <!-- 表头 -->
        <div class="table-header">

          <span>
            报警时间
          </span>

          <span>
            设备
          </span>

          <span>
            报警内容
          </span>

          <span>
            等级
          </span>

          <span>
            状态
          </span>

          <span>
            操作
          </span>

        </div>


        <!-- 表体 -->
        <div class="table-body">

          <div
            v-for="
              item in filteredRecords
            "
            :key="item.id"
            class="table-row"
          >

            <!-- 时间 -->
            <span class="alarm-time">
              {{ item.time }}
            </span>


            <!-- 设备 -->
            <strong class="device-name">
              {{ item.device }}
            </strong>


            <!-- 报警内容 -->
            <span
              class="alarm-content"
              :title="
                item.content
              "
            >
              {{ item.content }}
            </span>


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


            <!-- 状态 -->
            <span
              class="status-tag"
              :class="
                getStatusClass(
                  item.status,
                )
              "
            >
              {{ item.status }}
            </span>


            <!-- 操作 -->
            <button
              type="button"
              class="action-button"
              :class="{
                disabled:
                  item.status ===
                  '已处理',
              }"
              :disabled="
                item.status ===
                '已处理'
              "
              @click="
                item.status ===
                  '未处理'
                  ? confirmAlarm(item)
                  : closeAlarm(item)
              "
            >
              {{
                getActionText(
                  item,
                )
              }}
            </button>

          </div>


          <div
            v-if="
              !filteredRecords.length
            "
            class="empty-data"
          >
            当前暂无符合条件的报警记录
          </div>

        </div>

      </div>


      <!-- =================================================
           底部分页
      ================================================== -->

      <div class="pagination-bar">

        <span>
          共
          {{ filteredRecords.length }}
          条
        </span>


        <div class="pagination">

          <button
            type="button"
            disabled
          >
            上一页
          </button>


          <button
            type="button"
            class="page-active"
          >
            1
          </button>


          <button
            type="button"
            disabled
          >
            下一页
          </button>

        </div>

      </div>

    </section>

  </section>
</template>


<style scoped>
.alarm-history-view {
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
   主面板
===================================================== */

.record-panel {
  min-width: 0;
  min-height: 0;

  display: grid;

  grid-template-rows:
    36px
    42px
    minmax(0, 1fr)
    32px;

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
    #729bb3;

  font-size:
    9px;
}


/* =====================================================
   筛选栏
===================================================== */

.filter-bar {
  height: 42px;

  padding:
    0 10px;

  box-sizing:
    border-box;

  display: flex;

  align-items: center;

  gap: 8px;

  background:
    rgba(
      4,
      46,
      77,
      0.42
    );

  border-bottom:
    1px solid
    rgba(
      32,
      91,
      128,
      0.24
    );
}


.filter-label {
  color:
    #719bb5;

  font-size:
    10px;
}


.status-label {
  margin-left:
    3px;
}


.filter-select {
  width:
    96px;

  height:
    26px;

  padding:
    0 8px;

  box-sizing:
    border-box;

  outline:
    none;

  color:
    #b5d5e5;

  font-size:
    10px;

  background:
    #07345a;

  border:
    1px solid
    #086699;
}


.filter-select option {
  color:
    #d9eef7;

  background:
    #052b4a;
}


.reset-button {
  height:
    26px;

  padding:
    0 12px;

  color:
    #64a7ca;

  font-size:
    10px;

  cursor:
    pointer;

  background:
    rgba(
      5,
      65,
      105,
      0.7
    );

  border:
    1px solid
    #086699;
}


.reset-button:hover {
  color:
    #dcf8ff;

  background:
    rgba(
      6,
      92,
      144,
      0.78
    );
}


/* =====================================================
   表格
===================================================== */

.alarm-table {
  min-height:
    0;

  display:
    flex;

  flex-direction:
    column;
}


.table-header,
.table-row {
  display:
    grid;

  grid-template-columns:
    110px
    minmax(180px, 1fr)
    minmax(360px, 2.3fr)
    72px
    82px
    72px;

  align-items:
    center;
}


/* =====================================================
   表头
===================================================== */

.table-header {
  height:
    32px;

  flex-shrink:
    0;

  padding:
    0 10px;

  box-sizing:
    border-box;

  color:
    #6794af;

  font-size:
    9px;

  background:
    rgba(
      5,
      52,
      87,
      0.66
    );

  border-bottom:
    1px solid
    rgba(
      33,
      95,
      133,
      0.28
    );
}


/* =====================================================
   表体
===================================================== */

.table-body {
  min-height:
    0;

  flex:
    1;

  overflow-y:
    auto;
}


.table-body::-webkit-scrollbar {
  width:
    4px;
}


.table-body::-webkit-scrollbar-thumb {
  background:
    #075786;
}


.table-row {
  min-height:
    44px;

  padding:
    0 10px;

  box-sizing:
    border-box;

  border-bottom:
    1px dashed
    rgba(
      28,
      82,
      116,
      0.23
    );
}


.table-row:hover {
  background:
    rgba(
      7,
      62,
      100,
      0.17
    );
}


/* =====================================================
   时间
===================================================== */

.alarm-time {
  color:
    #77a1b9;

  font-size:
    10px;
}


/* =====================================================
   设备
===================================================== */

.device-name {
  color:
    #d7edf5;

  font-size:
    10px;

  font-weight:
    600;
}


/* =====================================================
   报警内容
===================================================== */

.alarm-content {
  padding-right:
    18px;

  overflow:
    hidden;

  color:
    #8eb0c3;

  font-size:
    10px;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;
}


/* =====================================================
   等级
===================================================== */

.level-tag {
  justify-self:
    start;

  min-width:
    38px;

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
      0.08
    );
}


.level-warning {
  color:
    #ffb11b;

  border-color:
    rgba(
      255,
      177,
      27,
      0.7
    );

  background:
    rgba(
      255,
      177,
      27,
      0.07
    );
}


.level-normal {
  color:
    #14ddef;

  border-color:
    rgba(
      20,
      221,
      239,
      0.62
    );

  background:
    rgba(
      20,
      221,
      239,
      0.06
    );
}


/* =====================================================
   状态
===================================================== */

.status-tag {
  justify-self:
    start;

  min-width:
    46px;

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


.status-unhandled {
  color:
    #ff6076;

  border-color:
    rgba(
      255,
      96,
      118,
      0.55
    );

  background:
    rgba(
      255,
      96,
      118,
      0.08
    );
}


.status-processing {
  color:
    #ffb11b;

  border-color:
    rgba(
      255,
      177,
      27,
      0.55
    );

  background:
    rgba(
      255,
      177,
      27,
      0.07
    );
}


.status-handled {
  color:
    #35dfa6;

  border-color:
    rgba(
      53,
      223,
      166,
      0.55
    );

  background:
    rgba(
      53,
      223,
      166,
      0.06
    );
}


/* =====================================================
   操作
===================================================== */

.action-button {
  width:
    46px;

  height:
    24px;

  padding:
    0;

  color:
    #50b5dd;

  font-size:
    9px;

  cursor:
    pointer;

  background:
    rgba(
      3,
      68,
      107,
      0.46
    );

  border:
    1px solid
    #0872a4;
}


.action-button:hover {
  color:
    #e2faff;

  background:
    rgba(
      7,
      109,
      161,
      0.55
    );
}


.action-button.disabled {
  color:
    #47778e;

  cursor:
    default;

  opacity:
    0.55;

  background:
    rgba(
      3,
      44,
      72,
      0.38
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
    #517e98;

  font-size:
    11px;
}


/* =====================================================
   分页
===================================================== */

.pagination-bar {
  height:
    32px;

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

  color:
    #7099b1;

  font-size:
    9px;

  border-top:
    1px solid
    rgba(
      29,
      89,
      126,
      0.24
    );
}


.pagination {
  display:
    flex;

  gap:
    4px;
}


.pagination button {
  height:
    24px;

  min-width:
    28px;

  padding:
    0 7px;

  color:
    #6692ad;

  font-size:
    9px;

  background:
    rgba(
      4,
      43,
      74,
      0.72
    );

  border:
    1px solid
    #075786;
}


.pagination
.page-active {
  color:
    #ffffff;

  background:
    #0782bd;

  border-color:
    #14c9ed;
}


.pagination
button:disabled {
  opacity:
    0.48;
}


/* =====================================================
   中等屏幕
===================================================== */

@media (
  max-width: 1500px
) {
  .alarm-history-view {
    grid-template-rows:
      60px
      minmax(0, 1fr);
  }


  .table-header,
  .table-row {
    grid-template-columns:
      90px
      minmax(130px, 0.9fr)
      minmax(280px, 2fr)
      58px
      66px
      58px;
  }
}
</style>