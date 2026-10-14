<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MetricCards from '@/components/common/MetricCards.vue'
import { inspectionSummary, inspectionRecords } from '@/mocks/maintenance'

const metrics = computed(() => [
  {
    key: 'monthly',
    icon: '♟',
    value: inspectionSummary.monthlyCount,
    unit: '条',
    label: '本月任务',
    theme: 'cyan',
  },
  {
    key: 'completed',
    icon: '✓',
    value: inspectionSummary.completedCount,
    unit: '条',
    label: '已完成',
    theme: 'green',
  },
  {
    key: 'processing',
    icon: '✣',
    value: inspectionSummary.processingCount,
    unit: '条',
    label: '进行中',
    theme: 'orange',
  },
  {
    key: 'overdue',
    icon: '!',
    value: inspectionSummary.overdueCount,
    unit: '条',
    label: '已逾期',
    theme: 'red',
  },
])

const records = ref(inspectionRecords.map((item) => ({ ...item })))

const queryForm = reactive({
  station: 'all',
  status: 'all',
})

const appliedQuery = reactive({
  station: 'all',
  status: 'all',
})

const stationOptions = computed(() => [...new Set(records.value.map((item) => item.station))])

const filteredRecords = computed(() => {
  return records.value.filter((item) => {
    const stationMatch = appliedQuery.station === 'all' || item.station === appliedQuery.station

    const statusMatch = appliedQuery.status === 'all' || item.status === appliedQuery.status

    return stationMatch && statusMatch
  })
})

function handleQuery() {
  Object.assign(appliedQuery, queryForm)
}

function resetQuery() {
  queryForm.station = 'all'
  queryForm.status = 'all'
  appliedQuery.station = 'all'
  appliedQuery.status = 'all'
}

function getStatusClass(status) {
  if (status === '已完成') return 'status-completed'
  if (status === '进行中') return 'status-processing'
  if (status === '待开始') return 'status-waiting'
  return 'status-overdue'
}

function getAbnormalClass(value) {
  return value > 0 ? 'abnormal-danger' : 'abnormal-normal'
}

const dialogVisible = ref(false)
const dialogMode = ref('add')
const editingId = ref(null)

const form = reactive({
  code: '',
  plan: '',
  station: '',
  inspector: '',
  planTime: '',
  finishTime: '',
  itemCount: 0,
  abnormalCount: 0,
  status: '待开始',
})

function resetForm() {
  form.code = ''
  form.plan = ''
  form.station = ''
  form.inspector = ''
  form.planTime = ''
  form.finishTime = ''
  form.itemCount = 0
  form.abnormalCount = 0
  form.status = '待开始'
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
  Object.assign(form, item)
  dialogVisible.value = true
}

function submitForm() {
  if (!form.code || !form.plan || !form.station || !form.planTime) {
    ElMessage.warning('请填写完整巡检任务信息')
    return
  }

  const itemCount = Number(form.itemCount)
  const abnormalCount = Number(form.abnormalCount)

  if (itemCount < 0 || abnormalCount < 0) {
    ElMessage.warning('巡检项和异常数不能小于0')
    return
  }

  if (dialogMode.value === 'add') {
    if (records.value.some((item) => item.code === form.code)) {
      ElMessage.warning('任务编号已经存在')
      return
    }

    const maxId = records.value.length ? Math.max(...records.value.map((item) => item.id)) : 0

    records.value.unshift({
      id: maxId + 1,
      code: form.code,
      plan: form.plan,
      station: form.station,
      inspector: form.inspector || '--',
      planTime: form.planTime,
      finishTime: form.finishTime || '--',
      itemCount,
      abnormalCount,
      status: form.status,
    })

    ElMessage.success('新增巡检任务成功')
  } else {
    const item = records.value.find((record) => record.id === editingId.value)

    if (item) {
      Object.assign(item, {
        code: form.code,
        plan: form.plan,
        station: form.station,
        inspector: form.inspector || '--',
        planTime: form.planTime,
        finishTime: form.finishTime || '--',
        itemCount,
        abnormalCount,
        status: form.status,
      })
    }

    ElMessage.success('巡检任务修改成功')
  }

  dialogVisible.value = false
}

async function deleteRecord(item) {
  try {
    await ElMessageBox.confirm(`确定删除巡检任务“${item.code}”吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    records.value = records.value.filter((record) => record.id !== item.id)
    ElMessage.success('删除成功')
  } catch {
    // 取消
  }
}
</script>

<template>
  <section class="inspection-view">
    <MetricCards :items="metrics" :columns="4" variant="compact" />

    <section class="manage-panel">
      <div class="panel-title">
        <strong>巡检管理</strong>
        <div class="title-right">
          <span>共 {{ filteredRecords.length }} 条</span>
          <button type="button" class="add-button" @click="openAddDialog">＋ 新增</button>
        </div>
      </div>

      <div class="filter-bar">
        <span class="filter-label">所属所亭</span>
        <select v-model="queryForm.station" class="station-select">
          <option value="all">全部</option>
          <option v-for="item in stationOptions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>

        <span class="filter-label">任务状态</span>
        <select v-model="queryForm.status" class="filter-select">
          <option value="all">全部</option>
          <option value="已完成">已完成</option>
          <option value="进行中">进行中</option>
          <option value="待开始">待开始</option>
          <option value="已逾期">已逾期</option>
        </select>

        <button type="button" class="query-button" @click="handleQuery">⌕ 查询</button>

        <button type="button" class="reset-button" @click="resetQuery">↻ 重置</button>
      </div>

      <div class="inspection-table">
        <div class="table-header">
          <span>任务编号</span>
          <span>巡检计划</span>
          <span>所属所亭</span>
          <span>巡检人</span>
          <span>计划时间</span>
          <span>完成时间</span>
          <span>巡检项</span>
          <span>异常</span>
          <span>状态</span>
          <span>操作</span>
        </div>

        <div class="table-body">
          <div v-for="item in filteredRecords" :key="item.id" class="table-row">
            <strong class="task-code">{{ item.code }}</strong>
            <span class="plan-name">{{ item.plan }}</span>
            <span class="station-name">{{ item.station }}</span>
            <span class="inspector">{{ item.inspector }}</span>
            <span class="time-value">{{ item.planTime }}</span>
            <span class="time-value">{{ item.finishTime }}</span>

            <strong class="item-count">
              {{ item.itemCount }}
              <small>项</small>
            </strong>

            <strong class="abnormal-count" :class="getAbnormalClass(item.abnormalCount)">
              {{ item.abnormalCount }}
              <small>项</small>
            </strong>

            <span class="status-tag" :class="getStatusClass(item.status)">
              {{ item.status }}
            </span>

            <div class="operation">
              <button
                type="button"
                class="operation-button"
                title="编辑"
                @click="openEditDialog(item)"
              >
                ✎
              </button>

              <button
                type="button"
                class="operation-button delete"
                title="删除"
                @click="deleteRecord(item)"
              >
                ▢
              </button>
            </div>
          </div>

          <div v-if="!filteredRecords.length" class="empty-data">当前暂无符合条件的巡检任务</div>
        </div>
      </div>

      <div class="pagination-bar">
        <span>共 {{ filteredRecords.length }} 条</span>

        <div class="pagination">
          <button type="button" disabled>上一页</button>
          <button type="button" class="page-active">1</button>
          <button type="button" disabled>下一页</button>
        </div>
      </div>
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增巡检任务' : '编辑巡检任务'"
      width="680px"
    >
      <div class="form-grid">
        <label>
          <span>任务编号</span>
          <input v-model="form.code" type="text" placeholder="例如 XJ-2026-029" />
        </label>

        <label>
          <span>巡检计划</span>
          <input v-model="form.plan" type="text" placeholder="例如 日巡检·主变油温" />
        </label>

        <label>
          <span>所属所亭</span>
          <input v-model="form.station" type="text" placeholder="例如 石家庄牵引变电所" />
        </label>

        <label>
          <span>巡检人</span>
          <input v-model="form.inspector" type="text" placeholder="例如 张工" />
        </label>

        <label>
          <span>计划时间</span>
          <input v-model="form.planTime" type="datetime-local" />
        </label>

        <label>
          <span>完成时间</span>
          <input v-model="form.finishTime" type="datetime-local" />
        </label>

        <label>
          <span>巡检项数量</span>
          <input v-model.number="form.itemCount" type="number" min="0" />
        </label>

        <label>
          <span>异常数量</span>
          <input v-model.number="form.abnormalCount" type="number" min="0" />
        </label>

        <label>
          <span>状态</span>
          <select v-model="form.status">
            <option value="待开始">待开始</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
            <option value="已逾期">已逾期</option>
          </select>
        </label>
      </div>

      <template #footer>
        <button type="button" class="dialog-cancel" @click="dialogVisible = false">取消</button>
        <button type="button" class="dialog-submit" @click="submitForm">确定</button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.inspection-view {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 706px;
  display: grid;
  grid-template-rows: 64px minmax(0, 1fr);
  gap: 10px;
}

.manage-panel {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: 36px 42px minmax(0, 1fr) 32px;
  overflow: hidden;
  background: rgba(1, 26, 48, 0.92);
  border: 1px solid #075786;
}

.panel-title {
  height: 36px;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #075184, #063457);
  border-bottom: 1px solid #075786;
}

.panel-title > strong {
  display: flex;
  align-items: center;
  color: #e5f9ff;
  font-size: 13px;
  font-weight: 600;
}

.panel-title > strong::before {
  content: '';
  width: 3px;
  height: 22px;
  margin-right: 7px;
  background: #16dcef;
  box-shadow: 0 0 5px rgba(22, 220, 239, 0.42);
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
  color: #fff;
  font-size: 9px;
  cursor: pointer;
  background: linear-gradient(180deg, #078fd0, #08649b);
  border: 1px solid #16b9e7;
}

.filter-bar {
  height: 42px;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(4, 46, 77, 0.42);
  border-bottom: 1px solid rgba(32, 91, 128, 0.24);
}

.filter-label {
  color: #719bb5;
  font-size: 10px;
}

.station-select {
  width: 160px;
  height: 26px;
  padding: 0 8px;
  box-sizing: border-box;
  outline: none;
  color: #b5d5e5;
  font-size: 10px;
  background: #07345a;
  border: 1px solid #086699;
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

.station-select option,
.filter-select option {
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
  background: rgba(5, 65, 105, 0.7);
  border: 1px solid #086699;
}

.query-button:hover,
.reset-button:hover {
  color: #dcf8ff;
  background: rgba(6, 92, 144, 0.78);
}

.inspection-table {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    105px
    minmax(180px, 1.3fr)
    minmax(210px, 1.4fr)
    70px
    135px
    135px
    70px
    60px
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
  background: rgba(5, 52, 87, 0.66);
  border-bottom: 1px solid rgba(33, 95, 133, 0.28);
}

.table-body {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
}

.table-row {
  min-height: 44px;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px dashed rgba(28, 82, 116, 0.23);
}

.table-row:hover {
  background: rgba(7, 62, 100, 0.17);
}

.task-code {
  color: #e3f3f9;
  font-size: 10px;
}

.plan-name {
  color: #b4cfdd;
  font-size: 10px;
}

.station-name,
.inspector,
.time-value {
  color: #75a1b9;
  font-size: 9px;
}

.item-count {
  color: #16ddef;
  font-size: 11px;
}

.abnormal-count {
  font-size: 11px;
}

.item-count small,
.abnormal-count small {
  margin-left: 2px;
  color: #7199af;
  font-size: 7px;
}

.abnormal-normal {
  color: #13ddef;
}

.abnormal-danger {
  color: #ff536f;
}

.status-tag {
  justify-self: start;
  min-width: 44px;
  padding: 2px 5px;
  box-sizing: border-box;
  text-align: center;
  font-size: 8px;
  border: 1px solid;
}

.status-completed {
  color: #35dfa6;
  border-color: rgba(53, 223, 166, 0.6);
  background: rgba(53, 223, 166, 0.06);
}

.status-processing {
  color: #ffb11b;
  border-color: rgba(255, 177, 27, 0.65);
  background: rgba(255, 177, 27, 0.07);
}

.status-waiting {
  color: #ff607c;
  border-color: rgba(255, 96, 124, 0.65);
  background: rgba(255, 96, 124, 0.07);
}

.status-overdue {
  color: #ff536f;
  border-color: rgba(255, 83, 111, 0.65);
  background: rgba(255, 83, 111, 0.07);
}

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
  background: rgba(5, 68, 108, 0.45);
  border: 1px solid #0871a4;
}

.operation-button:hover {
  color: #fff;
  background: rgba(7, 103, 153, 0.65);
}

.operation-button.delete:hover {
  color: #ff7185;
  border-color: #b7465b;
}

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
  border-top: 1px solid rgba(29, 89, 126, 0.24);
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
  background: rgba(4, 43, 74, 0.72);
  border: 1px solid #075786;
}

.pagination .page-active {
  color: #fff;
  background: #0782bd;
  border-color: #14c9ed;
}

.pagination button:disabled {
  opacity: 0.48;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  color: #fff;
  background: #087db6;
  border: 1px solid #16b9e7;
}

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

@media (max-width: 1500px) {
  .inspection-view {
    grid-template-rows: 60px minmax(0, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns:
      90px
      minmax(140px, 1.2fr)
      minmax(160px, 1.3fr)
      55px
      110px
      110px
      55px
      50px
      58px
      55px;
  }
}
</style>
