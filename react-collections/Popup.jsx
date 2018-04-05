import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import CircularProgress from 'material-ui/Progress/CircularProgress'
import purple from 'material-ui/colors/purple';
import HiddenLayout from './HiddenLayout'
import Snackbar from 'material-ui/Snackbar';
import SnackbarContent from 'material-ui/Snackbar/SnackbarContent';

const noop = e => e

const popupWatingBox = (promise, message = '', minimumtime = 1000) => {

  const timeout = new Promise(e => setTimeout(e, minimumtime))

  const { close, submit } = HiddenLayout.addPopup(({ onClose, open, _ = noop }) => <Dialog open={open} >
    <DialogContent >
      <DialogContentText style={{ textAlign: 'center' }}>{_(message || 'please_wating') || message}</DialogContentText>
      <CircularProgress style={{ color: purple[500], margin: '10px auto', display: "block" }} thickness={7} />
    </DialogContent>
  </Dialog>
  );

  const finalpromise = timeout.then(e => promise)

  finalpromise.then(submit);
  finalpromise.catch(close);

  return finalpromise;
}


const popupMessageBox = function ({ title = "", message = '', error = false }) {

  const { close, popuppromise } = HiddenLayout.addPopup(({ onClose, onSubmit, open, _ = noop }) => <Dialog open={open} onBackdropClick={onClose}>
    <DialogTitle>{_(title) || title}</DialogTitle>
    <DialogContent >
      <DialogContentText style={{ textAlign: 'center' }}>{_(message || 'please_wating') || message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="raised" onClick={onSubmit} color="primary"> {_('OK') || 'OK'} </Button>
    </DialogActions>
  </Dialog>
  );
  return popuppromise;
}


const confirmBox = function ({ title = "", message, submitText = '', cancelText = '' }) {

  const { close, submitpromise } = HiddenLayout.addPopup(({ onClose, onSubmit, open, _ = noop }) => <Dialog open={open} onBackdropClick={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent >
      <DialogContentText style={{ textAlign: 'center' }}>{_(message) || message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="raised" onClick={onClose} color="primary"> {_(cancelText || 'cancel') || cancelText || 'Cancel'} </Button>
      <Button variant="raised" onClick={onSubmit} color="primary"> {_(submitText || 'submit') || submitText || 'Submit'} </Button>
    </DialogActions>
  </Dialog>
  );
  return submitpromise;
}


const popupContent = function ({ title = "", Component, buttons = [], classes = {}, force = false, compact = false, props = {} }) {
  const { close, submitpromise } = HiddenLayout.addPopup(({ onClose, onSubmit, open, _ = noop }) => <Dialog open={open} onBackdropClick={force ? undefined : onClose} classes={classes}>
    {!compact && <DialogTitle>{title}</DialogTitle>}
    {!compact && <DialogContent><Component onClose={onClose} onSubmit={onSubmit} {...props} /></DialogContent>}
    {compact && <Component onClose={onClose} onSubmit={onSubmit} {...props instanceof Function ? props : props() } />}
    {!compact && <DialogActions>{buttons}</DialogActions>}
  </Dialog>
  );
  return submitpromise;
}

const snackBar = function ({
  message = '',
  action = [],
  className = '',
  allowClose = _ => true,
  anchorOrigin: { vertical = "bottom", horizontal = "right" } = {},
}) {
  const { close } = HiddenLayout.addPopup(({ onClose, open }) => <Snackbar
    className={className}
    anchorOrigin={{ vertical, horizontal }}
    open={open}
    action={action}
    onClose={() => allowClose() && onClose()}
    message={message}
  />
  );
  return close;
}

export {
  popupWatingBox,
  popupMessageBox,
  popupContent,
  confirmBox,
  snackBar,
}
