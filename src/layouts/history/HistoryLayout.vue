<script setup>
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'

import DeviceSidebar
  from '@/components/monitor/DeviceSidebar.vue'

import HistoryNav
  from '@/components/history/HistoryNav.vue'

import {
  deviceGroups,
} from '@/mocks/monitor'

import {
  useHistoryStore,
} from '@/stores/history'

const historyStore =
  useHistoryStore()

const {
  selectedDeviceCode,
} = storeToRefs(
  historyStore,
)

function handleSelectDevice(device) {
  historyStore.selectDevice(device)
}
</script>

<template>
  <div class="history-page">
    <main class="history-dashboard">

      <DeviceSidebar
        :device-groups="deviceGroups"
        :selected-device-code="
          selectedDeviceCode
        "
        @select-device="
          handleSelectDevice
        "
      />

      <section class="history-content">

        <HistoryNav />

        <div class="history-router-area">
          <RouterView />
        </div>

      </section>

    </main>
  </div>
</template>

<style scoped>
.history-page {
  width: 100%;

  min-width: 1200px;

  min-height:
    calc(100vh - 64px);

  padding:
    10px 12px;

  box-sizing:
    border-box;

  color: #d9f5ff;

  background:
    linear-gradient(
      rgba(4, 34, 62, 0.88),
      rgba(1, 18, 34, 0.97)
    );
}

.history-dashboard {
  width: 100%;

  min-height: 760px;

  display: grid;

  grid-template-columns:
    230px
    minmax(0, 1fr);

  gap: 10px;
}

.history-content {
  min-width: 0;
  min-height: 0;

  display: grid;

  grid-template-rows:
    44px
    minmax(0, 1fr);

  gap: 10px;
}

.history-router-area {
  min-width: 0;
  min-height: 0;
}

@media (max-width: 1500px) {
  .history-dashboard {
    grid-template-columns:
      215px
      minmax(0, 1fr);
  }
}
</style>