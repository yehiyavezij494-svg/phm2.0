<script setup>
import {
  computed,
  reactive,
  ref,
} from 'vue'

import {
  ElMessage,
  ElMessageBox,
} from 'element-plus'

import MetricCards
  from '@/components/common/MetricCards.vue'

import {
  deviceManageSummary,
  deviceManageRecords,
} from '@/mocks/device'


// =====================================================
// 顶部指标
// =====================================================

const metrics = computed(() => {
  return [
    {
      key: 'total',
      icon: '▦',
      value:
        deviceManageSummary.totalCount,
      unit: '台',
      label: '设备总数',
      theme: 'cyan',
    },

    {
      key: 'normal',
      icon: '✓',
      value:
        deviceManageSummary.normalCount,
      unit: '台',
      label: '正常运行',
      theme: 'green',
    },

    {
      key: 'warning',
      icon: '!',
      value:
        deviceManageSummary.warningCount,
      unit: '台',
      label: '预警',
      theme: 'orange',
    },

    {
      key: 'fault',
      icon: '×',
      value:
        deviceManageSummary.faultCount,
      unit: '台',
      label: '故障/停用',
      theme: 'red',
    },
  ]
})


// =====================================================
// 表格数据副本
// =====================================================

const records = ref(
  deviceManageRecords.map(
    (item) => ({
      ...item,
    }),
  ),
)


// =====================================================
// 查询条件
// =====================================================

const queryForm = reactive({
  type: 'all',
  station: 'all',
  status: 'all',
})

const appliedQuery = reactive({
  type: 'all',
  station: 'all',
  status: 'all',
})


const typeOptions = computed(() => {
  return [
    ...new Set(
      records.value.map(
        item => item.type,
      ),
    ),
  ]
})


const stationOptions = computed(() => {
  return [
    ...new Set(
      records.value.map(
        item => item.station,
      ),
    ),
  ]
})


const filteredRecords = computed(() => {
  return records.value.filter(
    (item) => {
      const typeMatch =
        appliedQuery.type ===
          'all' ||
        item.type ===
          appliedQuery.type

      const stationMatch =
        appliedQuery.station ===
          'all' ||
        item.station ===
          appliedQuery.station

      const statusMatch =
        appliedQuery.status ===
          'all' ||
        item.status ===
          appliedQuery.status

      return (
        typeMatch &&
        stationMatch &&
        statusMatch
      )
    },
  )
})


function handleQuery() {
  appliedQuery.type =
    queryForm.type

  appliedQuery.station =
    queryForm.station

  appliedQuery.status =
    queryForm.status
}


function resetQuery() {
  queryForm.type = 'all'
  queryForm.station = 'all'
  queryForm.status = 'all'

  appliedQuery.type = 'all'
  appliedQuery.station = 'all'
  appliedQuery.status = 'all'
}


// =====================================================
// 健康度
// =====================================================

function getHealthClass(value) {
  if (value < 60) {
    return 'health-danger'
  }

  if (value < 85) {
    return 'health-warning'
  }

  return 'health-normal'
}


function getHealthWidth(value) {
  return `${Math.max(
    0,
    Math.min(
      value,
      100,
    ),
  )}%`
}


// =====================================================
// 状态
// =====================================================

function getStatusClass(status) {
  if (status === '正常') {
    return 'status-normal'
  }

  if (status === '预警') {
    return 'status-warning'
  }

  return 'status-danger'
}


// =====================================================
// 新增 / 编辑
// =====================================================

const dialogVisible =
  ref(false)

const dialogMode =
  ref('add')

const editingId =
  ref(null)


const form = reactive({
  code: '',
  name: '',
  type: '牵引变压器',
  station: '石家庄牵引变电所',
  model: '',
  commissionDate: '',
  health: 100,
  status: '正常',
})


function resetForm() {
  form.code = ''
  form.name = ''
  form.type = '牵引变压器'
  form.station = '石家庄牵引变电所'
  form.model = ''
  form.commissionDate = ''
  form.health = 100
  form.status = '正常'

  editingId.value = null
}


function openAddDialog() {
  dialogMode.value = 'add'

  resetForm()

  dialogVisible.value = true
}


function openEditDialog(item) {
  dialogMode.value = 'edit'

  editingId.value = item.id

  form.code = item.code
  form.name = item.name
  form.type = item.type
  form.station = item.station
  form.model = item.model
  form.commissionDate =
    item.commissionDate
  form.health = item.health
  form.status = item.status

  dialogVisible.value = true
}


function submitForm() {
  if (
    !form.code ||
    !form.name ||
    !form.model ||
    !form.commissionDate
  ) {
    ElMessage.warning(
      '请填写完整设备信息',
    )

    return
  }


  const healthValue =
    Number(form.health)

  if (
    Number.isNaN(
      healthValue,
    ) ||
    healthValue < 0 ||
    healthValue > 100
  ) {
    ElMessage.warning(
      '健康度请输入0到100之间的数字',
    )

    return
  }


  if (
    dialogMode.value ===
    'add'
  ) {
    const codeExists =
      records.value.some(
        item =>
          item.code ===
          form.code,
      )


    if (codeExists) {
      ElMessage.warning(
        '设备编号已经存在',
      )

      return
    }


    const maxId =
      records.value.length
        ? Math.max(
            ...records.value.map(
              item => item.id,
            ),
          )
        : 0


    records.value.unshift({
      id: maxId + 1,

      code: form.code,
      name: form.name,
      type: form.type,
      station: form.station,
      model: form.model,

      commissionDate:
        form.commissionDate,

      health:
        healthValue,

      status:
        form.status,
    })


    ElMessage.success(
      '新增设备成功',
    )
  } else {
    const item =
      records.value.find(
        record =>
          record.id ===
          editingId.value,
      )


    if (item) {
      Object.assign(
        item,
        {
          code: form.code,
          name: form.name,
          type: form.type,
          station: form.station,
          model: form.model,

          commissionDate:
            form.commissionDate,

          health:
            healthValue,

          status:
            form.status,
        },
      )
    }


    ElMessage.success(
      '设备信息修改成功',
    )
  }


  dialogVisible.value = false
}


// =====================================================
// 删除
// =====================================================

async function deleteDevice(item) {
  try {
    await ElMessageBox.confirm(
      `确定删除设备“${item.name}（${item.code}）”吗？`,
      '删除确认',
      {
        confirmButtonText:
          '确定',

        cancelButtonText:
          '取消',

        type:
          'warning',
      },
    )


    records.value =
      records.value.filter(
        record =>
          record.id !==
          item.id,
      )


    ElMessage.success(
      '删除成功',
    )
  } catch {
    // 取消删除
  }
}
</script>


<template>
  <section class="device-manage-view">

    <!-- =================================================
         顶部指标
    ================================================== -->

    <MetricCards
      :items="metrics"
      :columns="4"
      variant="compact"
    />


    <!-- =================================================
         设备管理
    ================================================== -->

    <section class="manage-panel">

      <!-- 标题 -->
      <div class="panel-title">

        <strong>
          设备管理
        </strong>


        <div class="title-right">

          <span>
            共
            {{ filteredRecords.length }}
            台
          </span>


          <button
            type="button"
            class="add-button"
            @click="
              openAddDialog
            "
          >
            ＋ 新增
          </button>

        </div>

      </div>


      <!-- =================================================
           筛选栏
      ================================================== -->

      <div class="filter-bar">

        <span class="filter-label">
          设备类型
        </span>


        <select
          v-model="
            queryForm.type
          "
          class="filter-select"
        >
          <option value="all">
            全部
          </option>

          <option
            v-for="
              item in typeOptions
            "
            :key="item"
            :value="item"
          >
            {{ item }}
          </option>
        </select>


        <span class="filter-label">
          所属所亭
        </span>


        <select
          v-model="
            queryForm.station
          "
          class="station-select"
        >
          <option value="all">
            全部
          </option>

          <option
            v-for="
              item in stationOptions
            "
            :key="item"
            :value="item"
          >
            {{ item }}
          </option>
        </select>


        <span class="filter-label">
          状态
        </span>


        <select
          v-model="
            queryForm.status
          "
          class="filter-select"
        >
          <option value="all">
            全部
          </option>

          <option value="正常">
            正常
          </option>

          <option value="预警">
            预警
          </option>

          <option value="故障">
            故障
          </option>

          <option value="停用">
            停用
          </option>
        </select>


        <button
          type="button"
          class="query-button"
          @click="
            handleQuery
          "
        >
          ⌕ 查询
        </button>


        <button
          type="button"
          class="reset-button"
          @click="
            resetQuery
          "
        >
          ↻ 重置
        </button>

      </div>


      <!-- =================================================
           表格
      ================================================== -->

      <div class="device-table">

        <!-- 表头 -->
        <div class="table-header">

          <span>
            设备编号
          </span>

          <span>
            设备名称
          </span>

          <span>
            设备类型
          </span>

          <span>
            所属所亭
          </span>

          <span>
            型号
          </span>

          <span>
            投运日期
          </span>

          <span>
            健康度
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

            <!-- 编号 -->
            <strong class="device-code">
              {{ item.code }}
            </strong>


            <!-- 名称 -->
            <span class="device-name">
              {{ item.name }}
            </span>


            <!-- 类型 -->
            <span class="text-value">
              {{ item.type }}
            </span>


            <!-- 所亭 -->
            <span class="text-value">
              {{ item.station }}
            </span>


            <!-- 型号 -->
            <span class="model-value">
              {{ item.model }}
            </span>


            <!-- 日期 -->
            <span class="date-value">
              {{ item.commissionDate }}
            </span>


            <!-- 健康度 -->
            <div
              class="health-cell"
              :class="
                getHealthClass(
                  item.health,
                )
              "
            >

              <div class="health-track">

                <div
                  class="health-bar"
                  :style="{
                    width:
                      getHealthWidth(
                        item.health,
                      ),
                  }"
                ></div>

              </div>


              <strong>
                {{ item.health }}%
              </strong>

            </div>


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
            <div class="operation">

              <button
                type="button"
                class="operation-button"
                title="编辑"
                @click="
                  openEditDialog(
                    item,
                  )
                "
              >
                ✎
              </button>


              <button
                type="button"
                class="operation-button delete"
                title="删除"
                @click="
                  deleteDevice(
                    item,
                  )
                "
              >
                ▢
              </button>

            </div>

          </div>


          <div
            v-if="
              !filteredRecords.length
            "
            class="empty-data"
          >
            当前暂无符合条件的设备
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
          台
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
         新增 / 编辑设备
    ================================================== -->

    <el-dialog
      v-model="
        dialogVisible
      "
      :title="
        dialogMode === 'add'
          ? '新增设备'
          : '编辑设备'
      "
      width="650px"
    >

      <div class="form-grid">

        <label>
          <span>
            设备编号
          </span>

          <input
            v-model="
              form.code
            "
            type="text"
            placeholder="例如 BD-003"
          />
        </label>


        <label>
          <span>
            设备名称
          </span>

          <input
            v-model="
              form.name
            "
            type="text"
            placeholder="例如 3#主变压器"
          />
        </label>


        <label>
          <span>
            设备类型
          </span>

          <select
            v-model="
              form.type
            "
          >
            <option value="牵引变压器">
              牵引变压器
            </option>

            <option value="高压开关">
              高压开关
            </option>

            <option value="互感器">
              互感器
            </option>

            <option value="避雷器">
              避雷器
            </option>

            <option value="二次设备">
              二次设备
            </option>
          </select>
        </label>


        <label>
          <span>
            所属所亭
          </span>

          <input
            v-model="
              form.station
            "
            type="text"
          />
        </label>


        <label>
          <span>
            型号
          </span>

          <input
            v-model="
              form.model
            "
            type="text"
          />
        </label>


        <label>
          <span>
            投运日期
          </span>

          <input
            v-model="
              form.commissionDate
            "
            type="date"
          />
        </label>


        <label>
          <span>
            健康度
          </span>

          <input
            v-model.number="
              form.health
            "
            type="number"
            min="0"
            max="100"
          />
        </label>


        <label>
          <span>
            状态
          </span>

          <select
            v-model="
              form.status
            "
          >
            <option value="正常">
              正常
            </option>

            <option value="预警">
              预警
            </option>

            <option value="故障">
              故障
            </option>

            <option value="停用">
              停用
            </option>
          </select>
        </label>

      </div>


      <template #footer>

        <button
          type="button"
          class="dialog-cancel"
          @click="
            dialogVisible = false
          "
        >
          取消
        </button>


        <button
          type="button"
          class="dialog-submit"
          @click="
            submitForm
          "
        >
          确定
        </button>

      </template>

    </el-dialog>

  </section>
</template>


<style scoped>
.device-manage-view {
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

.manage-panel {
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
    rgba(1, 26, 48, 0.92);

  border: 1px solid #075786;
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
    1px solid #075786;
}

.panel-title > strong {
  display: flex;
  align-items: center;

  color: #e5f9ff;

  font-size: 13px;

  font-weight: 600;
}

.panel-title > strong::before {
  content: "";

  width: 3px;
  height: 22px;

  margin-right: 7px;

  background: #16dcef;

  box-shadow:
    0 0 5px
    rgba(22, 220, 239, 0.42);
}

.title-right {
  display: flex;
  align-items: center;

  gap: 10px;

  color: #729bb3;

  font-size: 9px;
}

.add-button {
  height: 25px;

  padding: 0 12px;

  color: #ffffff;

  font-size: 9px;

  cursor: pointer;

  background:
    linear-gradient(
      180deg,
      #078fd0,
      #08649b
    );

  border:
    1px solid #16b9e7;
}


/* =====================================================
   筛选栏
===================================================== */

.filter-bar {
  height: 42px;

  padding: 0 10px;

  box-sizing: border-box;

  display: flex;
  align-items: center;

  gap: 8px;

  background:
    rgba(4, 46, 77, 0.42);

  border-bottom:
    1px solid
    rgba(32, 91, 128, 0.24);
}

.filter-label {
  color: #719bb5;

  font-size: 10px;
}

.filter-select {
  width: 105px;
  height: 26px;

  padding: 0 8px;

  box-sizing: border-box;

  outline: none;

  color: #b5d5e5;

  font-size: 10px;

  background: #07345a;

  border: 1px solid #086699;
}

.station-select {
  width: 145px;
  height: 26px;

  padding: 0 8px;

  box-sizing: border-box;

  outline: none;

  color: #b5d5e5;

  font-size: 10px;

  background: #07345a;

  border: 1px solid #086699;
}

.filter-select option,
.station-select option {
  color: #d9eef7;

  background: #052b4a;
}

.query-button,
.reset-button {
  height: 26px;

  padding: 0 12px;

  color: #64a7ca;

  font-size: 10px;

  cursor: pointer;

  background:
    rgba(5, 65, 105, 0.7);

  border: 1px solid #086699;
}

.query-button:hover,
.reset-button:hover {
  color: #dcf8ff;

  background:
    rgba(6, 92, 144, 0.78);
}


/* =====================================================
   表格
===================================================== */

.device-table {
  min-height: 0;

  display: flex;

  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;

  grid-template-columns:
    90px
    minmax(110px, 0.8fr)
    minmax(100px, 0.8fr)
    minmax(190px, 1.3fr)
    120px
    105px
    minmax(220px, 1.7fr)
    70px
    65px;

  align-items: center;
}

.table-header {
  height: 32px;

  flex-shrink: 0;

  padding: 0 10px;

  box-sizing: border-box;

  color: #6794af;

  font-size: 9px;

  background:
    rgba(5, 52, 87, 0.66);

  border-bottom:
    1px solid
    rgba(33, 95, 133, 0.28);
}

.table-body {
  min-height: 0;

  flex: 1;

  overflow-y: auto;
}

.table-body::-webkit-scrollbar {
  width: 4px;
}

.table-body::-webkit-scrollbar-thumb {
  background: #075786;
}

.table-row {
  min-height: 44px;

  padding: 0 10px;

  box-sizing: border-box;

  border-bottom:
    1px dashed
    rgba(28, 82, 116, 0.23);
}

.table-row:hover {
  background:
    rgba(7, 62, 100, 0.17);
}

.device-code {
  color: #e2f3f9;

  font-size: 10px;
}

.device-name {
  color: #d7edf5;

  font-size: 10px;

  font-weight: 600;
}

.text-value,
.model-value,
.date-value {
  color: #77a2bb;

  font-size: 9px;
}


/* =====================================================
   健康度
===================================================== */

.health-cell {
  min-width: 0;

  padding-right: 14px;

  display: flex;
  align-items: center;

  gap: 8px;
}

.health-track {
  height: 4px;

  min-width: 0;

  flex: 1;

  overflow: hidden;

  background:
    rgba(7, 72, 112, 0.65);
}

.health-bar {
  height: 100%;

  border-radius: 2px;

  background:
    linear-gradient(
      90deg,
      #138cda,
      #10dff0
    );
}

.health-cell strong {
  width: 34px;

  flex-shrink: 0;

  text-align: right;

  font-size: 9px;
}

.health-normal strong {
  color: #13dfef;
}

.health-warning strong {
  color: #ffb11c;
}

.health-danger strong {
  color: #ff536f;
}

.health-warning .health-bar {
  background:
    linear-gradient(
      90deg,
      #da8600,
      #ffb41c
    );
}

.health-danger .health-bar {
  background:
    linear-gradient(
      90deg,
      #da3453,
      #ff5b72
    );
}


/* =====================================================
   状态
===================================================== */

.status-tag {
  justify-self: start;

  min-width: 38px;

  padding: 2px 5px;

  box-sizing: border-box;

  text-align: center;

  font-size: 8px;

  border: 1px solid;
}

.status-normal {
  color: #35dfa6;

  border-color:
    rgba(53, 223, 166, 0.6);

  background:
    rgba(53, 223, 166, 0.06);
}

.status-warning {
  color: #ffb11b;

  border-color:
    rgba(255, 177, 27, 0.65);

  background:
    rgba(255, 177, 27, 0.07);
}

.status-danger {
  color: #ff536f;

  border-color:
    rgba(255, 83, 111, 0.65);

  background:
    rgba(255, 83, 111, 0.07);
}


/* =====================================================
   操作
===================================================== */

.operation {
  display: flex;

  gap: 5px;
}

.operation-button {
  width: 24px;
  height: 24px;

  padding: 0;

  color: #42b8df;

  font-size: 11px;

  cursor: pointer;

  background:
    rgba(5, 68, 108, 0.45);

  border: 1px solid #0871a4;
}

.operation-button:hover {
  color: #ffffff;

  background:
    rgba(7, 103, 153, 0.65);
}

.operation-button.delete:hover {
  color: #ff7185;

  border-color: #b7465b;
}


/* =====================================================
   空数据和分页
===================================================== */

.empty-data {
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #517e98;

  font-size: 11px;
}

.pagination-bar {
  height: 32px;

  padding: 0 10px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: #7099b1;

  font-size: 9px;

  border-top:
    1px solid
    rgba(29, 89, 126, 0.24);
}

.pagination {
  display: flex;

  gap: 4px;
}

.pagination button {
  height: 24px;

  min-width: 28px;

  padding: 0 7px;

  color: #6692ad;

  font-size: 9px;

  background:
    rgba(4, 43, 74, 0.72);

  border: 1px solid #075786;
}

.pagination .page-active {
  color: #ffffff;

  background: #0782bd;

  border-color: #14c9ed;
}

.pagination button:disabled {
  opacity: 0.48;
}


/* =====================================================
   弹窗表单
===================================================== */

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 14px;
}

.form-grid label {
  display: grid;

  gap: 6px;
}

.form-grid label > span {
  color: #85aabe;

  font-size: 11px;
}

.form-grid input,
.form-grid select {
  width: 100%;

  height: 36px;

  padding: 0 10px;

  box-sizing: border-box;

  outline: none;

  color: #d7eef7;

  background: #052c49;

  border: 1px solid #08709f;
}

.dialog-cancel,
.dialog-submit {
  height: 30px;

  padding: 0 18px;

  cursor: pointer;
}

.dialog-cancel {
  color: #80a6bb;

  background: #073150;

  border: 1px solid #075f89;
}

.dialog-submit {
  margin-left: 8px;

  color: #ffffff;

  background: #087db6;

  border: 1px solid #16b9e7;
}


/* =====================================================
   Element Plus
===================================================== */

:deep(.el-dialog) {
  background: #062944;

  border: 1px solid #0872a3;
}

:deep(.el-dialog__title) {
  color: #e4f7fd;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #6ea5c3;
}


/* =====================================================
   中等屏幕
===================================================== */

@media (max-width: 1500px) {
  .device-manage-view {
    grid-template-rows:
      60px
      minmax(0, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns:
      75px
      minmax(90px, 0.8fr)
      minmax(85px, 0.8fr)
      minmax(145px, 1.2fr)
      100px
      90px
      minmax(170px, 1.6fr)
      55px
      55px;
  }
}
</style>