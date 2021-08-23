import React from 'react'
import cs from 'classnames'
import styles from './Timeline.module.scss'

type ItemProps = {
  // label?: React.ReactNode,
  active?: boolean
}

const Item: React.FC<ItemProps> = ({ children, active = false }) => (
  <li className={styles.timelineItem}>
    {/* <div className={styles.timeline__label}>{label}</div> */}
    <div
      className={cs(styles.timelineItem__point, {
        [styles['timelineItem__point--active']]: active,
      })}
    ></div>
    <div className={styles.timelineItem__content}>{children}</div>
  </li>
)

type Props = {
  children: React.ReactNode
}

const Timeline = ({ children }: Props) => (
  <ol className={styles.timeline}>{children}</ol>
)

Timeline.Item = Item

export default Timeline
