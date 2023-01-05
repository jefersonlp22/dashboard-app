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
  grid-gap: 30px;

  @media(min-width: 850px){
    grid-template-columns: 50% 1fr;
  }

`;

const DateContainer = styled.div``;

const DateTitle = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: #b2b2b3;
`;

const DateContent = styled.div`
  border: solid 1px #e5e5e6;
  padding: 0.6rem;
  margin-top: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


export { Container, DateContainer, DateTitle, DateContent };
