<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

function getProbabilityClass(value) {
  if (value >= 70) {
    return 'probability-danger'
  }

  if (value >= 50) {
    return 'probability-warning'
  }

  return 'probability-normal'
}
</script>

<template>
  <div class="prediction-list">

    <div class="table-header">
      <span>设备</span>
      <span>故障概率</span>
      <span>预计窗口</span>
    </div>

    <div class="table-body">

      <div
        v-for="item in data"
        :key="item.name"
        class="table-row"
      >
        <strong class="device-name">
          {{ item.name }}
        </strong>

        <strong
          class="probability-value"
          :class="
            getProbabilityClass(
              item.probability,
            )
          "
        >
          {{ item.probability }}

          <small>%</small>
        </strong>

        <span class="window-value">
          {{ item.window }}
        </span>
      </div>

      <div
        v-if="!data.length"
        class="empty-data"
      >
        当前暂无故障预测结果
      </div>

    </div>

  </div>
</template>

<style scoped>
.prediction-list {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    minmax(150px, 1.8fr)
    minmax(90px, 0.8fr)
    minmax(90px, 0.8fr);
  align-items: center;
}

.table-header {
  height: 32px;
  flex-shrink: 0;
  padding: 0 12px;
  box-sizing: border-box;

  color: #6794af;
  font-size: 9px;

  background:
    rgba(5, 50, 83, 0.58);

  border-bottom:
    1px solid
    rgba(25, 91, 130, 0.28);
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
  min-height: 45px;
  padding: 0 12px;
  box-sizing: border-box;

  border-bottom:
    1px dashed
    rgba(29, 82, 116, 0.24);
}

.table-row:hover {
  background:
    rgba(7, 61, 98, 0.18);
}

.device-name {
  color: #d7eef6;
  font-size: 10px;
  font-weight: 600;
}

.probability-value {
  font-size: 13px;
  font-weight: 600;
}

.probability-value small {
  font-size: 8px;
  font-weight: normal;
}

.probability-danger {
  color: #ff536f;
}

.probability-warning {
  color: #ffb018;
}

.probability-normal {
  color: #16dcf0;
}

.window-value {
  color: #a1bdcd;
  font-size: 10px;
}

.empty-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  color: #557f98;
  font-size: 11px;
}
</style>