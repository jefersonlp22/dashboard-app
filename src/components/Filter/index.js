import React, { useState, useEffect } from "react";

import {
  Row,
  Line,
  RangePicker,
  Icons,
  RightDrawer,
  SimpleTag,
  Button
} from "../index";

import moment from 'moment';

import { FilterMenu } from "./FilterMenu";
import { AccordionFilter } from "./AccordionFilter";
import InputSearch from "./InputSearch";

import "./styles.scss";

function mapObject(object, callback) {
  return Object.keys(object).map(function(key, index) {
    return callback(key, object[key], index);
  });
}

const Filter = ({
  title,
  dateFilter = true,
  textFilter = true,
  setFilter,
  filterSchema,
  changeSchema,
  otherActions,
  searchPlaceholder,
  enabled = true,
  ...props
}) => {
  const [rightDrawer, toggleRightDrawer] = useState(false);
  const [filterState, setFilterState] = useState({});
  const [cloneSchema] = useState(filterSchema);
  const [, setHasFilter] = useState(false);

  const toggleInArray = (value, name) => {
    if (filterState.hasOwnProperty(name)) {
      let current = filterState[name].indexOf(value);
      if (current >= 0) {
        filterState[name].splice(current, 1);
      } else {
        filterState[name].push(value);
      }
      setFilterState({ ...filterState });
    }
  };

  const overrideInArray = (value, name) => {
    if (filterState.hasOwnProperty(name)) {
      if (filterState[name][0] === value) {
        filterState[name].pop();
      } else {
        filterState[name][0] = value;
      }
      setFilterState({ ...filterState });
    }
  };

  const clearAllFilters = () => {
    let initialDate = moment().startOf('month').format('YYYY-MM-DDT00:00:00');

    let state = filterState;
    state.searchText = "";
    state.startDate = new Date(initialDate);
    state.endDate = new Date();
    mapObject(filterState, (key, value, index) => {
      if (["searchText", "startDate", "endDate"].indexOf(key) < 0) {
        filterState[key] = [];
      }
    });
    setFilterState({ ...state });
  };

  const handleActions = {
    checkbox: (value, name) => toggleInArray(value, name),
    radio: (value, name) => overrideInArray(value, name)
  };

  const applyFilter = () => {
    setFilter(filterState);
    toggleRightDrawer(false);
  };

  useEffect(() => {
    let initialDate = moment().startOf('month').format('YYYY-MM-DDT00:00:00');

    let state = {
      searchText: "",
      startDate: new Date(initialDate),
      endDate: new Date()
    };

    mapObject(filterSchema, (key, value, index) => {
      Object.defineProperty(state, key, {
        enumerable: true, //  enumerável
        configurable: true, //  configurável
        writable: true, //  gravável
        value: []
      });
    });
    setFilterState(state);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (filterState) {
      let filterCount = 0;
      mapObject(filterSchema, (key, value, index) => {
        if (
          ["searchText", "startDate", "endDate"].indexOf(key) < 0 &&
          filterState[key] &&
          filterState[key].length > 0
        ) {
          filterCount++;
        }
      });
      if (filterCount > 0) {
        setHasFilter(true);
      } else {
        setHasFilter(false);
      }
    }
    // eslint-disable-next-line
  }, [filterState]);

  return (
    <>
      <Row className="jc-sb alic">
        <div className="df fdr jc-start alic">
          <h1>{title}</h1>
          {enabled && dateFilter ? (
            <>{props.date === "none" ? null : (
              <RangePicker
                startDate={filterState.startDate || new Date()}
                setStartDate={date => {
                  let copy = filterState;
                  copy.startDate = date;
                  setFilterState({ ...copy });
                }}
                endDate={filterState.endDate || new Date()}
                setEndDate={date => {
                  let copy = filterState;
                  copy.endDate = date;
                  setFilterState({ ...copy });
                }}
              />
            )}
            </>
          ):null}
        </div>    

        <div className="df fdr jc-start alic">
          {enabled ? (
            <>
              { textFilter? (
                <InputSearch
                  placeholder={searchPlaceholder}
                  value={filterState.searchText || ""}
                  forceState={true}
                  onValueChange={value => {
                    let copy = filterState;
                    copy.searchText = value;
                    setFilterState({ ...copy });
                  }}
                  triggerAction={() => applyFilter()}

                />
              ): null}
              {/* <Icons.filterNotify
                cursor={"pointer"}
                fillIcon={hasFilter ? "#0489cc" : "#b2b2b3"}
                fillNotify={hasFilter ? "#ff6f6f" : "transparent"}
                onClick={() => {
                  toggleRightDrawer(!rightDrawer);
                }}
              /> */}
              <div style={{marginLeft: 20}}>
                <Button secundary type="button" onClick={() => applyFilter()} className="btFullWidth">Pesquisar</Button>
              </div>
            </>
          ):null}
          {otherActions}
        </div>
      </Row>
      {enabled ? (
        <>
          {false ? (
            <Row className="jc-start alic filterCurrentFilter">
              <div className="filterCurrentFilter--title">Filtros: </div>
              {mapObject(filterState, (key, value, index) => {
                if (
                  ["searchText", "startDate", "endDate"].indexOf(key) < 0 &&
                  filterState[key].length > 0
                ) {
                  return filterState[key].map((item, index) => (
                    <SimpleTag
                      key={`keyTag${index}`}
                      color="#b2b2b3"
                      icon={
                        <Icons.closeSmall
                          fill="#FFF"
                          onClick={() => {
                            filterState[key].splice(index, 1);
                            setFilterState({ ...filterState });
                          }}
                        />
                      }
                    >
                      <span>{filterSchema[key].label}</span>
                      <span>{item}</span>
                    </SimpleTag>
                  ));
                }
              })}
            </Row>
          ) : null}
          <RightDrawer toggleActive={rightDrawer}>
            <FilterMenu
              closeDrawer={toggleRightDrawer}
              clearFilter={clearAllFilters}
              handleAction={() => applyFilter()}
            >
              {mapObject(cloneSchema, (key, value, index) => {
                return (
                  <AccordionFilter
                    filterName={cloneSchema[key].label}
                    key={`filterMenuKey${index}`}
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
                              filterState[key] &&
                              filterState[key].indexOf(filterValue.value) > -1
                                ? true
                                : false
                            }
                            onChoose={e => {
                              handleActions[cloneSchema[key].type](
                                e.currentTarget.value,
                                key
                              );
                            }}
                          />
                        ))
                      : null}
                  </AccordionFilter>
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

export { Filter };
