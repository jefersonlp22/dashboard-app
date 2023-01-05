import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useHistory } from "react-router-dom";
import {  
  Icons,
  InputText,
  CkEditor,
  Button,
  Breadcrumbs,
  UploadThumbnail,
  PopoverItem,
  Popover,
  SimpleTag
} from "../../components";
import Tabs from "../../Layouts/Tabs";

import { useSelector, useDispatch } from "react-redux";
import { useUpdateTalk } from "../../gqlEndpoints/mutations";

import useForm from "../../customHooks/useForm";

import Swal from "sweetalert2";
const items = [
  {
    url: "/comunicacoes",
    title: "Comunicação"
  },
  {
    url: "/comunicacoes/automacao",
    title: "Automação",
    parent: "/automacao"
  }
];

const UpdateTalk = () => {
  const history = useHistory();
  const talk = useSelector(state => state.talks);
  const dispatch = useDispatch();
  

  const [tags, setTags] = useState([]);

  const { inputs, handleValueChange } = useForm({
    title: talk.title || "",
    image: talk.featured_image ||  "",
    description: talk.content || "",
    tags: talk.tags || []
  });

  // const [loading, setLoading] = useState(false);
  const { deleteTalk } = useUpdateTalk();
  const [descriptionData, setDescriptionData] = useState("");

  const addTag = (text, e) => {
    setTags([...tags, { name: text, color: "#0489cc" }]);
    e.currentTarget.textContent = "";
  };

  const editTag = (index, color) => {
    let tempTags = tags;
    tempTags[index].color = color;
    setTags([...tempTags]);
  };

  const deleteTag = index => {
    let tempTags = tags;
    tempTags.splice(index, 1);
    setTags([...tempTags]);
  };

  const storeTalk = async () => {        
    if (inputs.title !== "" && inputs.image !== "") {               
      dispatch({ 
        type: "UPDATE_TALKS", 
        talk: { 
          ...talk,                     
          title: inputs.title,
          featured_image: inputs.image,
          content: inputs.description,
          tags: inputs.tags
        } 
      }); 
      history.replace({ pathname: "/comunicacoes/criar-nova" });            
    }
  };

  const handleDelete = async id =>{
    const result = await deleteTalk(id);
    if(result){      
      history.replace({ pathname: "/comunicacoes" });
    }
  }

  useEffect(() => {
    if (talk.tags.length > 0) {
      setTags(talk.tags);
    }    

    if(localStorage.getItem('edit-talk')){
      let currentTalk = JSON.parse(localStorage.getItem('edit-talk'));            
      dispatch({ 
        type: "UPDATE_TALKS", 
        talk: { 
          ...talk, 
          id: currentTalk.id,      
          title: currentTalk.title,
          featured_asset: currentTalk.featured_asset,
          content: currentTalk.content || '',
          tags: currentTalk.tags
        } 
      });  
    }
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(talk.id){      
      inputs.title = talk.title;      
      inputs.image = "empty";
      setTags(talk.tags);
      setDescriptionData(talk.content); 
    }
  // eslint-disable-next-line
  }, [talk]);

  useEffect(() => {
    if (tags.length > 0) {
      inputs.tags = tags;
    } else {
      inputs.tags = [];
    }
    // eslint-disable-next-line
  }, [tags]);

  useEffect(() => {
    if(descriptionData){
      inputs.description = descriptionData;      
    }
    // eslint-disable-next-line
  }, [descriptionData]);


  return(
    <div className="talks__wrapper">
      <Tabs items={items} />
      <Breadcrumbs 
      itens={["Talks", "Comunicação", "Criar nova", "Informações e Conteúdo"]} />

      <div className="talks__wrapper--board">
        <div className="talks__wrapper--returnWrapper">
          <div
            className="talks__wrapper--iconBack"
            onClick={() => {
              if(localStorage.getItem('edit-talk')){
                localStorage.removeItem('edit-talk');
              }
              history.replace({ pathname: talk.id? "/comunicacoes": "/comunicacoes/criar-nova" })
            }
            }
          >
            <Icons.back />
          </div>
        </div>

        <div className="talks__wrapper--content">
          <h1 className="talks__wrapper--title">Informações e Conteúdo</h1>

          <InputText
            text={
              <div>
                Título <span style={{ color: "red" }}>*</span>
              </div>
            }
            name="title"
            type="text"
            value={inputs.title || ""}
            onChange={handleValueChange}
            required
          />

          <span className="talks__wrapper--label">
            Imagem destaque<span style={{ color: "red" }}>*</span>
          </span>

          <UploadThumbnail
            url={talk.featured_asset.url || ''}            
            base64={talk.featured_image || false}
            onChange={image => {
              inputs.image = image;
            }}
          />

          <span className="talks__wrapper--label">Texto</span>

          <CkEditor setData={setDescriptionData} value={talk.content} />

          <span className="talks__wrapper--label mTop30">Tags</span>

          <div className="df fdr collections__tagCloud mBottom20">
            {tags.map((tag, tagIndex) => (
              <Popover
                key={`tagPopover${tagIndex}`}
                top
                title="Editar tag"
                showCloseButton
                invert="true"
                content={
                  <div>
                    <PopoverItem>
                      Alterar Cor
                      <input
                        type="color"
                        onChange={e => {
                          editTag(tagIndex, e.target.value);
                        }}
                      />
                    </PopoverItem>
                    <PopoverItem
                      onClick={() => {
                        deleteTag(tagIndex);
                      }}
                    >
                      Remover
                      <Icons.delete fill={"#cccccc"} />
                    </PopoverItem>
                  </div>
                }
              >
                <SimpleTag
                  key={`vl-${tagIndex}`}
                  color={tag.color}
                  value={tag.name}
                  icon={
                    <Icons.pencil
                      onClick={() => {
                        editTag(tagIndex, tag);
                      }}
                      fill={"#FFF"}
                    />
                  }
                />
              </Popover>
            ))}

            <SimpleTag
              color={"#0489cc"}
              onEnter={(text, e, id) => {
                addTag(text, e, id);
              }}
              editable
              invert="true"
              icon={<Icons.next fill={"#0489cc"} />}
            />
          </div>
        </div>
        
        {talk.id?(
          <div className="df fdr mTop30 ">
            <div className="talks__wrapper--label link" onClick={()=>{
               Swal.fire({
                text: "Tem certeza que deseja deletar?",
                icon: "question",
                confirmButtonText: "Deletar",
                confirmButtonColor: "#0489cc",
                cancelButtonText: "Voltar",
                cancelButtonColor: "#086899",
                showCancelButton: true,
                showCloseButton: true
              }).then(result => {
                if (result.value) {
                  handleDelete(talk.id);
                }
              })
            }}>Excluir comunicação</div>
          </div>
        ):null}

        <div className="df fdr jc-end mTop30 ">
          <Button className="success" onClick={() => storeTalk()}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export { UpdateTalk };
