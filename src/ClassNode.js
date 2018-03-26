import React from 'react';
import styled from 'styled-components';
import Rnd from 'react-rnd';
import InlineEdit from './InlineEdit';

const solidBorder = '1px solid #75715e';
const dottedBorder = '1px dotted #464741';

const Wrapper = styled(Rnd)`
  border: ${solidBorder};
  border-radius: 4px;
  background-color: #272822;
`;

const Header = styled.div`
  border-bottom: ${solidBorder};
  padding: 4px;
  font-weight: bold;
  text-align: center;
  cursor: default;
  font-size: 14px;
`;

const MethodRow = styled(InlineEdit)`
  border-bottom: ${dottedBorder};
  padding: 4px;
  font-size: 14px;
  word-wrap: break-word;
`;

const ClassNode = ({ grClass, onChange, ...restProps }) => (
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
    <Header className="handle">{grClass.get('name')}</Header>
    {(grClass.get('methods') || []).map(method => (
      <MethodRow
        key={method.get('header')}
        text={method.get('header')}
        paramName="value"
        staticElement="div"
        change={(d) => {
          onChange(grClass.update('methods', methods =>
              methods.update(
                methods.findIndex(item => item.get('header') === method.get('header')),
                method => method.set('header', d.value),
              )));
        }}
      />
    ))}
  </Wrapper>
);

export default ClassNode;
