import React, { useEffect } from "react";
import { Loader } from "../../components";
import "./style.scss";
import useTheme from "../../customHooks/useTheme";

function Layout({ children, loading, tenantAssets,...props }) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="welcome--brandbar">
        <img src={tenantAssets?.picture_url} alt={tenantAssets?.name} />
      </div>
      <div className={`welcome--layout ${props.layoutClassName || ""}`}
        style={{backgroundImage: `url(${tenantAssets?.lp_banner_image})`}}>
        <div className={`welcome--content ${props.contentClassName || ""}`}>
          <div className="welcome--wantJoin">Quero Participar</div>
          {props.title || props.leftIcon || props.rightIcon ? (
            <div className="welcome--header">
              <div className="welcome--header__icon">
                {props.leftIcon || null}
              </div>

              <h1 className="welcome--header__title">{props.title}</h1>

              <div className="welcome--header__icon">
                {props.rightIcon || null}
              </div>
            </div>
          ) : null}
          <div className={`welcome--form ${props.formClassName}`}>
          <div className={`welcome--card ${props.layoutClassName || ""}`}>
            {loading ? (
              <Loader active={loading} />
            ) : (
              <>
                {children}
              </>
            )}
          </div>
          </div>
          <div className="welcome--copyright">People Commerce by Onawa</div>
        </div>
      </div>
    </>
  );
}

export { Layout };
