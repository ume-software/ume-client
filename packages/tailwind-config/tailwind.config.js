const colors = require('tailwindcss/colors')

module.exports = {
<<<<<<< HEAD
    content: [
        `./src/**/*.{js,ts,jsx,tsx}`,
    ],
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
            // colors: {
            //     brandblue: colors.blue[500],
            //     brandred: colors.red[500],
            //     kmsconnect: {
            //         primary: '#00B549',
            //         error: '#FF4D4F',
            //         blue: '#27AAE1',
            //         deepBlue: '#004F95',
            //         orange: '#FC8500',
            //         backgroundCard: '#F9FAFC',
            //         stepBorder: '#BFBFBF',
            //         textGrey: '#6C757D',
            //         textGreyDisable: '#00000040',
            //         backgroundTagInfo: '#F1FBFF',
            //         lightGrey: '#F1FBFF',
            //         grey: '#D9D9D9',
            //         white: '#FFFFFF',
            //     },
            // },
            colors: {
                
            }
        },
=======
  content: [`./src/**/*.{js,ts,jsx,tsx}`],
  theme: {
    screen: {
      lgmax: { max: '1024px' },
>>>>>>> e61802efb5da1b96c52000516bb2c2ee35315bd0
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
        header: '2A235A',
      },
      // colors: {
      //     brandblue: colors.blue[500],
      //     brandred: colors.red[500],
      //     kmsconnect: {
      //         primary: '#00B549',
      //         error: '#FF4D4F',
      //         blue: '#27AAE1',
      //         deepBlue: '#004F95',
      //         orange: '#FC8500',
      //         backgroundCard: '#F9FAFC',
      //         stepBorder: '#BFBFBF',
      //         textGrey: '#6C757D',
      //         textGreyDisable: '#00000040',
      //         backgroundTagInfo: '#F1FBFF',
      //         lightGrey: '#F1FBFF',
      //         grey: '#D9D9D9',
      //         white: '#FFFFFF',
      //     },
      // },
    },
  },
}
