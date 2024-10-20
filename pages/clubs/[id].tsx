import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const ClubPage = () => {
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

  const handleJoinRequest = async () => {
    try {
      const res = await fetch(`/api/clubs/${id}/membership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        alert('Membership request sent successfully')
        fetchClub()
      } else {
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.error('Error sending join request:', error)
    }
  }

  const handleMembershipAction = async (userId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/clubs/${id}/membership`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      if (res.ok) {
        alert(`Membership ${action}d successfully`)
        fetchClub()
      } else {
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.error('Error handling membership action:', error)
    }
  }

  const handleLeaveClub = async () => {
    try {
      const res = await fetch(`/api/clubs/${id}/membership`, {
        method: 'DELETE',
      })
      if (res.ok) {
        alert('Left club successfully')
        fetchClub()
        fetchUser()
      } else {
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.error('Error leaving club:', error)
    }
  }

  if (!club) return <div>Loading...</div>

  return (
    <Layout title={`${club.name} | BilgililerPaylasıyor`}>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
      <p>Category: {club.category}</p>
      <p>President: {club.president.firstName} {club.president.lastName}</p>
      {club.vicePresident && (
        <p>Vice President: {club.vicePresident.firstName} {club.vicePresident.lastName}</p>
      )}
      <p>Meeting Schedule: {club.meetingSchedule}</p>
      <div>
        <h3>Social Media:</h3>
        {club.socialMediaLinks.facebook && <a href={club.socialMediaLinks.facebook}>Facebook</a>}
        {club.socialMediaLinks.instagram && <a href={club.socialMediaLinks.instagram}>Instagram</a>}
        {club.socialMediaLinks.twitter && <a href={club.socialMediaLinks.twitter}>Twitter</a>}
      </div>
      <div>
        <h3>Tags:</h3>
        {club.tags.map((tag: string) => (
          <span key={tag} style={{marginRight: '10px'}}>{tag}</span>
        ))}
      </div>
      <h2>Members</h2>
      <ul>
        {club.members.map((member: any) => (
          <li key={member._id}>{member.firstName} {member.lastName}</li>
        ))}
      </ul>
      {user && club.president._id === user._id && (
        <>
          <h2>Pending Members</h2>
          <ul>
            {club.pendingMembers.map((member: any) => (
              <li key={member._id}>
                {member.firstName} {member.lastName}
                <button onClick={() => handleMembershipAction(member._id, 'approve')}>Approve</button>
                <button onClick={() => handleMembershipAction(member._id, 'reject')}>Reject</button>
              </li>
            ))}
          </ul>
        </>
      )}
      {user && !club.members.some((member: any) => member._id === user._id) && (
        <button onClick={handleJoinRequest}>Request to Join</button>
      )}
      {user && club.members.some((member: any) => member._id === user._id) && club.president._id !== user._id && (
        <button onClick={handleLeaveClub}>Leave Club</button>
      )}
      {club.applicationOpen ? (
        <p>Applications are open{club.applicationDeadline ? ` until ${new Date(club.applicationDeadline).toLocaleDateString()}` : ''}</p>
      ) : (
        <p>Applications are currently closed</p>
      )}
    </Layout>
  )
}

export default ClubPage
