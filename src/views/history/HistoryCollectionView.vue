<script setup>
import {
  computed,
  ref,
} from 'vue'

import MetricCards
  from '@/components/common/MetricCards.vue'

import {
  collectionSummary,
  collectionRecords,
} from '@/mocks/history'


/* =====================================================
   顶部4个公共指标
===================================================== */

const metrics = computed(() => {
  return [
    {
      key: 'points',

      icon: '▣',

      value:
        collectionSummary.todayPoints,

      unit: '点',

      label:
        '今日采集点数',

      theme:
        'cyan',
    },

    {
      key: 'success',

      icon: '✓',

      value:
        collectionSummary.successRate,

      unit: '%',

      label:
        '采集成功率',

      theme:
        'green',
    },

    {
      key: 'channels',

      icon: '↗',

      value:
        collectionSummary.onlineChannels,

      unit: '路',

      label:
        '在线通道',

      theme:
        'cyan',
    },

    {
      key: 'abnormal',

      icon: '!',

      value:
        collectionSummary.abnormalCount,

      unit: '次',

      label:
        '异常采集',

      theme:
        'orange',
    },
  ]
})


/* =====================================================
   设备筛选
===================================================== */

const deviceFilter =
  ref('all')


const deviceOptions =
  computed(() => {
    const map =
      new Map()

    collectionRecords.forEach(
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
    if (
      deviceFilter.value ===
      'all'
    ) {
      return collectionRecords
    }

    return collectionRecords.filter(
      (item) =>
        item.deviceCode ===
        deviceFilter.value,
    )
  })


function resetFilter() {
  deviceFilter.value =
    'all'
}


/* =====================================================
   采集值展示
===================================================== */

function formatValues(values) {
  return JSON.stringify(values)
}


/* =====================================================
   详情弹窗
===================================================== */

const dialogVisible =
  ref(false)

const currentRecord =
  ref(null)


function showDetail(item) {
  currentRecord.value =
    item

  dialogVisible.value =
    true
}
</script>


<template>
  <section class="collection-view">

    <!-- =================================================
         顶部公共指标
    ================================================== -->

    <MetricCards
      :items="metrics"
      :columns="4"
      variant="compact"
    />


    <!-- =================================================
         采集数据记录
    ================================================== -->

    <section class="record-panel">

      <!-- 标题 -->
      <div class="panel-title">

        <strong>
          采集数据记录
        </strong>

        <span>
          共
          {{ filteredRecords.length }}
          条
        </span>

      </div>


      <!-- 筛选 -->
      <div class="filter-bar">

        <span class="filter-label">
          设备
        </span>


        <select
          v-model="
            deviceFilter
          "
          class="device-select"
        >

          <option value="all">
            全部
          </option>

          <option
            v-for="item in deviceOptions"
            :key="item.code"
            :value="item.code"
          >
            {{ item.name }}
          </option>

        </select>


        <button
          type="button"
          class="reset-button"
          @click="resetFilter"
        >
          ↻ 重置
        </button>

      </div>


      <!-- 表格 -->
      <div class="record-table">

        <div class="table-header">

          <span>
            采集时间
          </span>

          <span>
            所属设备
          </span>

          <span>
            采集值
          </span>

          <span>
            详情
          </span>

        </div>


        <div class="table-body">

          <div
            v-for="item in filteredRecords"
            :key="item.id"
            class="table-row"
          >

            <span class="time-value">
              {{ item.time }}
            </span>


            <strong class="device-name">
              {{ item.device }}
            </strong>


            <span class="collection-value">
              {{ formatValues(item.values) }}
            </span>


            <button
              type="button"
              class="detail-button"
              @click="
                showDetail(item)
              "
            >
              详情
            </button>

          </div>


          <div
            v-if="
              !filteredRecords.length
            "
            class="empty-data"
          >
            当前暂无采集记录
          </div>

        </div>

      </div>


      <!-- 底部分页 -->
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


    <!-- =================================================
         详情弹窗
    ================================================== -->

    <el-dialog
      v-model="
        dialogVisible
      "
      title="采集数据详情"
      width="520px"
      class="history-dialog"
    >

      <div
        v-if="
          currentRecord
        "
        class="detail-dialog"
      >

        <div class="detail-item">
          <span>
            采集时间
          </span>

          <strong>
            {{ currentRecord.time }}
          </strong>
        </div>


        <div class="detail-item">
          <span>
            所属设备
          </span>

          <strong>
            {{ currentRecord.device }}
          </strong>
        </div>


        <div
          v-for="
            (
              value,
              key
            ) in currentRecord.values
          "
          :key="key"
          class="detail-item"
        >
          <span>
            {{ key }}
          </span>

          <strong>
            {{ value }}
          </strong>
        </div>

      </div>

    </el-dialog>

  </section>
</template>


<style scoped>
.collection-view {
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

  margin-right: 7px;

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
    #6296b5;

  font-size:
    9px;
}


/* =====================================================
   筛选
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
    #759cb5;

  font-size:
    10px;
}


.device-select {
  width: 125px;

  height: 26px;

  padding:
    0 9px;

  box-sizing:
    border-box;

  outline: none;

  color:
    #b4d6e7;

  font-size:
    10px;

  background:
    #07345a;

  border:
    1px solid
    #086699;
}


.device-select option {
  background:
    #052b4a;

  color:
    #d7eff8;
}


.reset-button {
  height: 26px;

  padding:
    0 12px;

  color:
    #65a8cb;

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

.record-table {
  min-height: 0;

  display: flex;

  flex-direction:
    column;
}


.table-header,
.table-row {
  display: grid;

  grid-template-columns:
    130px
    minmax(180px, 1fr)
    minmax(320px, 2fr)
    100px;

  align-items: center;
}


.table-header {
  height: 32px;

  flex-shrink: 0;

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


.table-body {
  min-height: 0;

  flex: 1;

  overflow-y: auto;
}


.table-row {
  min-height: 44px;

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


.time-value {
  color:
    #83a8bd;

  font-size:
    10px;
}


.device-name {
  color:
    #d7edf5;

  font-size:
    10px;
}


.collection-value {
  overflow: hidden;

  color:
    #10dce8;

  font-family:
    Consolas,
    monospace;

  font-size:
    10px;

  font-weight:
    600;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;
}


.detail-button {
  width: 48px;

  padding: 0;

  border: 0;

  color:
    #65a8cc;

  font-size:
    10px;

  cursor:
    pointer;

  text-align:
    left;

  background:
    transparent;
}


.detail-button:hover {
  color:
    #19ddf1;
}


/* =====================================================
   空数据
===================================================== */

.empty-data {
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

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

  min-width: 28px;

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


.pagination button:disabled {
  opacity:
    0.48;
}


/* =====================================================
   弹窗内容
===================================================== */

.detail-dialog {
  display: grid;

  gap: 8px;
}


.detail-item {
  min-height: 34px;

  padding:
    0 10px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  background:
    rgba(
      6,
      55,
      87,
      0.32
    );

  border:
    1px solid
    rgba(
      12,
      106,
      151,
      0.35
    );
}


.detail-item span {
  color:
    #729ab3;

  font-size:
    11px;
}


.detail-item strong {
  color:
    #d8f3fa;

  font-size:
    11px;
}


/* =====================================================
   Element Plus 弹窗深色处理
===================================================== */

:deep(.el-dialog) {
  background:
    #062944;

  border:
    1px solid
    #0872a3;
}


:deep(.el-dialog__title) {
  color:
    #e4f7fd;
}


:deep(.el-dialog__headerbtn .el-dialog__close) {
  color:
    #6ea5c3;
}


/* =====================================================
   中等屏幕
===================================================== */

@media (
  max-width: 1500px
) {
  .collection-view {
    grid-template-rows:
      60px
      minmax(0, 1fr);
  }


  .table-header,
  .table-row {
    grid-template-columns:
      100px
      minmax(150px, 1fr)
      minmax(240px, 2fr)
      70px;
  }
}
</style>