<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MetricCards from '@/components/common/MetricCards.vue'
import { stationSummary, stationRecords } from '@/mocks/config'

const metrics = computed(() => [
  {
    key: 'total',
    icon: '▥',
    value: stationSummary.totalCount,
    unit: '座',
    label: '所亭总数',
    theme: 'cyan',
  },
  {
    key: 'normal',
    icon: '✓',
    value: stationSummary.normalCount,
    unit: '座',
    label: '正常运行',
    theme: 'green',
  },
  {
    key: 'maintenance',
    icon: '!',
    value: stationSummary.maintenanceCount,
    unit: '座',
    label: '检修中',
    theme: 'orange',
  },
  {
    key: 'devices',
    icon: '▦',
    value: stationSummary.deviceCount,
    unit: '台',
    label: '设备总数',
    theme: 'cyan',
  },
])

const records = ref(stationRecords.map((item) => ({ ...item })))

const queryForm = reactive({
  line: 'all',
  status: 'all',
})

const appliedQuery = reactive({
  line: 'all',
  status: 'all',
})

const lineOptions = computed(() => [...new Set(records.value.map((item) => item.line))])

const filteredRecords = computed(() => {
  return records.value.filter((item) => {
    const lineMatch = appliedQuery.line === 'all' || item.line === appliedQuery.line
    const statusMatch = appliedQuery.status === 'all' || item.status === appliedQuery.status
    return lineMatch && statusMatch
  })
})

function handleQuery() {
  appliedQuery.line = queryForm.line
  appliedQuery.status = queryForm.status
}

function resetQuery() {
  queryForm.line = 'all'
  queryForm.status = 'all'
  appliedQuery.line = 'all'
  appliedQuery.status = 'all'
}

function getStatusClass(status) {
  if (status === '正常') return 'status-normal'
  if (status === '检修中') return 'status-warning'
  return 'status-danger'
}

const dialogVisible = ref(false)
const dialogMode = ref('add')
const editingId = ref(null)

const form = reactive({
  code: '',
  name: '',
  line: '京广线',
  mileage: '',
  deviceCount: 0,
  status: '正常',
})

function resetForm() {
  form.code = ''
  form.name = ''
  form.line = '京广线'
  form.mileage = ''
  form.deviceCount = 0
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
  Object.assign(form, item)
  dialogVisible.value = true
}

function submitForm() {
  if (!form.code || !form.name || !form.line || !form.mileage) {
    ElMessage.warning('请填写完整所亭信息')
    return
  }

  const count = Number(form.deviceCount)
  if (Number.isNaN(count) || count < 0) {
    ElMessage.warning('设备数请输入有效数字')
    return
  }

  if (dialogMode.value === 'add') {
    if (records.value.some((item) => item.code === form.code)) {
      ElMessage.warning('所亭编号已存在')
      return
    }

    const maxId = records.value.length ? Math.max(...records.value.map((item) => item.id)) : 0

    records.value.unshift({
      id: maxId + 1,
      code: form.code,
      name: form.name,
      line: form.line,
      mileage: form.mileage,
      deviceCount: count,
      status: form.status,
    })

    ElMessage.success('新增所亭成功')
  } else {
    const item = records.value.find((record) => record.id === editingId.value)
    if (item) {
      Object.assign(item, {
        code: form.code,
        name: form.name,
        line: form.line,
        mileage: form.mileage,
        deviceCount: count,
        status: form.status,
      })
    }
    ElMessage.success('所亭信息修改成功')
  }

  dialogVisible.value = false
}

async function deleteStation(item) {
  try {
    await ElMessageBox.confirm(`确定删除“${item.name}（${item.code}）”吗？`, '删除确认', {
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
  <section class="station-view">
    <MetricCards :items="metrics" :columns="4" variant="compact" />

    <section class="manage-panel">
      <div class="panel-title">
        <strong>所亭管理</strong>
        <div class="title-right">
          <span>共 {{ filteredRecords.length }} 座所亭</span>
          <button type="button" class="add-button" @click="openAddDialog">＋ 新增</button>
        </div>
      </div>

      <div class="filter-bar">
        <span class="filter-label">所属线路</span>
        <select v-model="queryForm.line" class="filter-select">
          <option value="all">全部</option>
          <option v-for="item in lineOptions" :key="item" :value="item">{{ item }}</option>
        </select>

        <span class="filter-label">运行状态</span>
        <select v-model="queryForm.status" class="filter-select">
          <option value="all">全部</option>
          <option value="正常">正常</option>
          <option value="检修中">检修中</option>
          <option value="停用">停用</option>
        </select>

        <button type="button" class="query-button" @click="handleQuery">⌕ 查询</button>
        <button type="button" class="reset-button" @click="resetQuery">↻ 重置</button>
      </div>

      <div class="station-table">
        <div class="table-header">
          <span>所亭编号</span>
          <span>所亭名称</span>
          <span>所属线路</span>
          <span>里程</span>
          <span>设备数</span>
          <span>状态</span>
          <span>操作</span>
        </div>

        <div class="table-body">
          <div v-for="item in filteredRecords" :key="item.id" class="table-row">
            <strong class="station-code">{{ item.code }}</strong>
            <span class="station-name">{{ item.name }}</span>
            <span class="text-value">{{ item.line }}</span>
            <span class="text-value">{{ item.mileage }}</span>
            <strong class="device-count">{{ item.deviceCount }}<small>台</small></strong>
            <span class="status-tag" :class="getStatusClass(item.status)">{{ item.status }}</span>

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
                @click="deleteStation(item)"
              >
                ▢
              </button>
            </div>
          </div>

          <div v-if="!filteredRecords.length" class="empty-data">当前暂无符合条件的所亭</div>
        </div>
      </div>

      <div class="pagination-bar">
        <span>共 {{ filteredRecords.length }} 座所亭</span>
        <div class="pagination">
          <button type="button" disabled>上一页</button>
          <button type="button" class="page-active">1</button>
          <button type="button" disabled>下一页</button>
        </div>
      </div>
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增所亭' : '编辑所亭'"
      width="600px"
    >
      <div class="form-grid">
        <label>
          <span>所亭编号</span>
          <input v-model="form.code" type="text" placeholder="例如 SS-003" />
        </label>

        <label>
          <span>所亭名称</span>
          <input v-model="form.name" type="text" placeholder="例如 新乐牵引变电所" />
        </label>

        <label>
          <span>所属线路</span>
          <input v-model="form.line" type="text" placeholder="例如 京广线" />
        </label>

        <label>
          <span>里程</span>
          <input v-model="form.mileage" type="text" placeholder="例如 K315+600" />
        </label>

        <label>
          <span>设备数</span>
          <input v-model.number="form.deviceCount" type="number" min="0" />
        </label>

        <label>
          <span>运行状态</span>
          <select v-model="form.status">
            <option value="正常">正常</option>
            <option value="检修中">检修中</option>
            <option value="停用">停用</option>
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
.station-view {
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
  width: 110px;
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

.station-table {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    95px
    minmax(260px, 2.5fr)
    110px
    110px
    85px
    75px
    70px;
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

.station-code {
  color: #e1f2f8;
  font-size: 10px;
}

.station-name {
  color: #d7edf5;
  font-size: 10px;
  font-weight: 600;
}

.text-value {
  color: #76a2bb;
  font-size: 9px;
}

.device-count {
  color: #13dcef;
  font-size: 11px;
}

.device-count small {
  margin-left: 2px;
  color: #719bb5;
  font-size: 8px;
}

.status-tag {
  justify-self: start;
  min-width: 40px;
  padding: 2px 5px;
  box-sizing: border-box;
  text-align: center;
  font-size: 8px;
  border: 1px solid;
}

.status-normal {
  color: #35dfa6;
  border-color: rgba(53, 223, 166, 0.6);
  background: rgba(53, 223, 166, 0.06);
}

.status-warning {
  color: #ffb11b;
  border-color: rgba(255, 177, 27, 0.65);
  background: rgba(255, 177, 27, 0.07);
}

.status-danger {
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
  .station-view {
    grid-template-rows: 60px minmax(0, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns:
      75px
      minmax(200px, 2fr)
      90px
      90px
      65px
      60px
      55px;
  }
}
</style>
