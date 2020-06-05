import React from 'react';
import Grid from '@material-ui/core/Grid';

import Stem from './Stem';

const LemmaGroups = ({ from, to }) => (
  <Grid container spacing={1}>
    <Grid item xs={6}>
      {from.map((stem, index) =>
        <Stem key={index} expression={stem.expression} />)
      }
    </Grid>
    <Grid item xs={6}>
      {to.map((stem, index) =>
        <Stem key={index} expression={stem.expression} />)
      }
    </Grid>
  </Grid>
);

export default LemmaGroups;
