import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const TeacherDashboard = () => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]))
      if (user.role !== 'teacher') {
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
    <Layout title="Teacher Dashboard | BilgililerPaylasıyor">
      <h1>Teacher Dashboard</h1>
      <p>Welcome, {user.firstName} {user.lastName}</p>
      {/* Add teacher-specific functionality here */}
    </Layout>
  )
}

export default TeacherDashboard
