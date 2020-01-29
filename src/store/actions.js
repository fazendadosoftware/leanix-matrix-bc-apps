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
