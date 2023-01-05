import { useState } from "react";
import client from "../../services/GraphQlRequest";

const useProducts = callback => {
  const cli = client();
  const [products, setProducts] = useState([]);

  const loadProducts = async ({first = 10, page = 1, search = ''}) => {
    const query = `query{
        products(
          first: ${first},
          page: ${page}
          ${ search !== '' ? `
            ,filter:{
              AND: [
                  { column: NAME, operator: LIKE, value: "%${search}%" }
                ]
            }
          `: ''}
        ){
            paginatorInfo{
              total
              count
              currentPage
              firstItem
              hasMorePages
              lastItem
              lastPage
              perPage
            }
            data{
              id
              name
              code
              enabled
              quantity_items
              published
              variants{
                id
                quantity_items
                list_price
              }
              share_asset{
                id
                url
                raw_url
              }
              updated_at
            }
          }
    }`;

    try {
      let result = await cli.request(query);
      return result;
    } catch (e) {
      console.log("Error ao buscar products", e);
    }
  };

  const loadCatalogProducts = async ({first = 10, page = 1, searchText = ''}) => {
    console.log('searchText',searchText)
    const query = `query{
        catalogProducts(
          first: ${first},
          page: ${page}
          ${ searchText !== '' ? `
          filter:{
            AND: [
              {
                OR: [
                  { column: CODE, operator: LIKE, value: "%${searchText}%" },
                  { column: NAME, operator: LIKE, value: "%${searchText}%" }
                ]
              }
            ]
          }
          `: ''}
        ){
            paginatorInfo{
              total
              count
              currentPage
              firstItem
              hasMorePages
              lastItem
              lastPage
              perPage
            }
            data{
              id
              name
              code
              enabled
              quantity_items
              published
            }
          }
    }`;

    try {
      let result = await cli.request(query);
      return result?.catalogProducts?.data;
    } catch (e) {
      console.log("Error ao buscar products", e);
    }
  };

  const loadProduct = async first => {
    const query = `query{
        product(id: ${first}){
              id
              name
              code
              enabled
              description
              quantity_items
              type
              datasheet
              pack_variants{
                id
                quantity
                product_variant_id
                setted_price
                subtotal
                final_price
                price
                product_variant{
                  id
                  name
                  sku
                  price
                  price_formatted
                  list_price_formatted
                  stock
                }
              }
              variants{
                id
                sku
                stock
                price
                list_price
                enabled
                quantity_items
                values {
                  id
                  name
                  option{
                    name
                  }
                }
              }
							options{
                id
                name
                values {
                  id
                  name
                }
              }
              featured_asset{
                id
                url
                raw_url
              }

              facet_values{
                id
                name
                facet{name color}
              }

              assets{
                id
                url
                raw_url
              }

              share_asset{
                id
                url
                raw_url
              }
          }
          facets(first:1000){
            data{
              id
              name
              color
              values{
                id
                name
              }
            }

          }
    }`;

    try {
      let result = await cli.request(query);
      return result;
    } catch (e) {
      console.log("Error ao buscar products", e);
    }
  };

  return {
    loadProduct,
    loadProducts,
    products,
    loadCatalogProducts
  };
};

export { useProducts };
