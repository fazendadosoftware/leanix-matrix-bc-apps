import '@leanix/reporting'

export const initializeReport = ({ commit }) => {
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

export const openFactSheetPreview = ({ state }, factSheet) => {
  const { id, type } = factSheet
  const uri = `/factsheet/${type}/${id}`
  lx.openLink(`${state.baseUrl}${uri}`)
}

export const fetchDataset = async ({ commit }) => {
  // lx.showSpinner()
  commit('loadingDatasetStart')
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
      commit('loadingDatasetDone')
      throw err
    })
  commit('loadingDatasetDone')
  const bcIndex = dataset
    .reduce((accumulator, businessCapability) => {
      const { id, relatedApplications, children } = businessCapability
      const parentRelatedApplications = relatedApplications.reduce((accumulator, application) => ({ ...accumulator, [application.id]: application }), {})
      const parentId = id
      children.forEach(child => {
        const { id, relatedApplications } = child
        relatedApplications.forEach(application => { parentRelatedApplications[application.id] = application })
        accumulator[id] = { id, relatedApplications, parentId }
      })
      accumulator[id] = { id, relatedApplications: Object.values(parentRelatedApplications) }
      return accumulator
    }, {})
  commit('setDataset', dataset)
  commit('setBusinessCapabilityIndex', bcIndex)
  return dataset
}

export const fetchViewOptions = async ({ commit, state }, factSheetType) => {
  if (!factSheetType) throw Error('factsheet type is required')
  const query = `{op:allFactSheets(factSheetType: ${factSheetType}){view{viewInfos{key label type}}}}`
  const viewOptions = await lx.executeGraphQL(query)
    .then(({ op }) => op.view.viewInfos)
  commit('setViewOptions', { factSheetType, viewOptions })
  if (viewOptions.length) commit('setViewKey', { factSheetType, viewKey: viewOptions[0].key })
}

export const fetchFactSheetTypeView = async ({ commit, state, dispatch }, factSheetType) => {
  let { dataset, viewKey } = state
  viewKey = viewKey[factSheetType]
  if (typeof viewKey === 'undefined' || viewKey === null) {
    commit('setViewIndex', { factSheetType, viewIndex: {} })
    return
  }
  let ids = []
  if (factSheetType === 'Application') {
    ids = Array.from(dataset
      .reduce((accumulator, businessCapability) => {
        const { relatedApplications = [], children = [] } = businessCapability
        relatedApplications.forEach(({ id }) => accumulator.add(id))
        children.forEach(({ relatedApplications = [] }) => relatedApplications.forEach(({ id }) => accumulator.add(id)))
        return accumulator
      }, new Set()))
  } else if (factSheetType === 'BusinessCapability') {
    ids = Array.from(dataset
      .reduce((accumulator, businessCapability) => {
        const { id, children = [] } = businessCapability
        accumulator.add(id)
        children.forEach(({ id }) => accumulator.add(id))
        return accumulator
      }, new Set()))
  }

  const query = `
    query($filter:FilterInput){
      op:allFactSheets(filter:$filter) {
        view(key:"${viewKey}") {
          viewInfos { key label type}
          mapping{fsId legendId}
          legendItems{id bgColor color transparency value}
        }
      }
    }
  `
  const variables = { filter: { facetFilters: [{ facetKey: 'FactSheetTypes', keys: [factSheetType] }], ids } }
  const { viewIndex, legendIndex } = await lx.executeGraphQL(query, variables)
    .then(({ op }) => {
      let { mapping, legendItems } = op.view
      const viewIndex = mapping.reduce((accumulator, { fsId, legendId }) => ({ ...accumulator, [fsId]: op.view.legendItems[legendId + 1] }), {})
      const legendIndex = legendItems.reduce((accumulator, legendItem) => ({ ...accumulator, [legendItem.value]: legendItem }), {})
      return { viewIndex, legendIndex }
    })

  commit('setViewIndex', { factSheetType, viewIndex })
  commit('setLegendIndex', { factSheetType, viewKey, legendIndex })
}
