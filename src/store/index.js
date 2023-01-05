import { createStore } from "redux";
import { combineReducers } from "redux";

const INITIAL_STATE = {
  id: "",
  name: "",
  code: "",
  price: 0.0,
  list_price: 0.0,
  type: "simple",
  quantity_items: 1,
  stock: 0,
  enabled: true,
  images: [
    { id: "", url: "" },
    { id: "", url: "" },
    { id: "", url: "" },
    { id: "", url: "" }
  ],
  share_image: "",
  description: "",
  variants: [],
  pack: [],
  fields: [],
  attributes: [],
  options: [],
  facet_values: [],
  collections: [],
  list: [],
  edit: false
};
//

function products(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "UPDATE_PRODUCT":      
      return { ...state, ...action.product };
    case "LOAD_PRODUCTS":
      return { ...state, ...{ list: action.products } };
    case "RESET_PRODUCT":
      let RESET_PRODUCT = {
        id: "",
        name: "",
        code: "",
        price: 0.0,
        list_price: 0.0,
        quantity_items: 1,
        type: 'simple',
        stock: 0,
        enabled: true,
        images: [
          { id: "", url: "" },
          { id: "", url: "" },
          { id: "", url: "" },
          { id: "", url: "" }
        ],
        share_image: "",
        description: "",
        variants: [{ id: "", sku: "", stock: "", price: 0.0, list_price: 0.0, values: Array(0) }],
        attributes: [],
        options: [],
        facet_values: [],
        collections: [],
        list: [],
        edit: false
      };
      return RESET_PRODUCT;
    default:
      return state;
  } 
}

const STATE_COLLECTIONS = {
  list: []
};
  

function collections(state = STATE_COLLECTIONS, action) {
  switch (action.type) {
    case "UPDATE_COLLECTIONS":
      return { ...state, list: action.collections };
    default:
      return state;
  }
}

// const ATRIBUTE_INITIAL_STATE = {
//   attributes: []
// };

// function attributes(state = ATRIBUTE_INITIAL_STATE, action) {
//   switch (action.type) {
//     case "UPDATE_ATTRIBUTE":
//       return { ...state, ...action.attribute };
//     default:
//       return state;
//   }
// }

const TALKS_STATE = {
  id: "",
  title: "",
  featured_asset: {},
  featured_image :"",
  content: "",
  tags: [],
  user_segments: "",
  user_groups: []
};

function talks(state = TALKS_STATE, action) {
  switch (action.type) {
    case "UPDATE_TALKS":
      return { ...state, ...action.talk };
    case "CANCEL_TALKS":
      return { ...TALKS_STATE };
    default:
      return state;
  }
}


const reducers = combineReducers({
  products,
  collections,
  talks
});

const store = createStore(reducers);

export default store;
