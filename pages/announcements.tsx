import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/announcements');
    const data = await res.json();
    if (data.success) {
      setAnnouncements(data.data);
    }
  };

  return (
    <Layout>
      <h1>Announcements</h1>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement._id}>
            <h2>{announcement.title}</h2>
            <p>{announcement.content}</p>
            <p>By: {announcement.author.name}</p>
            <p>Posted on: {new Date(announcement.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
