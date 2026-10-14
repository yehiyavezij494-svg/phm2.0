<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

function getLevelClass(level) {
  if (level === 'danger') {
    return 'diagnosis-danger'
  }

  if (level === 'warning') {
    return 'diagnosis-warning'
  }

  return 'diagnosis-normal'
}
</script>

<template>
  <div class="diagnosis-list">

    <article
      v-for="(item, index) in data"
      :key="`${item.name}-${index}`"
      class="diagnosis-card"
      :class="getLevelClass(item.level)"
    >

      <div class="diagnosis-top">

        <strong class="diagnosis-name">
          {{ item.name }}
        </strong>

        <span class="confidence">
          置信度
          <strong>
            {{ item.confidence }}%
          </strong>
        </span>

      </div>


      <div class="evidence">

        <span class="label">
          依据：
        </span>

        <span>
          {{ item.evidence }}
        </span>

      </div>


      <div class="advice">

        <span class="advice-icon">
          ●
        </span>

        <span>
          {{ item.advice }}
        </span>

      </div>

    </article>


    <div
      v-if="!data.length"
      class="empty-data"
    >
      当前暂无诊断结论
    </div>

  </div>
</template>

<style scoped>
.diagnosis-list {
  width: 100%;
  height: 100%;
  padding: 8px 10px;
  box-sizing: border-box;
  overflow-y: auto;
}

.diagnosis-list::-webkit-scrollbar {
  width: 4px;
}

.diagnosis-list::-webkit-scrollbar-thumb {
  background: #075786;
}

.diagnosis-card {
  position: relative;
  min-height: 76px;
  margin-bottom: 7px;
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: hidden;

  background:
    linear-gradient(
      90deg,
      rgba(5, 48, 80, 0.64),
      rgba(2, 31, 55, 0.22)
    );

  border-left:
    3px solid #19d8ec;
}

.diagnosis-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      rgba(0, 191, 237, 0.025),
      transparent 45%
    );
}

.diagnosis-top {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.diagnosis-name {
  color: #e3f5fb;
  font-size: 13px;
  font-weight: 600;
}

.confidence {
  color: #719bb5;
  font-size: 9px;
}

.confidence strong {
  margin-left: 2px;
  color: #16dff2;
  font-size: 10px;
}

.evidence {
  position: relative;
  z-index: 2;

  margin-top: 6px;

  color: #7095ad;
  font-size: 9px;
  line-height: 16px;
}

.label {
  color: #9eb9c9;
}

.advice {
  position: relative;
  z-index: 2;

  margin-top: 3px;

  display: flex;
  align-items: flex-start;
  gap: 6px;

  color: #f2b721;
  font-size: 9px;
  line-height: 15px;
}

.advice-icon {
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 7px;
}

.diagnosis-danger {
  border-left-color: #ff4767;
}

.diagnosis-danger .confidence strong {
  color: #13e3f3;
}

.diagnosis-warning {
  border-left-color: #ffae00;
}

.diagnosis-normal {
  border-left-color: #18d7e7;
}

.empty-data {
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #557e97;
  font-size: 11px;
}
</style>