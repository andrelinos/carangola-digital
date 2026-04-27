import { getDashboardStats } from '@/actions/dashboard/get-stats.action'
import { getUserProfilesForDashboard } from '@/actions/dashboard/get-user-profiles.action'
import { getUserPropertiesForDashboard } from '@/actions/dashboard/get-user-properties.action'
import { DashboardComponent } from './_components/dashboard-component'

export default async function AdminDashboardPage() {
  const [stats, profiles, properties] = await Promise.all([
    getDashboardStats(),
    getUserProfilesForDashboard(),
    getUserPropertiesForDashboard()
  ])
  
  return <DashboardComponent stats={stats} profiles={profiles} properties={properties} />
}
