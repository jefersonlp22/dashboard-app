import React, { useEffect, useState, useContext } from "react";
import { Icons } from "../../Icons";
import { CircleLoader } from "../../Loader";
import { AccordionFilter } from "../Option";
import { FilterContext } from "../../FilterNew";
import _ from "lodash";
import "./styles.scss";

export default ({
  label,
  model,
  useQuery,
  placeholder,
  schemaKey,
  ...props
}) => {
  const { filter, setFilter } = useContext(FilterContext);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { handleQuery, loading, results } = useQuery({});

  useEffect(() => {
    if (results) {
      setData(results);
    }
  }, [results]);

  async function handleSearch() {
    handleQuery({ searchText });
  }

  function clearSearch() {
    setSearchText("");
    setData([]);
    filter[schemaKey] = null;
    setFilter({ ...filter });
  }

  const toggleInArray = (value, name) => {
    let current = _.findIndex(filter[schemaKey], value);

    if (filter.hasOwnProperty(name)) {
      if (filter[name] && filter[name].length) {
        if (current >= 0) {
          filter[name].splice(current, 1);

          let checkAll = filter[name].indexOf("all");
          if (checkAll >= 0) {
            filter[name].splice(checkAll, 1);
          }
        } else {
          filter[name].push(value);
        }
      } else {
        filter[name] = [value];
      }
      setFilter({ ...filter });
    }
  };

  return (
    <div className="AccordionFilter">
      <div className="df fdr alic jc-sb AccordionFilter--header">
        <div>{label}</div>
      </div>
      <div className="optionSearchable--searchField">
        <input
          type="text"
          className="optionSearchable--input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === "Enter" && searchText.length >= 3) {
              handleSearch();
            }
          }}
        />
        <div className="optionSearchable--iconField">
          {data.length ? (
            <Icons.trash
              fill="#4A4A4A"
              onClick={() => clearSearch()}
              cursor="pointer"
            />
          ) : (
            <Icons.search
              fill="#4A4A4A"
              onClick={() => handleSearch()}
              cursor="pointer"
            />
          )}
        </div>
      </div>

      {loading ? (
        <div className="loaderResults">
          <CircleLoader color="#4A4A4A" active={true} />
        </div>
      ) : null}

      <div>
        {data.length
          ? data.map((item, i) => (
              <AccordionFilter.option
                type="checkbox"
                name={label}
                key={`searchableItem${label}${i}`}
                label={item?.label}
                value={item?.email}
                checked={_.findIndex(filter[schemaKey], item) > -1}
                onChoose={(e) => {
                  toggleInArray(item, schemaKey);
                }}
              />
            ))
          : null}
      </div>
    </div>
  );
};
