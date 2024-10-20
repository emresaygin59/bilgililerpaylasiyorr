import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    if (data.success) {
      setEvents(data.data);
    }
  };

  return (
    <Layout>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h2>{event.title}</h2>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
