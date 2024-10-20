import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

const ClubsPage = () => {
  const [clubs, setClubs] = useState([])
  const [filteredClubs, setFilteredClubs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchClubs = async () => {
      const res = await fetch('/api/clubs')
      const data = await res.json()
      setClubs(data)
      setFilteredClubs(data)
      const uniqueCategories = Array.from(new Set(data.map((club: any) => club.category)))
      setCategories(uniqueCategories as string[])
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
      <ul>
        {filteredClubs.map((club: any) => (
          <li key={club._id}>
            <Link href={`/clubs/${club._id}`}>
              <a>{club.name}</a>
            </Link>
            <p>{club.description}</p>
            <p>Category: {club.category}</p>
            <p>President: {club.president.firstName} {club.president.lastName}</p>
            <div>
              Tags: {club.tags.map((tag: string) => (
                <span key={tag} style={{marginRight: '5px'}}>{tag}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default ClubsPage
