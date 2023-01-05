import React, {useState, useEffect} from 'react';

import TalksLayout from '../index';
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from 'react-router-dom';

import {Row, Line, Breadcrumbs, ContentBoard, BlankCard, Icons, InnerEdgeButton } from "../../../components";
import './styles.scss';
import { useUpdateTalk } from "../../../gqlEndpoints/mutations";


export function CreateNew() {
  const talk = useSelector(state => state.talks);
  const dispatch = useDispatch();

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [contentStatus, setContentStatus] = useState(false);

  const { updateByQuery } = useUpdateTalk();

  const submitTalk = async () => {
    let query = "";
    if (talk.title !== "" && talk.image !== "" && (
        talk.user_segments.length > 0 || talk.id) ) {
      setLoading(true);
      query = `
        updateTalk(input:{
          ${talk.id && talk.id !== "" ? `id:${talk.id},` : ""}
          ${talk.title !== "" ? `title:"${talk.title}",` : ""}
          ${talk.featured_image !== "" & talk.featured_image !== "empty" ? `featured_image:"${talk.featured_image}}",` : ""}
          ${
            talk.content !== ""
              ? `content:"${talk.content
                  .replace(/"/g, '\\"')
                  .replace(/'/g, "\\\\\\'")
                  .replace(/\n/g, "\\n")}",`
              : ""
          }
          ${
            talk.tags.length > 0
              ? `tags: "${JSON.stringify(talk.tags).replace(/"/g, '\\"')}"`
              : ""
          }
          ${
            talk.user_groups.length &&  talk.user_segments !== ""
              ? `user_segments: ${JSON.stringify(talk.user_segments).replace(/"/g, '')}`
              : ""
          }
        }){
          id
          title
          content
          tags
        }
      `;

      let result = await updateByQuery(query);
      if (result) {
        dispatch({type: "CANCEL_TALKS"});
        setTimeout(() => {
          history.replace({ pathname: "/comunicacoes" });
        }, 300);
      }
    }
  };

  const cancelCreate = () => {
    dispatch({type: "CANCEL_TALKS"});
    history.replace({ pathname: "/comunicacoes" });
  }


  useEffect(()=>{
    if(
      talk.title !== "" &&
      talk.image !== ""){
        setContentStatus(true);
      }else{
        setContentStatus(false);
      }
  },[talk]);

  return (
    <TalksLayout className="createNewCommunication">
        <Breadcrumbs itens={["Talks","Comunicação","Criar nova"]} />
        <Line />
        <ContentBoard
          title="Criar nova comunicação"
          previousPath="/comunicacoes"
          className="contentMaxWidth"
          loading={loading}
        >
            {talk.id? null :(
              <BlankCard className="cardStep" onClick={()=>history.replace({pathname: "/comunicacoes/escolher-publico"})}>
                <div>
                  <div className="df fdr alic cardStep__header">
                    <Icons.circleCheck border={ talk.user_segments.length ? '' : "#e5e5e6"} fill={ talk.user_segments.length ? '' : "transparent"} className="cardStep__header--icon"/>
                    <span className="cardStep__header--title">Público</span>
                  </div>
                  <div className="cardStep__content">Grupos: Lovers, Trial</div>
                </div>
                <Icons.next />
              </BlankCard>
            )}

              <BlankCard className="cardStep" onClick={()=>history.replace({pathname: "/comunicacoes/novo"})}>
                <div>
                  <div className="df fdr alic cardStep__header">
                    <Icons.circleCheck border={ contentStatus ? '' : "#e5e5e6"} fill={contentStatus ? '' : "transparent"}  className="cardStep__header--icon"/>
                    <span className="cardStep__header--title">Informações & Conteúdo</span>
                  </div>
                  <div className="cardStep__content">
                    Assunto: Como vender mais e melhor
                  </div>
                  <div className="cardStep__content">
                    Hashtags: dicas, venda, produtividade
                  </div>
                </div>
                <Icons.next />
              </BlankCard>

              <Row className="cancelComunication">
                <div onClick={()=>cancelCreate()}>
                  Cancelar comunicação
                </div>
              </Row>
          </ContentBoard>
          {(talk.user_segments.length || talk.id) && contentStatus && loading === false ? (
            <Row className="createNewCommunication__actionButtons">
              {/* <InnerEdgeButton primary>Agendar</InnerEdgeButton> */}
              <InnerEdgeButton success onClick={()=> submitTalk()}>Enviar Agora</InnerEdgeButton>
            </Row>
          ):null}
    </TalksLayout>
  );
}
