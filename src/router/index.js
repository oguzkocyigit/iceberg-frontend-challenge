import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AppointmentsListView from '../views/AppointmentsListView.vue'
import CreateAppointmentView from '../views/CreateAppointmentView.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'dashboard' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: AppointmentsListView
  },
  {
    path: '/appointments/create/:id?',
    name: 'create-appointment',
    component: CreateAppointmentView,
    props: route => ({ appointmentId: route.params.id }),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
