import React from 'react'
import Container from '../container'
import styles from './Header.module.scss'

export default function Header() {
    return (
        <header className={styles.header}>
            <Container>
                <a className={styles.header__logo} href="#">The learning path</a>
            </Container>
        </header>
    )
}
