import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../components/withRoot';
import withCountDown from '../components/withCountDown';
import {withTranslate,T} from '../components/Language';

const styles = {
  root: {

  },
  days: { },
  hours: { },
  minutes: { },
  seconds: { },
  div: { },
  group: { },
  des: {
    fontSize: "0.55em",
    margin: "-0.5em 1em 1.5em",
    textAlign: "center",
  },
  number: {
    textAlign: "center",
    "&:after": {
      content: ":",
    }
  },
  unit: {
    textAlign: "center",
    fontSize: "0.4em",
    lineHeight: "1em"
  },
  clock: {
    display: 'flex',
    lineHeight: "0.9em",
    fontSize: "1.5em",
    "& > div": {
      flex: 1,
      textAlign: "center",
      lineHeight: "1.1em",
    },
    "& > $div": {
      flex: 0.1,
      textAlign: "center",
      lineHeight: "1.1em",
    }
  },
  // fill:{
  //   flex : 3
  // }
};


const Countdown = ({ classes, timeString, day, hour, minute, second, message, timeText, seperate, _}) => <div className={classes.root}>
  <div className={classes.des}>{message} {timeText || timeString}</div>
  <div className={classes.clock}>
    <div className={`${classes.group} ${classes.days}`}>
      <div className={classes.number}>{day}</div>
      <div className={classes.unit}>{_(T.time_unit,0)}</div>
    </div>
    <div className={classes.div}>{seperate || ":"}</div>
    <div className={`${classes.group} ${classes.hours}`}>
      <div className={classes.number}> {hour}</div>
      <div className={classes.unit}> {_(T.time_unit,1)}</div>
    </div>
    <div className={classes.div}>{seperate || ":"}</div>
    <div className={`${classes.group} ${classes.minutes}`}>
      <div className={classes.number}>{minute}</div>
      <div className={classes.unit}>{_(T.time_unit,2)} </div>
    </div>
    <div className={classes.div}>{seperate || ":"}</div>
    <div className={`${classes.group} ${classes.seconds}`}>
      <div className={classes.number}>{second}</div>
      <div className={classes.unit}>{_(T.time_unit,3)} </div>
    </div>
  </div>
</div>



export default withCountDown(withStyles(styles)(withTranslate(Countdown)));

