<script setup>
import { ref } from 'vue'

// =====================================================
// 父组件数据
// =====================================================

const props = defineProps({
  deviceGroups: {
    type: Array,
    default: () => [],
  },
  selectedDeviceCode: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select-device'])

// =====================================================
// 分类折叠状态
// Set中存在分类名称 = 当前分类处于折叠状态
// =====================================================

const collapsedGroups = ref(new Set())

function toggleGroup(groupName) {
  const newSet = new Set(collapsedGroups.value)

  if (newSet.has(groupName)) {
    newSet.delete(groupName)
  } else {
    newSet.add(groupName)
  }

  collapsedGroups.value = newSet
}

function isCollapsed(groupName) {
  return collapsedGroups.value.has(groupName)
}

function expandAll() {
  collapsedGroups.value = new Set()
}

function collapseAll() {
  collapsedGroups.value = new Set(props.deviceGroups.map((group) => group.name))
}

// =====================================================
// 选择设备
// =====================================================

function selectDevice(device) {
  emit('select-device', device)
}
</script>

<template>
  <aside class="device-sidebar">
    <!-- 标题栏 -->
    <div class="panel-title">
      <span class="panel-title-text">设备列表</span>

      <div class="title-actions">
        <button type="button" @click="expandAll">展开</button>

        <button type="button" @click="collapseAll">收缩</button>
      </div>
    </div>

    <!-- 设备列表 -->
    <div class="device-tree">
      <section v-for="group in deviceGroups" :key="group.name" class="device-group">
        <!-- 分类标题 -->
        <button type="button" class="group-header" @click="toggleGroup(group.name)">
          <span class="group-name">
            <!-- 展开 / 折叠箭头 -->
            <span
              class="arrow"
              :class="{
                collapsed: isCollapsed(group.name),
              }"
            >
              ▾
            </span>

            <!-- 分类图标 -->
            <span class="group-icon">
              <!-- 牵引变压器 -->
              <svg v-if="group.name === '牵引变压器'" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="8" width="14" height="8" rx="1.5" />
                <path d="M8 8V5" />
                <path d="M12 8V5" />
                <path d="M16 8V5" />
                <path d="M8 19V16" />
                <path d="M12 19V16" />
                <path d="M16 19V16" />
                <circle cx="12" cy="12" r="2.2" />
              </svg>

              <!-- 高压开关 -->
              <svg v-else-if="group.name === '高压开关'" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="5" cy="12" r="1.4" />
                <circle cx="19" cy="12" r="1.4" />
                <path d="M6.5 12H10" />
                <path d="M14 12H17.5" />
                <path d="M10 12L15 7" />
                <path d="M10 6V4" />
                <path d="M14 18V20" />
              </svg>

              <!-- 互感器 -->
              <svg v-else-if="group.name === '互感器'" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="12" r="3.3" />
                <circle cx="15" cy="12" r="3.3" />
                <path d="M5.7 12H4" />
                <path d="M20 12H18.3" />
                <path d="M12 7V4" />
                <path d="M12 20V17" />
              </svg>

              <!-- 避雷器 -->
              <svg v-else-if="group.name === '避雷器'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4V8" />
                <path d="M12 16V20" />
                <rect x="8.5" y="8" width="7" height="8" rx="1.3" />
                <path
                  class="lightning"
                  d="
                    M12.3 9.5
                    L10.4 12.4
                    H12
                    L11.2 14.6
                    L14.4 11.2
                    H12.8
                    L13.8 9.5
                    Z
                  "
                />
              </svg>

              <!-- 二次设备 -->
              <svg v-else-if="group.name === '二次设备'" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="4.5" width="14" height="15" rx="2" />
                <path d="M8 8.5H16" />
                <path d="M8 12H12" />
                <path d="M8 15.5H11" />
                <circle cx="15.8" cy="15.5" r="1.2" />
              </svg>

              <!-- 默认图标 -->
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="5" width="14" height="14" rx="2" />
                <path d="M8 9H16" />
                <path d="M8 13H14" />
                <path d="M8 17H11" />
              </svg>
            </span>

            <span class="group-text">
              {{ group.name }}
            </span>
          </span>

          <span class="count"> {{ group.devices.length }}台 </span>
        </button>

        <!-- 分类下的具体设备 -->
        <div v-show="!isCollapsed(group.name)" class="group-devices">
          <button
            v-for="device in group.devices"
            :key="device.code"
            type="button"
            class="device-card"
            :class="{
              selected: device.code === selectedDeviceCode,
            }"
            @click="selectDevice(device)"
          >
            <!-- 名称 + 健康度 -->
            <div class="device-top">
              <div class="device-name">
                <span
                  class="status-dot"
                  :class="{
                    warning: device.status === '预警',
                    danger: device.status === '异常',
                  }"
                ></span>

                {{ device.name }}
              </div>

              <strong>{{ device.score }}</strong>
            </div>

            <!-- 健康度进度条 -->
            <div class="score-line">
              <span
                :style="{
                  width: `${device.score}%`,
                }"
                :class="{
                  warningLine: device.status === '预警',
                  dangerLine: device.status === '异常',
                }"
              ></span>
            </div>

            <!-- 编号 + 状态 -->
            <div class="device-bottom">
              <span>{{ device.code }}</span>

              <span
                :class="{
                  normalText: device.status === '正常',
                  warningText: device.status === '预警',
                  dangerText: device.status === '异常',
                }"
              >
                {{ device.status }}
              </span>
            </div>
          </button>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* 整个设备侧边栏 */
.device-sidebar {
  min-width: 0;
  min-height: 790px;
  overflow: hidden;
  background: rgba(3, 32, 57, 0.88);
  border: 1px solid #075786;
  box-shadow: inset 0 0 20px rgba(0, 130, 201, 0.08);
}

/* 顶部标题 */
.panel-title {
  height: 37px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #07548a, #07365e);
  border-bottom: 1px solid #087bb6;
}

.panel-title-text {
  color: #e3f7ff;
  font-size: 13px;
  font-weight: bold;
}

/* 展开 / 收缩 */
.title-actions {
  display: flex;
  gap: 5px;
}

.title-actions button {
  padding: 3px 7px;
  color: #79c9ef;
  font-size: 10px;
  font-family: inherit;
  border: 1px solid #0e80bc;
  background: rgba(0, 83, 132, 0.25);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.title-actions button:hover {
  color: #ffffff;
  border-color: #16d6ff;
  background: rgba(0, 166, 221, 0.2);
}

/* 设备树 */
.device-tree {
  height: calc(100% - 37px);
  padding: 5px 10px 15px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #087bb6 #041f34;
}

.device-tree::-webkit-scrollbar {
  width: 5px;
}

.device-tree::-webkit-scrollbar-track {
  background: #041f34;
}

.device-tree::-webkit-scrollbar-thumb {
  background: #087bb6;
  border-radius: 10px;
}

.device-tree::-webkit-scrollbar-thumb:hover {
  background: #10c8ee;
}

/* 设备分类 */
.device-group {
  margin-bottom: 6px;
}

.group-header {
  width: 100%;
  height: 34px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #aee7ff;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  text-align: left;
  border: 0;
  border-left: 3px solid #00d8ff;
  background: linear-gradient(90deg, rgba(0, 113, 174, 0.34), rgba(0, 80, 125, 0.2));
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.group-header:hover {
  background: linear-gradient(90deg, rgba(0, 146, 209, 0.42), rgba(0, 82, 130, 0.24));
  border-left-color: #32e6ff;
}

/* 分类左侧 */
.group-name {
  min-width: 0;
  display: flex;
  align-items: center;
}

/* 展开箭头 */
.arrow {
  width: 14px;
  margin-right: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #1bdcff;
  font-size: 10px;
  transition: transform 0.2s ease;
}

.arrow.collapsed {
  transform: rotate(-90deg);
}

/* 分类图标 */
.group-icon {
  width: 19px;
  height: 19px;
  margin-right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #29ddff;
}

.group-icon svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 2px rgba(29, 222, 255, 0.45));
}

.group-icon .lightning {
  fill: currentColor;
  stroke: none;
}

/* 分类名称 */
.group-text {
  min-width: 0;
  overflow: hidden;
  color: #bcecff;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 设备数量 */
.count {
  flex-shrink: 0;
  margin-left: 5px;
  padding: 3px 7px;
  color: #29ddff;
  font-size: 11px;
  font-weight: normal;
  border: 1px solid #0982b9;
  border-radius: 3px;
  background: rgba(0, 120, 174, 0.15);
}

/* 分类内设备 */
.group-devices {
  display: block;
}

.device-card {
  width: calc(100% - 13px);
  margin-left: 13px;
  padding: 9px 9px 7px;
  display: block;
  color: inherit;
  font-family: inherit;
  text-align: left;
  border: 0;
  border-left: 2px solid #00dabe;
  background: rgba(0, 52, 89, 0.25);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.device-card:hover {
  background: rgba(0, 102, 156, 0.3);
}

.device-card.selected {
  border-left-color: #14ddff;
  background: linear-gradient(90deg, rgba(0, 122, 184, 0.55), rgba(0, 45, 78, 0.2));
  box-shadow: inset 0 0 12px rgba(0, 198, 255, 0.08);
}

/* 设备第一行 / 第二行 */
.device-top,
.device-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.device-top {
  color: #d7f4ff;
  font-size: 12px;
}

.device-name {
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.device-top strong {
  flex-shrink: 0;
  margin-left: 8px;
  color: #17d9ff;
  font-size: 12px;
}

.device-bottom {
  margin-top: 6px;
  color: #5b91b2;
  font-size: 11px;
}

/* 状态点 */
.status-dot {
  width: 6px;
  height: 6px;
  margin-right: 5px;
  display: inline-block;
  flex-shrink: 0;
  border-radius: 50%;
  background: #2fffc0;
  box-shadow: 0 0 8px #2fffc0;
}

.status-dot.warning {
  background: #ffb312;
  box-shadow: 0 0 8px #ffb312;
}

.status-dot.danger {
  background: #ff4268;
  box-shadow: 0 0 8px #ff4268;
}

/* 健康度进度条 */
.score-line {
  height: 2px;
  margin-top: 8px;
  overflow: hidden;
  background: #12476b;
}

.score-line span {
  display: block;
  height: 100%;
  background: #0fddf8;
  transition: width 0.3s ease;
}

.score-line .warningLine {
  background: #ffac00;
}

.score-line .dangerLine {
  background: #ff4167;
}

/* 状态文字 */
.normalText {
  color: #19e9c3;
}

.warningText {
  color: #ffb313;
}

.dangerText {
  color: #ff496d;
}

/* 键盘Focus */
.group-header:focus-visible,
.device-card:focus-visible,
.title-actions button:focus-visible {
  outline: 1px solid #20ddff;
  outline-offset: -1px;
}
</style>
