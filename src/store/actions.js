import '@leanix/reporting'

export const initializeReport = ({ commit, state }) => {
  const { customFields } = state
  return lx.init()
    .then(async reportSetup => {
      commit('setReportSeup', reportSetup)
      const { settings, savedState = {} } = reportSetup
      // eslint-disable-next-line
      const { customState = {} } = savedState !== null ? savedState : {}
      const { baseUrl, dataModel = {} } = settings
      const { factSheets } = dataModel

      const isWorkspaceCustomized = Object.entries(customFields)
        .every(([factSheetType, requiredFields]) => {
          const { fields = {} } = factSheets[factSheetType] || {}
          const workspaceFactSheetTypeFields = Object.keys(fields)
          const allFieldsDefined = requiredFields.every(field => workspaceFactSheetTypeFields.indexOf(field) > -1)
          return allFieldsDefined
        })
      if (!isWorkspaceCustomized) console.warn(`missing required customization fields in workspace data model: ${JSON.stringify(customFields)}`)
      if (isWorkspaceCustomized) commit('setWorkspaceIsCustomized')
      commit('setBaseUrl', baseUrl)

      const facets = ['BusinessCapability', 'Application']
        .map((fixedFactSheetType, i) => ({
          key: i,
          fixedFactSheetType,
          facetFiltersChangedCallback: filter => commit('setFilter', { factSheetType: fixedFactSheetType, filter }),
          callback: dataset => commit('setFilteredFactSheets', {
            factSheetType: fixedFactSheetType,
            ids: dataset.reduce((accumulator, { id }) => ({ ...accumulator, [id]: true }), {})
          })
        }))

      const reportConfig = {
        allowEditing: false,
        allowTableView: false,
        reportViewFactSheetType: 'Application',
        facets
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

export const fetchDataset = async ({ commit, state }) => {
  let { workspaceIsCustomized, customFields = {} } = state
  const applicationCustomFields = workspaceIsCustomized
    ? (customFields.Application || []).join(' ')
    : ''
  // lx.showSpinner()
  commit('loadingDatasetStart')
  const factSheetFields = `id name type level`
  const relatedApplications = `...on BusinessCapability {relatedApplications: relBusinessCapabilityToApplication{edges {node {factSheet {${factSheetFields}...on Application{${applicationCustomFields} lifecycle{phases{phase startDate}}}}}}}}`
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
      const parentId = id
      const childRelatedApplications = {}
      children.forEach(child => {
        const { id, relatedApplications } = child
        relatedApplications.forEach(application => { childRelatedApplications[application.id] = application })
        accumulator[id] = { id, relatedApplications, parentId }
      })
      accumulator[id] = { id, relatedApplications, childRelatedApplications: Object.values(childRelatedApplications) }
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
