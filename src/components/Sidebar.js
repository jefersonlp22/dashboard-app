import React, { useState, useEffect, useContext } from "react";
import MenuItem from "../components/MenuItem";
import HamburgerIcoin from "./HamburguerIcon";
import { IconsSidebar } from "./IconsSidebar";
import { SessionContext } from '../contexts/Session.ctx'
import _, { fromPairs } from "lodash";
import {
  IcDashboard,
  IcShop,
  IcOnawa,
  IcWow,
  IcArrowUp,
  IcArrowDown,
  IcCatalogo,
  IcPeople,
  IcConnect,
  IcTalks,
  IcConfig,
  IcPedidos,
  IcClients,
  IcAcademy,
  IcMovimentacao,
  IcCurrency,
  IcStar,
} from "./OnawaIcon";

import { checkAccesLevel, checkSuperAdmin } from "./HelperFunctions";

const menuAdmin = [
  // {
  //   order: 0,
  //   title: "Resultados",
  //   Icon: IcDashboard,
  //   href: "/",
  // },
  {
    order: 1,
    title: "Shop",
    Icon: IcShop,
    parent: "/shop",
    submenu: [
      {
        title: "Catálogo",
        Icon: IcCatalogo,
        href: "/shop/produtos",
        group: ["/shop/colecoes"],
      },
      {
        title: "Vitrine",
        Icon: IconsSidebar.vitrine,
        href: "/shop/office"
      },
      {
        title: "Cupom",
        Icon: IconsSidebar.coupon,
        href: "/shop/cupons"
      }
    ]
  },
  {
    order: 5,
    title: "Movimentação",
    Icon: IcMovimentacao,
    parent: "/movimentacoes",
    submenu: [
      {
        title: "Bonificação",
        Icon: IcWow,
        href: "/movimentacoes/bonificacao",
      },
      {
        title: "Resgates",
        Icon: IcCurrency,
        href: "/movimentacoes/resgates",
        locked: true,
      },
    ],
  },
  {
    order: 6,
    title: "Academy",
    Icon: IcAcademy,
    href: "/academy",
    locked: true,
  },
  {
    order: 7,
    title: "Talks",
    Icon: IcTalks,
    href: "/comunicacoes",
    group: [
      "/comunicacoes/automacao",
      "/comunicacoes/novo",
      "/comunicacoes/criar-nova",
      "/comunicacoes/escolher-publico",
    ],
  },
  {
    order: 8,
    title: "Configurações",
    Icon: IcConfig,
    parent: "/configs",
    submenu: [
      {
        title: "Cadastro",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/dados-marca",
      },
      {
        title: "Usuários",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/usuarios",
        group: ["/configs/convites-do-sistema"]
      },
      {
        title: "Design do aplicativo",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/layout-app",
      },
      {
        title: "Notificações",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/notificacoes",
      },
      {
        title: "Cobrança",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/cobranca",
      },
      {
        title: "Contrato do Lover",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/contrato-lover",
      },
      {
        title: "Política de Privacidade",
        Icon: IconsSidebar.subSetting,
        href: "/configs/politicas-privacidade"
      },
      {
        title: "Frete",
        Icon: IconsSidebar.subSetting,
        href: "/configs/frete"
      }
    ]
  }
];

const menuAmbassador = [
  {
    order: 0,
    title: "Resultados",
    Icon: IconsSidebar.dashboard,
    href: "/"
  },
  {
    order: 3,
    title: "People",
    Icon: IcPeople,
    parent: "/people",
    access: "all",
    submenu: [
      {
        title: "Lovers",
        Icon: IcStar,
        href: "/people/lovers",
        group: [
          "/people/lovers/grupos",
          "/people/lovers/novo-grupo",
          "/people/lovers/detalhes",
        ],
      },
      {
        title: "Connect",
        Icon: IcConnect,
        href: "/people/convites",
      },
      {
        title: "CRM",
        Icon: IcClients,
        href: "/people/clientes",
        locked: true,
      },
    ],
  },
  {
    order: 4,
    title: "Pedidos",
    Icon: IcPedidos,
    href: "/pedidos",
    access: "all",
  },
];

const ambassadorPrivacyPolice = [{
  order: 9,
  title: "Mais",
  Icon: IconsSidebar.dots,
  parent: "/mais",
  access: "all",
  submenu: [
    {
      title: "Contrato Lover",
      Icon: IconsSidebar.dots,
      href: "/mais/contrato-lover",
    },
    {
      title: "Política de Privacidade",
      Icon: IconsSidebar.dots,
      href: "/mais/politica-privacidade"
    }
  ]
}];

function Sidebar() {
  const { Session } = useContext(SessionContext);
  const [open, setOpen] = useState(true);
  const [currentSubmenu, setCurrentSubmenu] = useState("");
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [, setCurrentUser] = useState();
  const [menuItems, setMenuItens] = useState([]);

  const [menuClass, setMenuClass] = useState({
    show: "showMenu",
    hide: "hideMenu",
  });

  const toogleSubmenu = (parent) => {
    setOpenSubmenu(!openSubmenu);
    if (currentSubmenu !== parent) {
      setCurrentSubmenu(`${parent}`);
      setOpenSubmenu(true);
    } else if (currentSubmenu === parent && openSubmenu) {
      setCurrentSubmenu("");
    }
  };

  const toggleMenu = () => {
    window.localStorage.setItem("menu", !open);
    setOpen(!open);
    setMenuClass({ show: "showMenuTransition", hide: "hideMenuTransition" });
  };

  const menuSuperAdmin = () => {
    return [
      {
        title: "Bonificação",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/bonificacao",
      },
      {
        title: "Integração",
        Icon: (props) => IcConfig({ ...props, size: "md" }),
        href: "/configs/integracao",
      },
    ];
  };

  useEffect(() => {
    if(Session){
      const menu = window.localStorage.getItem("menu");
      setOpen(JSON.parse(menu));
      let localUser = window.localStorage.getItem("USER");
      setCurrentUser(localUser);

      if (checkAccesLevel(["admin"])) {
        let union = _.union(menuAmbassador, menuAdmin);
        let order = _.orderBy(union, ["order"], ["asc"]);

        if (checkSuperAdmin()) {
          order[7].submenu = _.union(order[7].submenu, menuSuperAdmin());

          if(Number(Session?.tenant?.current?.id) !== 6){
            order[1].submenu.splice(2,1);
          }
          if([6, 11, 20, 32].includes(Number(Session?.tenant?.current?.id))){
            order[7].submenu.splice(7,1);
          }
        }
        setMenuItens(order);
      } else {
        let union = _.union(menuAmbassador, ambassadorPrivacyPolice);
        let order = _.orderBy(union, ["order"], ["asc"]);
        setMenuItens(order);
      }
    }
  }, [Session]);



  return (
    <aside className={`sidebar ${open ? menuClass.show : menuClass.hide}`}>
      <div className="menu">
        <span to={"#"} className="menu__control" onClick={toggleMenu}>
          <div className="menu__control--icon">
            <HamburgerIcoin active={open} />
          </div>
          <div
            className="menu__control--txt"
            style={open ? {} : { display: "none" }}
          >
            <span>Menu</span>
          </div>
        </span>

        <div className="menuContent">
          {menuItems.map((item, index) =>
            item.href && item.submenu === undefined ? (
              <MenuItem
                Icon={item.Icon}
                title={item.title}
                href={item.href}
                locked={item.locked}
                active={open}
                index={item.index}
                group={item.group}
                // onClick={() => {
                //   console.log("teste");
                // }}
                key={index}
              />
            ) : (
              <div
                key={`${item.parent}${index}`}
                className={`sideBarSubMenu
                  ${
                    openSubmenu && currentSubmenu === item.parent
                      ? "subMenuOpen"
                      : ""
                  }
                  ${!open ? "sideBarOpen" : ""}`}
              >
                <MenuItem
                  Icon={item.Icon}
                  title={item.title}
                  parent={item.parent}
                  href={"#"}
                  locked={item.locked}
                  index={item.index}
                  className="submenuParent"
                  onClick={(e) => {
                    toogleSubmenu(`${item.parent}`);
                    if (!open) toggleMenu();
                  }}
                  rightIcon={
                    openSubmenu && currentSubmenu === item.parent ? (
                      <IcArrowUp size="sm" boxsize="20" fill="#fff" />
                    ) : (
                      <IcArrowDown size="sm" boxsize="20" fill="#fff" />
                    )
                  }
                />

                {item.submenu.map((subItem, i) => (
                  <MenuItem
                    Icon={subItem.Icon}
                    title={subItem.title}
                    href={subItem.href}
                    locked={subItem.locked}
                    group={subItem.group}
                    index={subItem.index}
                    className="subitem"
                    // rightIcon={<IconsSidebar.arrow_next fill="#fff" />}
                    // onClick={() => {
                    //   console.log("teste");
                    // }}
                    key={`${item.parent}.${i}`}
                  />
                ))}
              </div>
            )
          )}

          <span className={`menu__item copyright`}>
            <div className={`menu__item--icon`}>
              <span>
                <IcOnawa size="lg" fill="#fff" />
              </span>
            </div>
            <div
              className={`menu__item--txt`}
              style={!open ? { display: "none" } : {}}
            >
              <span>Powered by Onawa</span>
            </div>
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
