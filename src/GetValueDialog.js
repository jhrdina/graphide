// Copyright (C) 2018 Jan Hrdina
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  componentWillReceiveProps(props) {
    if (this.props.value !== props.value) {
      this.setState({ value: props.value });
    }
  }

  onClose(save) {
    if (save) {
      this.props.onChange(this.state.value);
    } else {
      this.setState({ value: this.props.value });
    }
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
