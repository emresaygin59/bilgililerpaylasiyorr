import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type LayoutProps = {
  children: React.ReactNode
  title?: string
}

const Layout = ({ children, title = 'BilgililerPaylasıyor' }: LayoutProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/"><a>Home</a></Link>
          <Link href="/clubs"><a>Clubs</a></Link>
          <Link href="/events"><a>Events</a></Link>
          <Link href="/announcements"><a>Announcements</a></Link>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link href="/login"><a>Login</a></Link>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>© 2024 BilgililerPaylasıyor. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
