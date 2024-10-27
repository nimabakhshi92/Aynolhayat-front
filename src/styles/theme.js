import { createTheme } from "@mui/material/styles";
export const theme = createTheme({
  breakpoints: {
    values: {
      loginChangeBackground: 1160,
      xs: 0,
      smm: 480,
      sm: 1000,
      md: 1100,
      lg: 1230,
      xl: 1330,
      xl2: 1400,
      "2xl": 1440,
    },
  },
  spacing: (factor) => `${0.4 * factor}rem`,
  components: {
    MuiStack: {
      defaultProps: {},
    },
  },
});
