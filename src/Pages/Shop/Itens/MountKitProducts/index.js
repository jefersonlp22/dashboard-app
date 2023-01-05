import React, { useState, useEffect } from "react";
import { Icons } from "../../../../components/Icons";
import { Line, Switch } from "../../../../components";
import NumberFormat from "react-number-format";
import _ from "lodash";
import AsyncSelect from "react-select/async";
import "./styles.scss";

import { useVariations } from "../../../../gqlEndpoints/queries";

const MountKitProducts = ({
  text,
  onChange,
  initialValue,
  currentType,
  pack,
  setChanged,
  setPackType,
  defaultValue,
  name,
  form,
  ...props
}) => {
  const { loadProducts } = useVariations();
  const [fields, setField] = useState(pack || []);
  const [isType, setIsType] = useState(true);

  const [totalKit, setTotalKit] = useState(0);
  const [totalPromoKit, setTotalPromoKit] = useState(0);
  const [qtdItensKit, setQtdItensKit] = useState(0);

  const handleChange = (key, index, value) => {
    let update = fields;
    update[index][key] = value;
    setField([...update]);
  };

  const handleRemove = index => {
    let remove = fields;
    remove.splice(index, 1);
    setField([...remove]);
    if (fields.length <= 0) {
      setQtdItensKit(0);
      setTotalKit(0);
      setTotalPromoKit(0);
    }
  };

  const addField = () => {
    setField([
      ...fields,
      {
        name: "",
        sku: "",
        original_price: "",
        setted_price: "",
        quantity: 1,
        stock: 0,
        subtotal: "",
        final_price: ""
      }
    ]);
  };

  const loadOptions = async (inputValue, callback) => {
    let result = [];
    let options = [];
    if (inputValue !== "") {
      result = await loadProducts({ search: inputValue });
    }
    if (result) {
      let filtered = _.map(result.productVariants.data, item => {
        return { value: item, label: `${item.sku} = ${item.name}` };
      });
      options = filtered;
    }

    callback(options);
  };

  const handleSearch = (newValue, action) => {
    return newValue;
  };

  const handleSelect = (value, action, index) => {
    let update = fields;
    update[index] = {
      product_variant_id: value.value.id,
      sku: value.value.sku,
      name: value.value.name,
      original_price: parseFloat(value.value.price) / 100,
      setted_price: parseFloat(value.value.price) / 100,
      quantity: 1,
      stock: value.value.stock,
      subtotal: parseFloat(value.value.price) / 100,
      final_price: parseFloat(value.value.price) / 100
    };
    setField([...update]);
  };

  const countQuantity = () =>
    fields.reduce((total, { quantity }) => total + quantity, 0);

  const price = () =>
    fields.reduce((count, { final_price }) => count + final_price, 0);

  const list_price = () =>
    fields.reduce((count, { subtotal }) => count + subtotal, 0);

  const serializeFields = array => {
    let serialized = _.cloneDeep(array);
    return serialized.map(item => {
      if (item.product_variant_id && item.product_variant_id !== "") {
        let toSave = {
          product_variant_id: Number(item.product_variant_id),
          quantity: Number(item.quantity),
          setted_price: Math.round(parseFloat(item.setted_price) * 100),
          subtotal: Math.round(parseFloat(item.subtotal) * 100),
          price: Math.round(parseFloat(item.price) * 100),
          final_price: Math.round(parseFloat(item.final_price) * 100)
        };
        if (item.id) {
          toSave.id = item.id;
        }
        return toSave;
      }
      return null;
    });
  };

  const serializeInitialValue = array => {
    let serialize = _.cloneDeep(array);
    return serialize.map(item => ({
      id: item.id,
      product_variant_id: item.product_variant_id,
      sku: item.product_variant.sku,
      name: item.product_variant.name,
      original_price: item.product_variant.price / 100,
      setted_price: item.setted_price / 100,
      quantity: item.quantity,
      stock: item.product_variant.stock,
      price: item.price / 100,
      subtotal: item.subtotal / 100,
      final_price: item.final_price / 100
    }));
  };

  useEffect(() => {
    if (!pack || pack?.length <= 0) {
      if (initialValue) {
        let serilizedInitialValue = serializeInitialValue(initialValue);
        setField(serilizedInitialValue);
      }
    }

    if (currentType === "compound") {
      setIsType(true);
    } else {
      setIsType(false);
    }

    // eslint-disable-next-line
  }, [initialValue, currentType]);

  useEffect(() => {
    if (onChange && fields.length) {
      onChange(
        serializeFields(fields),
        countQuantity(),
        price(),
        list_price(),
        fields
      );
      setTotalKit(list_price());
      setTotalPromoKit(price());
      setQtdItensKit(countQuantity());
    }

    if (defaultValue && typeof defaultValue === "string") {
      let parsed = JSON.parse(defaultValue);
      setField(parsed);
    }

    // eslint-disable-next-line
  }, [fields, defaultValue]);

  return (
    <div className="mountKitProducts">
      <div>
        <label className="mountKitProducts--title">{text}</label>
      </div>
      <Line />
      <div className="df fdr ali-fe jc-sb" style={{ width: "100%" }}>
        <div style={{ marginRight: 15 }} className="input_wrapper">
          <p className="mountKitProducts--title">Preço total do kit</p>
          <NumberFormat
            thousandSeparator={"."}
            decimalSeparator={","}
            decimalScale={2}
            allowedDecimalSeparators=","
            fixedDecimalScale={true}
            prefix={"R$ "}
            value={totalKit}
            className="light"
            disabled={true}
          />
        </div>
        <div style={{ marginRight: 15 }} className="input_wrapper">
          <p className="mountKitProducts--title">
            Preço total promocional do kit
          </p>
          <NumberFormat
            thousandSeparator={"."}
            decimalSeparator={","}
            decimalScale={2}
            allowedDecimalSeparators=","
            fixedDecimalScale={true}
            prefix={"R$ "}
            value={totalPromoKit}
            className="light"
            disabled={true}
          />
        </div>
        <div style={{ marginRight: 15 }} className="input_wrapper">
          <p className="mountKitProducts--title">Quantidade de itens do kit</p>
          <NumberFormat value={qtdItensKit} className="light" disabled={true} />
        </div>
        <div className="alsc">
          <Switch
            isOn={isType}
            label="Habilitar Preço por unidade"
            activeStateLabel="Ativo"
            inactiveStateLabel="Inativo"
            switchLabelClassName="widthSwitch"
            handleToggle={(e, value) => {
              setIsType(!isType);
              setPackType(!isType ? "compound" : "pack");
            }}
          />
        </div>
      </div>
      <Line />


      {fields?.map((field, index) => (
        <div
          key={`inKv${index}`}
          className="df fdr alic"
          style={{ marginBottom: 30 }}
        >
          <div>
            <br />
            <div className="df fdr alic">
              <div className="df fdr alic" style={{ width: '50%' }}>
                <div className="input_wrapper" style={{ width: '100%' }}>
                  <p className="input_wrapper--title">Item {index + 1}</p>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    value={{
                      value: field.product_variant_id,
                      label: `${field?.sku ? `${field?.sku} - ` : ""} ${field.name
                        }`
                    }}
                    loadOptions={loadOptions}
                    placeholder="Selecione..."
                    noOptionsMessage={() =>
                      "Para buscar, digite pelo menos, 3 caracteres"
                    }
                    loadingMessage={() => "Pesquisando..."}
                    onInputChange={handleSearch}
                    onChange={(value, action) => {
                      handleSelect(value, action, index)
                    }
                    }
                    classNamePrefix="mountAsyncInput"
                  />
                </div>
              </div>
              <div className="df fdr alic" style={{ width: '50%' }}>
                <div className="input_wrapper" >
                  <p className="input_wrapper--title">Preço inicial unitário</p>
                  <NumberFormat
                    thousandSeparator={"."}
                    allowedDecimalSeparators=","
                    decimalSeparator={","}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={"R$ "}
                    value={field.original_price}
                    className="light"
                    disabled={true}
                    onValueChange={values => {
                      handleChange("price", index, values.floatValue);
                    }}
                  />
                </div>
                <div className="input_wrapper">
                  <p className="input_wrapper--title">Qtd. em estoque</p>
                  <NumberFormat
                    value={field.stock}
                    className="light"
                    disabled={true}
                  />
                </div>

              </div>

            </div>
            <Line />
            <div className="df fdr alic">

              <div style={{ marginRight: 15 }} className="input_wrapper">
                <p className="input_wrapper--title">
                  Preço promocional unitário
                </p>
                <NumberFormat
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  decimalScale={2}
                  allowedDecimalSeparators=","
                  fixedDecimalScale={true}
                  prefix={"R$ "}
                  className="light"
                  value={field.setted_price}
                  onValueChange={values => {
                    let calc = values.floatValue * field.quantity;
                    if (!Number(calc)) {
                      calc = field.price;
                    }
                    handleChange("final_price", index, calc);
                    handleChange("setted_price", index, values.floatValue);
                  }}
                />
              </div>

              <div style={{ marginRight: 15 }} className="input_wrapper">
                <p className="input_wrapper--title">Quantidade</p>
                <NumberFormat
                  text="Quantidade"
                  value={field.quantity}
                  className="light"
                  onValueChange={values => {
                    let subtotal = values.floatValue * field.original_price;
                    let total = values.floatValue * field.setted_price;

                    if (!Number(subtotal)) {
                      subtotal = field.original_price;
                    }
                    if (!Number(total)) {
                      total = field.setted_price;
                    }

                    handleChange("subtotal", index, subtotal);
                    handleChange("final_price", index, total);
                    handleChange("quantity", index, values.floatValue);
                  }}
                />
              </div>

              <div style={{ marginRight: 15 }} className="input_wrapper">
                <p className="input_wrapper--title">Preço total incial</p>
                <NumberFormat
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  decimalScale={2}
                  allowedDecimalSeparators=","
                  fixedDecimalScale={true}
                  prefix={"R$ "}
                  value={field.subtotal}
                  className="light"
                  disabled={true}
                  onValueChange={values => {
                    handleChange("subtotal", index, values.floatValue);
                  }}
                />
              </div>
              <div style={{ marginRight: 15 }} className="input_wrapper">
                <p className="input_wrapper--title">Preço total promocional</p>
                <NumberFormat
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  decimalScale={2}
                  allowedDecimalSeparators=","
                  fixedDecimalScale={true}
                  prefix={"R$ "}
                  text="Preço final"
                  disabled={true}
                  value={field.final_price}
                  className="light"
                  onValueChange={values => {
                    handleChange("final_price", index, values.floatValue);
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="inputKeyValue__remove"
            onClick={() => handleRemove(index)}
          >
            <Icons.circleTrash
              fill={"currentColor"}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      ))}
      <Line />
      <div className="inputKeyValue__add" onClick={() => addField()}>
        <Icons.circleAdd />
        Adicionar Produto
      </div>
    </div>
  );
};

export { MountKitProducts };
