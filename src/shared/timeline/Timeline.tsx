import React from 'react'
import cs from 'classnames'
import styles from './Timeline.module.scss';

type ItemProps = {
    // label?: React.ReactNode,
    active?: boolean
}

const Item: React.FC<ItemProps> = ({ children, active = false }) =>
    <li className={styles.timeline__item}>
        {/* <div className={styles.timeline__label}>{label}</div> */}
        <div className={cs(styles.timeline__point, { [styles['timeline__point--active']]: active })}></div>
        <div className={styles.timeline__content}>
            {children}
        </div>
    </li>

type Props = {
    children: React.ReactNode
}

const Timeline = ({ children }: Props) =>
        <ul className={styles.timeline}>
            {children}
        </ul>

Timeline.Item = Item;

export default Timeline