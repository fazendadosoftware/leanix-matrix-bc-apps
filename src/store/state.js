export default {
  reportSetup: {},
  baseUrl: '',
  startYear: 2019,
  yearCount: 7,
  showQuarters: false,
  quarterLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
  businessCapabilities: [...Array(10).keys()]
    .map(id => ({ id: `bc${id}`, name: `BC-${id}`, children: [...Array(3).keys()].map(child => ({ id: `bc${id}child${child}`, name: `BC-${id}-child-${child}` })) })),
  expandedBusinessCapabilities: []
}
