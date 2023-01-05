import React, { useState, useEffect } from "react";
import Tabs from "../../../Layouts/Tabs";
import {
  Button,
  Table,
  Breadcrumbs,
  ContentBoard,
  VoidTemplate
} from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Layout from "../../Channel/Layout";

import { useUserSegments } from "../../../gqlEndpoints/queries";

import moment from "moment";

import "./style.scss";

export function ChooseGroup({ ...props }) {
  const history = useHistory();
  const talk = useSelector(state => state.talks);
  const dispatch = useDispatch();

  const { loadUserSegments, userSegmentsResult } = useUserSegments();
  const [selectedGroups, setSelectGroups] = useState([]);

  const [loading] = useState(false);

  const items = [
    {
      url: "/comunicacoes/escolher-publico",
      title: "Comunicação"
    },
    {
      url: "/comunicacoes/automacao",
      title: "Automação",
      parent: "/automacao"
    }
  ];

  const handleConfirm = () => {
    let formatted = selectedGroups.map(item => ({ id: item }));
    dispatch({
      type: "UPDATE_TALKS",
      talk: {
        ...talk,
        user_groups: selectedGroups,
        user_segments: formatted
      }
    });
    history.replace({ pathname: "/comunicacoes/criar-nova" });
  };

  function formatRow(item) {
    let converted = {
      edit: (
        <label>
          <div className="content-choose-group--option">
            <input
              type="checkbox"
              name={`${item.name}${item.id}`}
              value={item.id}
              checked={selectedGroups.includes(parseInt(item.id))}
              onChange={e => {
                let choosedGroups = selectedGroups;
                if (selectedGroups.includes(parseInt(item.id))) {
                  let idx = choosedGroups.indexOf(parseInt(item.id));
                  choosedGroups.splice(idx, 1);
                } else {
                  choosedGroups.push(parseInt(item.id));
                }
                setSelectGroups([...choosedGroups]);
              }}
            />
            <span className="check"></span>
          </div>
        </label>
      ),
      name: item.name,
      total: item.total_users,
      updated: item.total_users_updated_at
        ? moment(item.total_users_updated_at).format("DD/MM/YYYY - HH:mm:ss")
        : ""
    };
    let row = Object.entries(converted).map(([name, value], index) => (
      <Table.td key={`col-${name}-${index}`} name={name}>
        {value}
      </Table.td>
    ));

    return row;
  }

  useEffect(() => {
    loadUserSegments(5);

    if (talk.user_groups.length) {
      setSelectGroups([...talk.user_groups]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content-choose-group">
      <Tabs items={items} />
      <Layout>
        <Breadcrumbs
          itens={["Talks", "Comunicação", "Criar nova", "Escolher grupo"]}
        />
        <ContentBoard
          previousPath="/comunicacoes/criar-nova"
          className="contentMaxWidth"
          title="Escolher grupo"
        >
          <div
            className="content-choose-group"
            style={loading ? { display: "none" } : null}
          >
            <Table
              headers={["", "Lista", "Integrantes", "Última atualização"]}
              voidtemplate={
                <VoidTemplate
                  message={
                    <VoidTemplate.default
                      message={
                        <>
                          Você ainda não
                          <br /> Tem nenhum grupo cadastrado.
                        </>
                      }
                      buttonText="Convidar"
                    />
                  }
                />
              }
            >
              {userSegmentsResult && userSegmentsResult.length
                ? userSegmentsResult.map((item, rowIndex) => (
                    <Table.tr key={`row${rowIndex}`}>
                      {formatRow(item)}
                    </Table.tr>
                  ))
                : null}
            </Table>

            <div
              style={{
                display: selectedGroups.length > 0 ? null : "none"
              }}
              className="boxFooterButton"
            >
              <div className="footerButton">
                <Button
                  primary
                  className="btFullWidth"
                  onClick={() => handleConfirm()}
                  disabled={loading}
                  text="SALVAR E FECHAR"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </ContentBoard>
      </Layout>
    </div>
  );
}
