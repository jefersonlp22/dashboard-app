import React, {useState, useEffect, useContext} from 'react';
import _ from 'lodash';
import CreatableSelect from 'react-select/creatable'
import {Formik, Form} from "formik";

import {
  Line,
  Button,
  Loader
} from "../../../components";

import { SessionContext } from '../../../contexts/Session.ctx';
import { useUpdateSettings } from '../../../hooks-api/useTenant';

import "./styles.scss";

const Notifications = () => {
  const { Session, updateCurrentProperty  } = useContext(SessionContext);
  const [updatedSetting] = useUpdateSettings({ data: 'notification' });
  const [loading, setLoading] = useState(false);
  const [notificationsData, setNotificationsData] = useState({});

  const [state, setState] = useState({
    created: [],
    createdInputValue: '',
    paid: [],
    paidInputValue: '',
    canceled: [],
    canceledInputValue: '',
    approved: [],
    approvedInputValue: '',
    autoInvite: [],
    autoInviteInputValue: '',
  });

  const compareObjects = () => {
    let currentState = {
      order_created: serializeEmailArray(state?.created),
      order_paid: serializeEmailArray(state?.paid),
      order_approved: serializeEmailArray(state?.approved),
      order_canceled: serializeEmailArray(state?.canceled),
      auto_invite: serializeEmailArray(state?.autoInvite),
    };

    if (_.isEqual(currentState, notificationsData)) {
      return true;
    } else {
      return false;
    }
  }

  const handleState = (key, value) => {
    setState({...state, [key]: value});
  }

  const handleChange = (value, action, stateKey) => {
    switch (action.action) {
      case 'remove-value':
        handleState(stateKey, value ? value : []);
        break;
      case 'clear':
        handleState(stateKey, []);
        break;
      default:
        break;
    }
  }

  const handleInputChange = (value, stateKey) => {
    handleState(stateKey, value);
  };

  const createOption = (label) => ({
    label,
    value: label,
  });

  const handleKeyDown = (event, stateKey, stateInput) => {
    if (!state[stateInput]) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setState({
          ...state,
          [stateKey]: [...state[stateKey], createOption(state[stateInput])],
          [stateInput]: ''
        })
        event.preventDefault();
        break;
      default:
        console.error('No options');
    }
  };

  const serializeEmailArray = (array) => {
    return array.map(item => {
      return {email: item.value}
    });
  }

  const deSerializeEmailArray = (array) => {
    return array.length > 0 ? array.map(item => {
      return {value: item.email, label: item.email}
    }) : [];
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      let result = await updatedSetting({ variables: {
        notification: {
          order_created: serializeEmailArray(state?.created),
          order_approved: serializeEmailArray(state?.approved),
          order_paid: serializeEmailArray(state?.paid),
          order_canceled: serializeEmailArray(state?.canceled),
          auto_invite: serializeEmailArray(state?.autoInvite),
        }
      } });
      if (result) {
        updateCurrentProperty({
          property: 'notification',
          value: result.data.settings.notification,
          data: true
        });
        // setBonusData(result.data.settings.bonus);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if(Session){
      let cloned = _.cloneDeep(Session?.tenant?.current?.data?.notification);
      setState({
        ...state,
        created: deSerializeEmailArray(cloned?.order_created || []),
        approved: deSerializeEmailArray(cloned?.order_approved || []),
        paid: deSerializeEmailArray(cloned?.order_paid || []),
        canceled: deSerializeEmailArray(cloned?.order_canceled || []),
        autoInvite: deSerializeEmailArray(cloned?.auto_invite || []),
      });
      setNotificationsData({
        order_created: cloned?.order_created,
        order_paid: cloned?.order_paid,
        order_approved: cloned?.order_approved,
        order_canceled: cloned?.order_canceled,
        auto_invite: cloned?.auto_invite,
      });
    }
  // eslint-disable-next-line
  }, [Session]);

  return (
    <Formik
      initialValues={{
        order_created: "",
        order_approved: "",
        order_paid: "",
        order_canceled: "",
        auto_invite: "",
      }}>
      {({...props}) => (
        <Form className="notifications--wrapper">
          {loading ? <Loader active={true}/> : <>
            <div className="notifications">
            <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
                <h1>Emails de notificação</h1>
              </div>
              <Line />
              <div className="notifications--board">
                <div>
                  <p>Aprovação de pedido: informe os emails que receberão a notificação de pedido aguardando aprovação.</p>
                  <CreatableSelect
                    components={{
                      DropdownIndicator: null,
                    }}
                    onChange={(value, action) => handleChange(value, action, 'created')}
                    isClearable
                    isMulti
                    classNamePrefix="input__ReactSelect"
                    placeholder="Insira os Emails..."
                    options={state.created}
                    menuIsOpen={false}
                    onInputChange={(value) => handleInputChange(value, 'createdInputValue')}
                    onKeyDown={(event) => handleKeyDown(event, 'created', 'createdInputValue')}
                    inputValue={state.createdInputValue}
                    value={state.created}
                  />
                </div>
                <br/><br/><br/>
                <div>
                  <p>Pedido aprovado: informe os emails que receberão a notificação de pedido aprovado.</p>
                  <CreatableSelect
                    components={{
                      DropdownIndicator: null,
                    }}
                    onChange={(value, action) => handleChange(value, action, 'approved')}
                    isClearable
                    isMulti
                    classNamePrefix="input__ReactSelect"
                    placeholder="Insira os Emails..."
                    options={state.approved}
                    menuIsOpen={false}
                    onInputChange={(value) => handleInputChange(value, 'approvedInputValue')}
                    onKeyDown={(event) => handleKeyDown(event, 'approved', 'approvedInputValue')}
                    inputValue={state.approvedInputValue}
                    value={state.approved}
                  />
                </div>
                <br/><br/><br/>
                <div>
                  <p>Pedido pago: informe os emails que receberão a notificação de pedido pago.</p>
                  <CreatableSelect
                    components={{
                      DropdownIndicator: null,
                    }}
                    onChange={(value, action) => handleChange(value, action, 'paid')}
                    isClearable
                    isMulti
                    classNamePrefix="input__ReactSelect"
                    placeholder="Insira os Emails..."
                    options={state.paid}
                    menuIsOpen={false}
                    onInputChange={(value) => handleInputChange(value, 'paidInputValue')}
                    onKeyDown={(event) => handleKeyDown(event, 'paid', 'paidInputValue')}
                    inputValue={state.paidInputValue}
                    value={state.paid}
                  />
                </div>
                <br/><br/><br/>
                <div>
                  <p>Pedido cancelado: informe os emails que receberão a notificação de pedido cancelado.</p>
                  <CreatableSelect
                    components={{
                      DropdownIndicator: null,
                    }}
                    onChange={(value, action) => handleChange(value, action, 'canceled')}
                    isClearable
                    isMulti
                    classNamePrefix="input__ReactSelect"
                    placeholder="Insira os Emails..."
                    options={state.canceled}
                    menuIsOpen={false}
                    onInputChange={(value) => handleInputChange(value, 'canceledInputValue')}
                    onKeyDown={(event) => handleKeyDown(event, 'canceled', 'canceledInputValue')}
                    inputValue={state.canceledInputValue}
                    value={state.canceled}
                  />
                </div>
                <br/><br/><br/>
                <div>
                  <p>Auto convite: informe os emails que receberão a notificação de leads.</p>
                  <CreatableSelect
                    components={{
                      DropdownIndicator: null,
                    }}
                    onChange={(value, action) => handleChange(value, action, 'autoInvite')}
                    isClearable
                    isMulti
                    classNamePrefix="input__ReactSelect"
                    placeholder="Insira os Emails..."
                    options={state.autoInvite}
                    menuIsOpen={false}
                    onInputChange={(value) => handleInputChange(value, 'autoInviteInputValue')}
                    onKeyDown={(event) => handleKeyDown(event, 'autoInvite', 'autoInviteInputValue')}
                    inputValue={state.autoInviteInputValue}
                    value={state.autoInvite}
                  />
                </div>
              </div>
              <div
                style={{
                  display: compareObjects() ? 'none' : "block"
                }}
                className="boxFooterButton"
              >
                <div className="footerButton">
                  <p>Você realizou alterações.</p>
                  <Button
                    primary
                    className="btFullWidth"
                    onClick={() => handleSave()}
                    disabled={false}
                    text="SALVAR ALTERAÇÕES"
                    type="button"
                  />
                </div>
              </div>
            </div>
          </>}
        </Form>
      )}
    </Formik>
  );
}

export {Notifications};
