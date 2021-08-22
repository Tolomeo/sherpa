import React from 'react'
import styles from './Typography.module.scss'

const P: React.FC = ({ children }) => {
    return (
        <p className={styles.p}>
            {children}
        </p>
    )
}

export default P