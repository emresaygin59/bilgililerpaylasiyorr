import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]))
      setUser(user)
      switch(user.role) {
        case 'student':
          router.push('/admin/student')
          break
        case 'teacher':
          router.push('/admin/teacher')
          break
        case 'staff':
          router.push('/admin/staff')
          break
        case 'admin':
          router.push('/admin/superadmin')
          break
        default:
          router.push('/')
      }
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <Layout title="Admin Dashboard | BilgililerPaylasıyor">
      <h1>Redirecting to appropriate dashboard...</h1>
    </Layout>
  )
}

export default AdminDashboard
