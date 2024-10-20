import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null)
  const [clubs, setClubs] = useState([])
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const userRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const userData = await userRes.json()
        setUser(userData)

        const clubsRes = await fetch('/api/clubs', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const clubsData = await clubsRes.json()
        setClubs(clubsData)

        const eventsRes = await fetch('/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const eventsData = await eventsRes.json()
        setEvents(eventsData)

        const announcementsRes = await fetch('/api/announcements', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const announcementsData = await announcementsRes.json()
        setAnnouncements(announcementsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/login')
      }
    }

    fetchData()
  }, [])

  if (!user) return null

  return (
    <Layout title="Student Dashboard | BilgililerPaylasıyor">
      <h1>Student Dashboard</h1>
      <p>Welcome, {user.firstName} {user.lastName}</p>
      
      <h2>My Clubs</h2>
      <ul>
        {clubs.filter((club: any) => user.clubs.includes(club._id)).map((club: any) => (
          <li key={club._id}>{club.name}</li>
        ))}
      </ul>

      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event: any) => (
          <li key={event._id}>{event.title} - {new Date(event.startDate).toLocaleDateString()}</li>
        ))}
      </ul>

      <h2>Announcements</h2>
      <ul>
        {announcements.map((announcement: any) => (
          <li key={announcement._id}>{announcement.title}</li>
        ))}
      </ul>
    </Layout>
  )
}

export default StudentDashboard
