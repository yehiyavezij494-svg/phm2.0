import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import PhmLayout from '@/layouts/phm/PhmLayout.vue'
import HistoryLayout from '@/layouts/history/HistoryLayout.vue'
import DeviceLayout from '@/layouts/device/DeviceLayout.vue'

import MonitorView from '@/views/monitor/MonitorView.vue'

import ConfigLayout from '@/layouts/config/ConfigLayout.vue'
import StationManageView from '@/views/config/StationManageView.vue'
import MonitorItemManageView from '@/views/config/MonitorItemManageView.vue'

import MaintenanceLayout from '@/layouts/maintenance/MaintenanceLayout.vue'
import InspectionManageView from '@/views/maintenance/InspectionManageView.vue'
import DefectManageView from '@/views/maintenance/DefectManageView.vue'

/* =====================================================
   PHM
===================================================== */

import PhmOverviewView from '@/views/phm/PhmOverviewView.vue'
import PhmAlarmView from '@/views/phm/PhmAlarmView.vue'
import PhmHealthView from '@/views/phm/PhmHealthView.vue'
import PhmLifeView from '@/views/phm/PhmLifeView.vue'
import PhmDiagnosisView from '@/views/phm/PhmDiagnosisView.vue'
import PhmPredictionView from '@/views/phm/PhmPredictionView.vue'
import PhmReliabilityView from '@/views/phm/PhmReliabilityView.vue'
import PhmRiskView from '@/views/phm/PhmRiskView.vue'

/* =====================================================
   历史记录
===================================================== */

import HistoryCollectionView from '@/views/history/HistoryCollectionView.vue'
import HistoryAlarmView from '@/views/history/HistoryAlarmView.vue'
import HistoryFaultView from '@/views/history/HistoryFaultView.vue'

/* =====================================================
   设备管理
===================================================== */

import DeviceResumeView from '@/views/device/DeviceResumeView.vue'
import DeviceManageView from '@/views/device/DeviceManageView.vue'
import PartManageView from '@/views/device/PartManageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/monitor',

      children: [
        /* =================================================
           在线监测
        ================================================= */

        {
          path: 'monitor',
          name: 'monitor',
          component: MonitorView,
        },

        /* =================================================
           PHM
        ================================================= */

        {
          path: 'phm',
          component: PhmLayout,
          redirect: '/phm/overview',

          children: [
            {
              path: 'overview',
              name: 'phm-overview',
              component: PhmOverviewView,
            },
            {
              path: 'alarm',
              name: 'phm-alarm',
              component: PhmAlarmView,
            },
            {
              path: 'health',
              name: 'phm-health',
              component: PhmHealthView,
            },
            {
              path: 'life',
              name: 'phm-life',
              component: PhmLifeView,
            },
            {
              path: 'diagnosis',
              name: 'phm-diagnosis',
              component: PhmDiagnosisView,
            },
            {
              path: 'prediction',
              name: 'phm-prediction',
              component: PhmPredictionView,
            },
            {
              path: 'reliability',
              name: 'phm-reliability',
              component: PhmReliabilityView,
            },
            {
              path: 'risk',
              name: 'phm-risk',
              component: PhmRiskView,
            },
          ],
        },

        /* =================================================
           历史记录
        ================================================= */

        {
          path: 'history',
          component: HistoryLayout,
          redirect: '/history/collection',

          children: [
            {
              path: 'collection',
              name: 'history-collection',
              component: HistoryCollectionView,
            },
            {
              path: 'alarm',
              name: 'history-alarm',
              component: HistoryAlarmView,
            },
            {
              path: 'fault',
              name: 'history-fault',
              component: HistoryFaultView,
            },
          ],
        },

        /* =================================================
           设备管理
        ================================================= */

        {
          path: 'device',
          component: DeviceLayout,
          redirect: '/device/resume',

          children: [
            {
              path: 'resume',
              name: 'device-resume',
              component: DeviceResumeView,
            },
            {
              path: 'manage',
              name: 'device-manage',
              component: DeviceManageView,
            },
            {
              path: 'parts',
              name: 'device-parts',
              component: PartManageView,
            },
          ],
        },

        /* =================================================
           配置管理
        ================================================= */

        {
          path: 'config',
          component: ConfigLayout,
          redirect: '/config/station',
          children: [
            {
              path: 'station',
              name: 'config-station',
              component: StationManageView,
            },
            {
              path: 'monitor-item',
              name: 'config-monitor-item',
              component: MonitorItemManageView,
            },
          ],
        },

        /* =================================================
           检修管理
        ================================================= */

        {
          path: 'maintenance',
          component: MaintenanceLayout,
          redirect: '/maintenance/inspection',
          children: [
            {
              path: 'inspection',
              name: 'maintenance-inspection',
              component: InspectionManageView,
            },
            {
              path: 'defect',
              name: 'maintenance-defect',
              component: DefectManageView,
            },
          ],
        },
      ],
    },
  ],
})

export default router
