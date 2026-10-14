<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },

  columns: {
    type: Number,
    default: 4,
  },

  variant: {
    type: String,
    default: 'compact',

    validator(value) {
      return [
        'compact',
        'phm',
      ].includes(value)
    },
  },
})


const gridStyle = computed(() => {
  return {
    gridTemplateColumns:
      `repeat(${props.columns}, minmax(0, 1fr))`,
  }
})


function getThemeClass(theme) {
  if (theme === 'green') {
    return 'theme-green'
  }

  if (theme === 'orange') {
    return 'theme-orange'
  }

  if (theme === 'yellow') {
    return 'theme-yellow'
  }

  if (theme === 'red') {
    return 'theme-red'
  }

  if (theme === 'blue') {
    return 'theme-blue'
  }

  return 'theme-cyan'
}
</script>


<template>
  <section
    class="metric-cards"
    :class="[
      `variant-${variant}`,
    ]"
    :style="gridStyle"
  >

    <article
      v-for="item in items"
      :key="item.key"
      class="metric-card"
      :class="
        getThemeClass(
          item.theme,
        )
      "
    >

      <!-- 图标 -->
      <div
        v-if="item.icon"
        class="metric-icon"
      >
        <span>
          {{ item.icon }}
        </span>
      </div>


      <!-- 内容 -->
      <div class="metric-content">

        <div class="metric-value">

          <span class="value-number">
            {{ item.value }}
          </span>

          <small
            v-if="item.unit"
            class="metric-unit"
          >
            {{ item.unit }}
          </small>

        </div>


        <div class="metric-label">
          {{ item.label }}
        </div>

      </div>

    </article>

  </section>
</template>


<style scoped>
/* =====================================================
   公共布局
===================================================== */

.metric-cards {
  width: 100%;
  min-width: 0;

  display: grid;

  gap: 10px;
}


.metric-card {
  position: relative;

  min-width: 0;

  height: 64px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  overflow: hidden;

  background:
    linear-gradient(
      90deg,
      rgba(
        5,
        59,
        98,
        0.88
      ),
      rgba(
        3,
        39,
        68,
        0.92
      )
    );

  border:
    1px solid
    #075786;

  box-shadow:
    inset
    0 0
    20px
    rgba(
      0,
      135,
      198,
      0.04
    );
}


.metric-card::after {
  content: "";

  position: absolute;

  inset: 0;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      rgba(
        13,
        202,
        235,
        0.035
      ),
      transparent
      60%
    );
}


.metric-content {
  position: relative;

  z-index: 2;

  min-width: 0;
}


.metric-value {
  display: flex;

  align-items: baseline;

  color: currentColor;

  line-height: 23px;

  white-space: nowrap;
}


.value-number {
  font-size: 21px;

  font-weight: 600;

  text-shadow:
    0 0
    7px
    currentColor;
}


.metric-unit {
  margin-left: 4px;

  color: #7fa7bc;

  font-size: 9px;

  font-weight: normal;

  text-shadow: none;
}


.metric-label {
  margin-top: 3px;

  overflow: hidden;

  color: #719bb5;

  font-size: 9px;

  text-overflow: ellipsis;

  white-space: nowrap;
}


/* =====================================================
   compact
   历史记录 / 可靠性评估
===================================================== */

.variant-compact
.metric-card {
  padding:
    0 16px;
}


.variant-compact
.metric-icon {
  position: relative;

  z-index: 2;

  width: 30px;

  height: 30px;

  margin-right: 11px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  color: currentColor;

  font-size: 19px;

  font-weight: 500;

  text-shadow:
    0 0
    7px
    currentColor;
}


.variant-compact
.metric-icon span {
  display: flex;

  align-items: center;

  justify-content: center;
}


.variant-compact
.value-number {
  font-size: 21px;
}


/* =====================================================
   PHM
   概览 / 超限报警
===================================================== */

.variant-phm
.metric-card {
  padding:
    0 14px;
}


.variant-phm
.metric-icon {
  position: relative;

  z-index: 2;

  width: 38px;

  height: 38px;

  margin-right: 12px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  color: currentColor;

  border:
    2px solid
    currentColor;

  border-radius:
    50%;

  box-sizing:
    border-box;

  box-shadow:
    0 0
    8px
    rgba(
      0,
      220,
      245,
      0.08
    );
}


.variant-phm
.metric-icon span {
  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 16px;

  font-weight: 600;
}


.variant-phm
.value-number {
  font-size: 24px;

  font-weight: 650;
}


.variant-phm
.metric-label {
  margin-top: 4px;

  font-size: 9px;
}


/* =====================================================
   颜色
===================================================== */

.theme-cyan {
  color: #11e0f0;
}


.theme-blue {
  color: #1cb4ff;
}


.theme-green {
  color: #38e5a2;
}


.theme-orange {
  color: #ffad16;
}


.theme-yellow {
  color: #ffd044;
}


.theme-red {
  color: #ff4568;
}


/* =====================================================
   小屏幕
===================================================== */

@media (
  max-width: 1500px
) {
  .metric-card {
    height: 60px;
  }


  .variant-compact
  .metric-card {
    padding:
      0 12px;
  }


  .variant-compact
  .metric-icon {
    width: 26px;

    height: 26px;

    margin-right: 8px;

    font-size: 16px;
  }


  .variant-phm
  .metric-card {
    padding:
      0 11px;
  }


  .variant-phm
  .metric-icon {
    width: 34px;

    height: 34px;

    margin-right: 9px;
  }


  .variant-phm
  .metric-icon span {
    font-size: 14px;
  }


  .value-number {
    font-size: 19px;
  }


  .variant-phm
  .value-number {
    font-size: 21px;
  }
}
</style>