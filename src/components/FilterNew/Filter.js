import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Row, Line, Icons, RightDrawer, SimpleTag } from "../index";
import _ from "lodash";
import moment from "moment";
import { FilterMenu } from "./FilterMenu";
import { AccordionFilter } from "./Option";
import { DateOption } from "./Date";
import InputSearch from "./InputSearch";
import { FilterContext } from "./index";
import OptionSearchable from "./OptionSearchable";

import "./styles.scss";

function mapObject(object, callback) {
  if (object) {
    return Object.keys(object).map(function (key, index) {
      return callback(key, object[key], index);
    });
  }
}

export default ({
  dateSchema,
  filterSchema,
  title,
  searchPlaceholder,
  contextState,
  dateFilter = true,
  textFilter = true,
  otherActions,
  enabled = true,
  action,
  ...props
}) => {
  const { filter, setFilter } = useContext(FilterContext);

  const [rightDrawer, toggleRightDrawer] = useState(false);
  const [cloneSchema, setCloneSchema] = useState(filterSchema);
  const [hasFilter, setHasFilter] = useState(false);

  const checkDefaultOption = (array, value) =>
    value || _.find(array, { default: true });

  const filterTagModel = {
    searchText: (key, index, value) => (
      <SimpleTag
        key={`keySearchText${index}`}
        color="#b2b2b3"
        icon={
          <Icons.closeSmall
            fill="#FFF"
            onClick={() => {
              filter[key] = "";
              setFilter({ ...filter });
            }}
          />
        }
      >
        <span className="small">Busca por: </span>
        <span>{value}</span>
      </SimpleTag>
    ),
    date: (key, index) => (
      <SimpleTag
        key={`keyDate${index}`}
        color="#b2b2b3"
        icon={
          <Icons.closeSmall
            fill="#FFF"
            onClick={() => {
              handleActions["date"](null, key);
            }}
          />
        }
      >
        <span className="small">{cloneSchema[key].label || ""}</span>
        <span>{`
          ${moment(filter[key].from).format("DD/MM/YYYY")}
          ${cloneSchema[key]?.date_type !== "SINGLE_DATE" ? '-' + moment(filter[key].to).format("DD/MM/YYYY") : ''}
          `}</span>
      </SimpleTag>
    ),

    checkbox: (key, index) => {
      return _.find(filter[key], { value: "all" }) ? (
        <SimpleTag
          key={`keyTag${index}`}
          color="#b2b2b3"
          icon={
            <Icons.closeSmall
              fill="#FFF"
              onClick={() => {
                filter[key] = null;
                setFilter({ ...filter });
              }}
            />
          }
        >
          <span className="small">{filterSchema[key]?.label || ""}</span>
          <span>Todos</span>
        </SimpleTag>
      ) : (
        filter[key].map((item) => (
          <SimpleTag
            key={`keyTag${key}Alter${index}`}
            color="#b2b2b3"
            icon={
              <Icons.closeSmall
                fill="#FFF"
                onClick={() => {
                  filter[key].splice(_.indexOf(filter[key], item), 1);
                  setFilter({ ...filter });
                }}
              />
            }
          >
            <span className="small">{filterSchema[key]?.label || ""}</span>
            <span>{item.label}</span>
          </SimpleTag>
        ))
      );
    },
    radio: (key, index, value) => {
      return (
        <SimpleTag
          key={`keyTag${index}`}
          color="#b2b2b3"
          icon={
            <Icons.closeSmall
              fill="#FFF"
              onClick={() => {
                filter[key] = null;
                setFilter({ ...filter });
              }}
            />
          }
        >
          <span className="small">{filterSchema[key]?.label || ""}</span>
          <span>
            {filterSchema[key].required
              ? checkDefaultOption(filterSchema[key]?.values, value).label
              : value.label}
          </span>
        </SimpleTag>
      );
    },
  };

  const checkIsChecked = {
    checkbox: (key, value) => {
      return _.findIndex(filter[key], value) > -1;
    },
    radio: (key, value) => {
      return _.isEqual(filter[key], value);
    },
  };

  const toggleInArray = (value, name) => {
    if (value === "all" && filter.hasOwnProperty(name)) {
      if (filter[name] && filter[name].indexOf("all") >= 0) {
        console.log('aki',filter);
        setFilter({ ...filter, [name]: [] });
      } else {
        let all = cloneSchema[name].values.map((item) => item.value);
        console.log('aki1',filter);
        setFilter({ ...filter, [name]: all });
      }
    } else if (filter.hasOwnProperty(name)) {

      if (filter[name] && filter[name].length) {
        let current = filter[name].indexOf(value);
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
      console.log('aki2',filter);
      setFilter({ ...filter });
    }
  };

  const toggleRadio = (value, name) => {
    if (filter.hasOwnProperty(name)) {
      filter[name] = value;
      setFilter({ ...filter });
    }
  };

  const updateValueArray = (value, name) => {
    if (filter.hasOwnProperty(name)) {
      setFilter({ ...filter, [name]: value });
    }
  };

  const refreshFilter = () => {
    let state = {
      searchText: "",
    };

    const defaultValues = {
      radio: (values) => checkDefaultOption(values),
      checkbox: (values) => values,
      date: (values) => values,
      searchText: (values) => values,
    };
    mapObject(filterSchema, (key, value, index) => {
      Object.defineProperty(state, key, {
        enumerable: true, //  enumerável
        configurable: true, //  configurável
        writable: true, //  gravável
        value:
          value.required && value.values
            ? defaultValues[filterSchema[key].type](value.values)
            : null,
      });
    });

    console.log("STATE FILTER", state);

    setFilter(state);
  };

  const clearAllFilters = () => {
    Swal.fire({
      text: "Tem certeza que deseja excluir esse filtro?",
      icon: "question",
      confirmButtonText: "Excluir",
      confirmButtonColor: "#0489cc",
      cancelButtonText: "Voltar",
      cancelButtonColor: "#086899",
      showCancelButton: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.value) {
        refreshFilter();
        setCloneSchema({});
        setCloneSchema({ ...filterSchema });
      }
    });
  };

  const handleActions = {
    checkbox: (value, name) => toggleInArray(value, name),
    radio: (value, name) => toggleRadio(value, name),
    date: (value, name) => updateValueArray(value, name),
    fullvalue: (value, name) => updateValueArray(value, name),
  };

  const applyFilter = () => {
    action({ filter });
    toggleRightDrawer(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refreshFilter(), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (filter) {
      applyFilter()
    }
  }, [filter]);

  useEffect(() => {
    if (filter) {
      let filterCount = 0;
      mapObject(filterSchema, (key, value, index) => {
        if (filter[key]) {
          filterCount++;
        }
      });
      if (filterCount > 0 || filter.searchText !== "") {
        setHasFilter(true);
      } else {
        setHasFilter(false);
      }

      // console.log("The filter is: ", filter);
    }
    // eslint-disable-next-line
  }, [filter]);

  // console.log('other',otherActions);

  return (
    <>
      <Row className="jc-sb alic">
        <div className="df fdr jc-start alic">

          <h1>{title}</h1>
        </div>
        <div className="df fdr jc-start alic">
          {enabled ? (
            <>
              {textFilter ? (
                <InputSearch
                  placeholder={searchPlaceholder}
                  value={filter?.searchText || ""}
                  forceState={true}
                  onValueChange={(value) => {
                    let copy = filter;
                    copy.searchText = value;
                    setFilter({ ...copy });
                  }}
                  triggerAction={() => applyFilter()}
                />
              ) : null}
              <Icons.filterNotify
                cursor={"pointer"}
                fillIcon={"#b2b2b3"}
                fillNotify={hasFilter ? "#048DCC" : "transparent"}
                onClick={() => {
                  toggleRightDrawer(!rightDrawer);
                }}
              />
            </>
          ) : null}
          {otherActions}
        </div>
      </Row>
      {enabled ? (
        <>
          {hasFilter ? (
            <Row className="jc-start alic filterCurrentFilter">
              <div className="filterCurrentFilter--title">Filtros: </div>
              {mapObject(filter, (key, value, index) => {
                if (key === "searchText" && value !== "") {
                  return filterTagModel[key](key, index, value);
                } else if (
                  filter[key] &&
                  cloneSchema[key]?.type &&
                  filterTagModel[cloneSchema[key].type]
                ) {
                  return filterTagModel[cloneSchema[key].type](
                    key,
                    index,
                    value
                  );
                }
              })}
              <div
                className="filterCurrentFilter--apply"
                onClick={() => applyFilter()}
              >
                Aplicar
              </div>
            </Row>
          ) : null}
          <RightDrawer toggleActive={rightDrawer}>
            <FilterMenu
              closeDrawer={toggleRightDrawer}
              clearFilter={clearAllFilters}
              handleAction={() => applyFilter()}
              isEnabled={!hasFilter}
            >
              {mapObject(cloneSchema, (key, value, index) => {
                return cloneSchema[key].type === "date" ? (
                  <DateOption
                    closeCalendar={rightDrawer}
                    key={`filterDateMenuKey${index}`}
                    {...cloneSchema[key]}
                    clear={filter && filter[key] == null}
                    onChange={(values) => {
                      handleActions[cloneSchema[key].type](values, key);
                    }}
                  />
                ) : (
                  <div key={`filterMenuKey${index}`}>
                    {cloneSchema[key]?.isSearchable ? (
                      <OptionSearchable
                        schemaKey={key}
                        label={cloneSchema[key].label}
                        placeholder={cloneSchema[key].placeholder}
                        model={cloneSchema[key].model}
                        useQuery={cloneSchema[key].useQuery}
                        key={`filterMenuKey${index}`}
                      />
                    ) : (
                      <AccordionFilter
                        filterName={cloneSchema[key].label}
                        key={`filterMenuKeyAlter${index}`}
                      >
                        {cloneSchema[key].values
                          ? cloneSchema[key].values.map((filterValue, j) => (
                              <AccordionFilter.option
                                type={cloneSchema[key].type}
                                name={key}
                                key={`filterMenuValue${index}${j}`}
                                label={filterValue.label}
                                value={filterValue.value}
                                checked={
                                  filter &&
                                  filter[key] &&
                                  checkIsChecked[cloneSchema[key].type](
                                    key,
                                    filterValue
                                  )
                                }
                                onChoose={(e) => {
                                  handleActions[cloneSchema[key].type](
                                    filterValue,
                                    key
                                  );
                                }}
                              />
                            ))
                          : null}
                      </AccordionFilter>
                    )}
                  </div>
                );
              })}
            </FilterMenu>
          </RightDrawer>
        </>
      ) : null}
      <Line />
    </>
  );
};
