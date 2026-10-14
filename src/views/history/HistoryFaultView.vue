<script setup>
import {
  computed,
  ref,
} from 'vue'

import MetricCards
  from '@/components/common/MetricCards.vue'

import {
  faultSummary,
  faultRecords,
} from '@/mocks/history'


// =====================================================
// 顶部指标
// =====================================================

const metrics = computed(() => {
  return [
    {
      key: 'totalFault',

      icon: '!',

      value:
        faultSummary.totalFaultCount,

      unit: '次',

      label:
        '累计故障',

      theme:
        'cyan',
    },

    {
      key: 'monthlyFault',

      icon: '▣',

      value:
        faultSummary.monthlyFaultCount,

      unit: '次',

      label:
        '本月故障',

      theme:
        'orange',
    },

    {
      key: 'averageTime',

      icon: '◷',

      value:
        faultSummary.averageHandleTime,

      unit: 'h',

      label:
        '平均处理时长',

      theme:
        'cyan',
    },

    {
      key: 'repeatedFault',

      icon: '↻',

      value:
        faultSummary.repeatedFaultCount,

      unit: '项',

      label:
        '重复故障',

      theme:
        'orange',
    },
  ]
})


// =====================================================
// 筛选
// =====================================================

const deviceFilter =
  ref('all')

const statusFilter =
  ref('all')


const deviceOptions =
  computed(() => {
    const map =
      new Map()

    faultRecords.forEach(
      (item) => {
        map.set(
          item.deviceCode,
          item.device,
        )
      },
    )

    return Array.from(
      map.entries(),
    ).map(
      ([code, name]) => ({
        code,
        name,
      }),
    )
  })


const filteredRecords =
  computed(() => {
    return faultRecords.filter(
      (item) => {
        const deviceMatch =
          deviceFilter.value ===
            'all' ||
          item.deviceCode ===
            deviceFilter.value

        const statusMatch =
          statusFilter.value ===
            'all' ||
          item.status ===
            statusFilter.value

        return (
          deviceMatch &&
          statusMatch
        )
      },
    )
  })


function resetFilter() {
  deviceFilter.value =
    'all'

  statusFilter.value =
    'all'
}


// =====================================================
// 持续时长颜色
// =====================================================

function getDurationClass(
  item,
) {
  if (
    item.status ===
    '待处理'
  ) {
    return 'duration-waiting'
  }

  if (
    item.status ===
    '处理中'
  ) {
    return 'duration-processing'
  }

  if (
    item.duration.includes(
      'min',
    )
  ) {
    return 'duration-danger'
  }

  return 'duration-warning'
}


// =====================================================
// 状态颜色
// =====================================================

function getStatusClass(
  status,
) {
  if (
    status === '已恢复'
  ) {
    return 'status-recovered'
  }

  if (
    status === '处理中'
  ) {
    return 'status-processing'
  }

  return 'status-waiting'
}
</script>


<template>
  <section class="fault-history-view">

    <!-- =================================================
         顶部指标
    ================================================== -->

    <MetricCards
      :items="metrics"
      :columns="4"
      variant="compact"
    />


    <!-- =================================================
         故障记录
    ================================================== -->

    <section class="record-panel">

      <!-- 标题 -->
      <div class="panel-title">

        <strong>
          故障记录
        </strong>

        <span>
          累计
          {{ filteredRecords.length }}
          条
        </span>

      </div>


      <!-- =================================================
           筛选
      ================================================== -->

      <div class="filter-bar">

        <span class="filter-label">
          设备
        </span>


        <select
          v-model="
            deviceFilter
          "
          class="filter-select"
        >

          <option value="all">
            全部
          </option>

          <option
            v-for="
              item in deviceOptions
            "
            :key="item.code"
            :value="item.code"
          >
            {{ item.name }}
          </option>

        </select>


        <span class="filter-label second-label">
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

          <option value="已恢复">
            已恢复
          </option>

          <option value="处理中">
            处理中
          </option>

          <option value="待处理">
            待处理
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

      <div class="fault-table">

        <!-- 表头 -->
        <div class="table-header">

          <span>
            故障编号
          </span>

          <span>
            设备
          </span>

          <span>
            故障类型
          </span>

          <span>
            发生时间
          </span>

          <span>
            恢复时间
          </span>

          <span>
            持续时长
          </span>

          <span>
            状态
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

            <!-- 编号 -->
            <strong class="fault-id">
              {{ item.id }}
            </strong>


            <!-- 设备 -->
            <span class="device-name">
              {{ item.device }}
            </span>


            <!-- 类型 -->
            <span
              class="fault-type"
              :title="
                item.faultType
              "
            >
              {{ item.faultType }}
            </span>


            <!-- 发生时间 -->
            <span class="time-value">
              {{ item.startTime }}
            </span>


            <!-- 恢复时间 -->
            <span class="time-value">
              {{ item.recoverTime }}
            </span>


            <!-- 持续时长 -->
            <strong
              class="duration-value"
              :class="
                getDurationClass(
                  item,
                )
              "
            >
              {{ item.duration }}
            </strong>


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

          </div>


          <div
            v-if="
              !filteredRecords.length
            "
            class="empty-data"
          >
            当前暂无符合条件的故障记录
          </div>

        </div>

      </div>


      <!-- =================================================
           分页
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
.fault-history-view {
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
    1px solid #075786;
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
    1px solid #075786;
}


.panel-title strong {
  display: flex;

  align-items: center;

  color:
    #e5f9ff;

  font-size:
    13px;

  font-weight:
    600;
}


.panel-title strong::before {
  content: "";

  width: 3px;

  height: 22px;

  margin-right:
    7px;

  background:
    #16dcef;

  box-shadow:
    0 0
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


.second-label {
  margin-left:
    4px;
}


.filter-select {
  width: 100px;

  height: 26px;

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
  height: 26px;

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

.fault-table {
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
    minmax(120px, 0.8fr)
    minmax(350px, 2.5fr)
    145px
    145px
    90px
    75px;

  align-items:
    center;
}


/* =====================================================
   表头
===================================================== */

.table-header {
  height: 32px;

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
  min-height: 0;

  flex: 1;

  overflow-y:
    auto;
}


.table-body::-webkit-scrollbar {
  width: 4px;
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
   编号
===================================================== */

.fault-id {
  color:
    #e6f5fa;

  font-size:
    10px;
}


/* =====================================================
   设备
===================================================== */

.device-name {
  color:
    #b3d0de;

  font-size:
    10px;
}


/* =====================================================
   故障类型
===================================================== */

.fault-type {
  padding-right:
    15px;

  overflow:
    hidden;

  color:
    #a9c6d5;

  font-size:
    9px;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;
}


/* =====================================================
   时间
===================================================== */

.time-value {
  color:
    #69a0be;

  font-size:
    9px;
}


/* =====================================================
   持续时间
===================================================== */

.duration-value {
  font-size:
    11px;

  font-weight:
    600;
}


.duration-danger {
  color:
    #ff526d;
}


.duration-warning {
  color:
    #ffb11c;
}


.duration-processing {
  color:
    #ff536f;
}


.duration-waiting {
  color:
    #ffb21b;
}


/* =====================================================
   状态
===================================================== */

.status-tag {
  justify-self:
    start;

  min-width:
    44px;

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


.status-recovered {
  color:
    #38dfa7;

  border-color:
    rgba(
      56,
      223,
      167,
      0.6
    );

  background:
    rgba(
      56,
      223,
      167,
      0.07
    );
}


.status-processing {
  color:
    #ffb21b;

  border-color:
    rgba(
      255,
      178,
      27,
      0.65
    );

  background:
    rgba(
      255,
      178,
      27,
      0.08
    );
}


.status-waiting {
  color:
    #ff5b71;

  border-color:
    rgba(
      255,
      91,
      113,
      0.65
    );

  background:
    rgba(
      255,
      91,
      113,
      0.08
    );
}


/* =====================================================
   空数据
===================================================== */

.empty-data {
  height: 100%;

  display: flex;

  align-items: center;

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
  height: 32px;

  padding:
    0 10px;

  box-sizing:
    border-box;

  display: flex;

  align-items: center;

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
  display: flex;

  gap: 4px;
}


.pagination button {
  height: 24px;

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
  .fault-history-view {
    grid-template-rows:
      60px
      minmax(0, 1fr);
  }


  .table-header,
  .table-row {
    grid-template-columns:
      68px
      minmax(100px, 0.8fr)
      minmax(260px, 2.2fr)
      118px
      118px
      72px
      60px;
  }
}
</style>