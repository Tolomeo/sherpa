import React from 'react'
import { PopulatedAside } from '../../data'
import { List } from '../ui'
import styles from './Path.module.scss'

type Props = {
  aside: PopulatedAside
}

const Aside = ({ aside }: Props) => {
  return (
    <List>
      {aside.resources.map((resource) => (
        <a
          key={resource.url}
          href={resource.url}
          target="_blank"
          rel="noreferrer"
        >
          <p className={styles.aside__source}>{resource.source}</p>
          <p className={styles.aside__title}>{resource.title}</p>
        </a>
      ))}
    </List>
  )
}

export default Aside
