import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const SuperAdminDashboard = () => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]))
      if (user.role !== 'admin') {
        router.push('/')
      } else {
        setUser(user)
      }
    } else {
      router.push('/login')
    }
  }, [])

  if (!user) return null

  return (
    <Layout title="Super Admin Dashboard | BilgililerPaylasıyor">
      <h1>Super Admin Dashboard</h1>
      <p>Welcome, {user.firstName} {user.lastName}</p>
      {/* Add super admin-specific functionality here */}
    </Layout>
  )
}

export default SuperAdminDashboard
