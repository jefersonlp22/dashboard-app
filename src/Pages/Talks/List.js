import React, { useState } from "react";
import { Icons, Loader, Table, VoidTemplate, Filter } from "../../components";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import TalksLayout from "./index";

const List = (props) => {
  const talk = useSelector((state) => state.talks);
  const dispatch = useDispatch();
  const history = useHistory();

  const [, setFilter] = useState("");
  const [filterSchema] = useState({
    responsible: {
      label: "Responsável",
      type: "checkbox",
      values: [
        {
          label: "Fulano",
          value: "fulano",
        },
      ],
    },
  });

  const handleCreateNew = () => {
    dispatch({ type: "CANCEL_TALKS" });
    history.replace({ pathname: "/comunicacoes/criar-nova" });
  };

  const editTalk = (item) => {
    dispatch({
      type: "UPDATE_TALKS",
      talk: {
        ...talk,
        id: item.id,
        title: item.title,
        featured_asset: item.featured_asset,
        content: item.content,
        tags: item.tags ? JSON.parse(item.tags) : [],
      },
    });
    history.replace({ pathname: "/comunicacoes/novo" });
  };

  return (
    <TalksLayout>
      <Filter
        enabled={false}
        title="Comunicações"
        setFilter={setFilter}
        filterSchema={filterSchema}
        searchPlaceholder="Título"
        otherActions={
          <div style={{ marginLeft: 15 }}>
            <div className="button primary" onClick={() => handleCreateNew()}>
              Criar nova
            </div>
          </div>
        }
      />

      {props.loading ? (
        <Loader active={true} color="#0489cc" />
      ) : (
        <Table
          headers={["Título", "Enviado", " "]}
          voidtemplate={
            <VoidTemplate
              message={
                <VoidTemplate.default
                  message={
                    <>
                      Você ainda não tem
                      <br /> nenhuma comunicação cadastrada...
                    </>
                  }
                  to="/comunicacoes/criar-nova"
                  buttonText="Criar nova"
                />
              }
            />
          }
        >
          {props.data && props.data.length
            ? props.data.map((item, rowIndex) => (
                <Table.tr key={`row${rowIndex}`} onClick={() => editTalk(item)}>
                  <Table.td>{item?.title}</Table.td>
                  <Table.td>
                    {moment(item.created_at).format("DD/MM/YYYY HH:mm")}
                  </Table.td>
                  <Table.td style={{ textAlign: "center" }}>
                    <div className="table__arrow">
                      <Icons.next fill="#4d4d4d" />
                    </div>
                  </Table.td>
                </Table.tr>
              ))
            : null}
        </Table>
      )}
    </TalksLayout>
  );
};

export { List };
