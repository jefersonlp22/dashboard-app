import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { PhotoshopPicker } from "react-color";

import {
  InputText,
  Icons,
  Button,
  Loader,
  MobilePreview,
  UploadImage,
  Alert,
  AlertButton,
  Line
} from "../../../components";

import useForm from "../../../customHooks/useForm";

import logo from "../../../assets/images/logo-1@3x.png";
import { useUpdateTenantMe } from "../../../gqlEndpoints/mutations";
import { useMe } from "../../../gqlEndpoints/queries";

import { SessionContext } from '../../../contexts/Session.ctx';

import TotalStorage from "total-storage";

import "./style.scss";


const LayoutApp = ({ className }) => {

  const { Session } = useContext(SessionContext);

  const [togglePreview, setTogglePreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const { updateLayoutApp } = useUpdateTenantMe();
  const [changeImage, setChangeImage] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [showColorPrimary, setShowColorPrimary] = useState(false);
  const [showColorSecondary, setShowColorSecondary] = useState(false);
  const [change, ] = useState(false);
  const [validCNPJ, ] = useState(true);

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });
  const { getMe } = useMe();
  const [tenants, setTenants] = useState(null);

  const data = {
    primaryColor: "",
    secondaryColor: "",
    image: "",
    name: "",
  };
  const { handleValueChange, inputs } = useForm(data);

  useEffect(() => {
    setLoading(true);

    if(Session){
      let tenantCurrent = _.cloneDeep(Session.tenant.current);
      setTenants(Session.tenant.current);
      inputs.name = tenantCurrent.name ? tenantCurrent.name : "";

      inputs.secondaryColor =
        secondaryColor !== "" ? secondaryColor : tenantCurrent.data.color.secondary;

        inputs.primaryColor =
        primaryColor !== "" ? primaryColor : tenantCurrent.data.color.primary;
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Session]);

  useEffect(() => {
    if (primaryColor) {
      inputs.primaryColor = primaryColor;
    }
  }, [inputs.primaryColor, primaryColor]);


  useEffect(() => {
    if (secondaryColor) {
      inputs.secondaryColor = secondaryColor;
    }
  }, [inputs.secondaryColor, secondaryColor]);

  async function handleSave() {
    setLoading(true);

    if (inputs.name !== "") {
      let saved = await updateLayoutApp(inputs);
      if (saved) {
        inputs.change = false;

        let userMe = await getMe();
        if (userMe) {
          TotalStorage.set("TENANT_LIST", userMe.tenants);

          document.location.reload(true);
        }
      }
    } else {
      setLoading(false);
    }
  }


  if (loading) {
    return <Loader active={loading} />;
  }

  return (
    <div>
      <Alert show={((inputs.change || changeImage || change) && validCNPJ === false)|| alert.status} type={alert.type}>
        <div>{alert.message}</div>
        <div>
          <AlertButton
            onClick={() =>
              setAlert({
                status: false,
                message: alert.message || 'Mensagem de erro não definida',
                type: "error"
              })
            }
          >
            Fechar
          </AlertButton>
        </div>
      </Alert>


      <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
        <h1>Design do aplicativo</h1>
      </div>
      <Line />

      <div className="yourBrand__wrapper df fdc">
        <div className="content__config__yourBrand df fdr">
          <div className="content__config__yourBrand--configs df fdc">
            <div className="df fdr">
              <div className="configMark__wrapper--configs__logotipo">
                <UploadImage
                  url={
                    inputs.image
                      ? inputs.image
                      : tenants
                      ? tenants.picture_url
                      : null || logo
                  }
                  name="image"
                  onChange={image => {
                    setChangeImage(true);
                    inputs.image = image;
                    inputs.newImage = image;
                  }}
                  buttonText={{
                    btChange: "Trocar Imagem",
                    btDefault: "Adicionar Imagem"
                  }}
                />
              </div>
              <div className="configMark__wrapper--configs__markName">
                <InputText
                  text="Nome da sua marca"
                  name="name"
                  value={inputs.name}
                  onChange={e => handleValueChange(e)}
                  required
                />
                <span>
                  O nome da sua marca aparece em diversos espaços em nossas
                  plataformas. Preencha com carinho.
                </span>
              </div>
            </div>

            <div className="df fdr">
              <div
                onClick={() => setShowColorPrimary(!showColorPrimary)}
                className="configMark__wrapper--configs__colorCol"
              >
                <h2>Cor primária</h2>
                <label className="inputColor">
                  <div className="df fdr alic">
                    <div
                      style={{ backgroundColor: inputs.primaryColor }}
                      className="input"
                    ></div>
                    {inputs.primaryColor}
                  </div>
                  <Icons.arrowDown />
                </label>
              </div>

              <div
                onClick={() => setShowColorSecondary(!showColorSecondary)}
                className="configMark__wrapper--configs__colorCol"
              >
                <h2>Cor secundária</h2>
                <label className="inputColor">
                  <div className="df fdr alic">
                    <div
                      style={{ backgroundColor: inputs.secondaryColor }}
                      className="input"
                    ></div>
                    {inputs.secondaryColor}
                  </div>
                  <Icons.arrowDown />
                </label>
              </div>
            </div>
            <div className="df fdr alic">
              <Icons.brilho
                fill="#d9d9d9"
                className="configMark__wrapper--configs__iconBrilho"
              />
              <div className="configMark__wrapper--configs__textBrilho">
                Evite cores muito claras para não prejudicar a leitura sobre
                fundos brancos. Use o painel ao lado para pré-visualizar.
              </div>
            </div>
          </div>
          <div className="configMark__wrapper--phonePreview">
            <MobilePreview
              className="mobileFrame"
              toggle={togglePreview}
              primary={inputs.primaryColor}
              secondary={inputs.secondaryColor}
            />
          </div>
        </div>
        <div style={{ display: showColorPrimary ? null : "none" }}>
          <div className="box__select-color--primay">
            <div
              className="select-color"
              onClick={() => setShowColorPrimary(!showColorPrimary)}
            />
            <PhotoshopPicker
              header="Escolha a cor primária"
              name="primaryColor"
              onAccept={() => setShowColorPrimary(!showColorPrimary)}
              onCancel={() => setShowColorPrimary(!showColorPrimary)}
              color={primaryColor}
              onChange={color => {
                setTogglePreview(true);
                inputs.change = true;
                setPrimaryColor(color.hex);
              }}
            />
          </div>
        </div>
        <div style={{ display: showColorSecondary ? null : "none" }}>
          <div className="box__select-color--secondary">
            <div
              className="select-color"
              onClick={() => setShowColorPrimary(!showColorPrimary)}
            />
            <PhotoshopPicker
              header="Escolha a cor secundária"
              name="secondaryColor"
              onAccept={() => setShowColorSecondary(!showColorSecondary)}
              onCancel={() => setShowColorSecondary(!showColorSecondary)}
              color={secondaryColor}
              onChange={color => {
                setTogglePreview(false);
                setSecondaryColor(color.hex);
                inputs.change = true;
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: (inputs.change || changeImage || change) && validCNPJ ? null : "none"
          }}
          className="boxFooterButton"
        >
          <div className="footerButton">
            <p>Você realizou alterações.</p>
            <Button
              primary
              className="btFullWidth"
              onClick={() => handleSave()}
              disabled={loading}
              text="SALVAR ALTERAÇÕES"
              type="button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export { LayoutApp };
