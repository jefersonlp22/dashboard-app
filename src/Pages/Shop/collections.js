import React, { useEffect, useState } from "react";
import ShopLayout from "./index";
import { Table, Loader, Icons, VoidTemplate, Paginator, Line } from "../../components";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";

import { useIndexCollection, useDeleteCollection } from '../../hooks-api/useCollection';

import "./style.scss";

const ShopCollections = () => {
  const history = useHistory();
  const { data, loading , refetch } = useIndexCollection({});  
  const [ deleteCollection, { data: deletedCollection, loading: loadingDelete}] = useDeleteCollection();
  const [paginatorValues, setPaginatorValue] = useState(false);

  const handleLoadData = (params) =>{
    refetch({
      first: Number(params.first) || 10,
      page: Number(params.page) || 1,
      ...params
    });
  };

  useEffect(() => {    
    handleLoadData({
      first: paginatorValues?.first || 10,
      page: paginatorValues?.page || 1,
    });    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatorValues, deletedCollection]);

  async function handleDelete(id) {
    let swalResult = await Swal.fire({
      text: "Tem certeza que deseja remover esta coleção?",
      icon: "warning",
      confirmButtonText: "Sim",
      confirmButtonColor: "#0489cc",
      cancelButtonText: "Não",
      cancelButtonColor: "#086899",
      showCancelButton: true,
      showCloseButton: true
    });    

    if (id && swalResult.value) {
      deleteCollection({variables: { id }});            
    }
  }

  return (
    <ShopLayout>      
      <div className="df fdr jc-sb alic">
        <h1>Coleções</h1>
        <div>
          <Link className="button primary" to="/shop/colecoes/novo">
            Nova coleção
          </Link>
        </div>
      </div>
      <Line />

      {loading || loadingDelete ? (
        <ShopLayout.content className="df collections__content">
          <Loader active={loading || loadingDelete } />
        </ShopLayout.content>
      ) : (
        <>
          {data.collections.data.length >= 1 ? (
            <div
              className="df fdr jc-sb alic tableCollection__seeItens"
              style={{ marginBottom: 30 }}
            >
              <Table>
                {data.collections.data.map((item, rowIndex) => {
                  return item.name !== "__root" ? (
                    <Table.tr key={`row${rowIndex}`}>
                      <Table.td
                        onClick={() =>
                          history.push({
                            pathname: `/shop/colecoes/editar/${item.id}`
                          })
                        }
                      >
                        {item.name}
                      </Table.td>
                      <Table.td className="action__column">
                        <Icons.pencil
                          fill="#007196"
                          onClick={() =>
                            history.push({
                              pathname: `/shop/colecoes/editar/${item.id}`
                            })
                          }
                        />
                      </Table.td>
                      <Table.td className="action__column">
                        <Icons.delete
                          fill="#c8c7cc"
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                        />
                      </Table.td>
                    </Table.tr>
                  ) : null;
                })}
              </Table>
            </div>
          ) : (
            <VoidTemplate
              message={
                <VoidTemplate.default
                  message={
                    <>
                      Crie sua
                      <br /> primeira coleção.
                    </>
                  }
                  to="/shop/colecoes/novo"
                  buttonText="Nova coleção"
                />
              }
            />
          )}
        </>
      )}
      {data?.collections?.paginatorInfo &&
        <Paginator
          data={data.collections.paginatorInfo}
          onChange={setPaginatorValue}
        />
      }
    </ShopLayout>
  );
};

export default ShopCollections;
