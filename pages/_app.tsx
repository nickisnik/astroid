import '../styles/globals.css'
import type { AppProps } from 'next/app'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  if(!loggedIn) return (
    <div className={styles.login_wrapper}>
      <div className={styles.title_wrapper}>
        <span className={styles.title}>ASTROIDER</span>
        <span className={styles.subtitle}>Explore the universe</span>
      </div>
      <button className={styles.login_btn} onClick={() => setLoggedIn(true)}>Sign in as a guest</button>
    </div>
  )
  return <Component {...pageProps} setLoggedIn={setLoggedIn} />
}
