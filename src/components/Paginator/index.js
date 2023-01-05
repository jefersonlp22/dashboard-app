import React, { useState, useMemo } from "react";
import { Icons } from "../Icons";
import Select from "react-select";
import "./styles.scss";

const Paginator = ({ data, onChange }) => {
  const [first, setFirst] = useState(10);
  const [page, setPage] = useState(1);
  const defaultState = {
    count: 0,
    currentPage: 0,
    firstItem: 0,
    hasMorePages: false,
    lastItem: 0,
    lastPage: 0,
    perPage: 0,
    total: 0
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const state = useMemo(() => data || defaultState, [data]);

  const optionsSelect = [
    { value: 10, label: "10 por página" },
    { value: 20, label: "20 por página" },
    { value: 30, label: "30 por página" },
    { value: 40, label: "40 por página" },
    { value: 50, label: "50 por página" },
    { value: 60, label: "60 por página" }
  ];

  return (
    <div className="paginator">
      <div className="paginator__nav">
        <button
          className="paginator__page"
          disabled={page === 1}
          onClick={() => {
            setPage(page - 1);
            onChange({ first, page: page - 1 });
          }}
        >
          <Icons.next
            className="paginator__arrow--left"
            fill={page === 1 ? "#c3c3c3" : "#4d4d4d"}
          />
        </button>

        <div className="paginator__page indicator" disabled={true}>
          {data?.currentPage ? data.currentPage : page} de {state.lastPage}
        </div>

        <button
          className="paginator__page"
          disabled={page === state?.lastPage}
          onClick={() => {
            setPage(page + 1);
            onChange({ first, page: page + 1 });
          }}
        >
          <Icons.next
            className="paginator__arrow--right"
            fill={page === state?.lastPage ? "#c3c3c3" : "#4d4d4d"}
          />
        </button>
      </div>
      <div className="paginator__amount">
        <Select
          onChange={value => {
            setFirst(value.value);
            onChange({ first: value.value, page });
          }}
          isSearchable={false}
          classNamePrefix="top__select--Select"
          options={optionsSelect}
          defaultValue={optionsSelect[0]}
        />
      </div>
    </div>
  );
};

export { Paginator };
