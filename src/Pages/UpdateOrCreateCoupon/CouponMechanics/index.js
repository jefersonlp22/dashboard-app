import React, { useState, useEffect, useContext } from "react";

import {
  ContentBoard,
  Button,
  Row,
  Breadcrumbs,
  Line,
  Alert,
  Modal,
  AlertButton,
} from "../../../components";
import { useHistory } from 'react-router-dom';
import TotalStorage from "total-storage";
import _ from 'lodash';
import moment from 'moment';
import "../style.scss";
import Validity from "./Validity";
import CoupomObjects from "./CoupomObjects";
import States from "./States";
import Value from "./Value";

import { CouponContext } from '../../../contexts/Coupon.ctx';

const CouponMechanics = () => {
  const history = useHistory();
  const { setCouponMechanics, couponState, setCoupons } = useContext(CouponContext);
  let stateMechanics = couponState?.couponMechanics;
  const [TENANT_LIST, TENANT_ID] = TotalStorage.get([
    "TENANT_LIST",
    "@Auth:tenant"
  ]);

  const published = stateMechanics?.status === 'published' || stateMechanics?.published_at;

  const [object_type, setObject_type] = useState(stateMechanics?.object_type || 'ORDER');
  const [type, setType] = useState(stateMechanics?.type_value || 'PRICE');
  const [currentValue, setCurrentValue] = useState(type === 'PERCENTAGE' ?  stateMechanics?.value / 100 : stateMechanics?.value || 0);
  const [dateStart, setDateStart] = useState(stateMechanics?.start_at ? new Date(stateMechanics?.start_at) : new Date());
  const [dateEnd, setDateEnd] = useState(stateMechanics?.end_at ? new Date(stateMechanics?.end_at) : new Date());
  const [toggle, setToggle] = useState(false);
  const [tenant, setTenant] = useState(null);


  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  useEffect(() => {
    if (TENANT_ID) {
      let activeTenant = _.findIndex(TENANT_LIST, {
        external_id: TENANT_ID,
      });
      setTenant(TENANT_LIST[activeTenant]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TENANT_ID]);

  const handleType = (value) => {
    setType(value);
  }

  const handleValue = (value) => {
    setCurrentValue(value);
    //setCouponMechanics('value', value * 100);
  }

  const handObjectleType = (value) => {
    setObject_type(value);
    setCouponMechanics('objects', [
      {
        type: value,
        references: []
      }
    ]);
  }

  const removeCharactersAndParseInt = value => {
    let parseString = String(value)
    let removeStr = parseString.replace(/[^Z0-9]/g, '');
    let number = parseInt(removeStr, 10);

    if (!number) {
      number=0
    }
    return number;
  }

  const handleConfirm = () => {

    let object = []

    if (object_type === "COLLECTION" && stateMechanics?.objects[0]?.references.length < 1) {

      return (
        setAlert({
          status: true,
          message: 'Escolha uma coleção',
          type: "error"
        })
      )
    }
    console.log('type', type, 'stateMechanics?.objects', stateMechanics?.objects);
    if (object_type === "ORDER_ITEM" && stateMechanics?.objects[0]?.references.length < 1) {
      return (
        setAlert({
          status: true,
          message: 'Escolha um produto',
          type: "error"
        })
      )
    }

    if (!currentValue || currentValue < 1) {
      return (
        setAlert({
          status: true,
          message: 'Valor do cupom zerado.',
          type: "error"
        })
      )
    }

    if (type === "PRICE" && couponState?.couponAudiences?.max_discount_amount > couponState?.couponMechanics?.value) {
      return (
        setAlert({
          status: true,
          message: 'O valor do cupom é menor que o máximo de desconto.',
          type: "error"
        })
      )
    }

    if (object_type === "ORDER_ITEM" || object_type === "COLLECTION") {
      // eslint-disable-next-line no-unused-expressions
      stateMechanics?.objects?.map((obj, index) => {
        if (Array.isArray(obj?.references)) {
          object = obj?.references.map(item => { return { type: obj?.type, references: item } })
          return { type: obj?.type, references: obj?.references }
        } else {
          object = stateMechanics?.objects;
        }
      })
    } else {
      object = [{ type: object_type }]
    }

    let locations = [];

    // eslint-disable-next-line no-unused-expressions
    stateMechanics?.locations !== 'ALL' ? stateMechanics?.locations?.map(location => { locations.push(location) }) : []
    let mechanicsSaved = {
      end_at: moment(dateEnd).format('YYYY-MM-DD hh:mm:ss'),
      start_at: moment(dateStart).format('YYYY-MM-DD hh:mm:ss'),
      locations: locations,
      type_value: type,
      value: type === 'PERCENTAGE' ? currentValue * 100 : removeCharactersAndParseInt(currentValue),
      object_type: object_type,
      objects: object,
    }

    setCoupons({ ...couponState, mechanicsSaved, couponMechanics: mechanicsSaved});

    history.replace({ pathname: `/shop/cupom${stateMechanics?.external_id ? '/' + stateMechanics?.external_id : ''}` })

  }

  return (
    <div className="createNewCoupon">
      <Modal className="createNewCoupon" visible={toggle} onClose={() => setToggle(!toggle)} >
        <div className="df alic jc-c createNewCoupon__modalTitle">
          <h3 >Tem certeza que deseja <br/> voltar?</h3>
        </div>
        <div className="df fdc alic jc-c">
          <span className="createNewCoupon__modalTitle">
            Caso tenha editado algum dado, salve as alterações <br/>
            ou você perderá as modificações.
          </span>
          <div className="mBottom20 mTop20">
            <Button
              primary
              type="button"
              onClick={() => {
                setToggle(!toggle);
              }}
            >
              Cancelar
            </Button>
          </div>
          <div className="">
            <Button
                success
                type="button"
                onClick={() => {
                  history.replace({ pathname: `/shop/cupom${stateMechanics?.external_id ? '/' + stateMechanics?.external_id : ''}`})
                }}
              >
              Ok! Voltar
            </Button>
          </div>
        </div>
      </Modal>
      <Breadcrumbs itens={["Shop", "Cupons", "Criar novo", "Mecânica"]} />
      <Line />
      <ContentBoard
        title="Mecânica"
        previousPath={`/shop/cupom${stateMechanics?.external_id ? '/' + stateMechanics?.external_id : ''}`}
        className="contentMaxWidthUsage "
        loading={false}
        showAlert={() => !published ? setToggle(true) : history.replace({ pathname: `/shop/cupom${stateMechanics?.external_id ? '/' + stateMechanics?.external_id : ''}`})}
      >

        <div>

          <div className="df fdr alic mBottom30">
            <Validity published={published} dateEnd={dateEnd} dateStart={dateStart} setDateEnd={setDateEnd} setDateStart={setDateStart} setCouponMechanics={setCouponMechanics} />
          </div>

          <div className="df fdr alic mBottom30">
            <CoupomObjects
              type={object_type}
              published={published}
              objects={stateMechanics?.objects}
              handleType={handObjectleType}
              setCouponMechanics={setCouponMechanics}
              isWine = {tenant?.id === '6'}
            />
          </div>

          <div className="df fdr alic mBottom30">
            <States
              published={published}
              locations={stateMechanics?.locations}
              setCouponMechanics={setCouponMechanics}
            />
          </div>

          <div className="df fdr alic mBottom30">
            <Value
              published={published}
              currentValue={currentValue}
              setCurrentValue={handleValue}
              handleType={handleType}
              setCouponMechanics={setCouponMechanics}
              type={type}
            />
          </div>

        </div>

        {!published && <div>
          <Row className="couponFormButtons">
            <Button
              success
              type="button"
              onClick={() => handleConfirm()}
            >Confirmar</Button>
          </Row>
          <Alert show={alert.status} type={alert.type}>
            <div>{alert.message}</div>
            <div>
              <AlertButton
                onClick={() =>
                  setAlert({
                    status: false,
                    message: null,
                    type: "error"
                  })
                }
              >
                Fechar
              </AlertButton>
            </div>
          </Alert>
        </div>}
      </ContentBoard>

    </div>
  );
}

export default CouponMechanics;
