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
import PropTypes from 'prop-types';
import { Iterable } from 'immutable';

const solidBorder = '1px solid #75715e';
const dottedBorder = '1px dotted #464741';

const Wrapper = styled.div`
  border-top: ${solidBorder};
  background-color: #272822;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  max-height: ${props => props.maxHeight && `${props.maxHeight}px`};
`;

const Header = styled.div`
  border-bottom: ${solidBorder};
  padding: 4px;
  font-weight: bold;
  cursor: default;
  font-size: 14px;
`;

const LogRow = styled.div`
  border-bottom: ${dottedBorder};
  font-size: 14px;
  font-family: monospace;
  padding: 2px 4px;
  white-space: pre;
  &::before {
    content: '> ';
  }
`;

const Scrollable = styled.div`
  flex: 1;
  overflow-y: auto;
`;

class LogPane extends React.Component {
  componentDidUpdate() {
    this.scrollable.scrollTop = this.scrollable.scrollHeight;
  }

  render() {
    const { items, ...restProps } = this.props;
    return (
      <Wrapper {...restProps}>
        <Header>Log</Header>
        <Scrollable
          innerRef={(el) => {
            this.scrollable = el;
          }}
        >
          {items.map((text, i) => <LogRow key={i}>{text}</LogRow>)}
        </Scrollable>
      </Wrapper>
    );
  }
}

LogPane.propTypes = {
  items: PropTypes.instanceOf(Iterable).isRequired,
};

export default LogPane;
