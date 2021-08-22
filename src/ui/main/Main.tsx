import React from 'react'
import Background from './Background'
import styles from './Main.module.scss'

const Main: React.FC = ({children}) => {
    return (
        <main className={styles.main}>
            {children}
            <Background />
        </main>
    )
}

export default Main