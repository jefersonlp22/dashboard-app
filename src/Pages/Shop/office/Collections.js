import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { InputText, Loader, Button, Modal, Card, Line } from "../../../components";
import { ReactComponent as Delete } from "../../../assets/svg/i_delete_small4.svg";
import { useSaveHomeShopCollection } from "../../../gqlEndpoints/mutations";
import { useColections, useHomeShopCollection } from "../../../gqlEndpoints/queries";
import _ from "lodash";

const ModalAddShopCollection = ({ ...props }) => {
  const [search, setSearch] = useState("");
  const [selected, selectCollection] = useState("");
  const [collections, setCollections] = useState([]);
  const [saving, setSaving] = useState(false);
  const { saveShopCollection } = useSaveHomeShopCollection();

  async function handleSave() {
    setSaving(true);
    let result = await saveShopCollection(Number.parseInt(selected, 10));
    if (result) {
      setTimeout(() => {
        setSaving(false);
        props.setVisibility(false);
        props.loadShopCollections();
      }, 1000);
    }
  }

  useEffect(() => {
    let results = [];
    // eslint-disable-next-line array-callback-return
    results = props.modalCollections.filter(i => {
      if (i.name) {
        const itemData = `${i.name.toUpperCase()}`;
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }
    });

    setCollections(results);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function loopCollections(array) {
    return array.map((item, index) =>
      item.is_root === 0 ? (
        <li
          key={`collection${index}`}
          className={item.id === selected ? "active" : "none"}
          onClick={() => {
            selectCollection(item.id);
          }}
        >
          {item.name}
        </li>
      ) : null
    );
  }

  return saving ? (
    <Modal visible={props.visibility}>
      <Loader active={saving} />
    </Modal>
  ) : (
    <Modal
      visible={props.visibility}
      onClose={() => {
        props.setVisibility(false);
        setSearch("");
        selectCollection("");
      }}
    >
      <h1>Selecionar Coleção</h1>
      <br />
      <br />

      <InputText
        text="Pesquisar coleção"
        type="text"
        required
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="modal__collections--list">
        {search !== "" ? (
          <ul>{loopCollections(collections)}</ul>
        ) : (
          <ul>{loopCollections(props.modalCollections)}</ul>
        )}
      </div>

      <br />

      <Button
        primary
        disabled={selected === ""}
        className="btFullWidth"
        onClick={() => handleSave(selected)}
      >
        Confirmar
      </Button>
    </Modal>
  );
};

const SectionCollections = () => {
  const [toggleModal, setTogglemodal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopCollections, setShopCollections] = useState([]);
  const [, setOriginCollections] = useState([]);
  const [modalCollections, setModalCollections] = useState([]);
  const { deleteShopCollection } = useSaveHomeShopCollection();
  const { homeShopCollection } = useHomeShopCollection();
  const { loadCollections } = useColections();
  const settings = {
    dots: true,
    arrows: true,
    lazyLoad: true,
    accessibility: false,
    draggable: false,
    slidesToShow: 5,
    slidesToScroll: 1
  };

  useEffect(() => {
    loadShopCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadShopCollections() {
    setLoading(true);

    let originCollection = await loadCollections(1000);
    if (originCollection) {
      setOriginCollections(originCollection.collections.data);
      let shopResult = await homeShopCollection();
      if (shopResult) {
        let aux = shopResult;
        if (shopResult.length < 6) {
          let diff = 6 - shopResult.length;
          for (let i = 0; i < diff; i++) {
            aux.push({
              empty: true,
              add: i === 0 ? true : false
            });
          }
        } else {
          aux.push({
            empty: true,
            add: true
          });
        }

        //Filter collection that's show in modal
        let preModal = originCollection.collections.data.filter(item => {
          return _.find(shopResult, { collection: { id: item.id } }) ||
            item.is_root
            ? false
            : true;
        });

        setModalCollections(preModal);
        setShopCollections(aux);

        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    }
  }

  async function handleDelete(id) {
    setLoading(true);
    let result = await deleteShopCollection(Number.parseInt(id, 10));
    if (result) {
      loadShopCollections();
    }
  }

  return (
    <>
      <ModalAddShopCollection
        visibility={toggleModal}
        setVisibility={setTogglemodal}
        loadShopCollections={loadShopCollections}
        modalCollections={modalCollections}
      />
      <div className="office">        
      <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
        <h1>Coleções</h1>
      </div>  
      
        <Line/>
        <Card>
          {loading ? (
            <Loader active={loading} />
          ) : (
            <Slider {...settings}>
              {shopCollections.map((item, i) =>
                item.empty ? (
                  <div key={i} className="df fdc jc-c collection__item--fake">
                    <div className="collection__item--fake--divImg">
                      {item.add ? (
                        <div
                          className="collection__item--fake__add"
                          onClick={() => setTogglemodal(true)}
                        >
                          +
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="df fdc jc-c collection__item">
                    <div
                      className="collection__item--divImg"
                      style={{
                        backgroundImage: `url(${
                          item.collection.featured_asset !== null
                            ? item.collection.featured_asset.url
                            : ""
                        })`
                      }}
                    >
                      <div
                        className="collection__item--delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Delete />
                      </div>
                    </div>
                    <div>{item.collection.name}</div>
                  </div>
                )
              )}
            </Slider>
          )}
        </Card>
      </div>
    </>
  );
};

export default SectionCollections;
