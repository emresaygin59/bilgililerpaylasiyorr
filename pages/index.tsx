import type { NextPage } from 'next'
import Layout from '../components/Layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1>Welcome to BilgililerPaylasıyor</h1>
      <p>Your central hub for university services and information.</p>
      <section>
        <h2>Featured Services</h2>
        <ul>
          <li>Club Management</li>
          <li>Event Organization</li>
          <li>Campus-wide Announcements</li>
          <li>Resource Booking</li>
        </ul>
      </section>
      <section>
        <h2>Upcoming Events</h2>
        <p>Stay tuned for exciting events!</p>
      </section>
    </Layout>
  )
}

export default Home
