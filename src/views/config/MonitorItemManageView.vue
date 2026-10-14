<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MetricCards from '@/components/common/MetricCards.vue'
import { monitorItemSummary, monitorItemRecords } from '@/mocks/config'

const metrics = computed(() => [
  {
    key: 'total',
    icon: '◉',
    value: monitorItemSummary.totalCount,
    unit: '项',
    label: '监测项总数',
    theme: 'cyan',
  },
  {
    key: 'enabled',
    icon: '✓',
    value: monitorItemSummary.enabledCount,
    unit: '项',
    label: '启用',
    theme: 'green',
  },
  {
    key: 'disabled',
    icon: '×',
    value: monitorItemSummary.disabledCount,
    unit: '项',
    label: '停用',
    theme: 'orange',
  },
  {
    key: 'limit',
    icon: '!',
    value: monitorItemSummary.limitConfiguredCount,
    unit: '项',
    label: '越限配置',
    theme: 'orange',
  },
])

const records = ref(monitorItemRecords.map((item) => ({ ...item })))

const queryForm = reactive({
  device: 'all',
  type: 'all',
  status: 'all',
})

const appliedQuery = reactive({
  device: 'all',
  type: 'all',
  status: 'all',
})

const deviceOptions = computed(() => {
  const map = new Map()
  records.value.forEach((item) => map.set(item.deviceCode, item.device))
  return Array.from(map.entries()).map(([code, name]) => ({ code, name }))
})

const typeOptions = computed(() => [...new Set(records.value.map((item) => item.type))])

const filteredRecords = computed(() => {
  return records.value.filter((item) => {
    const deviceMatch = appliedQuery.device === 'all' || item.deviceCode === appliedQuery.device

    const typeMatch = appliedQuery.type === 'all' || item.type === appliedQuery.type

    const statusMatch = appliedQuery.status === 'all' || item.status === appliedQuery.status

    return deviceMatch && typeMatch && statusMatch
  })
})

function handleQuery() {
  Object.assign(appliedQuery, queryForm)
}

function resetQuery() {
  queryForm.device = 'all'
  queryForm.type = 'all'
  queryForm.status = 'all'
  appliedQuery.device = 'all'
  appliedQuery.type = 'all'
  appliedQuery.status = 'all'
}

function getTypeClass(type) {
  if (type === '温度量') return 'type-temperature'
  if (type === '局放量') return 'type-discharge'
  return 'type-electric'
}

function getStatusClass(status) {
  return status === '启用' ? 'status-enabled' : 'status-disabled'
}

function getLimitClass(item) {
  if (item.type === '温度量') return 'limit-warning'
  if (item.type === '局放量') return 'limit-danger'
  return 'limit-normal'
}

const dialogVisible = ref(false)
const dialogMode = ref('add')
const editingId = ref(null)

const form = reactive({
  code: '',
  name: '',
  device: '',
  deviceCode: '',
  type: '电气量',
  unit: '',
  upperLimit: 0,
  lowerLimit: 0,
  status: '启用',
})

function resetForm() {
  form.code = ''
  form.name = ''
  form.device = ''
  form.deviceCode = ''
  form.type = '电气量'
  form.unit = ''
  form.upperLimit = 0
  form.lowerLimit = 0
  form.status = '启用'
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
  if (!form.code || !form.name || !form.device || !form.unit) {
    ElMessage.warning('请填写完整监测项信息')
    return
  }

  const upper = Number(form.upperLimit)
  const lower = Number(form.lowerLimit)

  if (Number.isNaN(upper) || Number.isNaN(lower)) {
    ElMessage.warning('上下限必须为数字')
    return
  }

  if (lower > upper) {
    ElMessage.warning('下限不能大于上限')
    return
  }

  if (dialogMode.value === 'add') {
    if (records.value.some((item) => item.code === form.code)) {
      ElMessage.warning('测点编号已经存在')
      return
    }

    const maxId = records.value.length ? Math.max(...records.value.map((item) => item.id)) : 0

    records.value.unshift({
      id: maxId + 1,
      code: form.code,
      name: form.name,
      device: form.device,
      deviceCode: form.deviceCode || `DEVICE-${maxId + 1}`,
      type: form.type,
      unit: form.unit,
      upperLimit: upper,
      lowerLimit: lower,
      status: form.status,
    })

    ElMessage.success('新增监测项成功')
  } else {
    const item = records.value.find((record) => record.id === editingId.value)

    if (item) {
      Object.assign(item, {
        code: form.code,
        name: form.name,
        device: form.device,
        deviceCode: form.deviceCode,
        type: form.type,
        unit: form.unit,
        upperLimit: upper,
        lowerLimit: lower,
        status: form.status,
      })
    }

    ElMessage.success('监测项修改成功')
  }

  dialogVisible.value = false
}

async function deleteItem(item) {
  try {
    await ElMessageBox.confirm(`确定删除监测项“${item.name}（${item.code}）”吗？`, '删除确认', {
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
  <section class="monitor-item-view">
    <MetricCards :items="metrics" :columns="4" variant="compact" />

    <section class="manage-panel">
      <div class="panel-title">
        <strong>监测项管理</strong>
        <div class="title-right">
          <span>共 {{ filteredRecords.length }} 项</span>
          <button type="button" class="add-button" @click="openAddDialog">＋ 新增</button>
        </div>
      </div>

      <div class="filter-bar">
        <span class="filter-label">所属设备</span>
        <select v-model="queryForm.device" class="device-select">
          <option value="all">全部</option>
          <option v-for="item in deviceOptions" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>

        <span class="filter-label">量测类型</span>
        <select v-model="queryForm.type" class="filter-select">
          <option value="all">全部</option>
          <option v-for="item in typeOptions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>

        <span class="filter-label">状态</span>
        <select v-model="queryForm.status" class="filter-select">
          <option value="all">全部</option>
          <option value="启用">启用</option>
          <option value="停用">停用</option>
        </select>

        <button type="button" class="query-button" @click="handleQuery">⌕ 查询</button>
        <button type="button" class="reset-button" @click="resetQuery">↻ 重置</button>
      </div>

      <div class="monitor-table">
        <div class="table-header">
          <span>测点编号</span>
          <span>测点名称</span>
          <span>所属设备</span>
          <span>量测类型</span>
          <span>单位</span>
          <span>上限</span>
          <span>下限</span>
          <span>状态</span>
          <span>操作</span>
        </div>

        <div class="table-body">
          <div v-for="item in filteredRecords" :key="item.id" class="table-row">
            <strong class="point-code">{{ item.code }}</strong>
            <span class="point-name">{{ item.name }}</span>
            <span class="device-name">{{ item.device }}</span>

            <span class="type-tag" :class="getTypeClass(item.type)">
              {{ item.type }}
            </span>

            <span class="unit-value">{{ item.unit }}</span>

            <strong class="limit-value" :class="getLimitClass(item)">
              {{ item.upperLimit }}
              <small>{{ item.unit }}</small>
            </strong>

            <strong class="limit-value" :class="getLimitClass(item)">
              {{ item.lowerLimit }}
              <small>{{ item.unit }}</small>
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
                @click="deleteItem(item)"
              >
                ▢
              </button>
            </div>
          </div>

          <div v-if="!filteredRecords.length" class="empty-data">当前暂无符合条件的监测项</div>
        </div>
      </div>

      <div class="pagination-bar">
        <span>共 {{ filteredRecords.length }} 项</span>

        <div class="pagination">
          <button type="button" disabled>上一页</button>
          <button type="button" class="page-active">1</button>
          <button type="button" disabled>下一页</button>
        </div>
      </div>
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增监测项' : '编辑监测项'"
      width="650px"
    >
      <div class="form-grid">
        <label>
          <span>测点编号</span>
          <input v-model="form.code" type="text" placeholder="例如 PT-070" />
        </label>

        <label>
          <span>测点名称</span>
          <input v-model="form.name" type="text" placeholder="例如 油位" />
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
          <span>量测类型</span>
          <select v-model="form.type">
            <option value="电气量">电气量</option>
            <option value="温度量">温度量</option>
            <option value="局放量">局放量</option>
            <option value="状态量">状态量</option>
          </select>
        </label>

        <label>
          <span>单位</span>
          <input v-model="form.unit" type="text" placeholder="例如 kV、℃、pC" />
        </label>

        <label>
          <span>上限</span>
          <input v-model.number="form.upperLimit" type="number" step="any" />
        </label>

        <label>
          <span>下限</span>
          <input v-model.number="form.lowerLimit" type="number" step="any" />
        </label>

        <label>
          <span>状态</span>
          <select v-model="form.status">
            <option value="启用">启用</option>
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
.monitor-item-view {
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

.device-select {
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

.device-select option,
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

.monitor-table {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    90px
    minmax(130px, 0.9fr)
    minmax(200px, 1.5fr)
    90px
    65px
    90px
    90px
    65px
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
  border-bottom: 1px dashed rgba(28, 82, 116, 0.23);
}

.table-row:hover {
  background: rgba(7, 62, 100, 0.17);
}

.point-code {
  color: #e5f4fa;
  font-size: 10px;
}

.point-name {
  color: #d7edf5;
  font-size: 10px;
  font-weight: 600;
}

.device-name {
  color: #84a9bd;
  font-size: 9px;
}

.type-tag {
  justify-self: start;
  min-width: 46px;
  padding: 2px 5px;
  box-sizing: border-box;
  text-align: center;
  font-size: 8px;
  border: 1px solid;
}

.type-electric {
  color: #35dfa6;
  border-color: rgba(53, 223, 166, 0.6);
  background: rgba(53, 223, 166, 0.06);
}

.type-temperature {
  color: #ffb11b;
  border-color: rgba(255, 177, 27, 0.65);
  background: rgba(255, 177, 27, 0.07);
}

.type-discharge {
  color: #ff536f;
  border-color: rgba(255, 83, 111, 0.65);
  background: rgba(255, 83, 111, 0.07);
}

.unit-value {
  color: #76a5bd;
  font-size: 9px;
}

.limit-value {
  font-size: 11px;
}

.limit-value small {
  margin-left: 2px;
  font-size: 7px;
  font-weight: normal;
}

.limit-normal {
  color: #18dff0;
}

.limit-warning {
  color: #ffb11b;
}

.limit-danger {
  color: #ff536f;
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

.status-enabled {
  color: #35dfa6;
  border-color: rgba(53, 223, 166, 0.6);
  background: rgba(53, 223, 166, 0.06);
}

.status-disabled {
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
  .monitor-item-view {
    grid-template-rows: 60px minmax(0, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns:
      72px
      minmax(105px, 0.9fr)
      minmax(155px, 1.4fr)
      72px
      50px
      70px
      70px
      55px
      55px;
  }
}
</style>
