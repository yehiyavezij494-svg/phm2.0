<script setup>
defineProps({
  title: { type: String, default: '实时告警信息' },
  alarms: { type: Array, default: () => [] },
})

function getLevelClass(level) {
  if (level === '紧急') return 'level-danger'
  if (level === '重要') return 'level-warning'
  return 'level-normal'
}
</script>

<template>
  <section class="alarm-panel">
    <!-- 标题栏 -->
    <div class="section-title">
      <strong>{{ title }}</strong>
      <span>未处理 {{ alarms.length }} 条</span>
    </div>

    <!-- 告警表格 -->
    <div class="alarm-table">
      <div class="table-header">
        <span>程度</span>
        <span>告警内容</span>
        <span>时间</span>
      </div>

      <div
        v-if="alarms.length"
        class="alarm-list"
      >
        <div
          v-for="(item, index) in alarms"
          :key="`${item.time}-${index}`"
          class="alarm-row"
        >
          <span
            class="alarm-level"
            :class="getLevelClass(item.level)"
          >
            {{ item.level }}
          </span>

          <span
            class="alarm-text"
            :title="item.text"
          >
            {{ item.text }}
          </span>

          <span class="alarm-time">
            {{ item.time }}
          </span>
        </div>
      </div>

      <div
        v-else
        class="empty-alarm"
      >
        当前无告警信息
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 告警面板 */
.alarm-panel {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  background: rgba(1, 29, 52, 0.88);
  border: 1px solid #075786;
}

/* 标题栏 */
.section-title {
  height: 32px;
  padding: 0 9px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #075184, #063457);
  border-bottom: 1px solid #075786;
}

.section-title strong {
  padding-left: 7px;
  color: #e0f8ff;
  font-size: 12px;
  border-left: 3px solid #14d9f5;
}

.section-title span {
  color: #ff6078;
  font-size: 9px;
}

/* 表格 */
.alarm-table {
  height: calc(100% - 32px);
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-header {
  height: 27px;
  flex-shrink: 0;
  padding: 0 8px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr) 58px;
  align-items: center;
  color: #598ca9;
  font-size: 9px;
  background: rgba(4, 48, 79, 0.72);
  border-bottom: 1px solid rgba(37, 105, 145, 0.3);
}

.table-header span:first-child {
  text-align: center;
}

.table-header span:last-child {
  text-align: right;
}

/* 告警列表 */
.alarm-list {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
}

.alarm-list::-webkit-scrollbar {
  width: 4px;
}

.alarm-list::-webkit-scrollbar-track {
  background: transparent;
}

.alarm-list::-webkit-scrollbar-thumb {
  background: #075786;
}

/* 单条告警 */
.alarm-row {
  min-height: 31px;
  padding: 0 8px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr) 58px;
  align-items: center;
  border-bottom: 1px solid rgba(27, 84, 119, 0.22);
}

.alarm-row:hover {
  background: rgba(6, 85, 126, 0.14);
}

.alarm-level {
  justify-self: center;
  min-width: 31px;
  padding: 2px 3px;
  box-sizing: border-box;
  text-align: center;
  font-size: 8px;
  border: 1px solid;
}

.alarm-text {
  min-width: 0;
  padding: 0 7px;
  overflow: hidden;
  color: #a7c7d9;
  font-size: 9px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.alarm-time {
  justify-self: end;
  color: #618ca6;
  font-size: 9px;
}

/* 告警等级 */
.level-danger {
  color: #ff536f;
  border-color: rgba(255, 83, 111, 0.6);
  background: rgba(255, 83, 111, 0.08);
}

.level-warning {
  color: #ffb41f;
  border-color: rgba(255, 180, 31, 0.6);
  background: rgba(255, 180, 31, 0.08);
}

.level-normal {
  color: #27dcb1;
  border-color: rgba(39, 220, 177, 0.55);
  background: rgba(39, 220, 177, 0.07);
}

/* 无告警 */
.empty-alarm {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #467995;
  font-size: 11px;
}
</style>