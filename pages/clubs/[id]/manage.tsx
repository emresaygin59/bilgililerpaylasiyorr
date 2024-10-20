import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'

const ClubManagementPage = () => {
  const [club, setClub] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchClub()
    }
    fetchUser()
  }, [id])

  const fetchClub = async () => {
    const res = await fetch(`/api/clubs/${id}`)
    const data = await res.json()
    setClub(data)
  }

  const fetchUser = async () => {
    const res = await fetch('/api/auth/me')
    const data = await res.json()
    setUser(data)
  }

  const handleClubUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const clubData: any = {}
    for (const entry of Array.from(formData.entries())) {
      const [key, value] = entry
      if (key === 'applicationOpen') {
        clubData.applicationOpen = value === 'on'
      } else {
        clubData[key] = value
      }
    }

    try {
      const res = await fetch(`/api/clubs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clubData),
      })
      if (res.ok) {
        alert('Club updated successfully')
        fetchClub()
      } else {
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.error('Error updating club:', error)
    }
  }

  if (!club || !user) return <div>Loading...</div>
  if (club.president._id !== user._id) return <div>Not authorized</div>

  return (
    <Layout title={`Manage ${club.name} | BilgililerPaylasıyor`}>
      <h1>Manage {club.name}</h1>
      <form onSubmit={handleClubUpdate}>
        <label>
          Name:
          <input type="text" name="name" defaultValue={club.name} required />
        </label>
        <label>
          Description:
          <textarea name="description" defaultValue={club.description} required />
        </label>
        <label>
          Category:
          <input type="text" name="category" defaultValue={club.category} required />
        </label>
        <label>
          Meeting Schedule:
          <input type="text" name="meetingSchedule" defaultValue={club.meetingSchedule || ''} />
        </label>
        <label>
          Application Open:
          <input type="checkbox" name="applicationOpen" defaultChecked={club.applicationOpen} />
        </label>
        <label>
          Application Deadline:
          <input type="date" name="applicationDeadline" defaultValue={club.applicationDeadline?.split('T')[0] || ''} />
        </label>
        <label>
          Tags (comma-separated):
          <input type="text" name="tags" defaultValue={club.tags?.join(',') || ''} />
        </label>
        <button type="submit">Update Club</button>
      </form>
    </Layout>
  )
}

export default ClubManagementPage

