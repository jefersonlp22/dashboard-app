import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import "./styles.scss";
import { Modal } from "../../../../components";
import IconInfo from "./info";

const Button = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px 0;
  align-items: center;  
  justify-content: space-between;
`;

const Col = styled.div`
  p {
    font-weight: 500;
    font-size: 21px;
    line-height: 27px;
    color: ${({ color }) => color || "#9B9B9B"};
    margin-bottom: 10px;
  }
  span {
    font-weight: 450;
    font-size: 14px;
    line-height: 18px;
    color: #b2b2b3;
  }  
`;

const Separator = styled.div`
  height: 50px;
  width: 1px;
  background-color: #c4c4c4;
  margin: 0 30px;
`;

const Footer = styled.div`  
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
    .modal-delivery-footer--totals {
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
  
`;

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
        <TrackFill key={`trackCellModal${index}`} width={`${item.percent}%`} bg={item.color} />
      ))}
    </TrackWrapper>
  );
};

const IconDelivery = ({ children, update, color, info, id, ...props }) => {
  const [toggle, setToggle] = useState(false);
 
  return (
    <>
      <Modal visible={toggle} onClose={() => setToggle(!toggle)}>
        <h1>Acompanhar entregas</h1>
        <Row>
          <Col color={color}>
            <p>R$ 59.441,44</p>
            <span>72% pedidos entregues</span>
          </Col>
          <Separator />
          <Col>
            <p>R$ 23.116,11</p>
            <span>72% pedidos entregues</span>
          </Col>
        </Row>
        <TrackCounter
          data={{
            total: 82557.56,
            variants: [
              { color: color, value: 59441.44 },
              { color: "#9B9B9B", value: 23116.11 },
            ],
          }}
        />
        <Footer>
          <div className="alignItens">            
            {info ? (
              <IconInfo update={toggle}>{info}</IconInfo>
            ) : null}            
          </div>
          <div className="modal-delivery-footer--totals alignItens">
            <span className="total-label">Pedidos pagos</span>
            <span className="total-value">R$ R$ 82.557,56</span>
          </div>
        </Footer>
      </Modal>
      <Button
        data-for={id}
        data-tip="hover on me will keep the tooltip"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"          
        >          
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.6747 8.74214L17.7161 10.0002C17.8108 10.097 17.8108 10.1938 17.8108 10.2905V13.6776C17.8108 13.9679 17.6215 14.1615 17.2428 14.1615H15.728C15.4439 15.0325 14.6865 15.7099 13.6451 15.7099C12.6037 15.7099 11.8463 15.0325 11.5623 14.1615H8.34335C8.05933 15.0325 7.30193 15.7099 6.26051 15.7099C5.21909 15.7099 4.46169 15.0325 4.17767 14.1615H2.75755C2.66288 14.1615 2.5682 14.1615 2.47353 14.0647H2.28418V13.6776V4.7744V4.29053H2.85223H3.13625H11.7516C12.0357 4.29053 12.3197 4.48408 12.3197 4.7744V5.25827H14.5919C14.7812 5.25827 14.9706 5.35504 15.0652 5.54859L16.6747 8.74214ZM3.13625 5.25827H11.1836V8.93569C11.1836 9.22601 11.3729 9.41956 11.7516 9.41956H15.9173L16.6747 10.3873V13.097H15.6333C15.4439 12.226 14.5919 11.5486 13.5505 11.5486C12.509 11.5486 11.7516 12.226 11.4676 13.097H8.34335C8.05933 12.3228 7.20726 11.5486 6.26051 11.5486C5.21909 11.5486 4.46169 12.226 4.17767 13.097H3.13625V5.25827ZM12.225 6.32279V8.45182H15.2546L14.2132 6.32279H12.225ZM5.12442 13.6776C5.12442 14.2583 5.59779 14.7421 6.16584 14.7421C6.73388 14.7421 7.20726 14.2583 7.20726 13.6776C7.20726 13.097 6.73388 12.6131 6.16584 12.6131C5.69246 12.6131 5.12442 13.097 5.12442 13.6776ZM12.509 13.6776C12.509 14.2583 12.9824 14.7421 13.5505 14.7421C14.1185 14.7421 14.5919 14.2583 14.5919 13.6776C14.5919 13.097 14.1185 12.6131 13.5505 12.6131C12.9824 12.6131 12.509 13.097 12.509 13.6776Z"
            fill="#B2B2B3"
            stroke="#B2B2B3"
            strokeWidth="0.5"
            strokeMiterlimit="10"
          />   
        </svg>
      </Button>
      <ReactTooltip
        id={id}
        className="extraClass"
        delayHide={1000}
        effect="solid"
      >
        <p onClick={() => setToggle(true)}>Acompanhar entregas {">"}</p>
      </ReactTooltip>
    </>
  );
};

export { IconDelivery }