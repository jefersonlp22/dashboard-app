import React from "react";
import Login from "../Pages/Login";
import ChooseTenant from "../Pages/ChooseTenant";
import ActiveCode from "../Pages/ActiveCode";
// import General from "../Channel/General";
import Invite from "../Pages/Channel/Invite";
import InviteLanding from "../Pages/Channel/InviteLanding";
import Indications from "../Pages/Channel/Indications";

import ExpertsIndex from "../Pages/Channel/Experts";
import ExpertDetail from "../Pages/Channel/Experts/ExpertDetail";
import Groups from "../Pages/Channel/Experts/Groups";
import NewGroup from "../Pages/Channel/Experts/NewGroup";
import Orders from "../Pages/Orders";
import OrdersDetail from "../Pages/OrdersDetail";
import Dashboard from "../Pages/Dashboard";
import ComingSoon from "../Pages/ComingSoon";
import Coupon from "../Pages/Coupon/";
import UpdateOrCreateCoupon from "../Pages/UpdateOrCreateCoupon";
import CouponMechanics from "../Pages/UpdateOrCreateCoupon/CouponMechanics";
import CouponAudiences from "../Pages/UpdateOrCreateCoupon/CouponAudiences";




import {
  Commissions,
  CommissionDetail,
  // Rescues,
  // RescuesDetail,
  // RescuesCommissionsList
} from "../Pages/Movements";

import {
  Talks,
  UpdateTalk,
  CreateNew,
  ChoosePublic,
  ChooseGroup,
} from "../Pages/Talks";

import { BrandInfos } from "../Pages/Configurations/BrandInfos";
import { SystemInvites } from "../Pages/Configurations/Users/SystemInvites";
import { SystemUsers } from "../Pages/Configurations/Users/SystemUsers";
import { LayoutApp } from "../Pages/Configurations/LayoutApp";
import { Notifications } from "../Pages/Configurations/Notifications";
import { PaymentMethods } from "../Pages/Configurations/PaymentMethods";
import { Bonus } from "../Pages/Configurations/Bonus";
import { AmbassadorTerm } from "../Pages/Configurations/AmbassadorTerm";
import { Webhooks } from "../Pages/Configurations/Webhooks";
import { Freight } from "../Pages/Configurations/Freight";
import { PrivacyPolice } from "../Pages/Configurations/PrivacyPolice";
import FreightUpdate from "../Pages/Configurations/Freight/update";
import WelcomeAutoInvite from "../Pages/WelcomeAutoInvite";


import ResetPassword from "../Pages/ResetPassword";

import {
  Company,
  Bank,
  Address,
  Contact,
  Visual,
} from "../Pages/CompanyWizard";

import {
  RegisterName,
  RegisterPhone,
  RegisterPassword,
  RegisterConfirmPassword,
} from "../Pages/RegisterWizard";

import {
  // ShopItens,
  ShopCollections,
  ShopOffice,
  ShopNewItens,
  ShopNewCollections,
  ShopProductVariations,
  ShopManageVariations,
  ShopManageAttributes,
  ShopAttributes,
} from "../Pages/Shop";

import ProductIndex from "../Pages/Product";
// import ProductUpdate from '../Pages/Product/update';

import { Redirect } from "react-router-dom";

const publicRoutes = [
  {
    path: "/login",
    component: <Login />,
  },
  {
    path: "/active-code",
    component: <ActiveCode />,
  },
  {
    path: "/redefinir-senha",
    component: <ResetPassword />,
  },
];

const registerRoutes = [
  {
    path: "/register-name",
    component: <RegisterName />,
  },
  {
    path: "/register-phone",
    component: <RegisterPhone />,
  },
  {
    path: "/register-password",
    component: <RegisterPassword />,
  },
  {
    path: "/register-confirm-password",
    component: <RegisterConfirmPassword />,
  },
];

const registerOwner = [
  {
    path: "/register-company",
    component: <Company />,
  },
  {
    path: "/register-visual",
    component: <Visual />,
  },
  {
    path: "/register-address",
    component: <Address />,
  },
  {
    path: "/register-contact",
    component: <Contact />,
  },
  {
    path: "/register-bank",
    component: <Bank />,
  },
];

const chooseTenantRoute = {
  path: "/choose-tenant",
  component: <ChooseTenant />,
};

const welcomeRoute = {
  path: "/welcome/:tenant",
  component: <WelcomeAutoInvite />,
};

const privateRoutes = [
  {
    path: "/movimentacoes/bonificacao/:id",
    component: <CommissionDetail />,
  },
  {
    path: "/movimentacoes/bonificacao",
    component: <Commissions />,
  },
  {
    path: "/movimentacoes/resgates/bonificacao/:id",
    component: <ComingSoon />,
  },
  {
    path: "/movimentacoes/resgates/:id",
    component: <ComingSoon />,
  },
  {
    path: "/movimentacoes/resgates",
    component: <ComingSoon />,
  },
  {
    path: "/shop/atributos",
    component: <ShopManageAttributes />,
  },
  {
    path: "/academy",
    component: (
      <ComingSoon
        pageTitle="Academy"
        message={
          <div>
            Falta pouco para você conhecer esta nova área.
            <br />
            Por enquanto, você pode acessar o drive com conteúdos exclusivos para ajudar a sua marca na construção e desenvolvimento do canal People Commerce.
            <div style={{ marginTop: 10, fontWeight: 500, letterSpacing: '0.5px', color: "#4d4d4d" }}>
              Acesse aqui o{" "}
              <a
                href="https://drive.google.com/drive/folders/1GL9YAdXRFiiW2iMpOkg41l0RXAs13QOg"
                target="_blank"
              >
                Drive com conteúdos exclusivos
              </a>
            </div>
          </div>
        }
      />
    ),
  },
  {
    path: "/clientes",
    component: <ComingSoon pageTitle="Clientes" />,
  },

  {
    path: "/configs/dados-marca",
    component: <BrandInfos />,
  },
  {
    path: "/configs/usuarios",
    component: <SystemUsers />,
  },
  {
    path: "/configs/convites-do-sistema",
    component: <SystemInvites />,
  },
  {
    path: "/configs/layout-app",
    component: <LayoutApp />,
  },

  {
    path: "/configs/notificacoes",
    component: <Notifications />,
  },

  {
    path: "/configs/cobranca",
    component: <PaymentMethods />,
  },

  {
    path: "/configs/bonificacao",
    component: <Bonus />,
  },
  {
    path: "/configs/contrato-lover",
    component: <AmbassadorTerm />,
  },
  {
    path: "/configs/integracao",
    component: <Webhooks />,
  },
   {
    path: "/configs/frete/:id",
    component: <FreightUpdate />,
  },
  {
    path: "/configs/frete/novo",
    component: <FreightUpdate />,
  },
  {
    path: "/configs/frete",
    component: <Freight />,
  },
  {
    path: "/configs/politicas-privacidade",
    component: <PrivacyPolice />,
  },
  {
    path: "/mais/politica-privacidade",
    component: <PrivacyPolice level="master"/>,
  },
  {
    path: "/mais/contrato-lover",
    component: <AmbassadorTerm level="master" />,
  },
  {
    path: "/comunicacoes/editar/:id",
    component: <UpdateTalk />,
  },
  {
    path: "/comunicacoes/automacao",
    component: <ComingSoon pageTitle="Automação" />,
  },

  {
    path: "/comunicacoes/criar-nova",
    component: <CreateNew />,
  },
  {
    path: "/comunicacoes/escolher-publico",
    component: <ChoosePublic />,
  },
  {
    path: "/comunicacao/escolher-publico/grupos",
    component: <ChooseGroup />,
  },
  {
    path: "/comunicacoes/novo",
    component: <UpdateTalk />,
  },
  {
    path: "/comunicacoes",
    component: <Talks />,
  },
  {
    path: "/shop/produtos/novo/variacoes/gerenciar",
    component: <ShopManageVariations />,
  },
  {
    path: "/shop/produtos/novo/variacoes",
    component: <ShopProductVariations />,
  },

  {
    path: "/shop/produtos/novo/atributos",
    component: <ShopAttributes />,
  },
  {
    path: "/shop/produtos/edit/:id",
    component: <ShopNewItens />,
    exact: true,
  },
  {
    path: "/shop/produtos/novo",
    component: <ShopNewItens />,
  },
  {
    path: "/shop/produtos",
    component: <ProductIndex />,
  },
  {
    path: "/shop/colecoes/editar/:id",
    component: <ShopNewCollections />,
  },
  {
    path: "/shop/colecoes/novo",
    component: <ShopNewCollections />,
  },
  {
    path: "/shop/colecoes",
    component: <ShopCollections />,
  },

  {
    path: "/shop/office",
    component: <ShopOffice />,
  },
  {
    path: "/shop/cupons",
    component: <Coupon />,
  },

  {
    path: "/shop/cupom/mecanica",
    component: <CouponMechanics />,
  },
  {
    path: "/shop/cupom/publico",
    component: <CouponAudiences />,
  },

  {
    path: "/shop/cupom/:id",
    component: <UpdateOrCreateCoupon />,
  },

  {

    exact: true,
    path: "/shop/cupom",
    component: <UpdateOrCreateCoupon />,
  },

  {
    path: "/shop",
    component: <Redirect to={"/shop/produtos"} />,
    exact: true,
  },

  {
    path: "/people",
    component: <Redirect to={"/people/convites"} />,
    exact: true,
  },
  {
    path: "/people/convites",
    component: <Invite />,
  },
  {
    path: "/people/convites-landings",
    component: <InviteLanding />,
  },
  {
    path: "/people/indicacoes",
    component: <Indications />,
  },

  {
    path: "/people/lovers",
    component: <ExpertsIndex />,
    exact: true,
  },
  {
    path: "/people/lovers/detalhes",
    component: <ExpertDetail />,
  },
  {
    path: "/people/lovers/grupos",
    component: <Groups />,
  },

  {
    path: "/people/lovers/novo-grupo",
    component: <NewGroup />,
  },
  {
    path: "/people/clientes",
    component: <ComingSoon pageTitle="Clientes" />,
  },
  {
    path: "/pedidos/:id",
    component: <OrdersDetail />,
  },
  {
    path: "/pedidos",
    component: <Orders />,
  },
  {
    path: "/",
    exact: true,
    component: <Dashboard />,
  },
];

export {
  publicRoutes,
  chooseTenantRoute,
  welcomeRoute,
  privateRoutes,
  registerRoutes,
  registerOwner,
};
