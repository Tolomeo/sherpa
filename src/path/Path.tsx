import React from 'react'
import { PopulatedPath } from '../../data'
import { Timeline, Column, H1 } from '../shared'
import styles from './Path.module.scss'

type Props = {
    path: PopulatedPath
}

const Path = ({ path }: Props) => {
    return (
        <div>
            <Column>
                <H1>The <u>{path.title}</u> learning path</H1>
            </Column>

            <Column>
                <Timeline>
                    {Object.values(path.resources).map((resource, index) => 
                    <Timeline.Item key={resource.url}>
                        <a href={resource.url} target="_blank" rel="noreferrer">
                            <p className={styles.resource__source}>{resource.source}</p>
                            <h2 className={styles.resource__title}>{resource.title}</h2>
                            <p className={styles.resource__type}>{resource.type}</p>
                        </a>
                    </Timeline.Item>)}
                </Timeline>
            </Column>

        </div>
    )
}

export default Path