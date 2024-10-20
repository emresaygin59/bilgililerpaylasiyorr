import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const ClubsPage = () => {
  const [clubs, setClubs] = useState<any[]>([])
  const [filteredClubs, setFilteredClubs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchClubs = async () => {
      const res = await fetch('/api/clubs')
      const data = await res.json()
      if (Array.isArray(data)) {
        setClubs(data)
        setFilteredClubs(data)
        const uniqueCategories = Array.from(new Set(data.map((club: any) => club.category)))
        setCategories(uniqueCategories as string[])
      } else {
        console.error('Expected an array of clubs but received:', data)
      }
    }
    fetchClubs()
  }, [])

  useEffect(() => {
    const results = clubs.filter((club: any) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === '' || club.category === categoryFilter)
    )
    setFilteredClubs(results)
  }, [searchTerm, categoryFilter, clubs])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(event.target.value)
  }

  return (
    <Layout title="Clubs | BilgililerPaylasıyor">
      <h1>Clubs</h1>
      <div>
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={categoryFilter} onChange={handleCategoryFilter}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <h2>Club List</h2>
      <ul>
        {filteredClubs?.map((club) => (
          <li key={club._id}>
            <h3>{club.name}</h3>
            <p>{club.description}</p>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default ClubsPage
