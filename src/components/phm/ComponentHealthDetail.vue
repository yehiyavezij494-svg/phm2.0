<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

function getStatus(score) {
  if (score >= 85) {
    return 'normal'
  }

  if (score >= 70) {
    return 'warning'
  }

  return 'danger'
}

function getWidth(score) {
  return `${Math.max(
    0,
    Math.min(score, 100),
  )}%`
}
</script>

<template>
  <div class="health-detail">
    <div
      v-for="item in data"
      :key="item.name"
      class="detail-row"
      :class="`status-${getStatus(item.score)}`"
    >
      <span class="row-name">
        {{ item.name }}
      </span>

      <div class="progress-track">
        <div
          class="progress-value"
          :style="{
            width: getWidth(item.score),
          }"
        ></div>
      </div>

      <strong class="row-score">
        {{ item.score }}
      </strong>
    </div>
  </div>
</template>

<style scoped>
.health-detail {
  width: 100%;
  padding: 8px 10px;
  box-sizing: border-box;
}

.detail-row {
  position: relative;
  height: 40px;
  margin-bottom: 4px;
  padding: 0 12px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns:
    70px
    minmax(0, 1fr)
    40px;
  gap: 12px;
  align-items: center;
  background:
    linear-gradient(
      90deg,
      rgba(6, 51, 84, 0.52),
      rgba(3, 34, 59, 0.16)
    );
  border-left: 2px solid #13e5c0;
}

.row-name {
  color: #d2eff8;
  font-size: 11px;
}

.progress-track {
  position: relative;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background:
    rgba(0, 93, 151, 0.45);
}

.progress-value {
  height: 100%;
  border-radius: 2px;
  background:
    linear-gradient(
      90deg,
      #078ed0,
      #14ddf3
    );
  box-shadow:
    0 0 7px
    rgba(20, 221, 243, 0.28);
}

.row-score {
  justify-self: end;
  color: #13e6ff;
  font-size: 12px;
}

.status-warning {
  border-left-color: #ffae00;
}

.status-warning .progress-value {
  background:
    linear-gradient(
      90deg,
      #d48600,
      #ffb31a
    );
}

.status-warning .row-score {
  color: #ffb31a;
}

.status-danger {
  border-left-color: #ff4a67;
}

.status-danger .progress-value {
  background:
    linear-gradient(
      90deg,
      #d92f50,
      #ff5570
    );
}

.status-danger .row-score {
  color: #ff5570;
}
</style>