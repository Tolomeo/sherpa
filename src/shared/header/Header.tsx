import React from 'react'
import styles from './Header.module.scss'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.header__container}>
                <a className={styles.header__logo} href="#">Learning path</a>
            </div>
        </header>
    )
}
