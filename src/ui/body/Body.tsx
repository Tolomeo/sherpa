import React from 'react'
import styles from './Body.module.scss'

const Body: React.FC = ({ children }) => {
    return (
        <body className={styles.body}>
            { children }
        </body>
    )
}

export default Body