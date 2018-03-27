import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class GetValueDialog extends React.Component {
  state = {
    value: '',
  };

  componentWillReceiveProps(props) {
    if (this.props.value !== props.value) {
      this.setState({ value: props.value });
    }
  }

  onClose(save) {
    if (save) {
      this.props.onChange(this.state.value);
    }
    this.setState({ value: '' });
    this.props.onClose();
  }

  render() {
    const { title, message, open } = this.props;
    return (
      <Dialog open={open} onClose={() => this.onClose()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {message && <DialogContentText>{message}</DialogContentText>}
          <TextField
            value={this.state.value}
            onChange={(e) => {
              this.setState({ value: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onClose()} color="primary">
            Zrušit
          </Button>
          <Button onClick={() => this.onClose(true)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default GetValueDialog;
