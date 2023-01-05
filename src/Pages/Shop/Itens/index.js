import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Swal from "sweetalert2";
import ShopLayout from "../index";

import {
  Alert,
  AlertButton,
  Table,
  Icons,
  Loader,
  Button,
  VoidTemplate,
  Filter,
  Paginator
} from "../../../components";
import moment from 'moment';
import TotalStorage from "total-storage";
import { useIndexProduct, useDeleteProduct } from '../../../hooks-api/useProduct';

const ShopItens = ({ history }) => {
  const [deleteProduct, { data: deletedProduct, loading: loadingDelete }] = useDeleteProduct();
  const { data, loading, refetch } = useIndexProduct({
    filter: {
      AND: [
        { column: 'NAME', operator: 'LIKE', value: "" }
      ]
    }
  });

  const dispatch = useDispatch();

  const [alert, setAlert] = useState(false);
  const [paginatorValues, setPaginatorValue] = useState(false);

  const [filter, setFilter] = useState('');

  const [filterSchema] = useState({
    status: {
      label: "Status",
      type: "radio",
      values: [
        {
          label: "Aguardando aprovação",
          value: 'placed_at'
        },
      ]
    }
  });

  const handleNewItem = () => {
    dispatch({ type: "RESET_PRODUCT" });
    history.push("/shop/produtos/novo");
  };

  const handleLoadProducts = (params) => {
    refetch({
      first: Number(params.first) || 10,
      page: Number(params.page) || 1,
      filter: {
        AND: [
          {
            column: 'NAME',
            operator: 'LIKE',
            value: `${params?.search !== '' ? `%${params.search}%` : ''}`
          }
        ]
      }
    });
  };

  const handleEdit = async id => {
    history.push("/shop/produtos/edit/" + id);
  };

  const handleDelete = async id => {
    let swalResult = await Swal.fire({
      text: "Tem certeza que deseja remover este item?",
      icon: "warning",
      confirmButtonText: "Sim",
      confirmButtonColor: "#0489cc",
      cancelButtonText: "Não",
      cancelButtonColor: "#086899",
      showCancelButton: true,
      showCloseButton: true
    });

    if (id && swalResult.value) {
      deleteProduct({ variables: { id } });
    }
  };

  useEffect(() => {
    let savingReturn = TotalStorage.get("returnSaveProductSuccess");
    if (savingReturn) {
      setAlert(true);
      setTimeout(() => setAlert(false), 10000);
      TotalStorage.remove("returnSaveProductSuccess");
    }
    dispatch({ type: "RESET_PRODUCT" });

    handleLoadProducts({
      first: paginatorValues?.first || 10,
      page: paginatorValues?.page || 1,
      search: filter?.searchText || '',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, paginatorValues, deletedProduct]);

  return (
    <ShopLayout>
      <Alert show={alert}>
        <div>Produto salvo com sucesso!</div>
        <div>
          <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
        </div>
      </Alert>
      <Filter
        dateFilter={false}
        title={
          <div className="df fdr alic">
            <h1>Itens cadastrados</h1>
            <Link className="linkManageAttributes" to="/shop/atributos">
              Gerenciador de atributos
              </Link>
          </div>
        }
        setFilter={setFilter}
        searchPlaceholder='Nome'
        filterSchema={filterSchema}
        otherActions={
          <Button primary onClick={handleNewItem} style={{ marginLeft: 10 }}>
            Novo Item
            </Button>
        }
      />

      {loading || loadingDelete ? (
        <ShopLayout.content className="df collections__content">
          <Loader active={loading || loadingDelete} />
        </ShopLayout.content>
      ) : (
          <>
            {data.products.data.length > 0 ? (
              <Table
                headers={[
                  "Nome",
                  <div style={{ textAlign: "center" }}>Variações</div>,
                  <div style={{ textAlign: "center" }}>Modificado em</div>,
                  <div style={{ textAlign: "center" }}>Publicado</div>,
                  "",
                  ""
                ]}
              >
                {data.products.data.map((item, index) => (
                  <Table.tr key={`pl-${index}`}>
                    <Table.td
                      onClick={() => {
                        handleEdit(item.id);
                      }}
                    >
                      {item.name}
                    </Table.td>
                    <Table.td
                      onClick={() => {
                        handleEdit(item.id);
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        {JSON.stringify(item.variants.length)}
                      </div>
                    </Table.td>
                    <Table.td>
                      <div style={{ textAlign: "center" }}>
                        {moment(item.updated_at).format('DD/MM/YYYY HH:mm')}
                      </div>
                    </Table.td>
                    <Table.td>
                      <div style={{ textAlign: "center" }}>
                        {item?.published === 1 ?
                          <Icons.inputCheck /> : <Icons.inputError />}
                      </div>
                    </Table.td>
                    <Table.td className="action__column">
                      <Icons.pencil
                        fill="#007196"
                        onClick={() => {
                          handleEdit(item.id);
                        }}
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
                ))}
              </Table>
            ) : (
                <VoidTemplate
                  message={
                    <VoidTemplate.default
                      message={
                        <>
                          Você ainda não tem
                          <br /> nenhum item cadastrado...
                        </>
                      }
                      to="/shop/produtos/novo"
                      buttonText="Novo item"
                    />
                  }
                />
              )}
          </>
        )}
      <Paginator
        data={data?.products?.paginatorInfo}
        onChange={setPaginatorValue}
      />
    </ShopLayout>
  );
};

export default withRouter(ShopItens);
