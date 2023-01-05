import React, { useState, useContext, useEffect } from 'react';
import {
  Loader,
  ContentBoard,
  BlankCard,
  Icons, Row,
  Button, Breadcrumbs,
  Line, InputTextarea,
  Alert,
  AlertButton,
  Modal,
  FormField2
} from "../../components/";
import UsagesList from "./UsagesList";
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import { CouponContext } from "../../contexts/Coupon.ctx";
import { serviceFile } from "../../services/GraphQlRequest";
import moment from 'moment';
import TotalStorage from "total-storage";
import _ from 'lodash';
import "./style.scss";
import VMasker from 'vanilla-masker';

import {
  useGetCouponById,
  useUpdateCoupon,
  useCloseCoupon,
  usePublishCoupon,
  useSendCouponNotification
} from "../../hooks-api/useCoupon";

const FormValidation = Yup.object().shape({
  // title: Yup.string()
  //   .required("Preencha este campo"),
  // code: Yup.string()
  //   .required("Preencha este campo"),
  // // description: Yup.string()
  // //   .required('Preencha este campo'),
});

const UpdateOrCreateCoupon = props => {
  const { setFullyMechanics, couponState, setCoupons, setCouponAudience } = useContext(CouponContext);
  let fileRef = React.createRef();
  const [TENANT_LIST, TENANT_ID] = TotalStorage.get([
    "TENANT_LIST",
    "@Auth:tenant"
  ]);

  let isWine;

  if (TENANT_ID) {
    let activeTenant = _.findIndex(TENANT_LIST, {
      external_id: TENANT_ID,
    });
    isWine = TENANT_LIST[activeTenant];
  }

  const [sendNotification, { data: sendNotificationResult }] = useSendCouponNotification();
  const [closeCoupon, { data: closeCouponResult }] = useCloseCoupon();
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [validEmails, setValidEmails] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [modalSaveCoupon, setModalSaveCoupon] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [toggleUsages, handleToggleUsages] = useState(false);

  const [couponDatta, setCoupon] = useState({
    title: couponState?.couponAudiences?.title,
    description: couponState?.couponAudiences?.description,
    code: couponState?.couponAudiences?.code
  });
  const history = useHistory();
  let match = useRouteMatch("/shop/cupom/:id");
  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  const [updateCoupon] = useUpdateCoupon();
  const [publish, { loading: loadPublish, data: publishData }] = usePublishCoupon();
  const [published, setPublished] = useState(false);
  const [expired, setExpired] = useState(false);
  const [closed, setClosed] = useState(false);

  const {
    handleQuery: getCoupon,
    data: editingCoupon,
    loading: editingLoading
  } = useGetCouponById();


  async function handleSendNotification(external_id) {
    setLoading(true);
    await sendNotification({ variables: { external_id } });
    window.location.reload();
    setLoading(false);
  }

  useEffect(() => {
    if (publishData) {
      setModalSaveCoupon(true);
      setLoading(false);
      setModalDescription('Cupom publicado com sucesso.')
      setModalTitle('Publicado!')
    }
  }, [publishData]);

  const handlePublishCoupon = () => {
    setLoading(true)
    publish({ variables: { external_id: couponState?.couponSelected?.external_id, send_notifications: couponState?.audienceSaved?.send_push } })
  }

  async function handleCloseCoupon(external_id) {
    setLoading(true);
    await closeCoupon({ variables: { external_id } });
    window.location.reload();
    setLoading(false);
  }

  async function handleSave(values, plublished = false) {

    let audience = couponState?.audienceSaved;
    let mechanic = couponState?.mechanicsSaved;

    if (!values?.code && !couponState?.couponAudiences?.code) {
      return (
        setAlert({
          status: true,
          message: 'Inserir código',
          type: "error"
        })
      )
    }
    if (!values?.title && !couponState?.couponAudiences?.title) {
      return (
        setAlert({
          status: true,
          message: 'Inserir titulo',
          type: "error"
        })
      )
    }
    if (!values?.description && !couponState?.couponAudiences?.description) {
      return (
        setAlert({
          status: true,
          message: 'Inserir descrição',
          type: "error"
        })
      )
    }

    if (!mechanic) {
      return (
        setAlert({
          status: true,
          message: 'Selecione a mecânica do cupom',
          type: "error"
        })
      )
    }

    if (!audience) {
      return (
        setAlert({
          status: true,
          message: 'Selecione o público do cupom',
          type: "error"
        })
      )
    }

    // if (true) {
    //   console.log('audience',audience)
    //   return (console.log((audience?.segment_type === 'ACTIVE' || audience?.segment_type === 'INACTIVE')) )
    // }
    let coupon = {
      code: values?.code || couponState?.couponAudiences?.code,
      title: values?.title || couponState?.couponAudiences?.title,
      description: values?.description || couponState?.couponAudiences?.description,
      object_type: mechanic?.object_type.toUpperCase(),
      recipient: audience?.recipient,
      usage_limit: audience?.usage_limit,
      limit_person_usage: audience?.limit_person_usage,
      first_sale: audience?.first_sale,
      first_purchase: audience?.first_purchase,
      locations: mechanic?.locations.length > 0 ? mechanic?.locations : [],
      value: mechanic?.value,
      max_discount_amount: audience?.max_discount_amount,
      order_min_amount: audience?.order_min_amount,
      image_layout: audience?.image_layout,
      push_text: audience?.push_text,
      send_push: audience?.send_push,
      send_email: audience?.send_email,
      channel: audience?.channel,
      type_value: mechanic?.type_value,
      start_at: mechanic?.start_at,
      end_at: mechanic?.end_at,
      push_title: audience?.push_title,
      email_subject: audience?.email_subject
    };
    if (couponState?.couponSelected?.external_id) {
      coupon.external_id = couponState?.couponSelected?.external_id;
    }

    let audiences = [{
      //type: (audience?.segment_type === 'ACTIVE' || audience?.segment_type === 'INACTIVE') ? audience?.segment_type : audience?.audience,
      type: audience?.segment_type,
    }];

    if (audience?.segment_type !== 'SPREADSHEET') {
      audiences = [{
        //type: (audience?.segment_type === 'ACTIVE' || audience?.segment_type === 'INACTIVE') ? audience?.segment_type : audience?.audience,
        type: audience?.segment_type,
        audience: audience?.audiences ? audience?.audiences : [],
      }];
    }

    if (audience?.audience === 'SPREADSHEET' && !audience?.file) {
      audiences = null
    }

    // if (couponState?.couponSelected?.audiences[0]?.id) {
    //   audiences[0].id = couponState?.couponSelected?.audiences[0]?.id
    // }

    let objSave = mechanic?.objects.map(obj => { return { type: obj?.type.toUpperCase(), references: obj?.references } })


    //let object = [{type: mechanic?.objects[0]?.type.toUpperCase(), references: mechanic?.objects[0]?.references || null}]
    let object = objSave;

    console.log(' audiences' ,audiences)
    //return;
    setLoading(true);

    let result = updateCoupon({ variables: { coupon, audiences, object } }).then(response => {
      // console.log('mechanic?.object_type,',mechanic?.object_type);
      // console.log('response',response);

      if (audience?.audience === 'SPREADSHEET' && audience?.file) {
        console.log('audience', audience);
        let saved = response?.data?.updateCoupon
        serviceFile(audience?.file, saved?.external_id, saved?.audiences[0].id).then(result => {
          setLoading(false);
          setCoupons({ ...couponState, couponSelected: response.data.updateCoupon })
          setModalSaveCoupon(true);
          setModalDescription('Cupom salvo com sucesso.')
          setModalTitle('Salvo!')

        }).catch(err => {
          setLoading(false);
          return err
        })
      } else {
        setLoading(false);
        setCoupons({ ...couponState, couponSelected: response.data.updateCoupon });
        setModalSaveCoupon(true);
        setModalDescription('Cupom salvo com sucesso.')
        setModalTitle('Salvo!')
      }

    }).catch(err => {
      setAlert({
        status: true,
        message: 'Código do cupom deve ser único!!',
        type: "error"
      })
      setLoading(false);
    });

  }

  const handleReload = () => {
    if (modalTitle === 'Publicado!') {
      history.replace({ pathname: "/shop/cupons" })
    } else {
      history.replace({ pathname: `/shop/cupom/${couponState?.couponSelected.external_id}` });
      window.location.reload();
    }
  }

  const serializeToEditAudience = couponSelected => {

    let segment = couponSelected?.audiences[0]?.type?.toUpperCase();

    let audienceEdit = {
      ...couponSelected,
      audiences: Array.isArray(couponSelected?.audiences) ? JSON.parse(couponSelected?.audiences[0]?.audience) : [],
      audience: segment === "EMAIL_LIST" ? "EMAIL_LIST" : segment === "SPREADSHEET" ? "SPREADSHEET" : "STATE_LIST",
      segment_type: couponSelected?.first_purchase ? "FIRST_PURCHASE" : couponSelected?.audiences[0].type.toUpperCase(),
      recipient: couponSelected?.recipient.toUpperCase(),
      //channel:
    }

    setCoupons({
      ...couponState,
      couponAudiences: audienceEdit,
      audienceSaved: audienceEdit,
    })
  }

  useEffect(() => {
    let segment = couponState?.couponSelected?.audiences[0]?.type?.toUpperCase();

    if (Array.isArray(couponState?.couponSelected?.audiences) && segment === "SPREADSHEET" && couponState?.couponSelected?.audiences[0]?.failed_import) {
      if (couponState?.couponSelected?.recipient === "customer") {
        const customersList = JSON.parse(couponState?.couponSelected?.audiences[0]?.audience || []);
        const uniquesEmails = _.uniqBy(customersList, 'email');
        const getEmails = uniquesEmails.map(item => item?.email);
        setValidEmails(getEmails);
      } else {
        setValidEmails(JSON.parse(couponState?.couponSelected?.audiences[0]?.audience || []));
      }
      setInvalidEmails(JSON.parse(couponState?.couponSelected?.audiences[0]?.failed_import || []))
      //setCouponAudience('list_name', couponState?.couponSelected?.audiences[0]?.list_name)

      setCoupons({
        ...couponState,
        couponAudiences: { ...couponState?.couponAudiences, list_name: couponState?.couponSelected?.audiences[0]?.list_name },
        audienceSaved: { ...couponState?.audienceSaved, list_name: couponState?.couponSelected?.audiences[0]?.list_name }
      })
    }

  }, [couponState?.couponSelected]);

  useEffect(() => {
    if (couponState?.couponSelected && !couponState?.audienceSaved) {
      serializeToEditAudience(couponState?.couponSelected);
    }
  }, [couponState?.couponSelected]);

  useEffect(() => {
    setLoading(true);

    if (match && !couponState?.couponMechanics) {
      getCoupon(match?.params?.id);
    }

    if (!match && !couponState?.couponSelected || couponState?.couponMechanics) {
      setCoupon(couponState?.couponMechanics);
      setLoading(false);
    }

    if (editingCoupon) {
      const serializeCoupon = {
        ...editingCoupon?.coupon,
        locations: JSON.parse(editingCoupon?.coupon?.locations) || [],

      };
      //setFullyMechanics(serializeCoupon);
      setCoupon(serializeCoupon);
      setLoading(false);
      setCoupons({
        ...couponState,
        couponSelected: editingCoupon?.coupon,
        couponMechanics: serializeCoupon,
        mechanicsSaved: serializeCoupon
      })
    }

    if (couponState?.couponMechanics?.status === 'published' || couponState?.couponMechanics?.published_at) {
      setPublished(true);
    }

    if (couponState?.couponMechanics?.status === 'expired' || couponState?.couponMechanics?.expired_at) {
      setExpired(true);
    }

    if (couponState?.couponMechanics?.status === 'closed' || couponState?.couponMechanics?.closed_at) {
      setClosed(true);
    }

  }, [editingCoupon]);

  const handleSeguementType = () => {
    if (couponState?.audienceSaved?.segment_type) {
      let type = couponState?.audienceSaved?.segment_type;
      if (type === 'FIRST_PURCHASE') {
        return 'Primeira compra.'
      }
      if (type === 'ACTIVE') {
        return 'Ativos'
      }
      if (type === 'INACTIVE') {
        return 'Inativos'
      }
      if (type === 'STARTS') {
        return 'Inciantes no canal'
      }
      if (type === "SPREADSHEET") {
        return 'Lista personalizada.'
      }
    } else {
      let type = couponState?.audienceSaved?.audience
      if (type === "EMAIL_LIST") {
        return 'Lista de email.'
      }
      if (type === "SPREADSHEET") {
        return 'Lista personalizada.'
      }
    }
  }

  const handleObjType = () => {
    if (couponState?.mechanicsSaved?.object_type) {
      let type = couponState?.mechanicsSaved?.object_type;
      if (type === "COLLECTION") {
        return 'Coleções específicas.'
      }
      if (type === "ORDER_ITEM") {
        return 'Produtos específicos.'
      }
      if (type === "FREIGHT") {
        return 'Frete (Não considera o total)'
      }
      if (type === "ORDER") {
        return isWine?.id === '6' ? 'Total do Pedido' : 'Total do Pedido (Não considera o valor do frete)'
      }
    }
  }
  useEffect(() => {
    if (sendNotificationResult) {
      history.replace({ pathname: `/shop/cupom/${sendNotificationResult.data.updateCoupon.external_id}` });

      window.location.reload();
    }
  }, [sendNotificationResult]);

  const onFileChange = event => {
    setCoupons({
      ...couponState,
      couponAudiences: { ...couponState?.couponAudiences, list_name: event.target.files[0]?.name },
      audienceSaved: { ...couponState?.audienceSaved, file: event.target.files[0], list_name: event.target.files[0]?.name }
    })
  };

  if (loading || loadPublish) {
    return <Loader active={loading} />;
  }

  return toggleUsages === true ? (
    <UsagesList
      usages={couponState?.couponSelected?.usages}
      recipientType={couponState?.couponSelected?.recipient}
      setScreen={() => handleToggleUsages(!toggleUsages)}
    />
  ) : (

    <div className="createNewCoupon">

      <Modal className="createNewCoupon" visible={modalSaveCoupon} >
        <div className="df alic jc-c createNewCoupon__modalTitle">
          <h3>{modalTitle}</h3>
        </div>
        <div className="df fdc alic jc-c">
          <span className="createNewCoupon__modalTitle">
            {modalDescription}
          </span>
          <div className="mBottom20 mTop20">
            <Button
              success
              type="button"
              onClick={() => {
                handleReload()
              }}
            >
              Ok
            </Button>
          </div>
          {/* <div className="">
            <Button
                c
                type="button"
                onClick={() => {
                  history.replace({ pathname: "/shop/cupons" })
                }}
              >
              Ok! Voltar
            </Button>
          </div> */}
        </div>
      </Modal>

      <Modal className="createNewCoupon" visible={showAlert} onClose={() => setShowAlert(!showAlert)} >
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
                setShowAlert(!showAlert);
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
                history.replace({ pathname: "/shop/cupons" })
              }}
            >
              Ok! Voltar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal visible={toggle} onClose={() => setToggle(!toggle)} >
        <div className="df alic jc-c createNewCoupon__modalTitle">
          <span className="createNewCoupon__modalTitle">{`${validEmails?.length}/${validEmails?.length + invalidEmails?.length}`} Emails válidos</span>
        </div>
        <div className="df jc-e">
          <div className="df fdc mRight30 paddingAll">
            <span className="createNewCoupon__modalTitle"> Emails válidos</span>
            <div className="cardStep__content fdc ">
              {
                validEmails.map(email => { return (<><span> {email}</span><br /></>) })
              }
            </div>
          </div>
          <div className="df fdc  paddingAll">
            <span className="createNewCoupon__modalTitle"> Emails inválidos</span>
            <div className="cardStep__content fdc ">
              {
                invalidEmails.map(email => { return (<><span> {email}</span><br /></>) })
              }
            </div>
          </div>
        </div>
      </Modal>
      <Breadcrumbs itens={["Shop", "Cupons", "Criar novo"]} />
      <ContentBoard
        title="Criar novo cupom"
        previousPath="/shop/cupons"
        className="contentMaxWidth "
        loading={false}
        showAlert={() => !published ? setShowAlert(!showAlert) : history.replace({ pathname: `/shop/cupons` })}

      >
        <div className="cardStep__status">
          <span className="cardStep__content">
            Status: {`${couponState?.couponSelected?.closed_at ? 'Cancelado' : published ? 'Publicado' : 'Não publicado'}`}
            {couponState?.couponSelected?.published_at && <span className="cardStep__content"> em {moment(couponState?.couponSelected?.published_at).format('DD/MM/YYYY')}</span>}
          </span>
        </div>
        <br />

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
        <Line />
        <Formik
          initialValues={{ ...couponDatta }}
          validateOnChange
          validateOnBlur
          validationSchema={FormValidation}
          enableReinitialize={true}
          onSubmit={handleSave}
          validateOnMount={false}
        >
          {({ ...props }) => (<Form>
            {setCoupons}
            <div className="df fdr alic spacedInput">
              <FormField2
                text="Nome"
                required
                isRequired
                className="login_input"
                name="title"
                disabled={published || expired}
                onChange={e => {
                  props.setFieldValue('title', e.currentTarget.value); setCouponAudience('title', e.currentTarget.value);
                }}
              />

              <FormField2
                text="Código"
                required
                isRequired
                className="login_input"
                name="code"
                disabled={published || expired}
                onChange={e => {
                  props.setFieldValue('code', e.currentTarget.value); setCouponAudience('code', e.currentTarget.value);
                }}
              />
            </div>

            <div className="mBottom30">
              <InputTextarea
                disabled={published || expired}
                text={
                  <span>
                    Descrição<span style={{ color: "red" }}>*</span>
                  </span>
                }
                value={props?.values?.description}
                name="description"
                style={{ backgroundColor: published || expired ? 'transparent' : '' }}
                onChange={e => {
                  props.setFieldValue('description', e.currentTarget.value); setCouponAudience('description', e.currentTarget.value)
                }}
              />
            </div>

            {couponState?.couponSelected?.audiences.length > 0
              && couponState?.couponSelected?.audiences[0].type === "spreadsheet"
              &&
              <BlankCard className="cardStep cardStep__list" >
                <div className="cardStep__modalList" onClick={() => setToggle(!toggle)}>
                  {!couponState?.audienceSaved?.file &&
                    <span className="cardStep__content">
                      Lista de emails: {validEmails?.length}/{validEmails?.length + invalidEmails?.length} Emails válidos
                    </span>
                  }
                  <span className="cardStep__content">
                    {couponState?.audienceSaved?.file?.name || couponState?.audienceSaved?.list_name}
                  </span>
                </div>
                {couponState?.couponSelected?.audiences[0].type === "spreadsheet"
                  //&& couponState?.audienceSaved?.file
                  && !published
                  &&
                  <div onClick={() => fileRef.current.click()} className={`cardStep__newList  ${!published ? 'cursorPointer' : ''}`}>
                    <input
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      style={{ display: "none" }}
                      ref={fileRef}
                      type="file"
                      onChange={e => onFileChange(e)}
                    />
                    {couponState?.audienceSaved?.file ? 'Trocar' : 'Nova lista'}
                  </div>
                }
              </BlankCard>
            }
            {/* {published &&
              <BlankCard
                className="cardStep cardStep__list"
                onClick={() => handleToggleUsages(!toggleUsages)}
                style={{
                  cursor: "pointer",

                }}
              >
                <div className="cardStep__header--title"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    lineHeight: "100%",
                    alignItems: "center"
                  }}>
                  Lista de beneficiários
                </div>
                <div style={{
                  cursor: "pointer",
                  display: "flex",
                  lineHeight: "100%",
                  alignItems: "center"
                }}>
                  <Icons.next />
                </div>
              </BlankCard>} */}

            <BlankCard className={`cardStep cursorPointer`} onClick={() => {
              history.replace({ pathname: "/shop/cupom/mecanica" })
            }}>
              <div>
                <div className="df fdr alic cardStep__header">
                  {published ? (
                    <Icons.circleCheck border='' fill='' className="cardStep__header--icon" />
                  ) : (
                    <Icons.circleCheck border={couponState?.mechanicsSaved ? '' : "#e5e5e6"} fill={couponState?.mechanicsSaved ? '' : "transparent"} className="cardStep__header--icon" />
                  )}
                  <span className="cardStep__header--title">Mecânica</span>
                </div>
                {couponState?.mechanicsSaved ?
                  <div className="cardStep__content">
                    Vigência: {`${moment(couponState?.mechanicsSaved?.start_at).format('DD/MM/YYYY')} - ${moment(couponState?.mechanicsSaved?.end_at).format('DD/MM/YYYY')}`}<br />
                    Praça de aplicação: {Array.isArray(couponState?.mechanicsSaved?.locations) && couponState?.mechanicsSaved?.locations.length > 0 ? 'Estados selecionados' : 'Todo Brasil'}<br />
                    Objeto: {handleObjType()}<br />
                    Tipo de desconto: {couponState?.mechanicsSaved?.type_value === "PERCENTAGE" ? `Porcentagem (${couponState?.mechanicsSaved?.value / 100}%)` : `Valor (R$${VMasker.toMoney(couponState?.mechanicsSaved?.value)})`}<br />
                  </div>
                  :
                  <div className="cardStep__content">
                    Você ainda não definiu a mecânica da sua campanha.<br />
                    Clique para começar.
                  </div>
                }
              </div>
              {(!published && !expired) && <Icons.next />}
            </BlankCard>

            <BlankCard className={`cardStep cursorPointer`} onClick={() => {
              history.replace({ pathname: "/shop/cupom/publico" })
            }}>
              <div>
                <div className="df fdr alic cardStep__header">
                  {published ? (
                    <Icons.circleCheck border='' fill='' className="cardStep__header--icon" />
                  ) : (
                    <Icons.circleCheck border={couponState?.audienceSaved ? '' : "#e5e5e6"} fill={couponState?.audienceSaved ? '' : "transparent"} className="cardStep__header--icon" />
                  )}
                  <span className="cardStep__header--title">Público</span>
                </div>
                {couponState?.audienceSaved ?
                  <div className="cardStep__content">
                    Beneficiário: {couponState?.audienceSaved?.recipient === "AMBASSADOR" ? 'Embaixador' : 'Clientes'}<br />
                    Segmentação: {handleSeguementType()}<br />
                    Canal: {couponState?.audienceSaved?.channel === "OFFICE" ? 'Aplicativo' : couponState?.audienceSaved?.channel === 'STORE' ? 'Lojinha' : 'APP + Lojinha'}<br />
                    Notificação: {couponState?.audienceSaved?.send_email && couponState?.audienceSaved?.send_push
                      ? 'Email e Push'
                      : couponState?.audienceSaved?.send_push
                        ? "Push"
                        : couponState?.audienceSaved?.send_email
                          ? 'Email'
                          :
                          'Sem notificações'}<br />
                    {couponState?.audienceSaved?.usage_limit > 0 ?
                      <>Limites: Nº máximo de utilizações ({couponState?.audienceSaved?.usage_limit})<br /></>
                      : ''
                    }
                    {couponState?.audienceSaved?.limit_person_usage > 0 ?
                      <>Limites: Nº máximo de utilizações por Beneficiário ({couponState?.audienceSaved?.limit_person_usage})<br /></>
                      : ''
                    }
                    {couponState?.audienceSaved?.order_min_amount > 0 ?
                      <>Valor mínimo do pedido: R$ {VMasker.toMoney(couponState?.audienceSaved?.order_min_amount)}<br /></>
                      : ''
                    }
                    {couponState?.audienceSaved?.max_discount_amount > 0 ?
                      <>Valor máximo do desconto: R$ {VMasker.toMoney(couponState?.audienceSaved?.max_discount_amount)}<br /></>
                      : ''
                    }
                  </div>
                  :
                  <div className="cardStep__content">
                    Você ainda não definiu o público da sua campanha.<br />
                    Clique para começar.
                  </div>
                }
              </div>
              {(!published && !expired && !closed) && <Icons.next />}
            </BlankCard>

            {(!expired && !closed) && <div>
              {!published &&
                <Row className="couponFormButtons">
                  <Button disabled={!couponState?.couponSelected?.external_id} onClick={() => handlePublishCoupon()} primary type="button">
                    Publicar
                  </Button>
                  <Button success type="submit">Salvar</Button>
                </Row>
              }
              {published &&
                <Row className="couponFormButtons">
                  <Button
                    cancel
                    type="button"
                    onClick={() => {
                      handleCloseCoupon(couponState?.couponSelected?.external_id);
                    }}
                  >
                    Cancelar cupom
                  </Button>
                  {(couponState?.audienceSaved?.send_email || couponState?.audienceSaved?.send_push) &&
                    <Button
                      primary
                      type="button"
                      onClick={() => {
                        handleSendNotification(couponState?.couponSelected?.external_id);
                      }}
                    >
                      Reenviar notificações
                    </Button>
                  }
                </Row>
              }
            </div>}

          </Form>)}</Formik>
      </ContentBoard>
    </div>
  );
}

export default UpdateOrCreateCoupon;
