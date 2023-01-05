import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import IconExpander from "./Icons/expander";
import IconInfo from "./Icons/info";
import {IconDelivery } from "./Icons/delivery";

const Box = styled.div`
  display: grid;
  ${(props) => props.columnExp  === 4  ? `grid-template-columns: 1fr 1fr 1fr 1fr;` : `grid-template-columns: 1fr 1fr 1fr;`}

  grid-template-rows: auto;
  grid-column-gap: 20px;
  grid-template-areas: "col1 col2 col3";
  width: 100%;
`;

const Card = styled.div`
  background: ${({theme}) => theme.colors.white};
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  min-height: 200px;
  border: 1px solid ${({theme}) => theme.colors.gallery};
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.05);

  ${(props) =>
    props.column &&
    css`
      grid-row-start: 1;
      grid-column-start: ${props.column};
      grid-row-end: span 3;
    `}

  ${(props) =>
    props.toggle
      ? css`
          grid-column: span ${props.columnExp} / -1;
          z-index: 1;
          grid-row: 1;
        `
      : css``}
`;

const TitleLabel = styled.div`
  font-family: FontBook;
  color: ${({theme}) => theme.colors.bombay};
  font-weight: 450;
  font-size: 16px;
  line-height: 20px;
`;

const TitleValue = styled.div`
  font-family: FontBook;
  color: ${({theme}) => theme.colors.tundora};
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;
  margin-bottom: 13px;
`;

const CardClosed = styled.div`
  ${(props) =>
    props.toggle
      ? css`
          overflow: hidden;
          width: 0px;
          height: 0px;
        `
      : css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 30px;
          flex: 1;

          .card-closed-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .card-closed-icons {
            justify-self: flex-end;
            display: flex;
            .firstIcon {
              margin-right: 14px;
            }
          }
        `}
`;

const CardOpen = styled.div`
  ${(props) =>
    props.toggle
      ? css`
          width: 100%;
          height: 100%;
          padding: 50px 50px 30px 50px;
          display: flex;
          flex-direction: column;

          .card-open-footer {
            display: flex;
            flex-direction: row;
            justify-self: flex-end;
            justify-content: space-between;
            .alignItens {
              display: flex;
              flex-direction: row;
            }
            .firstIcon {
              margin-right: 14px;
            }
            &--totals {
              .total-label {
                font-size: 14px;
                font-weight: 450;
                color: #b2b2b3;
                margin-right: 30px;
              }
              .total-value {
                font-size: 16px;
                font-weight: 500;
                color: #4d4d4d;
              }
            }
          }
        `
      : css`
          overflow: hidden;
          width: 0px;
          height: 0px;
        `}
`;

const Expansor = styled.div`
  ${(props) => props.expansorHidden ? `display: none;` : `display: flex;`}
  position: absolute;
  top: 20px;
  right: 20px;
`;

const CardsDescription = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 20%);
  width: 100%;
  flex: 1;
`;

const ItemDescription = styled.div`
  height: 70px;
  margin-bottom: 20px;
  p {
    font-size: 20px;
    font-weight: 500;
    color: ${(props) => (props.color ? props.color : "#4D4D4D")};
    margin-bottom: 8px;
  }

  span {
    font-size: 14px;
    font-weight: 450;
    color: #b2b2b3;
  }

  &:not(:last-child) {
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid #c4c4c4;
  }
`;

const ResultBox = ({ children, className, columnExp,loading, column, ...props }) => {
  return (
    <Box columnExp={columnExp}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { column: index + 1 })
      )}
    </Box>
  );
};

const TrackWrapper = styled.div`
  height: 5px;
  margin-bottom: 20px;
  background-color: #cccccc;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const TrackFill = styled.div`
  display: flex;
  flex-direction: row;
  width: ${({ width }) => width};
  background-color: ${({ bg }) => bg};
`;

const TrackCounter = ({ data }) => {
  const [values, setValues] = useState([]);
  useEffect(() => {
    if (data.variants.length) {
      let variants = data.variants.map((item) => {
        return {
          percent: Math.round((item.value / data.total) * 100) + 1,
          color: item.color,
        };
      });

      setValues(variants);
      // console.log('percents',variants);
    }
  }, [data]);

  return (
    <TrackWrapper>
      {values.map((item, index) => (
        <TrackFill key={`trackCounterFill${index}`} width={`${item.percent}%`} bg={item.color} />
      ))}
    </TrackWrapper>
  );
};

const ResultCard = ({
  children,
  className,
  loading,
  column,
  color,
  value,
  title,
  columnExp,
  expansorHidden,
  info,
  id,
  ...props
}) => {
  const [toggle, setToggle] = useState(false);

  function changeState() {
    setToggle(!toggle);
    if (props?.setCurrent) {
      props.setCurrent(!toggle);
    }
  }

  return (
    <Card toggle={toggle} columnExp={columnExp} column={column}>
      <Expansor expansorHidden={expansorHidden} onClick={() => changeState()}>
        <IconExpander pointer toggle={toggle} />
      </Expansor>

      <CardClosed toggle={toggle}>
        <div className="card-closed-content">
          <TitleValue>{value}</TitleValue>
          <TitleLabel>{title}</TitleLabel>
        </div>
        <div className="card-closed-icons">
          {info ?
            <>
              <IconInfo className="firstIcon" update={toggle}>{info}</IconInfo>
              <IconDelivery id={id} color="#6DC783" info={info} />
            </>
          :null}
        </div>
      </CardClosed>
      <CardOpen toggle={toggle}>
        {children || null}
      </CardOpen>
    </Card>
  );
};

export { ResultBox, ResultCard, CardsDescription, ItemDescription, TrackCounter };
