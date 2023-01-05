import React, { useState, useEffect, useContext } from "react";

import {
  ContentBoard,
  BlankCard,
  Icons,
  Row,
  Col,
  Breadcrumbs,
  Line, SimpleTag,
  InputText,
  RadioButton,
  InputTextarea,
  UploadThumbnail,
  Button,
  Alert,
  Modal,
  AlertButton,
  InnerEdgeButton,
} from "../../../components";
import { useHistory } from 'react-router-dom';
import AsyncSelect from "react-select/async";
import Select from 'react-select';
import { useGetStateList } from "../../../hooks-api/useLocals";
import { useChannel } from "../../../gqlEndpoints/queries/";
import _ from 'lodash';
import VMasker from 'vanilla-masker';
import Channel from "../CouponMechanics/Channel";

import "../style.scss";
import { CouponContext } from '../../../contexts/Coupon.ctx';

const CouponAudiences = () => {
  const { setCouponAudience, couponState, setCoupons, } = useContext(CouponContext);
  let audience = couponState?.couponAudiences;
  let stateMechanics = couponState?.couponMechanics;
  const [stateOptions, setStateOptions] = useState([]);

  const [selectedSegments, setSlectedSegments] = useState(audience?.audience || 'SPREADSHEET');
  const [segmentType, setSegmentType] = useState(audience?.segment_type || "");
  const [recipient, setRecipient] = useState(audience?.recipient || 'CUSTOMER');
  const [channel, setChannel] = useState(audience?.channel || 'ANY');
  const [minOrder, setMinOrder] = useState(audience?.order_min_amount > 0);
  const [maxDiscount, setMaxDiscount] = useState(couponState?.couponMechanics?.type_value === "PRICE" ? false : audience?.max_discount_amount > 0);
  const [maxUtils, setMaxUtils] = useState(audience?.usage_limit > 0);
  const [maxUtilsClient, setMaxUtilsClient] = useState(audience?.limit_person_usage > 0);
  const [minOrderValue, setMinOrderValue] = useState(audience?.order_min_amount || 0);
  const [maxDiscountValue, setMaxDiscountValue] = useState(audience?.max_discount_amount || 0);
  const [maxUtilsValue, setMaxUtilsValue] = useState(audience?.usage_limit || 1);
  const [maxUtilsClientValue, setMaxUtilsClientValue] = useState(audience?.limit_person_usage || 1);
  const [push, setPush] = useState(audience?.send_push || false);
  const [pushTitle, setPushTitle] = useState(audience?.push_title || '');
  const [email_subject, setEmail_subject] = useState(audience?.email_subject || '');
  const [email, setEmail] = useState(audience?.send_email || false);
  const [selectedFile, setSelectedFile] = useState(audience?.file || null);
  const [list_name, setList_name] = useState(audience?.list_name || null);
  const [statesSelected, setStatesSelected] = useState(audience?.audience  === 'SPREADSHEET' ? [] : audience?.audiences || []);

  //const [statesSelected, setStatesSelected] = useState(audience?.audiences || []);
  // const [emailsSelected, setEmailsSelected] = useState(audience?.audiences || []);
  // const [statesSelected, setStatesSelected] = useState([]);
  const [emailsSelected, setEmailsSelected] = useState([]);
  const [toggle, setToggle] = useState(false);
  const published = stateMechanics?.status === 'published' || stateMechanics?.published_at;


  console.log('#############', audience);
  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const history = useHistory();
  let fileRef = React.createRef();

  const { data: stateList, loading: loadingStates } = useGetStateList();

  const {
    loadChannel,
    channel: channelResult,
    channelCustomers,
    loadCustomers
  } = useChannel();

  // const typeSegments = [
  //   {
  //     label: 'Grupo fechado',
  //     value: 'STATE_LIST'
  //   },
  //   {
  //     label: 'Lista personalizada',
  //     value: "SPREADSHEET"
  //   },
  //   {
  //     label: 'Seleção individual',
  //     value: 'EMAIL_LIST'
  //   }
  // ]

  const typeSegments = [
    {
      label: 'Lista personalizada',
      value: "SPREADSHEET"
    },
    {
      label: 'Grupo fechado',
      value: 'STATE_LIST'
    },
  ]

  useEffect(() => {
    let stateValues = []
    if (!loadingStates) {
      stateValues = stateList.stateList.map(state => {
        return {
          label: `${state?.uf_nome} - ${state?.uf_sigla}`,
          value: state
        }
      })
      setStateOptions(stateValues)
    }
  }, [loadingStates, stateList]);

  const loadOptions = async (inputValue, callback) => {
    let options = [];
    options = await loadChannel({ first: 50, page: 1, searchText: inputValue });

    let filtered = channelResult.map(item => {
      return { value: item, label: item?.user?.email }
    })
    callback(filtered);

  };

  const loadOptionsCustomers = async (inputValue, callback) => {
    let options = [];
    options = await loadCustomers({ first: 50, page: 1, searchText: inputValue });

    let filtered = channelCustomers.map(item => {
      return { value: item, label: item?.email }
    })
    console.log('filtered', filtered)
    callback(filtered);

  };

  const handleEmailsSelect = (value, action) => {
    if (recipient === 'CUSTOMER') {
      setEmailsSelected([...emailsSelected, value?.value?.email]);
      setCouponAudience('email_list', [...emailsSelected, value?.value?.email]);
    } else {
      setEmailsSelected([...emailsSelected, value?.value?.user?.email]);
      setCouponAudience('email_list', [...emailsSelected, value?.value?.user?.email]);
    }
  };

  const handleSelectSegments = segment => {

    if (segment !== 'STATE_LIST') {
      setSlectedSegments(segment);
      setCouponAudience('audience', segment);
      setStatesSelected([]);
      setSegmentType(null);
      setEmailsSelected([]);
    } else {
      setEmailsSelected([]);
      setStatesSelected([]);
      setSlectedSegments(segment);
      setCouponAudience('audience', segment);
      setSegmentType(null)
    }
  }

  const handleSelectState = state => {
    setStatesSelected([...statesSelected, state?.uf_sigla]);
    setCouponAudience('locations', [...statesSelected, state?.uf_sigla]);
  }

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
    setCouponAudience('list_name', event.target.files[0]?.name);
    setList_name(event.target.files[0]?.name)
  };

  const removeCharactersAndParseInt = value => {
    let removeStr = value.replace(/[^Z0-9]/g, '');
    let number = parseInt(removeStr, 10);

    if (!number) {
      number = 0
    }
    return number;
  }

  const handleChannel = (value) => {
    setChannel(value);
    setCouponAudience('channel', value);
  }

  const save = () => {

    if (selectedSegments === "STATE_LIST" && !segmentType) {
      return (
        setAlert({
          status: true,
          message: 'Escolha um segmento',
          type: "error"
        })
      )
    }

    if (selectedSegments === "EMAIL_LIST" && emailsSelected.length < 1) {
      return (
        setAlert({
          status: true,
          message: 'Selecione um email',
          type: "error"
        })
      )
    }
    if (maxUtils && maxUtilsClient && maxUtilsValue < maxUtilsClientValue) {
      return (
        setAlert({
          status: true,
          message: 'Máximo de uso do cliente maior que máximo de uso do cupom!',
          type: "error"
        })
      )
    }

    if (selectedSegments === "SPREADSHEET" && !list_name) {
      return (
        setAlert({
          status: true,
          message: 'Escolha a lista.',
          type: "error"
        })
      )
    }

    if (couponState?.couponMechanics?.type_value === "PRICE" && couponState?.couponMechanics?.value < maxDiscountValue) {
      return (
        setAlert({
          status: true,
          message: 'Máximo de desconto, maior que valor do cupom',
          type: "error"
        })
      )
    }

    let audienceSaved = {
      recipient: recipient,
      audience: selectedSegments,
      audiences: selectedSegments === 'STATE_LIST' ? statesSelected : selectedSegments === 'EMAIL_LIST' ? emailsSelected : [],
      send_push: push,
      send_email: email,
      push_title: push ? pushTitle : '',
      push_text: push ? audience?.push_text : '',
      image_layout: audience?.image_layout,
      first_purchase: segmentType === 'FIRST_PURCHASE',
      first_sale: segmentType === 'STARTS',
      usage_limit: maxUtils ? maxUtilsValue : null,
      order_min_amount: minOrder ? minOrderValue : null,
      limit_person_usage: maxUtilsClient ? maxUtilsClientValue : null,
      max_discount_amount: maxDiscount ? maxDiscountValue : null,
      file: selectedFile,
      list_name: list_name,
      segment_type: selectedSegments === "SPREADSHEET" ? "SPREADSHEET" : segmentType,
      email_subject: email_subject || '',
      channel: channel
    }
    setCoupons({ ...couponState, couponAudiences: { ...audience, ...audienceSaved }, audienceSaved });
    //setCoupons({ ...couponState, audienceSaved });

    history.replace({ pathname: "/shop/cupom" })
  }

  return (
    <div className="createNewCoupon">
      <Modal className="createNewCoupon" visible={toggle} onClose={() => setToggle(!toggle)} >
        <div className="df alic jc-c createNewCoupon__modalTitle">
          <h3 >Tem certeza que deseja <br /> voltar?</h3>
        </div>
        <div className="df fdc alic jc-c">
          <span className="createNewCoupon__modalTitle">
            Caso tenha editado algum dado, salve as alterações <br />
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
                history.replace({ pathname: "/shop/cupom" })
              }}
            >
              Ok! Voltar.
            </Button>
          </div>
        </div>
      </Modal>
      <Breadcrumbs itens={["Shop", "Cupons", "Criar novo", "Público"]} />
      <Line />
      <ContentBoard
        title="Público"
        previousPath="/shop/cupom"
        className="contentMaxWidthUsage "
        loading={false}
        showAlert={() => !published ? setToggle(true) : history.replace({ pathname: `/shop/cupom${stateMechanics?.external_id ? '/' + stateMechanics?.external_id : ''}` })}

      >
        <div>
          <div className="df fdr alic mBottom30">
            <BlankCard className="cardStep contentMinWidthUsage" onClick={() => { }}>
              <div className="df fdc  cardStep__channel">
                <span className="cardStep__content padding10 paddingAll">Beneficiário</span>
                <div className="df jc-sb">
                  <div className="df alic jc-sb">
                    <RadioButton
                      autoFocus={true}
                      type="radio"
                      checked={recipient === 'CUSTOMER'}
                      value={10}
                      onChoose={published ? () => { } : (e) => { setRecipient('CUSTOMER'); setCouponAudience('recipient', 'CUSTOMER'); setStatesSelected([]); setEmailsSelected([]) }}
                      classes="comissionTable--checkbox"
                    />
                    <span className="cardStep__content">Cliente</span>
                  </div>
                  <div className="df alic jc-sb">
                    <RadioButton
                      type="radio"
                      disabled={['FIRST_PURCHASE'].includes(segmentType)}
                      checked={recipient === 'AMBASSADOR'}
                      value={10}
                      onChoose={published ? () => { } : (e) => { setRecipient('AMBASSADOR'); setCouponAudience('recipient', 'AMBASSADOR'); setEmailsSelected([]); handleChannel('OFFICE') }}
                      classes="comissionTable--checkbox"
                    />
                    <span className="cardStep__content">Embaixador</span>
                  </div>
                </div>
              </div>
            </BlankCard>
          </div>
          <div className="df fdr alic mBottom30">
            <Channel recipient={recipient} published={published} channel={channel} setChannel={handleChannel} />
          </div>
          <div className="df fdr alic mBottom30">
            <BlankCard className="cardStep alis contentMinWidthUsage" onClick={() => { }}>
              <div className="df fdc alis  cardStep__date">
                <span className="cardStep__content padding10 paddinBottom">Segmentação</span>
                <div className="input_wrapper  padding40  mBottom20 paddingRight" style={{ width: '100%' }}>
                  <Select
                    onChange={(value) => {
                      handleSelectSegments(value.value);
                    }}
                    isDisabled={published}
                    isSearchable={false}
                    classNamePrefix="top__select2--Select"
                    options={typeSegments}
                    placeholder={selectedSegments === 'STATE_LIST' ? "Grupo fechado" : selectedSegments === 'EMAIL_LIST' ? 'Seleção individual' : 'Lista personalizada'}
                  />
                </div>
                <div hidden={selectedSegments !== "SPREADSHEET"}>
                  <div className="cardStep__boxFile">
                    <input accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ display: "none" }} ref={fileRef} type="file" onChange={e => onFileChange(e)} />
                    <div className="cardStep__boxFile-content">
                      <span className="cardStep__content padding10 paddinBottom">{list_name ? list_name : 'Selecione um arquivo.xlsx'}</span>
                      <Button
                        primary
                        onClick={published ? () => { } : () => {
                          fileRef.current.click();
                        }}
                        type="button"
                      >
                        <>{list_name ? "TROCAR" : "ADICIONAR"}</>
                      </Button>
                    </div>
                  </div>

                </div>

                <div hidden={selectedSegments !== 'STATE_LIST'}>
                  <div className="df fdc jc-sb">
                    <div className="df alic jc-s">
                      <RadioButton
                        type="radio"
                        checked={segmentType === 'FIRST_PURCHASE'}
                        value={10}
                        onChoose={async (e) => {
                          setSegmentType('FIRST_PURCHASE');
                          setRecipient('CUSTOMER');
                          await setCouponAudience('segment_type', 'FIRST_PURCHASE')
                        }
                        }
                        classes="comissionTable--checkbox"
                      />
                      <span className="cardStep__content">Primeira compra (apenas clientes)</span>
                    </div>
                    <div className="df alic jc-s">
                      <RadioButton
                        type="radio"
                        checked={segmentType === 'ACTIVE'}
                        value={10}
                        onChoose={(e) => { setSegmentType('ACTIVE'); setCouponAudience('segment_type', 'ACTIVE') }}
                        classes="comissionTable--checkbox"
                      />
                      <span className="cardStep__content">Ativos</span>
                    </div>

                    <div className="df alic jc-s">
                      <RadioButton
                        type="radio"
                        checked={segmentType === 'INACTIVE'}
                        value={10}
                        onChoose={async (e) => { setSegmentType('INACTIVE'); await setCouponAudience('segment_type', 'INACTIVE') }}
                        classes="comissionTable--checkbox"
                      />
                      <span className="cardStep__content">Inativos</span>
                    </div>
                    {/* <div className="df alic jc-s">
                      <RadioButton
                        type="radio"
                        checked={segmentType === 'STARTS'}
                        value={10}
                        onChoose={(e) => { setSegmentType('STARTS'); setCouponAudience('segment_type', 'STARTS') }}
                        classes="comissionTable--checkbox"
                      />
                      <span className="cardStep__content">Inícios (cadastrados no mês corrente)</span>
                    </div> */}
                  </div>
                </div>
              </div>
              <div hidden={selectedSegments === "SPREADSHEET" || selectedSegments === 'STATE_LIST'}>
                <div className="df fdc jc-start alis cardStep__date">
                  <span className="cardStep__content mBottom10 ">Email</span>
                  <div className="input_wrapper  padding40  mBottom20 paddingRight" style={{ width: '100%' }}>
                    <AsyncSelect
                      defaultOptions
                      value={{
                        value: emailsSelected,
                        label: "Email"
                      }}

                      loadOptions={recipient === 'CUSTOMER' ? loadOptionsCustomers : loadOptions}
                      placeholder="Selecione..."
                      noOptionsMessage={() =>
                        "Para buscar, digite pelo menos, 3 caracteres"
                      }
                      loadingMessage={() => "Pesquisando..."}
                      onChange={(value, action) => handleEmailsSelect(value)
                      }
                    />
                  </div>
                  <BlankCard>
                    <div className="df fdc jc-center alis padding10 paddingAll cardStep__tags">
                      <Row>
                        <Col>
                          {
                            emailsSelected.map((email, index) => {
                              return (
                                <SimpleTag
                                  key={`keyTag${index}`}
                                  color="#b2b2b3"
                                  icon={
                                    <Icons.closeSmall
                                      fill="#FFF"
                                      onClick={() => {
                                        emailsSelected.splice(_.indexOf(emailsSelected, email), 1);
                                        setEmailsSelected([...emailsSelected]);
                                        setCouponAudience('email_list', [...emailsSelected]);
                                      }}
                                    />
                                  }
                                >
                                  <span className="small">{email}</span>
                                </SimpleTag>
                              )
                            })
                          }
                        </Col>
                      </Row>
                    </div>
                  </BlankCard>
                </div>
              </div>
              <div style={{ display: (selectedSegments === 'STATE_LIST') ? "flex" : "none" }}>
                <div className="df fdc jc-start alis cardStep__date">
                  <span className="cardStep__content mBottom10 ">Estados</span>
                  <div className="input_wrapper  padding40  mBottom20 paddingRight" style={{ width: '100%' }}>
                    <Select
                      onChange={(value) => {
                        handleSelectState(value.value);
                      }}
                      isSearchable={true}
                      classNamePrefix="top__select2--Select"
                      options={stateOptions}
                      placeholder="Selecione um municipio"
                    //isDisabled={citysOptions?.length < 1 || loadingCitys}
                    />
                  </div>
                  <BlankCard>
                    <div className="df fdr jc-center alis padding10 paddingAll cardStep__tags">
                      <Row>
                        <Col>
                          {statesSelected.map((state, index) => {
                            return (
                              <SimpleTag
                                key={`keyTag${index}`}
                                color="#b2b2b3"
                                icon={
                                  <Icons.closeSmall
                                    fill="#FFF"
                                    onClick={() => {
                                      statesSelected.splice(_.indexOf(statesSelected, state), 1);
                                      setStatesSelected([...statesSelected]);
                                      setCouponAudience('locations', [...statesSelected])
                                    }}
                                  />
                                }
                              >
                                <span className="small">{state}</span>
                              </SimpleTag>
                            )
                          })
                          }
                        </Col>
                      </Row>
                    </div>
                  </BlankCard>
                </div>
              </div>
            </BlankCard>

          </div>
          <div className="df fdr alic mBottom30">
            <BlankCard className="cardStep alis contentMinWidthUsage">
              <div hidden={recipient === 'CUSTOMER'}>
                <span hidden={false} className="cardStep__content padding10">Notificação</span>
                <div className="df fdc alis  cardStep__date">

                  <div className="df fdc jc-sb cardStep__date">
                    <div className="df alic jc-s mBottom30">
                      <RadioButton
                        type="checkbox"
                        checked={push}
                        value={10}
                        onChoose={published ? () => { } : (e) => { setCouponAudience('send_push', !push); setPush(!push) }}
                        classes="comissionTable--checkbox"
                      />
                      <span className="cardStep__content">Push</span>
                    </div>
                    <div>
                      <InputText
                        readOnly={!push || published}
                        text={
                          <span>
                            Título
                          </span>
                        }
                        required
                        type="text"
                        onChange={e => {
                          setCouponAudience('push_title', e.target.value);
                          setPushTitle(e.target.value);
                        }}
                        value={pushTitle}
                        className="cardStep__input"
                      />
                    </div>
                    <div className="mBottom30">
                      <InputTextarea
                        readOnly={!push || published}
                        text={
                          <span className="cardStep__content padding10 paddinBottom">
                            Texto
                          </span>
                        }
                        name="notification"
                        onChange={e => setCouponAudience('push_text', e.target.value)}
                        style={{ height: 160 }}
                        value={audience?.push_text}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div hidden={false}>
                <span hidden={recipient !== 'CUSTOMER'} className="cardStep__content padding10">Notificação</span>
                <div className="df fdc jc-start alis cardStep__date">
                  <span className="cardStep__content mBottom20"></span>
                  <div className="df fdc jc-sb cardStep__date">
                    <div className="df alic mBottom30 jc-s">
                      <RadioButton
                        type="checkbox"
                        checked={email}
                        value={10}
                        onChoose={published ? () => { } : (e) => { setCouponAudience('send_email', !email); setEmail(!email) }}
                        classes="comissionTable--checkbox"
                      />
                      <span className="cardStep__content">Email</span>
                    </div>
                    <div>
                      <InputText
                        readOnly={!email || published}
                        text={
                          <span>
                            Assunto do email
                          </span>
                        }
                        required
                        type="text"
                        onChange={e => {
                          setCouponAudience('email_text', e.target.value);
                          setEmail_subject(e.target.value);
                        }}
                        value={email_subject}
                        className="cardStep__input"
                      />
                    </div>
                    <span className="cardStep__content padding10 paddinBottom">
                      Imagem (Lagura máxima: 600px e tamanho máximo: 2MB)
                    </span>
                    <div>
                      <UploadThumbnail
                        disabled={published}
                        url={audience?.email_layout || ''}
                        base64={false}
                        onChange={image => {
                          setCouponAudience('image_layout', image);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </BlankCard>
          </div>
          <div className="df fdr alic mBottom30">
            <BlankCard className="cardStep alis contentMinWidthUsage" onClick={() => { }}>
              <div className="df fdc alis  cardStep__channel">
                <span className="cardStep__content padding10 paddinBottom">Limites</span>
                <div className="df fdc jc-sb cardStep__channel">
                  <div className="df alic jc-start">
                    <RadioButton
                      type="checkbox"
                      checked={maxUtils}
                      value={10}
                      onChoose={published ? () => { } : (e) => setMaxUtils(!maxUtils)}
                      classes="comissionTable--checkbox"
                    />
                    <span className="cardStep__content">Nº máximo de utilizações</span>
                  </div>
                  <div className="df alic jc-start">
                    <RadioButton
                      type="checkbox"
                      checked={maxUtilsClient}
                      value={10}
                      onChoose={published ? () => { } : (e) => setMaxUtilsClient(!maxUtilsClient)}
                      classes="comissionTable--checkbox"
                    />
                    <span className="cardStep__content">Nº máximo de utilizações por beneficiário</span>
                  </div>
                  <div className="df alic jc-start">
                    <RadioButton
                      type="checkbox"
                      checked={minOrder}
                      value={10}
                      onChoose={published ? () => { } : (e) => setMinOrder(!minOrder)}
                      classes="comissionTable--checkbox"
                    />
                    <span className="cardStep__content">Valor mínimo do pedido</span>
                  </div>
                  {couponState?.couponMechanics?.type_value !== "PRICE" &&
                    <div className="df alic jc-start">
                      <RadioButton
                        type="checkbox"
                        checked={maxDiscount}
                        disabled={couponState?.couponMechanics?.type_value === "PRICE"}
                        value={10}
                        onChoose={published ? () => { } : (e) => setMaxDiscount(!maxDiscount)}
                        classes="comissionTable--checkbox"
                      />
                      <span className="cardStep__content">
                        Valor máximo desconto
                        (Válido para desconto %)
                      </span>
                    </div>
                  }
                </div>
              </div>
              <div className="df fdc jc-center alis padding10 paddingAll">
                <div className="df jc-sb cardStep__inputs">
                  <div className="cardStep__boxInputLeft">
                    <InputText
                      text={
                        <span>
                          Nº máximo de utilizações
                        </span>
                      }
                      name="name"
                      type="text"
                      required
                      readOnly={published}
                      value={maxUtils ? maxUtilsValue : ""}
                      onChange={published ? () => { } : e => {
                        setCouponAudience('usage_limit', removeCharactersAndParseInt(e.target.value));
                        setMaxUtilsValue(removeCharactersAndParseInt(e.target.value))
                      }}
                      className="cardStep__input"
                    />

                    <InputText
                      text={
                        <span>
                          Nº máximo de utilizações por beneficiário
                        </span>
                      }
                      name="name"
                      type="text"
                      required
                      readOnly={published}
                      value={maxUtilsClient ? maxUtilsClientValue : ''}
                      onChange={published ? () => { } : e => {
                        setCouponAudience('limit_person_usage', removeCharactersAndParseInt(e.target.value));
                        setMaxUtilsClientValue(removeCharactersAndParseInt(e.target.value))
                      }}
                      className="cardStep__input"
                    />
                  </div>
                  <div className="cardStep__boxInput">
                    <InputText
                      readOnly={published}
                      text={
                        <span>
                          Valor mínimo do pedido
                        </span>
                      }
                      required
                      type="text"
                      onChange={published ? () => { } : e => {
                        setCouponAudience('order_min_amount', removeCharactersAndParseInt(e.target.value));
                        setMinOrderValue(removeCharactersAndParseInt(e.target.value))
                      }}
                      value={minOrder ? `R$ ${VMasker.toMoney(minOrderValue)}` : ''}
                      className="cardStep__input"
                    />

                    {couponState?.couponMechanics?.type_value !== "PRICE" &&
                      <InputText
                        readOnly={published}
                        text={
                          <span>
                            Valor máximo desconto
                          </span>
                        }
                        type="text"
                        onChange={published ? () => { } : e => {
                          setCouponAudience('max_discount_amount', removeCharactersAndParseInt(e.target.value));
                          setMaxDiscountValue(removeCharactersAndParseInt(e.target.value))
                        }}
                        value={maxDiscount ? `R$ ${VMasker.toMoney(maxDiscountValue)}` : ''}
                        className="cardStep__input"
                        required
                      />}
                  </div>
                </div>
              </div>
            </BlankCard>
          </div>
          <div className="padding10 paddingAll mBottom30">

          </div>
        </div>

      </ContentBoard>
      {
        !published &&
        <Row className="createNewCommunication__actionButtons">
          <InnerEdgeButton success onClick={() => save()}>SALVAR E FECHAR</InnerEdgeButton>
        </Row>
      }
      <Alert show={alert.status} type={alert.type}>
        <div >{alert.message}</div>
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

    </div>
  );
}

export default CouponAudiences;
