import React from 'react'
import styles from './Timeline.module.scss';

type ItemProps = {
    label?: React.ReactNode
}

const Item: React.FC<ItemProps> = ({ children, label }) =>
    <>
        <div className={styles.timeline__content}>
            {children}
        </div>
        <div className={styles.timeline__point}></div>
        <div className={styles.timeline__label}>{label}</div>
        {/* {label && <div className={styles.timeline__date}>{label}</div>} */}
    </>

type Props = {
    children: React.ReactNode
}

const Timeline = ({ children }: Props) =>
    <div className={styles.timeline}>
        <ul>
            {React.Children.map(children, child => <li>{child}</li>)}
        </ul>
    </div>

Timeline.Item = Item;

export default Timeline