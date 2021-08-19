import React from 'react'
import { PopulatedPath } from '../../data'
import { Timeline, Container } from '../shared'
import styles from './Path.module.scss'

type Props = {
    path: PopulatedPath
}

const Path = ({ path }: Props) => {
    return (
        <div>
            <h1 className={styles.path__title}>The <u>{path.title}</u> learning path</h1>

            <Container>
                <Timeline>
                    {Object.values(path.resources).map((resource, index) => 
                    <Timeline.Item key={resource.url} active={index < 3}>
                        <a href={resource.url} target="_blank" rel="noreferrer">
                            <p className={styles.resource__source}>{resource.source}</p>
                            <h2 className={styles.resource__title}>{resource.title}</h2>
                            <p className={styles.resource__type}>{resource.type}</p>
                        </a>
                    </Timeline.Item>)}
                </Timeline>
            </Container>

        </div>
    )
}

export default Path