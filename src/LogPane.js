import React from 'react';
import styled from 'styled-components';

const solidBorder = '1px solid #75715e';

const Wrapper = styled.div`
  border-top: ${solidBorder};
  background-color: #272822;
  min-height: 100px;
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

const LogPane = props => (
  <Wrapper {...props}>
    <Header>Log</Header>
    <LogRow>Hello World!</LogRow>
  </Wrapper>
);

export default LogPane;
