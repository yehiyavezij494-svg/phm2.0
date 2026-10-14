<script setup>
import OverlimitAlarm from '@/components/phm/OverlimitAlarm.vue'

import {
  overlimitAlarmRecords,
  overlimitAlarmUpdatedAt,
} from '@/mocks/phmAlarm'
</script>

<template>
  <div class="phm-alarm-view">
    <OverlimitAlarm
      :records="overlimitAlarmRecords"
      :updated-at="overlimitAlarmUpdatedAt"
    />
  </div>
</template>

<style scoped>
.phm-alarm-view {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 706px;
}
</style>