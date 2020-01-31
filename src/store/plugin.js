export default async store => {
  await store.dispatch('initializeReport')
  store.dispatch('fetchViewOptions', 'Application')
  store.dispatch('fetchViewOptions', 'BusinessCapability')

  store.dispatch('fetchDataset')

  store.watch(
    state => state.loadingDataset,
    (val, oldVal) => {
      if (oldVal === 0 && val > 0) lx.showSpinner()
      else if (oldVal > 0 && val === 0) lx.hideSpinner()
    }
  )

  store.watch(
    state => state.viewKey.Application,
    () => store.dispatch('fetchFactSheetTypeView', 'Application')
  )

  store.watch(
    state => state.viewKey.BusinessCapability,
    () => store.dispatch('fetchFactSheetTypeView', 'BusinessCapability')
  )

  store.watch(
    state => state.dataset,
    () => {
      store.dispatch('fetchFactSheetTypeView', 'Application')
      store.dispatch('fetchFactSheetTypeView', 'BusinessCapability')
    }
  )
}
