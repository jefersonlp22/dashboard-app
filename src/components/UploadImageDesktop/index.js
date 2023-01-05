import React, { useState, useEffect } from "react";
import { Button } from "../Buttons";

import "./uploadImage.scss";

import Swal from "sweetalert2";

const swalStyled = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success"
  },
  buttonsStyling: true
});


const UploadImageDesktop = ({ url, base64, onChange, ...props }) => {
  const [image, setImage] = useState(null);

  let fileRef = React.createRef();

  useEffect(() => {
    if (base64) {
      setImage(base64);
    }
  }, [base64]);

  const imagesToBase64 = async evt => {
    return new Promise((resolve, reject) => {
      let tgt = evt.target;
      let files = tgt.files;

      let _URL = window.URL || window.webkitURL;
      let img = new Image();

      if(files[0].size <= 2000000){

        var objectUrl = _URL.createObjectURL(files[0]);

        img.onload = function () {

          if(this.width <= 1600 && this.height <= 1800){

            if (FileReader && files && files.length) {
              var fr = new FileReader();
              fr.onload = function() {
                resolve(fr.result);
              };
              fr.readAsDataURL(files[0]);
            }

          }else {
            swalStyled.fire({
              icon: "error",
              title: "As dimensões da imagem excederam o limite permitido",
              text: "Tente novamente selecionando uma imagem com dimensões máximas de 1600px largura por 1800px de altura",
              showConfirmButton: false,
              showCloseButton: true
            });
          }


          _URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;

      }else{
        swalStyled.fire({
          icon: "error",
          title: "A imagem excedeu o tamanho permitido",
          text: "Tente novamente selecionando uma imagem com até 2MB.",
          showConfirmButton: false,
          showCloseButton: true
        });
      }
    });
  };

  return (
    <div
      className="uploadImageDesktop"
      style={{
        backgroundImage: `url("${image || url}")`,
        backgroundPosition: "50%",
        backgroundSize: "cover",
        borderRadius: "5px",
        backgroundRepeat: "no-repeat"
      }}
    >
      <input
        type="file"
        style={{ display: "none" }}
        name={props.name}
        onChange={async e => {
          e.persist();
          try {
            const base64Image = await imagesToBase64(e);
            setImage(base64Image);
            if (onChange) onChange(base64Image, e);
          } catch (error) {
            console.error(error);
            // window.alert(
            //   "Não foi possível fazer o upload da imagem. Tente novamente daqui a alguns instantes."
            // );
          }
        }}
        ref={fileRef}
      />
      <Button
        primary
        onClick={() => {
          fileRef.current.click();
        }}
        type="button"
      >
        {props.buttonText ? (
          <>
            {url || image
              ? props.buttonText.btChange
              : props.buttonText.btDefault}
          </>
        ) : (
          <>{image ? "TROCAR" : "ADICIONAR"}</>
        )}
      </Button>
    </div>
  );
};

export { UploadImageDesktop };
