export default {
  reportSetup: {},
  baseUrl: '',
  startYear: 2019,
  yearCount: 7,
  showQuarters: false,
  quarterLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
  businessCapabilities: [...Array(100).keys()]
    .map(id => ({ id: `bc${id}`, name: `BC-${id}` }))
}
