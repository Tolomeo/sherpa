import React from 'react'
import Link from 'next/link'
import { Paths } from '../../data'
import { List, H2 } from '../shared'

type Props = {
    paths: Paths
}

const PathsList = ({ paths }: Props) => {
    return (
        <List>
            {Object.entries(paths).map(([pathName]) => 
                <Link key={pathName} href={`/paths/${pathName}`}>
                    <a><H2>The {pathName} learning path</H2></a>
                </Link>
            )}
      </List>

    )
}

export default PathsList