import React from "react";
import "./styles.scss";

function StepsProgress({ data }) {
  let status = data.canceled_at ? "canceled" : "active";
  return (
    <div className={`steps__progress  ${status}`}>
      <div className="steps__progress--container">
        <ul className="steps__progress--progressbar">
          <li className="steps__progress--first">
            <span className="steps__progress--title">Pedido solicitado</span>
            <span className="steps__progress--date">{data.placed_at}</span>
          </li>
          <li
            className={
              data.approved_at || data.canceled_at || data.paid_at
                ? "steps__progress--current"
                : ""
            }
          >
            <span className="steps__progress--title">Pedido liberado</span>
            <span className="steps__progress--date"></span>
          </li>
          <li className={data.paid_at ? "steps__progress--current" : ""}>
            <span className="steps__progress--title">Pagamento confirmado</span>
            <span className="steps__progress--date"></span>
          </li>
          <li>
            <span className="steps__progress--title">Pedido completo</span>
            <span className="steps__progress--date"></span>
          </li>
        </ul>
      </div>
    </div>
  );
}
export { StepsProgress };
