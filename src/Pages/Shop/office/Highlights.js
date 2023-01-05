import React, { useEffect, useState } from "react";

import {
  InputText,
  InputTextarea,
  Loader,
  SimpleSlider,
  Card,
  UploadImage,
  UploadImageDesktop,
  Line
} from "../../../components";

import { useHomeShopSlider } from "../../../gqlEndpoints/queries";
import { useSaveShopSlider } from "../../../gqlEndpoints/mutations";
import { useFormGroup } from "../../../customHooks/useForm";

const SectionHighlights = () => {
  const [sliders, setSliders] = useState([]);
  const [device, setDevice] = useState('desktop');
  const [loading, setLoading] = useState(false);

  const { saveShopSlider, deleteHomeShopSlider } = useSaveShopSlider();
  const { homeShopSlider } = useHomeShopSlider();
  const {
    inputs,
    setInputs,
    updateState,
    handleChange,
    handleChangeDefinedValue
  } = useFormGroup([
    {
      homeShopSlider: [
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
      ]
    },
    {
      storeHomeShopSlider: [
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
      ]
    },
    {
      mobileStoreHomeShopSlider: [
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
        {
          title: "",
          link: "",
          description: "",
          asset_url: "",
          image: "",
          channel: "",
          device: "",
        },
      ]
    }

  ]);

  useEffect(() => {
    loadHighlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadHighlights() {
    let result = await homeShopSlider();
    setLoading(true);
    if (result) {
      setSliders([...sliders, ...result.homeShopSlider.data]);
      setSliders([...sliders, ...result.storeHomeShopSlider.data]);
      let aux = inputs;
      let filterSliderMobile = []
      let filterSliderDesktop = []

      filterSliderMobile =  result.storeHomeShopSlider.data.filter(slide => {

        if (slide?.device === null) {
          return false
        }

        return slide?.device === 'mobile'
      })

      filterSliderDesktop =  result.storeHomeShopSlider.data.filter(slide => {
        console.log(' slide?.device', slide?.device)

        if (slide?.device === null) {
          return false
        }

        return slide?.device === 'desktop'
      })



      result.homeShopSlider.data.forEach((item, index) => {
        aux[0].homeShopSlider[index] = {
          id: item.id,
          title: item.title,
          link: item.link,
          description: item.description,
          asset_url: item.featured_asset ? item.featured_asset.url : "",
          image: "",
          device: item?.device,
          channel: item?.channel
        };
      });

      filterSliderDesktop.forEach((item, index) => {
        aux[1].storeHomeShopSlider[index] = {
          id: item.id,
          title: item.title,
          link: item.link,
          description: item.description,
          asset_url: item.featured_asset ? item.featured_asset.url : "",
          image: "",
          device: item?.device,
          channel: item?.channel
        };
      });

      filterSliderMobile.forEach((item, index) => {
        aux[2].mobileStoreHomeShopSlider[index] = {
          id: item.id,
          title: item.title,
          link: item.link,
          description: item.description,
          asset_url: item.featured_asset ? item.featured_asset.url : "",
          image: "",
          device: item?.device,
          channel: item?.channel
        };
      });

      setInputs(aux);
      updateState();
      setLoading(false);
    }
  }

  async function handleSaveShopHomeSlider(id, item) {
    console.log(id , '===' , item)
    setLoading(true);

    item.title = item.title.replace(/"/g, '\\"').replace(/'/g, "`");
    item.description = item.description.replace(/"/g, '\\"').replace(/'/g, "`");

    let saved = await saveShopSlider(id, item);
    if (saved) {
      loadHighlights();
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }
  async function handleSaveStoreShopHomeSlider(id, item) {

    setLoading(true);

    item.channel = 'store'
    item.device = device
    item.title = item.title.replace(/"/g, '\\"').replace(/'/g, "`");
    item.description = item.description.replace(/"/g, '\\"').replace(/'/g, "`");

    let saved = await saveShopSlider(id, item);
    if (saved) {
      loadHighlights();
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }

  // useEffect(() => {
  //   if (storeShopSlider) {
  //     setStoreSliders(storeShopSlider.data)
  //     // let filterMobile = storeShopSlider.data.filter((slider) => slider?.device === 'mobile')
  //     // setMobileStoreSliders(filterMobile)
  //   }
  // }, [storeShopSlider]);

  async function handleDeleteShopHomeSlider(id) {
    setLoading(true);
    let saved = await deleteHomeShopSlider(id);
    if (saved) {
      loadHighlights();
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }

  console.log('imputs',inputs)

  return (
    <div className="office">
      <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
        <h1>Destaques</h1>
      </div>
      <Line/>
      <Card>
        {loading ? (
          <Loader active={loading} className="loader__highlights" />
        ) : (
          <SimpleSlider>
            {inputs[0].homeShopSlider.map((item, i) => (
              <div key={i} className="df fdc slider__wrapper">
                <div className="df fdr">
                  <div>
                    <UploadImage
                      url={inputs[0].homeShopSlider[i].asset_url}
                      name="image"
                      onChange={(image, event) => {
                        handleChangeDefinedValue(event, i, image, 0, "homeShopSlider");
                      }}
                    />
                  </div>
                  <div className="office--form">
                    <InputText
                      tabIndex="1"
                      text={
                        <span>
                          Título principal{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      required
                      name="title"
                      value={inputs[0].homeShopSlider[i].title}
                      onChange={e => handleChange(e, i, 0, "homeShopSlider")}
                    />
                    <InputText
                      tabIndex="2"
                      text={
                        <span>
                          Link<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="url"
                      required
                      name="link"
                      value={inputs[0].homeShopSlider[i].link}
                      onChange={e => handleChange(e, i, 0, "homeShopSlider")}
                    />
                    <InputTextarea
                      tabIndex="2"
                      text={
                        <span>
                          Descrição<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      name="description"
                      value={inputs[0].homeShopSlider[i].description}
                      onChange={e => handleChange(e, i, 0, "homeShopSlider")}
                    />
                  </div>
                </div>
                <div className="office--footer df fdr alic jc-end">
                  <div className="df fdr alic">
                    <span
                      className="button__delete"
                      onClick={() => handleDeleteShopHomeSlider(inputs[0].homeShopSlider[i].id)}
                    >
                      Excluir
                    </span>{" "}
                    <span
                      className="button primary button__save"
                      onClick={() =>
                        handleSaveShopHomeSlider(inputs[0].homeShopSlider[i].id, inputs[0].homeShopSlider[i])
                      }
                    >
                      Salvar
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </SimpleSlider>
        )}
      </Card>
      <div className="title_store">
        <h1>Destaques lojinha</h1>
      </div>
      <Card>
        <div className="store">
        {loading ? (
          <Loader active={loading} className="loader__highlights" />
        ) : (
          <>
          { device === 'desktop' ?
          (<SimpleSlider>
            {inputs[1].storeHomeShopSlider.map((item, i) => (
              <div key={i} className="df fdc slider__wrapper">
                <div className="df fdr">
                  <div style={{paddingRight: 30}}>
                    <div className="type_device">
                      <div onClick={() => setDevice('desktop')} style={{color: device === 'desktop' ? '#0489CC' : '#B2B2B3' }} className="text_type_device">Computadores</div>
                      <div onClick={() => setDevice('mobile')} style={{color: device === 'mobile' ? '#0489CC' : '#B2B2B3' }} className="text_type_device">Smartphones</div>
                    </div>
                    <UploadImageDesktop
                      url={inputs[1].storeHomeShopSlider[i].asset_url}
                      name="image"
                      onChange={(image, event) => {
                        handleChangeDefinedValue(event, i, image, 1, "storeHomeShopSlider");
                      }}
                    />
                  </div>
                  <div className="office--form">
                    <InputText
                      tabIndex="1"
                      text={
                        <span>
                          Título principal{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      required
                      name="title"
                      value={inputs[1].storeHomeShopSlider[i].title}
                      onChange={e => handleChange(e, i, 1, "storeHomeShopSlider")}
                    />
                    <InputText
                      tabIndex="2"
                      text={
                        <span>
                          Link<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="url"
                      required
                      name="link"
                      value={inputs[1].storeHomeShopSlider[i].link}
                      onChange={e => handleChange(e , i, 1, "storeHomeShopSlider")}
                    />
                    <InputTextarea
                      tabIndex="2"
                      text={
                        <span>
                          Descrição<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      name="description"
                      value={inputs[1].storeHomeShopSlider[i].description}
                      onChange={e => handleChange(e, i, 1, "storeHomeShopSlider")}
                    />
                  </div>
                </div>
                <div className="office--footer df fdr alic jc-sb">
                <div>Sugestão de tamanho 1230x300 para desktop.</div>
                  <div className="df fdr alic">
                    <span
                      className="button__delete"
                      onClick={() => handleDeleteShopHomeSlider(inputs[1].storeHomeShopSlider[i].id)}
                    >
                      Excluir
                    </span>{" "}
                    <span
                      className="button primary button__save"
                      onClick={() =>
                        handleSaveStoreShopHomeSlider(inputs[1].storeHomeShopSlider[i].id, inputs[1].storeHomeShopSlider[i])
                      }
                    >
                      Salvar
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </SimpleSlider>
          )
          :
          (
          <SimpleSlider>
          {inputs[2].mobileStoreHomeShopSlider.map((item, i) => (
            <div key={i} className="df fdc slider__wrapper">
              <div className="df fdr">
                <div >
                  <div style={{width: '90%'}} className="type_device">
                    <div onClick={() => setDevice('desktop')} style={{color: device === 'desktop' ? '#0489CC' : '#B2B2B3' }} className="text_type_device">Computadores</div>
                    <div onClick={() => setDevice('mobile')} style={{color: device === 'mobile' ? '#0489CC' : '#B2B2B3' }} className="text_type_device">Smartphones</div>
                  </div>
                  <UploadImage
                    url={inputs[2].mobileStoreHomeShopSlider[i].asset_url}
                    name="image"
                    onChange={(image, event) => {
                      handleChangeDefinedValue(event, i, image, 2, "mobileStoreHomeShopSlider");
                    }}
                  />
                </div>
                <div className="office--form">
                  <InputText
                    tabIndex="1"
                    text={
                      <span>
                        Título principal{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    required
                    name="title"
                    value={inputs[2].mobileStoreHomeShopSlider[i].title}
                    onChange={e => handleChange(e, i, 2, "mobileStoreHomeShopSlider")}
                  />
                  <InputText
                    tabIndex="2"
                    text={
                      <span>
                        Link<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    type="url"
                    required
                    name="link"
                    value={inputs[2].mobileStoreHomeShopSlider[i].link}
                    onChange={e => handleChange(e, i, 2, "mobileStoreHomeShopSlider")}
                  />
                  <InputTextarea
                    tabIndex="2"
                    text={
                      <span>
                        Descrição<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="description"
                    value={inputs[2].mobileStoreHomeShopSlider[i].description}
                    onChange={e => handleChange(e, i, 2, "mobileStoreHomeShopSlider")}
                  />
                </div>
              </div>
              <div className="office--footer df fdr alic jc-sb">
              <div>Sugestão de tamanho 900x900 para mobile.</div>
                <div className="df fdr alic">
                  <span
                    className="button__delete"
                    onClick={() => handleDeleteShopHomeSlider(inputs[2].mobileStoreHomeShopSlider[i].id)}
                  >
                    Excluir
                  </span>{" "}
                  <span
                    className="button primary button__save"
                    onClick={() =>
                      handleSaveStoreShopHomeSlider(inputs[2].mobileStoreHomeShopSlider[i].id, inputs[2].mobileStoreHomeShopSlider[i])
                    }
                  >
                    Salvar
                  </span>
                </div>
              </div>

            </div>
          ))}
          </SimpleSlider>
          )
          }
        </>
        )}
        </div>
      </Card>
    </div>
  );
};

export default SectionHighlights;
