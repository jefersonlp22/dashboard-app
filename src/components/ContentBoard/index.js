import React from "react";
import "./styles.scss";
import { useHistory } from 'react-router-dom';
import { Row as div, Loader, Icons } from "../index";

const ContentBoard = ({previousPath, loading, title, subtitle, children, className, showAlert}) => {
  const history = useHistory();
  return(
    <div className={`contentBoard ${className || ''}`}>
        { loading ? (
            <Loader active={loading} />
        ) : (
            <>
                <div className="contentBoard__returnWrapper">
                    <div
                        className="contentBoard__iconBack"
                        onClick={() => showAlert ? showAlert() : previousPath ? history.replace({ pathname: previousPath }) : null}
                    >
                        <Icons.back />
                    </div>
                </div>
                {title && (<h1 className="contentBoard__title">{title}</h1>)}
                {subtitle && (<h1 className="contentBoard__subtitle">{subtitle}</h1>)}
                <div>
                    {children}
                </div>
            </>
        )}
    </div>
    );
};

export { ContentBoard };
