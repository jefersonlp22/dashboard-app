import React, { useState, useEffect } from "react";
import "./styles.scss";

// 1 - enviado
// 2 - aceito
function GetCircleStatus({ item }) {
  let status = "default";
  if (item) {
    if (item.placed_at) {
      status = "default";
    }

    if (item.approved_at) {
      status = "approved";
    }

    if (item.canceled_at) {
      status = "canceled";
    }
  }
  return <div className={`circleStatus ${status}`}></div>;
}

//pending
//trial
//completed

function GetCircleStatusInvite({ status_formatted }) {
  let status = "default";
  let label = "Trial";
  if (status_formatted) {
    if (status_formatted === "completed") {
      status = "approved";
      label = "Completo";
    }

    if (status_formatted === "pending") {
      status = "canceled";
      label = "Pendente";
    }
  }
  return (
    <div className="circleStatus__wrapper">
      <div className={`circleStatus ${status}`}></div>
      {label}
    </div>
  );
}

function GetStatusComission({ item, type }) {
  let status = "default";
  let label = "Em aberto";

  if (item?.available_at && !item?.paid_at) {
    status = "canceled";
    label = "Pendente";
  }

  if (item?.available_at && item?.paid_at) {
    status = "approved";
    label = "Em baixa";
  }

  if (type === "status") {
    return <div className={`labelStatus ${status}`}>Status: {label}</div>;
  }
  return (
    <div className="circleStatus__wrapper">
      <div className={`circleStatus ${status}`}></div>
      {label}
    </div>
  );
}

function GetCircleStatusOrderTransaction({ status }) {
  let statusLabel = {
    draft: "Em aberto",
    canceled: "Cancelado",
    paid: "Pago",
    expired: "Expirado"
  };
  let statusColor = {
    draft: "default",
    canceled: "canceled",
    paid: "approved",
    expired: "canceled"
  };
  return (
    <div className="circleStatus__wrapperLeft">
      <div className={`circleStatus ${statusColor[status]}`}></div>
      {statusLabel[status]}
    </div>
  );
}

function GetOrderStatus({ item }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!item?.approved_at) {
      setStatus("WAIT_APPROVE");
    }

    if (item?.approved_at && !item?.paid_at) {
      setStatus("WAIT_PAY");
    }

    if (item?.approved_at && item?.paid_at && !item?.shipped_at) {
      setStatus("WAIT_SHIP");
    }

    if (item?.paid && item?.shipped_at && !item?.delivered_at) {
      setStatus("WAIT_SHIPPED");
    }

    if (item?.delivered_at) {
      setStatus("DELIVERED");
    } else {
      setStatus("WAIT_SHIPPED");
    }

    if (item?.delivered_at) {
      setStatus("DELIVERED");
    }

    if (item?.delivered_at && item?.billed_at) {
      setStatus("FINAL");
    }
  }, [item]);

  let statusLabel = {
    WAIT_APPROVE: "Aguardando Aprovação",
    WAIT_PAY: "Aguardando Pagamento",
    WAIT_SHIP: "Aguardando Envio",
    WAIT_SHIPPED: "Aguardando Entrega",
    DELIVERED: "Entregue",
    CANCELED: "Cancelado",
    FINAL: "Finalizado"
  };
  let statusColor = {
    WAIT_APPROVE: "default",
    WAIT_PAY: "approved",
    WAIT_SHIP: "approved",
    WAIT_SHIPPED: "approved",
    DELIVERED: "approved",
    CANCELED: "canceled",
    FINAL: "approved"
  };
  return (
    <div className="circleStatus__wrapperLeft" title={statusLabel[status]}>
      <div className={`circleStatus ${statusColor[status]}`}></div>
      {statusLabel[status]}
    </div>
  );
}

export {
  GetCircleStatus,
  GetOrderStatus,
  GetCircleStatusInvite,
  GetStatusComission,
  GetCircleStatusOrderTransaction
};
