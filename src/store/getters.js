export const years = state => [...Array(state.yearCount).keys()].map(offset => state.startYear + offset)
export const showQuarters = state => state.showQuarters
export const dataset = state => state.dataset
export const businessCapabilityIndex = state => state.businessCapabilityIndex
export const expandedBusinessCapabilities = state => state.expandedBusinessCapabilities

export const applicationViewIndex = state => state.viewIndex.Application || {}
export const applicationViewOptions = state => state.viewOptions.Application || []
export const applicationViewKey = state => state.viewKey.Application

export const businessCapabilityViewIndex = state => state.viewIndex.BusinessCapability || {}
export const businessCapabilityViewOptions = state => state.viewOptions.BusinessCapability || []
export const businessCapabilityViewKey = state => state.viewKey.BusinessCapability

export const getViewIndex = state => factSheetType => state.viewIndex[factSheetType]
export const getViewOptions = state => factSheetType => state.viewOptions[factSheetType] || []
export const getViewKey = state => factSheetType => state.viewKey[factSheetType]

export const columns = state => {
  const { yearCount, startYear, showQuarters, quarterLabels } = state
  const columns = [...Array(yearCount).keys()]
    .reduce((accumulator, offset) => {
      const year = startYear + offset
      if (showQuarters) accumulator = [...accumulator, ...quarterLabels.map((label, i) => ({ year, quarter: i + 1, id: `${year}-${label}`, label: `${year}-${label}` }))]
      else accumulator.push({ year, id: year, label: `${year}` })
      return accumulator
    }, [])
  return columns
}
export const cells = state => {
  const { expandedBusinessCapabilities } = state
  const bcsDrilledDown = expandedBusinessCapabilities.length > 0
  const _columns = columns(state)

  const businessCapabilities = [ ...state.dataset ]
  if (!businessCapabilities.length) businessCapabilities[0] = false

  const cells = businessCapabilities
    .reduce((accumulator, businessCapability, i) => {
      // Compute x header row and add it to the accumulator
      if (i === 0) {
        const firstRow = [
          { class: 'pivot-cell', id: 'pivot-cell', isPivotCell: true, style: `grid-column: 1/${bcsDrilledDown ? 3 : 2}` },
          ..._columns.map((column, j) => ({ ...column, isHeader: true, axis: 'x', isFirst: j === 0, isLast: j === (_columns.length - 1) }))
        ]

        accumulator = [ ...accumulator, ...firstRow ]
      }
      if (businessCapability === false) return accumulator

      if ((expandedBusinessCapabilities.indexOf(businessCapability.id) > -1) && Array.isArray(businessCapability.children) && businessCapability.children.length) {
        const bcHeaderCell = { ...businessCapability, isHeader: true, axis: 'y', isFirst: i === 0, isLast: i === (businessCapabilities.length - 1), style: `grid-row: span ${businessCapability.children.length}` }
        accumulator.push(bcHeaderCell)
        businessCapability.children
          .forEach(child => {
            const firstCell = { ...child, isHeader: true, axis: 'y', isFirst: i === 0, isLast: i === (businessCapabilities.length - 1) }
            const row = [firstCell, ..._columns
              .map(column => {
                const { year, quarter = null } = column
                const computedCellValue = {
                  id: `${child.id}-${year}-${quarter}`,
                  isContent: true,
                  businessCapabilityId: child.id,
                  year,
                  quarter
                }
                return computedCellValue
              })]
            row.forEach(cell => accumulator.push(cell))
          })
      } else {
        const firstCell = { ...businessCapability, isHeader: true, axis: 'y', isFirst: i === 0, isLast: i === (businessCapabilities.length - 1) }
        const row = [firstCell, ..._columns
          .map(column => {
            const { year, quarter = null } = column
            const computedCellValue = {
              id: `${businessCapability.id}-${year}-${quarter}`,
              isContent: true,
              businessCapabilityId: businessCapability.id,
              year,
              quarter
            }
            return computedCellValue
          })]
        if (bcsDrilledDown) {
          const secondColumn = { id: `${businessCapability.id}-empty`, isBusinessCapabilityEmptyHeader: true }
          row.splice(1, 0, secondColumn)
        }
        row.forEach(cell => accumulator.push(cell))
      }
      return accumulator
    }, [])
  return cells
}
