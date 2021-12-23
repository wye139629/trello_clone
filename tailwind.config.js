const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  theme: {
    extend: {
      opacity: {
        35: '0.35',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      rose: colors.rose,
      teal: colors.teal,
      orange: colors.orange,
      gray: colors.gray,
      red: colors.red,
      green: colors.green,
      blue: colors.blue,
      sky: colors.sky,
      cyan: colors.cyan,
    },
    zIndex: {
      m1: -1,
      m10: -10,
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      60: 60,
      70: 70,
      80: 80,
      90: 90,
      100: 100,
      auto: 'auto',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
