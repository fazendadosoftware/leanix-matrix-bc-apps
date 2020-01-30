export default async store => {
  await store.dispatch('initializeReport')
  store.dispatch('fetchDataset')
}
