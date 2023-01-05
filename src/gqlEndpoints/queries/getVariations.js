import client from "../../services/GraphQlRequest";

const useVariations = callback => {
  const cli = client();

  const loadProducts = async ({ first = 10, page = 1, search = "" }) => {
    const query = `query{
        productVariants(
          first: ${first},
          page: ${page}
          ${
            search !== ""
              ? `
            ,filter:{              
              OR: [
                { column: NAME, operator: LIKE, value: "%${search}%" }
                { column: SKU, operator: LIKE, value: "%${search}%" }
              ]                
            }
          `
              : ""
          }
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
              sku
              stock
              price
              price_formatted
              list_price_formatted
            }
          }
    }`;

    try {
      let result = await cli.request(query);
      return result;
    } catch (e) {
      // console.log("Error ao buscar products", e);
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
    loadProducts
  };
};

export { useVariations };
