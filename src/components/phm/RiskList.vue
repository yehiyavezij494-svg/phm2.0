<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },

  selectedName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'select',
])


function getRiskValueClass(level) {
  if (level === '紧急') {
    return 'risk-danger'
  }

  if (level === '重要') {
    return 'risk-warning'
  }

  return 'risk-normal'
}


function getLevelClass(level) {
  if (level === '紧急') {
    return 'level-danger'
  }

  if (level === '重要') {
    return 'level-warning'
  }

  return 'level-normal'
}


function handleSelect(item) {
  emit(
    'select',
    item,
  )
}
</script>

<template>
  <div class="risk-list">

    <!-- 表头 -->
    <div class="table-header">

      <span>
        风险项
      </span>

      <span>
        风险值
      </span>

      <span>
        等级
      </span>

    </div>


    <!-- 数据 -->
    <div class="table-body">

      <button
        v-for="item in data"
        :key="item.name"
        type="button"
        class="table-row"
        :class="{
          selected:
            selectedName ===
            item.name,
        }"
        @click="
          handleSelect(item)
        "
      >

        <strong class="risk-name">
          {{ item.name }}
        </strong>

        <strong
          class="risk-value"
          :class="
            getRiskValueClass(
              item.level,
            )
          "
        >
          {{ item.risk }}
        </strong>

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

      </button>


      <div
        v-if="!data.length"
        class="empty-data"
      >
        当前暂无风险项
      </div>

    </div>

  </div>
</template>

<style scoped>
.risk-list {
  width: 100%;
  height: 100%;
  min-height: 0;

  display: flex;

  flex-direction: column;
}


/* =====================================================
   表格
===================================================== */

.table-header,
.table-row {
  width: 100%;

  display: grid;

  grid-template-columns:
    minmax(220px, 1fr)
    85px
    70px;

  align-items: center;
}


.table-header {
  height: 32px;

  flex-shrink: 0;

  padding:
    0 12px;

  box-sizing:
    border-box;

  color: #6794af;

  font-size: 9px;

  background:
    rgba(
      5,
      50,
      83,
      0.58
    );

  border-bottom:
    1px solid
    rgba(
      25,
      91,
      130,
      0.28
    );
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
  background:
    #075786;
}


/* =====================================================
   每一行
===================================================== */

.table-row {
  position: relative;

  min-height: 45px;

  padding:
    0 12px;

  box-sizing:
    border-box;

  border: 0;

  border-bottom:
    1px dashed
    rgba(
      29,
      82,
      116,
      0.24
    );

  color: inherit;

  text-align: left;

  font-family: inherit;

  cursor: pointer;

  background:
    transparent;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}


.table-row:hover {
  background:
    rgba(
      7,
      74,
      116,
      0.22
    );
}


/* 当前选中行 */
.table-row.selected {
  background:
    linear-gradient(
      90deg,
      rgba(
        0,
        145,
        204,
        0.20
      ),
      rgba(
        0,
        104,
        156,
        0.06
      )
    );

  box-shadow:
    inset
    3px
    0
    0
    #16dff1;
}


/* 选中行右边装饰 */
.table-row.selected::after {
  content: "";

  position: absolute;

  right: 0;
  top: 20%;

  width: 2px;
  height: 60%;

  background:
    #16dff1;

  box-shadow:
    0 0 6px
    rgba(
      22,
      223,
      241,
      0.65
    );
}


/* =====================================================
   风险项
===================================================== */

.risk-name {
  color: #d8edf5;

  font-size: 10px;

  font-weight: 600;
}


.table-row.selected
.risk-name {
  color: #ffffff;
}


/* =====================================================
   风险值
===================================================== */

.risk-value {
  font-size: 13px;

  font-weight: 600;
}


.risk-danger {
  color: #ff536f;
}


.risk-warning {
  color: #ffb11b;
}


.risk-normal {
  color: #13dcef;
}


/* =====================================================
   等级
===================================================== */

.level-tag {
  justify-self: start;

  min-width: 36px;

  padding:
    2px 5px;

  box-sizing:
    border-box;

  text-align: center;

  font-size: 8px;

  border:
    1px solid;
}


.level-danger {
  color: #ff536f;

  border-color:
    rgba(
      255,
      83,
      111,
      0.65
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
  color: #ffb21c;

  border-color:
    rgba(
      255,
      178,
      28,
      0.65
    );

  background:
    rgba(
      255,
      178,
      28,
      0.07
    );
}


.level-normal {
  color: #14ddef;

  border-color:
    rgba(
      20,
      221,
      239,
      0.60
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
   空数据
===================================================== */

.empty-data {
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #557e98;

  font-size: 11px;
}
</style>