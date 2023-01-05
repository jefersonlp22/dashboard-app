import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  border-radius: 5px;
  padding: 16px;
  background-color:  #fafafa;
  box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  min-width: 250px;
  width: 100%;
  grid-gap: 10px;

  @media(min-width: 850px){
    grid-template-columns: 1fr 1fr;
  }

  .coupon_value_input{
    margin-top: 25px;
    margin-bottom: 10px;
    min-width: 120px;
  }

  .type_radios{
    display: flex;
    align-items: center;
    height: 50px;
  }

`;

const ContainerOption = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:first-child{
    margin-right: 30px;
  }
`;

const ContainerTitle = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: #b2b2b3;
  display: flex;
  align-items: center;
`;


export { Container, ContainerOption, ContainerTitle};
