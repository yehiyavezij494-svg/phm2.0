import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePhmStore = defineStore('phm', () => {
  const selectedDeviceCode = ref('')

  function selectDevice(device) {
    selectedDeviceCode.value = typeof device === 'string' ? device : device.code
  }

  return {
    selectedDeviceCode,
    selectDevice,
  }
})
