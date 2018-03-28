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
import styled from 'styled-components';
import Rnd from 'react-rnd';
import IconButton from 'material-ui/IconButton';
import { Add, Close, Edit } from 'material-ui-icons';
import { Map } from 'immutable';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import InlineEdit from './InlineEdit';

const solidBorder = '1px solid #75715e';
const dottedBorder = '1px dotted #464741';

const Wrapper = styled(Rnd)`
  border: ${solidBorder};
  border-radius: 4px;
  background-color: #272822;
  overflow: hidden;
`;

const Header = styled.div`
  border-bottom: ${solidBorder};
  padding: 4px;
  font-weight: bold;
  text-align: center;
  cursor: default;
  font-size: 14px;
`;

const MethodRow = styled.div`
  border-bottom: ${dottedBorder};
  padding: 4px;
  font-size: 14px;
  word-wrap: break-word;

  display: flex;
`;

const MethodHeaderEdit = styled(InlineEdit)`
  flex: 1;
`;

const AddBtnRow = styled.div`
  display: none;
  text-align: center;

  ${Wrapper}:hover & {
    display: block;
  }
`;

const SmallIconBtn = styled(IconButton)`
  && {
    width: 40px;
    height: 40px;
  }
`;
const TinyIconBtn = styled(IconButton)`
  && {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    float: ${props => props.float};
  }
`;

const tinyIconStyle = {
  width: 16,
  height: 16,
};

const BodyEditor = styled.textarea`
  min-width: 370px;
  min-height: 150px;
`;

class ClassNode extends React.Component {
  state = {
    methodEditOpened: false,
    methodEditMethod: null,
    methodEditBody: '',
  };

  onMethodHeaderChange(method, header) {
    const { grClass, onChange } = this.props;
    onChange(grClass.update('methods', methods =>
      methods.update(
        methods.findIndex(item => item.get('header') === method.get('header')),
        method => method.set('header', header),
      )));
  }

  onCloseMethodEdit(save) {
    const { grClass, onChange } = this.props;
    const { methodEditMethod, methodEditBody } = this.state;

    if (save) {
      onChange(grClass.update('methods', methods =>
        methods.update(
          methods.findIndex(item => item.get('header') === methodEditMethod.get('header')),
          method => method.set('body', methodEditBody),
        )));
    }

    this.setState({
      methodEditOpened: false,
    });
  }

  onEditMethodClick(method) {
    this.setState({
      methodEditBody: method.get('body'),
      methodEditMethod: method,
      methodEditOpened: true,
    });
  }

  onDeleteMethodClick(method) {
    const { grClass, onChange } = this.props;
    onChange(grClass.update('methods', methods =>
      methods.delete(methods.findIndex(item => item.get('header') === method.get('header')))));
  }

  onClassNameChange(name) {
    const { grClass, onChange } = this.props;
    onChange(grClass.set('name', name));
  }

  render() {
    const {
      grClass, onChange, onDelete, ...restProps
    } = this.props;
    const { methodEditOpened, methodEditMethod, methodEditBody } = this.state;
    return (
      <Wrapper
        {...restProps}
        size={{ width: grClass.get('width'), height: grClass.get('height') }}
        position={{ x: grClass.get('x'), y: grClass.get('y') }}
        onDragStop={(e, d) => {
          onChange(grClass.set('x', d.x).set('y', d.y));
        }}
        onResize={(e, direction, ref, delta, position) => {
          onChange(grClass.merge({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              ...position,
            }));
        }}
        dragHandleClassName=".handle"
      >
        <Header className="handle">
          <InlineEdit
            text={grClass.get('name')}
            paramName="value"
            staticElement="span"
            change={d => this.onClassNameChange(d.value)}
          />
          <TinyIconBtn
            aria-label="Upravit"
            color="inherit"
            float="right"
            onClick={() => onDelete && onDelete()}
          >
            <Close style={tinyIconStyle} />
          </TinyIconBtn>
        </Header>
        {(grClass.get('methods') || []).map(method => (
          <MethodRow key={method.get('header')}>
            <MethodHeaderEdit
              text={method.get('header')}
              paramName="value"
              staticElement="div"
              change={d => this.onMethodHeaderChange(method, d.value)}
            />
            <TinyIconBtn
              aria-label="Upravit"
              color="inherit"
              onClick={() => this.onEditMethodClick(method)}
            >
              <Edit style={tinyIconStyle} />
            </TinyIconBtn>

            <TinyIconBtn
              aria-label="Odstranit"
              color="inherit"
              onClick={() => this.onDeleteMethodClick(method)}
            >
              <Close style={tinyIconStyle} />
            </TinyIconBtn>
          </MethodRow>
        ))}

        <AddBtnRow>
          <SmallIconBtn
            aria-label="Přidat"
            color="inherit"
            onClick={() => {
              onChange(grClass.update('methods', methods =>
                  methods.push(Map({
                      header: 'method()',
                      body: '',
                    }))));
            }}
          >
            <Add />
          </SmallIconBtn>
        </AddBtnRow>

        <Dialog
          open={methodEditOpened}
          onClose={() => this.onCloseMethodEdit()}
          aria-labelledby="method-dialog-title"
        >
          <DialogTitle id="method-dialog-title">
            {methodEditMethod && methodEditMethod.get('header')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <BodyEditor
                value={methodEditBody}
                onChange={(e) => {
                  this.setState({
                    methodEditBody: e.target.value,
                  });
                }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.onCloseMethodEdit()} color="primary">
              Zrušit
            </Button>
            <Button
              onClick={() => this.onCloseMethodEdit(true)}
              color="primary"
              autoFocus
            >
              Uložit
            </Button>
          </DialogActions>
        </Dialog>
      </Wrapper>
    );
  }
}

export default ClassNode;
