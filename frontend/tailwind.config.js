const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'Fuchsia':{
        50:'#fdf4ff',
        100:'#fae8ff',
        200:"#f5d0fe",
        300:"#f0abfc",
        400:"#e879f9",
        500:"#d946ef",
        600:"#c026d3",
        700:"#a21caf",
        800:"#86198f",
        900:"#701a75",
        950:"#4a044e",
      },
      Zinc:{
        50:'#fafafa',
        100:'#f4f4f5',
        200:"#e4e4e7",
        300:"#d4d4d8",
        400:"#a1a1aa",
        500:"#71717a",
        600:"#52525b",
        700:"#3f3f46",
        800:"#27272a",
        900:"#18181b",
        950:"#09090b",
      }
  }
  },
  plugins: [],
});
