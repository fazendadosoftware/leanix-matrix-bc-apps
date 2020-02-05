import Vue from 'vue'

export const setReportSeup = (state, reportSetup) => { state.reportSetup = reportSetup }
export const setWorkspaceIsCustomized = state => { state.workspaceIsCustomized = true }
export const setBaseUrl = (state, baseUrl) => { state.baseUrl = baseUrl }
export const setDataset = (state, dataset) => { state.dataset = dataset; state.expandedBusinessCapabilities = [] }
export const setBusinessCapabilityIndex = (state, businessCapabilityIndex) => { state.businessCapabilityIndex = businessCapabilityIndex }
export const setShowQuarters = (state, showQuarters) => { state.showQuarters = showQuarters }

export const loadingDatasetStart = state => state.loadingDataset++
export const loadingDatasetDone = state => state.loadingDataset--

export const setViewOptions = (state, { factSheetType, viewOptions }) => Vue.set(state.viewOptions, factSheetType, viewOptions)
export const setViewKey = (state, { factSheetType, viewKey }) => Vue.set(state.viewKey, factSheetType, viewKey)
export const setViewIndex = (state, { factSheetType, viewIndex }) => Vue.set(state.viewIndex, factSheetType, viewIndex)

export const setLegendIndex = (state, { factSheetType, viewKey, legendIndex }) => Vue.set(state.legendIndex, factSheetType, legendIndex)
