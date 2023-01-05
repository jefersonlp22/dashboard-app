import React, { useState } from "react";
import {
  InputText,
  Icons,
  Button,
  MobilePreview,
  UploadImage
} from "../../../components";
import { useHistory } from "react-router-dom";
import useForm from "../../../customHooks/useForm";
import { useUpdateTenantMe } from "../../../gqlEndpoints/mutations";
import { useMe } from "../../../gqlEndpoints/queries";
import logo from "../../../assets/images/logo-1@3x.png";
import "./style.scss";

import TotalStorage from "total-storage";

function Visual() {
  const { handleValueChange, inputs } = useForm({
    primaryColor: "#007196",
    secondaryColor: "#007196",
    image: "",
    name: ""
  });
  const history = useHistory();
  const { updateByQuery } = useUpdateTenantMe();
  const { getMe } = useMe();

  const [togglePreview, setTogglePreview] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);

    if (inputs.name !== "") {
      let saved = await updateByQuery(`{
        name: "${inputs.name}",
        ${inputs.image ? `image:"${inputs.image}",` : ""}
        color: {
          primary: "${inputs.primaryColor}",
          secondary:"${inputs.secondaryColor}"
        }
      }`);

      if (saved) {
        let userMe = await getMe();

        if (userMe) {
          TotalStorage.set("USERNAME", userMe.name);
          TotalStorage.set("TENANT_LIST", userMe.tenants);

          setTimeout(() => {
            history.push("/canal");
          }, 300);
        }
      }
    } else {
      console.log("Formulário Inválido");
    }

    setLoading(false);
  }

  return (
    <div className="configMark__wrapper df fdc">
      <div className="configMark__wrapper--title">
        <span>Criar nova marca</span>{" "}
        <Icons.close
          className="configMark__wrapper--iconClose"
          fill="#FFF"
          onClick={() => history.replace({ pathname: "/choose-tenant" })}
        />
      </div>
      <div className="df fdr">
        <div className="configMark__wrapper--configs df fdc">
          <div className="df fdr">
            <div className="configMark__wrapper--configs__logotipo">
              <UploadImage
                url={logo}
                name="image"
                onChange={image => {
                  inputs.image = image;
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
            <div className="configMark__wrapper--configs__colorCol">
              <h2>Cor primária</h2>
              <label className="inputColor">
                <div className="df fdr alic">
                  <input
                    className="input"
                    type="color"
                    name="primaryColor"
                    value={inputs.primaryColor}
                    onChange={e => {
                      setTogglePreview(true);
                      handleValueChange(e);
                    }}
                  />
                  {inputs.primaryColor}
                </div>
                <Icons.arrowDown />
              </label>
              <div className="df fdr">
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
            <div className="configMark__wrapper--configs__colorCol">
              <h2>Cor secundária</h2>
              <label className="inputColor">
                <div className="df fdr alic">
                  <input
                    className="input"
                    type="color"
                    name="secondaryColor"
                    value={inputs.secundaryColor}
                    onChange={e => {
                      setTogglePreview(false);
                      handleValueChange(e);
                    }}
                  />
                  {inputs.secondaryColor}
                </div>
                <Icons.arrowDown />
              </label>
              <Button
                primary
                className="btFullWidth"
                onClick={() => handleSave()}
                disabled={loading}
                text="Confirmar"
                type="button"
              />
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
    </div>
  );
}

export default Visual;
