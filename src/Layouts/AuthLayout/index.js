import React, { useEffect } from "react";
import { Loader } from "../../components";
import "./Layout.scss";
import useTheme from "../../customHooks/useTheme";

function AuthLayout({ children, ...props }) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`auth__wizard--layout ${props.layoutClassName || ""}`}>
      <div className={`auth__wizard--content ${props.contentClassName || ""}`}>
        {props.title || props.leftIcon || props.rightIcon ? (
          <div className="auth__wizard--header">
            <div className="auth__wizard--header__icon">
              {props.leftIcon || null}
            </div>

            <h1 className="auth__wizard--header__title">{props.title}</h1>

            <div className="auth__wizard--header__icon">
              {props.rightIcon || null}
            </div>
          </div>
        ) : null}
        <div className={`auth__wizard--form ${props.formClassName}`}>
          {children}
          {/* <form onSubmit={e => props.submit(e)}>{children}</form> */}
        </div>
      </div>
    </div>
  );
}

const AuthLayout__card = ({ children, title, loading, ...props }) => (
  <div className={`auth__wizard--card ${props.layoutClassName || ""}`}>
    {loading ? (
      <Loader active={loading} />
    ) : (
      <>
        {title ? <h1 className="auth__wizard--card__title">{title}</h1> : null}
        {children}
      </>
    )}
  </div>
);

const AuthLayout__actions = ({ children, loading }) => (
  <div className="auth__wizard--actions">{loading ? null : children}</div>
);

AuthLayout.card = AuthLayout__card;
AuthLayout.actions = AuthLayout__actions;

export { AuthLayout };
