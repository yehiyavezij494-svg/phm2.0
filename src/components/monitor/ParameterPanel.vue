<script setup>
defineProps({
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] },
})

function isWarning(item) {
  return item.warn || item.status === '预警'
}

function isDanger(item) {
  return item.status === '异常'
}
</script>

<template>
  <div class="parameter-panel">
    <!-- 标题 -->
    <div class="sub-title">
      <span class="title-mark"></span>
      {{ title }}
    </div>

    <!-- 参数列表 -->
    <div
      v-for="item in items"
      :key="item.name"
      class="parameter-item"
      :class="{
        warnItem: isWarning(item),
        dangerItem: isDanger(item),
      }"
    >
      <!-- 参数名称 + 参数值 -->
      <div class="parameter-row">
        <div class="parameter-name">
          <span
            class="status-dot"
            :class="{
              warning: isWarning(item),
              danger: isDanger(item),
            }"
          ></span>
          <span>{{ item.name }}</span>
        </div>

        <strong
          :class="{
            warningText: isWarning(item),
            dangerText: isDanger(item),
          }"
        >
          {{ item.value }}
          <small>{{ item.unit }}</small>
        </strong>
      </div>

      <!-- 参数进度条 -->
      <div class="parameter-progress">
        <span
          :style="{ width: `${item.percent}%` }"
          :class="{
            warnProgress: isWarning(item),
            dangerProgress: isDanger(item),
          }"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 参数面板 */
.parameter-panel {
  min-width: 0;
  min-height: 0;
  padding: 0 10px 10px;
  overflow-y: auto;
  border: 1px solid #064a78;
  background: rgba(1, 31, 55, 0.45);
  scrollbar-width: thin;
  scrollbar-color: #087bb6 #041f34;
}

/* 滚动条 */
.parameter-panel::-webkit-scrollbar {
  width: 5px;
}

.parameter-panel::-webkit-scrollbar-track {
  background: #041f34;
}

.parameter-panel::-webkit-scrollbar-thumb {
  background: #087bb6;
  border-radius: 10px;
}

.parameter-panel::-webkit-scrollbar-thumb:hover {
  background: #10c8ee;
}

/* 标题 */
.sub-title {
  position: sticky;
  top: 0;
  z-index: 3;
  height: 32px;
  margin: 0 -10px 7px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  color: #d5f4ff;
  font-size: 12px;
  font-weight: bold;
  background: linear-gradient(90deg, #075282, #062f51);
  border-bottom: 1px solid rgba(14, 115, 169, 0.45);
}

.title-mark {
  width: 3px;
  height: 13px;
  margin-right: 7px;
  background: #17dcff;
  box-shadow: 0 0 5px rgba(23, 220, 255, 0.45);
}

/* 单个参数 */
.parameter-item {
  padding: 10px 10px 8px;
  margin-bottom: 2px;
  border-left: 2px solid #0fe7bf;
  background: rgba(4, 63, 99, 0.18);
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.parameter-item:hover {
  background: rgba(5, 84, 127, 0.25);
}

.parameter-item.warnItem {
  border-left-color: #ffb116;
  background: rgba(122, 78, 0, 0.08);
}

.parameter-item.dangerItem {
  border-left-color: #ff4268;
  background: rgba(122, 15, 39, 0.09);
}

/* 参数名称和值 */
.parameter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 11px;
}

.parameter-name {
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #b8dcec;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 状态点 */
.status-dot {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #2fffc0;
  box-shadow: 0 0 7px #2fffc0;
}

.status-dot.warning {
  background: #ffb312;
  box-shadow: 0 0 7px #ffb312;
}

.status-dot.danger {
  background: #ff4268;
  box-shadow: 0 0 7px #ff4268;
}

/* 参数值 */
.parameter-row strong {
  flex-shrink: 0;
  color: #12ddff;
  font-size: 13px;
  font-weight: 600;
}

.parameter-row small {
  margin-left: 2px;
  color: #8abbd4;
  font-size: 9px;
  font-weight: normal;
}

.warningText {
  color: #ffb313 !important;
}

.dangerText {
  color: #ff496d !important;
}

/* 参数进度条 */
.parameter-progress {
  height: 2px;
  margin-top: 10px;
  overflow: hidden;
  background: #0e4266;
}

.parameter-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #18f2db, #09c7ff);
  transition: width 0.3s ease;
}

.parameter-progress .warnProgress {
  background: #ffb214;
}

.parameter-progress .dangerProgress {
  background: #ff4268;
}
</style>