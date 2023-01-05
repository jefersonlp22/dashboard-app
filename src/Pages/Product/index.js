import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import Swal from "sweetalert2";
import ShopLayout from "./layout";

import {
  Alert,
  AlertButton,
  Table,
  Icons,
  Modal,
  InputText,
  Loader,
  Button,
  VoidTemplate,
  Filter,
  Paginator,
} from "../../components";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  useIndexProduct,
  useDeleteProduct,
  useDuplicateProduct,
} from "../../hooks-api/useProduct";


const ProductIndex = ({ history }) => {
  const [toogleModal, setToogleModal] = useState(false);

  const [duplicateName, setDuplicateName] = useState("");
  const [duplicateId, setDuplicateId] = useState("");
  const dispatch = useDispatch();
 

  const [
    deleteProduct,
    { data: deletedProduct, loading: loadingDelete },
  ] = useDeleteProduct();
  const [
    duplicateProduct,
    { data: duplicatedProduct, loading: loadingDuplicate },
  ] = useDuplicateProduct();

  const { data, loading, refetch } = useIndexProduct({
    filter: {
      AND: [{ column: "NAME", operator: "LIKE", value: "" }],
    },
  });

  const [loaderData, setLoaderData] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    type: "alertError",
    message: "",
  });
  const [paginatorValues, setPaginatorValue] = useState(false);
  const [filter, setFilter] = useState("");

  const [filterSchema] = useState({
    status: {
      label: "Status",
      type: "radio",
      values: [
        {
          label: "Aguardando aprovação",
          value: "placed_at",
        },
      ],
    },
  });

  const handleNewItem = () => {
    history.push("/shop/produtos/novo");
  };

  const handleDuplicateProduct = async () => {
    if (duplicateName !== "" && duplicateId !== "") {
      setToogleModal(false);
      setLoaderData(true);
      try {
        await duplicateProduct({
          variables: {
            id: Number(duplicateId),
            name: duplicateName,
          },
        });
        setAlert({
          status: true,
          message: "Produto duplicado com sucesso!",
        });
      } catch (e) {
        console.log("error", e);
        setAlert({
          status: true,
          type: "error",
          message: "Erro ao duplicar produto",
        });
      }
      await handleLoadProducts({
        first: paginatorValues?.first || 10,
        page: paginatorValues?.page || 1,
        search: filter?.searchText || "",
      });
      setLoaderData(false);
    }
  };

  const handleLoadProducts = async (params) => {
    await refetch({
      first: Number(params.first) || 10,
      page: Number(params.page) || 1,
      filter: {
        OR: [
          {
            column: "NAME",
            operator: "LIKE",
            value: `${params?.search !== "" ? `%${params.search}%` : ""}`,
          },
          {
            column: "CODE",
            operator: "LIKE",
            value: `${params?.search !== "" ? `%${params.search}%` : ""}`,
          },
        ],
      },
    });    
  };

  const handleEdit = async (id) => {
    history.push("/shop/produtos/edit/" + id);
  };

  const handleDelete = async (id) => {
    let swalResult = await Swal.fire({
      text: "Tem certeza que deseja remover este item?",
      icon: "warning",
      confirmButtonText: "Sim",
      confirmButtonColor: "#0489cc",
      cancelButtonText: "Não",
      cancelButtonColor: "#086899",
      showCancelButton: true,
      showCloseButton: true,
    });

    if (id && swalResult.value) {
      setLoaderData(true);
      try {
        await deleteProduct({ variables: { id } });
        setAlert({
          status: true,
          message: "Produto deletado com sucesso!",
        });
      } catch (e) {
        console.log("error", e);
        setAlert({
          status: true,
          type: "error",
          message: "Erro ao deletar produto",
        });
      }
      await handleLoadProducts({
        first: paginatorValues?.first || 10,
        page: paginatorValues?.page || 1,
        search: filter?.searchText || "",
      });
      setLoaderData(false);
    }
  };

  useEffect(() => {
    dispatch({ type: "RESET_PRODUCT" });
    handleLoadProducts({
      first: paginatorValues?.first || 10,
      page: paginatorValues?.page || 1,
      search: filter?.searchText || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, paginatorValues]);

  return (
    <ShopLayout>
      <Alert show={alert.status} type={alert.type}>
        <div>{alert.message}</div>
        <div>
          <AlertButton
            onClick={() =>
              setAlert({
                ...alert,
                status: false,
              })
            }
          >
            Fechar
          </AlertButton>
        </div>
      </Alert>
      <Filter
        dateFilter={false}
        title={
          <div className="df fdr alic">
            <h1>Produtos cadastrados</h1>
            <Link className="linkManageAttributes" to="/shop/atributos">
              Gerenciador de atributos
            </Link>
          </div>
        }
        setFilter={setFilter}
        searchPlaceholder="Nome ou Código"
        filterSchema={filterSchema}
        otherActions={
          <Button primary onClick={handleNewItem} style={{ marginLeft: 10 }}>
            Novo produto
          </Button>
        }
      />

      {loading || loaderData ? (
        <ShopLayout.content className="df collections__content">
          <Loader active={true} />
        </ShopLayout.content>
      ) : (
        <>
          {data.products.data.length > 0 ? (
            <Table
              headers={[
                "Código",
                "Nome",
                "Tipo",
                <div style={{ textAlign: "center" }}>Variações</div>,
                <div style={{ textAlign: "center" }}>Modificado em</div>,
                <div style={{ textAlign: "center" }}>Publicado</div>,
                <div style={{ textAlign: "center" }}>Duplicar</div>,
                "",
              ]}
            >
              {data.products.data.map((item, index) => (
                <Table.tr key={`pl-${index}`}>
                  <Table.td
                    onClick={() => {
                      handleEdit(item.id);
                    }}
                  >
                    {item.code}
                  </Table.td>
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
                    {item.type === "simple" ? "Simples" : "Kit"}
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
                      {moment(item.updated_at).format("DD/MM/YYYY HH:mm")}
                    </div>
                  </Table.td>
                  <Table.td>
                    <div style={{ textAlign: "center" }}>
                      {item?.published === 1 ? (
                        <Icons.inputCheck />
                      ) : (
                        <Icons.inputError />
                      )}
                    </div>
                  </Table.td>

                  <Table.td className="action__column">
                    <div style={{ textAlign: "center" }}>
                      <Icons.duplicate
                        fill="#0489cc"
                        onClick={() => {
                          setDuplicateId(item.id);
                          setDuplicateName(`Duplicado de ${item.name}`);
                          setToogleModal(!toogleModal);
                        }}
                      />
                    </div>
                  </Table.td>

                  <Table.td className="action__column">
                    <div className="df fdr alic">
                      <Icons.pencil
                        fill="#0489cc"
                        onClick={() => {
                          handleEdit(item.id);
                        }}
                      />
                      <div style={{ width: 10 }}></div>
                      <Icons.delete
                        fill="#c8c7cc"
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      />
                    </div>
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
                      <br /> nenhum produto cadastrado...
                    </>
                  }
                  to="/shop/produtos/novo"
                  buttonText="Novo produto"
                />
              }
            />
          )}
        </>
      )}

      <Modal
        classes={`modal-items`}
        visible={toogleModal}
        onClose={() => setToogleModal(!toogleModal)}
      >
        <div>
          <h2 className="modal--item">Duplicar Produto</h2>
          <div style={{ marginTop: 50, width: "100%" }}>
            <InputText
              className="light"
              text={"Nome do produto"}
              type="title"
              required
              label="Nome do produto"
              value={duplicateName}
              onChange={(e) => {
                e.persist();
                setDuplicateName(e.target.value);
              }}
            />
          </div>
          <div>
            <Button
              onClick={() => handleDuplicateProduct()}
              primary
              style={{ marginTop: 20, width: "100%" }}
            >
              Criar novo produto
            </Button>
          </div>
        </div>
      </Modal>

      <Paginator
        data={data?.products?.paginatorInfo}
        onChange={setPaginatorValue}
      />
    </ShopLayout>
  );
};

export default withRouter(ProductIndex);
