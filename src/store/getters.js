export const years = state => [...Array(state.yearCount).keys()].map(offset => state.startYear + offset)
export const showQuarters = state => state.showQuarters
export const businessCapabilities = state => state.businessCapabilities

export const columns = state => {
  const { yearCount, startYear, showQuarters, quarterLabels } = state
  const columns = [...Array(yearCount).keys()]
    .reduce((accumulator, offset) => {
      const year = startYear + offset
      if (showQuarters) accumulator = [...accumulator, ...quarterLabels.map((label, i) => ({ year, quarter: i, id: `${year}-${label}`, label: `${year}-${label}` }))]
      else accumulator.push({ year, id: year, label: `${year}` })
      return accumulator
    }, [])
  return columns
}
export const cells = state => {
  const _columns = columns(state)

  const businessCapabilities = [ ...state.businessCapabilities ]
  if (!businessCapabilities.length) businessCapabilities[0] = false

  const cells = businessCapabilities
    .reduce((accumulator, businessCapability, i) => {
      // Compute x header row and add it to the accumulator
      if (i === 0) {
        const firstRow = [{ class: 'pivot-cell', id: 'pivot-cell', isPivotCell: true }, ..._columns.map((column, j) => ({ ...column, isHeader: true, axis: 'x', isFirst: j === 0, isLast: j === (_columns.length - 1) }))]

        accumulator = [ ...accumulator, ...firstRow ]
      }
      if (businessCapability === false) return accumulator

      const firstCell = { ...businessCapability, isHeader: true, axis: 'y', isFirst: i === 0, isLast: i === (businessCapabilities.length - 1) }
      const row = [firstCell, ..._columns
        .map(column => {
          const { year, quarter } = column
          const computedCellValue = {
            id: `${businessCapability.id}-${year}-${quarter}`,
            isContent: true,
            businessCapabilityId: businessCapability.id,
            year
          }
          return computedCellValue
        })]
      return [ ...accumulator, ...row ]
    }, [])
  return cells
}
