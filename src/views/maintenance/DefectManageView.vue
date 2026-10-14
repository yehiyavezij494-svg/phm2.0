<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MetricCards from '@/components/common/MetricCards.vue'
import { defectSummary, defectRecords } from '@/mocks/maintenance'

const metrics = computed(() => [
  {
    key: 'monthly',
    icon: '!',
    value: defectSummary.monthlyCount,
    unit: '条',
    label: '本月消缺',
    theme: 'cyan',
  },
  {
    key: 'completed',
    icon: '✓',
    value: defectSummary.completedCount,
    unit: '条',
    label: '已消缺',
    theme: 'green',
  },
  {
    key: 'processing',
    icon: '✣',
    value: defectSummary.processingCount,
    unit: '条',
    label: '处理中',
    theme: 'orange',
  },
  {
    key: 'overdue',
    icon: '×',
    value: defectSummary.overdueCount,
    unit: '条',
    label: '超期未消',
    theme: 'red',
  },
])

const records = ref(defectRecords.map((item) => ({ ...item })))

const queryForm = reactive({
  level: 'all',
  status: 'all',
})

const appliedQuery = reactive({
  level: 'all',
  status: 'all',
})

const filteredRecords = computed(() => {
  return records.value.filter((item) => {
    const levelMatch = appliedQuery.level === 'all' || item.level === appliedQuery.level

    const statusMatch = appliedQuery.status === 'all' || item.status === appliedQuery.status

    return levelMatch && statusMatch
  })
})

function handleQuery() {
  Object.assign(appliedQuery, queryForm)
}

function resetQuery() {
  queryForm.level = 'all'
  queryForm.status = 'all'
  appliedQuery.level = 'all'
  appliedQuery.status = 'all'
}

function getLevelClass(level) {
  if (level === '紧急') return 'level-danger'
  if (level === '重要') return 'level-warning'
  return 'level-normal'
}

function getStatusClass(status) {
  if (status === '已消缺') return 'status-completed'
  if (status === '处理中') return 'status-processing'
  if (status === '待处理') return 'status-waiting'
  return 'status-overdue'
}

const dialogVisible = ref(false)
const dialogMode = ref('add')
const editingId = ref(null)

const form = reactive({
  code: '',
  description: '',
  device: '',
  deviceCode: '',
  level: '一般',
  foundTime: '',
  handler: '',
  planFinishTime: '',
  actualFinishTime: '',
  status: '待处理',
})

function resetForm() {
  form.code = ''
  form.description = ''
  form.device = ''
  form.deviceCode = ''
  form.level = '一般'
  form.foundTime = ''
  form.handler = ''
  form.planFinishTime = ''
  form.actualFinishTime = ''
  form.status = '待处理'
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
  if (!form.code || !form.description || !form.device || !form.foundTime || !form.planFinishTime) {
    ElMessage.warning('请填写完整消缺信息')
    return
  }

  if (dialogMode.value === 'add') {
    if (records.value.some((item) => item.code === form.code)) {
      ElMessage.warning('消缺单号已经存在')
      return
    }

    const maxId = records.value.length ? Math.max(...records.value.map((item) => item.id)) : 0

    records.value.unshift({
      id: maxId + 1,
      code: form.code,
      description: form.description,
      device: form.device,
      deviceCode: form.deviceCode || `DEVICE-${maxId + 1}`,
      level: form.level,
      foundTime: formatDateTime(form.foundTime),
      handler: form.handler || '--',
      planFinishTime: formatDateTime(form.planFinishTime),
      actualFinishTime: form.actualFinishTime ? formatDateTime(form.actualFinishTime) : '--',
      status: form.status,
    })

    ElMessage.success('新增消缺任务成功')
  } else {
    const item = records.value.find((record) => record.id === editingId.value)

    if (item) {
      Object.assign(item, {
        code: form.code,
        description: form.description,
        device: form.device,
        deviceCode: form.deviceCode,
        level: form.level,
        foundTime: formatDateTime(form.foundTime),
        handler: form.handler || '--',
        planFinishTime: formatDateTime(form.planFinishTime),
        actualFinishTime: form.actualFinishTime ? formatDateTime(form.actualFinishTime) : '--',
        status: form.status,
      })
    }

    ElMessage.success('消缺信息修改成功')
  }

  dialogVisible.value = false
}

function formatDateTime(value) {
  if (!value || value === '--') return '--'
  return value.replace('T', ' ')
}

async function deleteRecord(item) {
  try {
    await ElMessageBox.confirm(`确定删除消缺任务“${item.code}”吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    records.value = records.value.filter((record) => record.id !== item.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <section class="defect-view">
    <MetricCards :items="metrics" :columns="4" variant="compact" />

    <section class="manage-panel">
      <div class="panel-title">
        <strong>消缺管理</strong>

        <div class="title-right">
          <span>共 {{ filteredRecords.length }} 条</span>
          <button type="button" class="add-button" @click="openAddDialog">＋ 新增</button>
        </div>
      </div>

      <div class="filter-bar">
        <span class="filter-label">缺陷等级</span>

        <select v-model="queryForm.level" class="filter-select">
          <option value="all">全部</option>
          <option value="紧急">紧急</option>
          <option value="重要">重要</option>
          <option value="一般">一般</option>
        </select>

        <span class="filter-label">处理状态</span>

        <select v-model="queryForm.status" class="filter-select">
          <option value="all">全部</option>
          <option value="待处理">待处理</option>
          <option value="处理中">处理中</option>
          <option value="已消缺">已消缺</option>
          <option value="超期未消">超期未消</option>
        </select>

        <button type="button" class="query-button" @click="handleQuery">⌕ 查询</button>

        <button type="button" class="reset-button" @click="resetQuery">↻ 重置</button>
      </div>

      <div class="defect-table">
        <div class="table-header">
          <span>消缺单号</span>
          <span>缺陷描述</span>
          <span>所属设备</span>
          <span>等级</span>
          <span>发现时间</span>
          <span>处理人</span>
          <span>计划完成</span>
          <span>实际完成</span>
          <span>状态</span>
          <span>操作</span>
        </div>

        <div class="table-body">
          <div v-for="item in filteredRecords" :key="item.id" class="table-row">
            <strong class="defect-code">{{ item.code }}</strong>

            <span class="description" :title="item.description">
              {{ item.description }}
            </span>

            <span class="device-name">{{ item.device }}</span>

            <span class="level-tag" :class="getLevelClass(item.level)">
              {{ item.level }}
            </span>

            <span class="time-value">{{ item.foundTime }}</span>
            <span class="handler">{{ item.handler }}</span>
            <span class="time-value">{{ item.planFinishTime }}</span>
            <span class="time-value">{{ item.actualFinishTime }}</span>

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

          <div v-if="!filteredRecords.length" class="empty-data">当前暂无符合条件的消缺任务</div>
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
      :title="dialogMode === 'add' ? '新增消缺任务' : '编辑消缺任务'"
      width="720px"
    >
      <div class="form-grid">
        <label>
          <span>消缺单号</span>
          <input v-model="form.code" type="text" placeholder="例如 XQ-2026-020" />
        </label>

        <label>
          <span>所属设备</span>
          <input v-model="form.device" type="text" placeholder="例如 2#主变压器" />
        </label>

        <label>
          <span>设备编码</span>
          <input v-model="form.deviceCode" type="text" placeholder="例如 BD-002" />
        </label>

        <label>
          <span>缺陷等级</span>
          <select v-model="form.level">
            <option value="一般">一般</option>
            <option value="重要">重要</option>
            <option value="紧急">紧急</option>
          </select>
        </label>

        <label>
          <span>发现时间</span>
          <input v-model="form.foundTime" type="datetime-local" />
        </label>

        <label>
          <span>处理人</span>
          <input v-model="form.handler" type="text" placeholder="例如 张工" />
        </label>

        <label>
          <span>计划完成</span>
          <input v-model="form.planFinishTime" type="datetime-local" />
        </label>

        <label>
          <span>实际完成</span>
          <input v-model="form.actualFinishTime" type="datetime-local" />
        </label>

        <label>
          <span>处理状态</span>
          <select v-model="form.status">
            <option value="待处理">待处理</option>
            <option value="处理中">处理中</option>
            <option value="已消缺">已消缺</option>
            <option value="超期未消">超期未消</option>
          </select>
        </label>

        <label class="full-row">
          <span>缺陷描述</span>
          <textarea v-model="form.description" rows="4" placeholder="请输入缺陷描述"></textarea>
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
.defect-view {
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

.filter-select {
  width: 100px;
  height: 26px;
  padding: 0 8px;
  box-sizing: border-box;
  outline: none;
  color: #b5d5e5;
  font-size: 10px;
  background: #07345a;
  border: 1px solid #086699;
}

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

.defect-table {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    105px
    minmax(300px, 2fr)
    minmax(150px, 1fr)
    60px
    125px
    65px
    125px
    125px
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

.defect-code {
  color: #e3f3f9;
  font-size: 10px;
}

.description {
  padding-right: 15px;
  overflow: hidden;
  color: #a7c4d3;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-name,
.handler,
.time-value {
  color: #76a2ba;
  font-size: 9px;
}

.level-tag,
.status-tag {
  justify-self: start;
  min-width: 40px;
  padding: 2px 5px;
  box-sizing: border-box;
  text-align: center;
  font-size: 8px;
  border: 1px solid;
}

.level-danger {
  color: #ff536f;
  border-color: rgba(255, 83, 111, 0.65);
  background: rgba(255, 83, 111, 0.07);
}

.level-warning {
  color: #ffb11b;
  border-color: rgba(255, 177, 27, 0.65);
  background: rgba(255, 177, 27, 0.07);
}

.level-normal {
  color: #18ddef;
  border-color: rgba(24, 221, 239, 0.6);
  background: rgba(24, 221, 239, 0.06);
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
.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 8px 10px;
  box-sizing: border-box;
  outline: none;
  color: #d7eef7;
  background: #052c49;
  border: 1px solid #08709f;
}

.form-grid input,
.form-grid select {
  height: 36px;
}

.form-grid textarea {
  resize: vertical;
}

.full-row {
  grid-column: 1 / -1;
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
  .defect-view {
    grid-template-rows: 60px minmax(0, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns:
      90px
      minmax(220px, 1.8fr)
      minmax(120px, 0.9fr)
      50px
      105px
      55px
      105px
      105px
      58px
      55px;
  }
}
</style>
