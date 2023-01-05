import styled, { css } from 'styled-components';

const Container = styled.div`
  display: grid;
  border-radius: 5px;
  padding: 16px;
  background-color:  #fafafa;
  box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  min-width: 250px;
  width: 100%;
  grid-gap: 30px;

  @media(min-width: 920px){
    grid-template-columns: 1fr 2fr;
  }

  .containerColumn{

    .asyncSelectContainer{
      margin-bottom: 20px;
    }
  }

`;

const ContainerOption = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ContainerTitle = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: #b2b2b3;
  display: flex;
  align-items: center;
`;

const TagCloud = styled.div`

  border: 1px solid #E5E5E6;
  border-radius: 5px;
  overflow-y: scroll;
  padding: 10px;
  height: 110px;

  ${({isDisabled})=> isDisabled ? css`
    background: hsl(0,0%,95%);
  ` : css`
    background: #FFFFFF;
  `}
`;

export { Container, ContainerOption, ContainerTitle, TagCloud};
