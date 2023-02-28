const colors = require('tailwindcss/colors')

module.exports = {
  content: [`./src/**/*.{js,ts,jsx,tsx}`],
  theme: {
    screen: {
      lgmax: { max: '1024px' },
    },
    extend: {
      screens: {
        lgmax: { max: '1024px' },
        sm: { min: '640px' },
        smmax: { max: '640px' },
        appBreakPoint: { max: '850px' },
        xsm: { max: '520px' },
      },
      colors: {
        umeHeader: '2A235A',
      },
    },
  },
}
