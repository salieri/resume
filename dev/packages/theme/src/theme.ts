import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Merriweather, Georgia, serif',

  headings: {
    fontFamily: 'Raleway, Helvetica, Arial, sans-serif',
    fontWeight: '500',

    sizes: {
      h1: { fontSize: '3rem' },
      h2: { fontSize: '2rem' },
      h3: { fontSize: '1.5rem' },
    },
  },

  fontSizes: {
    //   xs: '1rem',
    //   sm: '1.15rem',
    md: '1.05rem',
    //   lg: '1.35rem',
    //   xl: '1.5rem',
  },

  lineHeights: {
    xs: '1.5rem',
    sm: '1.75rem',
    md: '2rem',
    lg: '2.25rem',
    xl: '2.5rem',
  },
});

// 1.25rem merriweather, font-weight:300, line-height:2.35rem margin bottom 1.55rem;

// dark #c9c9c9
// strong #e4e4e4

// light
//  text #121111
//  strong #000
