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
  deviceResumeSummary,
  deviceResumeRecords,
} from '@/mocks/device'


// =====================================================
// 顶部统计
// =====================================================

const metrics = computed(() => {
  return [
    {
      key: 'total',

      icon: '▣',

      value:
        deviceResumeSummary.totalCount,

      unit: '条',

      label:
        '累计履历',

      theme:
        'cyan',
    },

    {
      key: 'monthly',

      icon: '▦',

      value:
        deviceResumeSummary.monthlyCount,

      unit: '条',

      label:
        '本月新增',

      theme:
        'orange',
    },

    {
      key: 'pending',

      icon: '!',

      value:
        deviceResumeSummary.pendingCount,

      unit: '条',

      label:
        '待处理',

      theme:
        'red',
    },

    {
      key: 'archived',

      icon: '✓',

      value:
        deviceResumeSummary.archivedCount,

      unit: '条',

      label:
        '已归档',

      theme:
        'green',
    },
  ]
})


// =====================================================
// 数据副本
// =====================================================

const records = ref(
  deviceResumeRecords.map(
    (item) => ({
      ...item,
    }),
  ),
)


// =====================================================
// 筛选
// =====================================================

const deviceFilter =
  ref('all')

const typeFilter =
  ref('all')


const deviceOptions = computed(() => {
  const map = new Map()

  records.value.forEach(
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


const typeOptions = computed(() => {
  return [
    ...new Set(
      records.value.map(
        (item) =>
          item.type,
      ),
    ),
  ]
})


const filteredRecords = computed(() => {
  return records.value.filter(
    (item) => {
      const deviceMatch =
        deviceFilter.value ===
          'all' ||
        item.deviceCode ===
          deviceFilter.value

      const typeMatch =
        typeFilter.value ===
          'all' ||
        item.type ===
          typeFilter.value

      return (
        deviceMatch &&
        typeMatch
      )
    },
  )
})


function resetFilter() {
  deviceFilter.value =
    'all'

  typeFilter.value =
    'all'
}


// =====================================================
// 标签颜色
// =====================================================

function getTypeClass(type) {
  if (type === '缺陷') {
    return 'type-defect'
  }

  if (type === '试验') {
    return 'type-test'
  }

  if (type === '投运') {
    return 'type-operation'
  }

  return 'type-modification'
}


function getStatusClass(status) {
  if (status === '处理中') {
    return 'status-processing'
  }

  if (status === '已完成') {
    return 'status-completed'
  }

  return 'status-archived'
}


// =====================================================
// 新增 / 编辑弹窗
// =====================================================

const dialogVisible =
  ref(false)

const dialogMode =
  ref('add')

const editingId =
  ref(null)


const form = reactive({
  time: '',
  device: '',
  deviceCode: '',
  type: '缺陷',
  content: '',
  operator: '',
  status: '处理中',
})


function resetForm() {
  form.time = ''
  form.device = ''
  form.deviceCode = ''
  form.type = '缺陷'
  form.content = ''
  form.operator = ''
  form.status = '处理中'

  editingId.value = null
}


function openAddDialog() {
  dialogMode.value =
    'add'

  resetForm()

  dialogVisible.value =
    true
}


function openEditDialog(item) {
  dialogMode.value =
    'edit'

  editingId.value =
    item.id

  form.time =
    item.time

  form.device =
    item.device

  form.deviceCode =
    item.deviceCode

  form.type =
    item.type

  form.content =
    item.content

  form.operator =
    item.operator

  form.status =
    item.status

  dialogVisible.value =
    true
}


function submitForm() {
  if (
    !form.time ||
    !form.device ||
    !form.content
  ) {
    ElMessage.warning(
      '请填写时间、设备和履历内容',
    )

    return
  }


  if (
    dialogMode.value ===
    'add'
  ) {
    const maxId =
      records.value.length
        ? Math.max(
            ...records.value.map(
              (item) =>
                item.id,
            ),
          )
        : 0


    records.value.unshift({
      id:
        maxId + 1,

      time:
        form.time,

      device:
        form.device,

      deviceCode:
        form.deviceCode ||
        `DEVICE-${maxId + 1}`,

      type:
        form.type,

      content:
        form.content,

      operator:
        form.operator || '系统',

      status:
        form.status,
    })


    ElMessage.success(
      '新增履历成功',
    )
  } else {
    const item =
      records.value.find(
        (record) =>
          record.id ===
          editingId.value,
      )


    if (item) {
      Object.assign(
        item,
        {
          time:
            form.time,

          device:
            form.device,

          deviceCode:
            form.deviceCode,

          type:
            form.type,

          content:
            form.content,

          operator:
            form.operator,

          status:
            form.status,
        },
      )
    }


    ElMessage.success(
      '修改成功',
    )
  }


  dialogVisible.value =
    false
}


// =====================================================
// 删除
// =====================================================

async function deleteRecord(item) {
  try {
    await ElMessageBox.confirm(
      `确定删除“${item.device}”这条履历记录吗？`,
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
        (record) =>
          record.id !==
          item.id,
      )


    ElMessage.success(
      '删除成功',
    )
  } catch {
    // 用户取消
  }
}
</script>


<template>
  <section class="resume-view">

    <!-- =================================================
         顶部指标
    ================================================== -->

    <MetricCards
      :items="metrics"
      :columns="4"
      variant="compact"
    />


    <!-- =================================================
         设备履历
    ================================================== -->

    <section class="record-panel">

      <!-- 标题 -->
      <div class="panel-title">

        <strong>
          设备履历
        </strong>


        <div class="title-actions">

          <span>
            共
            {{ filteredRecords.length }}
            条
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
          类型
        </span>


        <select
          v-model="
            typeFilter
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


        <button
          type="button"
          class="query-button"
        >
          ⌕ 查询
        </button>


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

      <div class="resume-table">

        <!-- 表头 -->
        <div class="table-header">

          <span>
            时间
          </span>

          <span>
            设备
          </span>

          <span>
            履历类型
          </span>

          <span>
            履历内容
          </span>

          <span>
            操作人
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
            <span class="time-value">
              {{ item.time }}
            </span>


            <!-- 设备 -->
            <strong class="device-name">
              {{ item.device }}
            </strong>


            <!-- 类型 -->
            <span
              class="type-tag"
              :class="
                getTypeClass(
                  item.type,
                )
              "
            >
              {{ item.type }}
            </span>


            <!-- 内容 -->
            <span
              class="resume-content"
              :title="
                item.content
              "
            >
              {{ item.content }}
            </span>


            <!-- 操作人 -->
            <span class="operator">
              {{ item.operator }}
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
                  deleteRecord(
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
            当前暂无符合条件的设备履历
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


    <!-- =================================================
         新增 / 编辑弹窗
    ================================================== -->

    <el-dialog
      v-model="
        dialogVisible
      "
      :title="
        dialogMode === 'add'
          ? '新增设备履历'
          : '编辑设备履历'
      "
      width="600px"
    >

      <div class="form-grid">

        <label>
          <span>
            时间
          </span>

          <input
            v-model="
              form.time
            "
            type="text"
            placeholder="2026-09-24 14:32"
          />
        </label>


        <label>
          <span>
            设备
          </span>

          <input
            v-model="
              form.device
            "
            type="text"
            placeholder="2#主变压器"
          />
        </label>


        <label>
          <span>
            设备编码
          </span>

          <input
            v-model="
              form.deviceCode
            "
            type="text"
            placeholder="BD-002"
          />
        </label>


        <label>
          <span>
            履历类型
          </span>

          <select
            v-model="
              form.type
            "
          >
            <option value="缺陷">
              缺陷
            </option>

            <option value="试验">
              试验
            </option>

            <option value="投运">
              投运
            </option>

            <option value="技改">
              技改
            </option>
          </select>
        </label>


        <label>
          <span>
            操作人
          </span>

          <input
            v-model="
              form.operator
            "
            type="text"
            placeholder="王工"
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
            <option value="处理中">
              处理中
            </option>

            <option value="已完成">
              已完成
            </option>

            <option value="已归档">
              已归档
            </option>
          </select>
        </label>


        <label class="full-row">
          <span>
            履历内容
          </span>

          <textarea
            v-model="
              form.content
            "
            rows="4"
          ></textarea>
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
.resume-view {
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

.title-actions {
  display: flex;

  align-items: center;

  gap: 10px;

  color: #729bb3;

  font-size: 9px;
}

.add-button {
  height: 25px;

  padding: 0 11px;

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
   筛选
===================================================== */

.filter-bar {
  height: 42px;

  padding: 0 10px;

  display: flex;

  align-items: center;

  gap: 8px;

  box-sizing: border-box;

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

.second-label {
  margin-left: 4px;
}

.filter-select {
  width: 110px;
  height: 26px;

  padding: 0 8px;

  color: #b5d5e5;

  font-size: 10px;

  outline: none;

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

  background:
    rgba(5, 65, 105, 0.7);

  border:
    1px solid #086699;
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

.resume-table {
  min-height: 0;

  display: flex;

  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;

  grid-template-columns:
    125px
    minmax(140px, 0.9fr)
    90px
    minmax(360px, 2.7fr)
    90px
    85px
    75px;

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

.time-value {
  color: #6fa1bd;

  font-size: 9px;
}

.device-name {
  color: #d7edf5;

  font-size: 10px;
}

.resume-content {
  padding-right: 20px;

  overflow: hidden;

  color: #9ebdcd;

  font-size: 9px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.operator {
  color: #a3bfce;

  font-size: 9px;
}


/* =====================================================
   类型
===================================================== */

.type-tag {
  justify-self: start;

  min-width: 36px;

  padding: 2px 5px;

  text-align: center;

  font-size: 8px;

  border: 1px solid;
}

.type-defect {
  color: #ff5b71;

  border-color:
    rgba(255, 91, 113, 0.6);

  background:
    rgba(255, 91, 113, 0.08);
}

.type-test {
  color: #35dfa6;

  border-color:
    rgba(53, 223, 166, 0.6);

  background:
    rgba(53, 223, 166, 0.07);
}

.type-operation {
  color: #14ddef;

  border-color:
    rgba(20, 221, 239, 0.6);

  background:
    rgba(20, 221, 239, 0.06);
}

.type-modification {
  color: #ffb21b;

  border-color:
    rgba(255, 178, 27, 0.65);

  background:
    rgba(255, 178, 27, 0.07);
}


/* =====================================================
   状态
===================================================== */

.status-tag {
  justify-self: start;

  min-width: 44px;

  padding: 2px 5px;

  text-align: center;

  font-size: 8px;

  border: 1px solid;
}

.status-processing {
  color: #ffb21b;

  border-color:
    rgba(255, 178, 27, 0.65);

  background:
    rgba(255, 178, 27, 0.07);
}

.status-completed,
.status-archived {
  color: #35dfa6;

  border-color:
    rgba(53, 223, 166, 0.55);

  background:
    rgba(53, 223, 166, 0.06);
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
   空数据 / 分页
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

  display: flex;

  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;

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
   表单
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

.form-grid textarea {
  resize: vertical;
}

.full-row {
  grid-column:
    1 / -1;
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
   Element Plus 深色弹窗
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
   小屏
===================================================== */

@media (max-width: 1500px) {
  .resume-view {
    grid-template-rows:
      60px
      minmax(0, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns:
      105px
      minmax(115px, 0.8fr)
      70px
      minmax(260px, 2.4fr)
      65px
      65px
      62px;
  }
}
</style>