<script setup>
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'

import DeviceSidebar from '@/components/monitor/DeviceSidebar.vue'
import PhmNav from '@/components/phm/PhmNav.vue'

import { deviceGroups } from '@/mocks/monitor'
import { usePhmStore } from '@/stores/phm'

const phmStore = usePhmStore()

const {
  selectedDeviceCode,
} = storeToRefs(phmStore)

function handleSelectDevice(device) {
  phmStore.selectDevice(device)
}
</script>

<template>
  <div class="phm-page">
    <main class="phm-dashboard">

      <DeviceSidebar
        :device-groups="deviceGroups"
        :selected-device-code="selectedDeviceCode"
        @select-device="handleSelectDevice"
      />

      <section class="phm-content">
        <PhmNav />

        <div class="phm-router-area">
          <RouterView />
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.phm-page {
  width: 100%;
  min-width: 1200px;
  min-height: calc(100vh - 64px);
  padding: 10px 12px;
  box-sizing: border-box;
  color: #d9f5ff;
  background:
    linear-gradient(
      rgba(4, 34, 62, 0.88),
      rgba(1, 18, 34, 0.97)
    ),
    linear-gradient(
      90deg,
      rgba(0, 204, 255, 0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(0, 204, 255, 0.035) 1px,
      transparent 1px
    );
  background-color: #03182b;
  background-size:
    auto,
    24px 24px,
    24px 24px;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

.phm-dashboard {
  width: 100%;
  min-height: 760px;
  display: grid;
  grid-template-columns:
    230px
    minmax(0, 1fr);
  gap: 10px;
}

.phm-content {
  min-width: 0;
  min-height: 760px;
  display: grid;
  grid-template-rows:
    44px
    minmax(0, 1fr);
  gap: 10px;
}

.phm-router-area {
  min-width: 0;
  min-height: 0;
}

@media (max-width: 1500px) {
  .phm-dashboard {
    grid-template-columns:
      215px
      minmax(0, 1fr);
  }
}
</style>