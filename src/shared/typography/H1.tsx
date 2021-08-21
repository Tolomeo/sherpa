import React from 'react'
import styles from './Typography.module.scss'

const H1: React.FC = ({ children }) => {
    return (
        <h1 className={styles.h1}>
            {children}
        </h1>
    )
}

export default H1