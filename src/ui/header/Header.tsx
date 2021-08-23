import React from 'react'
import Link from 'next/link'
import Container from '../container'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <Link href="/">
          <a className={styles.header__logo}>The learning path</a>
        </Link>
      </Container>
    </header>
  )
}
