export default async store => {
  await store.dispatch('initializeReport')
  store.dispatch('fetchViewOptions', 'Application')
  store.dispatch('fetchViewOptions', 'BusinessCapability')

  store.dispatch('fetchDataset')

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
