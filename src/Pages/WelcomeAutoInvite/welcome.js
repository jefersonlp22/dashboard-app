import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

import { Button, FormField, Loader } from "../../components";
import LogoPlayStore from "../../assets/images/playstore.png";
import LogoAppStore from "../../assets/images/appstore.png";

import { Layout } from "./Layout";

const FormValidation = Yup.object().shape({
  name: Yup.string()
    .required("Informe seu nome"),
  email: Yup.string()
    .required("Informe seu email")
    .email("Informe um email válido"),
});

export default function ({tenantId}) {

  const [handleConfirm, {data, loading, error}] = useMutation(gql`
    mutation AutoInvite($name: String!, $email: String!, $phone: String) {
      autoInvite(input: {name: $name, email: $email, phone: $phone}) {
        name
        email
        phone
        code
      }
    }
  `);

  const [ getTenantAssets ,{data: tenant, loading: loadingAssets}] = useLazyQuery(gql`
    query PublicAssets($id: String!){
      tenantPublicAssets(id: $id) {
        name
        picture_url
        lp_banner_image
      }
    }
  `,);

  async function handleInvite({name, email, phone}) {
    handleConfirm({ variables: {
      name,
      email,
      phone
    }});
  }

  useEffect(() => {
    if(tenantId != ''){
      getTenantAssets({
        variables:{
          id: tenantId
        }
      })
    }
    // eslint-disable-next-line
  }, [tenantId]);

  return (
      <Formik
        initialValues={{ name: "", email: "", phone: "" }}
        validationSchema={FormValidation}
        onSubmit={handleInvite}

      >
        {({}) => (
          <Form>
            <Layout tenantAssets={tenant?.tenantPublicAssets} loading={loading} >

                {error ? <InviteError error={error} /> : null}

                {data ? <InviteResponse invite={data?.autoInvite} tenantName={tenant?.tenantPublicAssets?.name} /> : <div>
                  <div className="welcome__form--title">
                    Preencha seus dados abaixo para <br /> gerarmos seu código de acesso<br /> ao Aplicativo {tenant?.tenantPublicAssets?.name}
                  </div>
                  <FormField
                    text="Nome"
                    required
                    className="login_input"
                    name="name"
                  />

                  <FormField
                    text="E-mail"
                    required
                    className="login_input"
                    name="email"
                  />

                  <FormField
                    text="Telefone (opcional)"
                    required
                    className="login_input"
                    name="phone"
                  />

                  <br />

                  <Button
                    text="Confirmar"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    primary
                    className="btFullWidth"
                  />
                </div>}

            </Layout>
          </Form>
        )}
      </Formik>
  );
}

function InviteResponse({invite, tenantName}){
  return(
    <div>
      <div className="welcome__form--title">
        Tudo certo!
      </div>

      <div className="welcome__form--code">
        <div className="gray-title">Código de ativação</div>
        <div className="code">{invite?.code}</div>
      </div>

      <div className="welcome__form--download-apps">
        Agora é só baixar o aplicativo People Commerce em seu celular, validar
        seu código e começar a sua jornada com a marca {tenantName}
        <div className="welcome__form--apps-links">
          <a href="https://apps.apple.com/br/app/people-commerce/id1491063239?l=pt&ls=1" target="_blank">
            <img src={LogoAppStore} alt="AppStore" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=me.onawa.peoplecommerce" target="_blank">
            <img src={LogoPlayStore} alt="PlayStore" />
          </a>
        </div>
      </div>

      <div className="welcome__form--yourinvite">
        <div className="gray-title">Seus dados</div>
        <table cellSpacing="0">
          <tbody>
            <tr>
              <td className="tbtitle">E-mail</td>
              <td>{invite?.email}</td>
            </tr>
            <tr>
              <td class="tbtitle">Nome</td>
              <td>{invite?.name}</td>
            </tr>
            <tr>
              <td class="tbtitle">Telefone</td>
              <td>{invite?.phone}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="welcome__form--footer-message">
        Estamos te enviando essas informações também por e-mail, para que você possa consultar posteriormente.
      </div>
    </div>
  );
}

function InviteError({error}){
  return(
    <div>
      <div className="welcome__form--title">
        Opss!!
      </div>

      <div className="welcome__form--title error">
        {error?.graphQLErrors[0].message}
      </div>

    </div>
  );
}



