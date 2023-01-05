export default ({
    placed_at,
    approved_at,
    canceled_at,
    paid_at,
    billed_at,
    delivered_at,
    shipped_at
}, type) =>{
    // current | success | canceled | waiting

    const status = {
        // PEDIDO SOLICITADO
        "placed_at"  : placed_at ? "success" : "current",

        // PEDIDO APROVADO
        "approved_at": approved_at && !canceled_at ? "success" : canceled_at ? "canceled": "current",

        // PEDIDO CANCELADO
        "canceled_at": canceled_at ? "canceled" : "waiting",

        // PEDIDO PAGO, DE DO PRODUTO NÃO ESTAR CANCELADO
        "paid_at"    : paid_at && !canceled_at ? "success" : "waiting",

        // PEDIDO ENVIADO , DEPENDE DO PRODUTO ESTAR APROVADO E PAGO
        "shipped_at"  : approved_at &&
                        !canceled_at &&
                        paid_at &&
                        shipped_at ? "success"
                        :
                          approved_at &&
                          !canceled_at &&
                          paid_at &&
                          !shipped_at ? "current" : "waiting",

        // PEDIDO ENTREGUE. DEPENDE DO PRODUTO ESTAR APROVADO, PAGO, ENVIADO
        "delivered_at": approved_at &&
                        !canceled_at &&
                        paid_at &&
                        delivered_at &&
                        shipped_at ? "success"
                        :
                          approved_at &&
                          !canceled_at &&
                          paid_at &&
                          shipped_at &&
                          !delivered_at ? "current" : "waiting",
    };

    return status[type];
}
