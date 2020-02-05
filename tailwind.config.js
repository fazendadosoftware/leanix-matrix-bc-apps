module.exports = {
  theme: {
    extend: {
      truncate: {
        lines: {
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          8: '8'
        }
      },
      colors: {
        dodgerblue: '#0e90d2',
        darkslategray: '#333333',
        darkgray: '#aaaaaa',
        gainsboro: '#e6e6e6',
        whitesmoke: '#f3f3f3',
        royalblue: '#1665ee',
        silver: '#c9c9c9'
      },
      borderRadius: {
        default: '3px'
      }
    }
  },
  variants: {
    margin: ['responsive', 'last', 'hover', 'focus']
  },
  plugins: [
    require('./src/assets/js/tailwindcss-truncate-multiline')()
  ]
}
