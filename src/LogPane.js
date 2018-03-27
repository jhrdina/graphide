import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Iterable } from 'immutable';

const solidBorder = '1px solid #75715e';

const Wrapper = styled.div`
  border-top: ${solidBorder};
  background-color: #272822;
  min-height: 100px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  border-bottom: ${solidBorder};
  padding: 4px;
  font-weight: bold;
  cursor: default;
  font-size: 14px;
`;

const LogRow = styled.div`
  font-size: 14px;
  font-family: monospace;
  padding: 4px;
  &::before {
    content: '> ';
  }
`;

const Scrollable = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const LogPane = ({ items, ...restProps }) => (
  <Wrapper {...restProps}>
    <Header>Log</Header>
    <Scrollable>
      {items.map((text, i) => <LogRow key={i}>{text}</LogRow>)}
    </Scrollable>
  </Wrapper>
);

LogPane.propTypes = {
  items: PropTypes.instanceOf(Iterable).isRequired,
};

export default LogPane;
