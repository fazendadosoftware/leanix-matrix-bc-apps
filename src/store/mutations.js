export const setReportSeup = (state, reportSetup) => { state.reportSetup = reportSetup }
export const setBaseUrl = (state, baseUrl) => { state.baseUrl = baseUrl }
export const setDataset = (state, dataset) => { state.dataset = dataset; state.expandedBusinessCapabilities = [] }
export const setBusinessCapabilityIndex = (state, businessCapabilityIndex) => { state.businessCapabilityIndex = businessCapabilityIndex }
export const setShowQuarters = (state, showQuarters) => { state.showQuarters = showQuarters }
export const setApplicationViewIndex = (state, applicationViewIndex) => { state.applicationViewIndex = applicationViewIndex }
export const setApplicationViewOptions = (state, applicationViewOptions) => { state.applicationViewOptions = applicationViewOptions }
export const setApplicationViewKey = (state, applicationViewKey) => { state.applicationViewKey = applicationViewKey }
