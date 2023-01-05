import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Row, Popover, Tag, Icons } from "../index";

import _ from "lodash";

import "./styles.scss";

const FooterPopover = props => (
  <div className="footerPopover">
    <Link className="footerPopover__link" to="#">
      Gerenciar atributos
      <Icons.next fill="currentColor" />
    </Link>
  </div>
);

const SelectFacets = props => {
  const [attributesSeted, setAttribute] = useState([]);
  const [searchedAttributes, setSearchedAttribute] = useState([]);
  const [tags, setTags] = useState([]);
  const [facets, setFacets] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [textResult, setTextResult] = useState("");

  function search(e) {
    let results = [];

    // eslint-disable-next-line array-callback-return
    results = tags.filter(i => {
      if (i.name) {
        const itemData = `${i.name.toUpperCase()}`;
        const textData = e.current.value.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }
    });

    setSearchText(e.current.value);
    setSearchedAttribute([...results]);
  }

  useEffect(() => {
    if (props.facets && props.facets.facets && props.facets.facets.data) {
      let tags = [];

      // eslint-disable-next-line array-callback-return
      props.facets.facets.data.map((facet, index) => {
        if (facet.values.length > 0) {
          facet.values.forEach(value => {
            tags.push({
              attribute: facet.name,
              id: value.id,
              name: value.name
            });
          });
        }
      });

      setTags([...tags]);
      setFacets([...tags]);
    }
  }, [props.facets]);

  useEffect(() => {
    if (searchText !== "") {
      if (searchedAttributes.length > 0) {
        let tagsFound = `${searchedAttributes.length} resultados para '${searchText}'`;
        setTextResult(tagsFound);
        setTags(searchedAttributes);
      } else {
        let tagsFound = `Nenhum resultado para '${searchText}'`;
        setTextResult(tagsFound);
        setTags([]);
      }
    } else {
      setTextResult("");
      setTags(facets);
      if (attributesSeted.length > 0) {
        let diff = _.differenceWith(facets, attributesSeted, _.isEqual);
        setTags(diff);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedAttributes]);

  useEffect(() => {
    if (attributesSeted.length === 0) {
      setTags([...facets]);
      props.onChange([]);
    } else {
      let seted = [];
      //Separe facets to save  && products
      // eslint-disable-next-line array-callback-return
      attributesSeted.map(attribute => {
        seted.push({ id: attribute.id });
      });
      props.onChange(seted);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesSeted]);

  return (
    <Row className="selectFacets__wrapper">
      <div className="selectFacets__wrapper--title">Atributos</div>
      <div className="selectFacets__wrapper--facets">
        {attributesSeted && attributesSeted.length > 0
          ? attributesSeted.map((tag, index) => (
              <Tag
                key={`tag${index}`}
                color="#0489cc"
                invert
                className="cursorPointer"
              >
                <span className="collections__tag--areaLabel">
                  {tag.attribute}
                </span>{" "}
                {tag.name}
                <span
                  className="collections__tag--closeIcon"
                  onClick={() => {
                    setTags([...tags, tag]);
                    let auxToSplice = attributesSeted;
                    auxToSplice.splice(index, 1);
                    setAttribute([...auxToSplice]);
                  }}
                >
                  x
                </span>
              </Tag>
            ))
          : null}

        <Popover
          headerSearch={true}
          searchOnChange={e => {
            search(e);
          }}
          top
          content={
            <div className="collections__tagsSearch">
              {textResult !== "" ? (
                <span className="collections__tagsSearch--resultText">
                  {textResult}
                </span>
              ) : null}
              {tags.map((tag, index) => (
                <Tag
                  key={`tag${index}`}
                  color="#0489cc"
                  invert
                  className="cursorPointer"
                  disabled={tag.disabled}
                  onClick={() => {
                    setAttribute([...attributesSeted, tag]);
                    tags.splice(index, 1);
                  }}
                >
                  <span className="collections__tag--areaLabel">
                    {tag.attribute}
                  </span>{" "}
                  {tag.name}
                </Tag>
              ))}
            </div>
          }
          footer={<FooterPopover />}
        >
          <Tag color="#0489cc" invert>
            Adicionar >
          </Tag>
        </Popover>
      </div>
    </Row>
  );
};

export { SelectFacets };
