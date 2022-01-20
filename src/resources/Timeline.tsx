import React from 'react'
import { Resource } from '../../data'
import { Timeline } from '../ui'
import styles from './Resources.module.scss'

type Props = {
  resources: Resource[]
}

const ResourcesTimeline = ({ resources }: Props) => {
  return (
    <Timeline>
      {Object.values(resources).map((resource) => (
        <Timeline.Item key={resource.url}>
          <a href={resource.url} target="_blank" rel="noreferrer">
            <p className={styles.resource__source}>{resource.source}</p>
            <p className={styles.resource__title}>{resource.title}</p>
            <p className={styles.resource__type}>{resource.type.join(', ')}</p>
          </a>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}

export default ResourcesTimeline
