import '@leanix/reporting'

export const initializeReport = ({ commit, dispatch }) => {
  lx.init()
    .then(async reportSetup => {
      commit('setReportSeup', reportSetup)
      const { settings, savedState = {} } = reportSetup
      // eslint-disable-next-line
      const { customState = {} } = savedState !== null ? savedState : {}
      const { baseUrl } = settings
      commit('setBaseUrl', baseUrl)

      const reportConfig = {
        allowEditing: false,
        allowTableView: false,
        reportViewFactSheetType: 'Application',
        facets: [
          {
            key: 1,
            fixedFactSheetType: 'Application'
          }
        ]
      }
      console.debug(`reportSetup`, reportSetup)
      lx.ready(reportConfig)
    })
}

export const fetchDataset = async ({ commit }) => {
  lx.showSpinner()
  const factSheetFields = `id name type level`
  const relatedApplications = `...on BusinessCapability {relatedApplications: relBusinessCapabilityToApplication{edges {node {factSheet {${factSheetFields}...on Application{lifecycle{phases{phase startDate}}}}}}}}`
  const children = `children: relToChild {edges {node {factSheet {${factSheetFields} ${relatedApplications}}}}}`

  const query = `
  query ($filter: FilterInput) {
    op: allFactSheets(filter: $filter) {
      edges {
        node {
          ...on BusinessCapability {
            ${factSheetFields}
            ${relatedApplications}
            ${children}
          }
        }
      }
    }
  }
  `
  const variables = {
    filter: {
      facetFilters: [
        { facetKey: 'FactSheetTypes', keys: ['BusinessCapability'] },
        { facetKey: 'hierarchyLevel', keys: ['1'] }
      ]
    }
  }
  const dataset = await lx.executeGraphQL(query, variables)
    .then(({ op }) => op.edges
      .map(({ node }) => ({
        ...node,
        relatedApplications: node.relatedApplications.edges
          .map(({ node }) => ({ ...node.factSheet })),
        children: node.children.edges
          .map(({ node }) => ({
            ...node.factSheet,
            relatedApplications: node.factSheet.relatedApplications.edges
              .map(({ node }) => ({ ...node.factSheet }))
          }))
      })))
    .catch(err => {
      lx.hideSpinner()
      throw err
    })
  lx.hideSpinner()
  const bcIndex = dataset
    .reduce((accumulator, businessCapability) => {
      const { id, relatedApplications, children } = businessCapability
      const parentId = id
      accumulator[id] = { id, relatedApplications }
      children.forEach(child => {
        const { id, relatedApplications } = child
        accumulator[id] = { id, relatedApplications, parentId }
      })
      return accumulator
    }, {})
  commit('setDataset', dataset)
  commit('setBusinessCapabilityIndex', bcIndex)
  return dataset
}
