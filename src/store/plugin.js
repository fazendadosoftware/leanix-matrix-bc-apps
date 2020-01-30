export default async store => {
  await store.dispatch('initializeReport')
  store.dispatch('fetchApplicationViewOptions')
  store.dispatch('fetchDataset')

  store.watch(
    state => state.applicationViewKey,
    () => store.dispatch('fetchApplicationView')
  )

  store.watch(
    state => state.dataset,
    () => {
      store.dispatch('fetchApplicationView')
    }
  )
}
