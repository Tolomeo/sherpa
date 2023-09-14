const fs = require('fs')
const pathName = process.argv[2]

const path = require(`./${pathName}.json`)
const resources = require(`../resources/${pathName}.json`)

const types = {
  "There's more": 'basics',
  'Beyond basics': 'advanced',
  'How do they do it?': 'how-to',
  'How do they do it': 'how-to',
  'Nice to know': 'curiosity',
  'Work smarter, not harder': 'tool',
  'Great bookmarks': 'reference',
  'Stay in the loop': 'feed',
}

const splitSubpaths = () => {
  const updatedExtras = [...path.extra]

  path.extra.forEach((extra) => {
    if (types[extra.title]) return

    console.log(extra.title)

    if (extra.extra) {
      extra.resources = extra.extra
      delete extra.extra
    }

    const childName = `${pathName}.${extra.title
      .replace(/\W/g, '')
      .toLowerCase()}`

    fs.writeFileSync(`./${childName}.json`, JSON.stringify(extra, null, 2))

    path.children = path.children
      ? path.children.concat([childName])
      : [childName]

    updatedExtras.splice(
      updatedExtras.findIndex((uE) => uE.title === extra.title),
      1,
    )
  })

  path.extra = updatedExtras
}

const addResourceType = (resourceUrl, type) => {
  const resourceData = resources.find(
    (resource) => resource.url === resourceUrl,
  )

  if (!resourceData) {
    console.log(resourceUrl)
    return
  }

  resourceData.type = type
}

const addResourcesTypes = () => {
  path.extra.forEach((extra) => {
    const type = types[extra.title]

    extra.resources &&
      extra.resources.forEach((resource) => addResourceType(resource, type))
  })

  fs.writeFileSync(
    `../resources/${pathName}.json`,
    JSON.stringify(resources, null, 2),
  )
}

const flattenResources = () => {
  path.resources = path.extra.reduce((resources, extra) => {
    return extra.resources ? resources.concat(extra.resources) : resources
  }, [])

  delete path.extra
}

;(() => {
  splitSubpaths()
  addResourcesTypes()
  flattenResources()
  fs.writeFileSync(`./${pathName}.json`, JSON.stringify(path, null, 2))
})()
