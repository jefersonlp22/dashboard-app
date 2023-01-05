import _ from "lodash";

function validarCNPJ(s) {
  let cnpj = s.replace(/[^\d]+/g, "");

  // Valida a quantidade de caracteres
  if (cnpj.length !== 14) return false;

  // Elimina inválidos com todos os caracteres iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Cáculo de validação
  let t = cnpj.length - 2,
    d = cnpj.substring(t),
    d1 = parseInt(d.charAt(0)),
    d2 = parseInt(d.charAt(1)),
    calc = (x) => {
      let n = cnpj.substring(0, x),
        y = x - 7,
        s = 0,
        r = 0;

      for (let i = x; i >= 1; i--) {
        s += n.charAt(x - i) * y--;
        if (y < 2) y = 9;
      }

      r = 11 - (s % 11);
      return r > 9 ? 0 : r;
    };

  return calc(t) === d1 && calc(t + 1) === d2;
}

function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}

/*SE role ambassador && APPS ['dashboard', 'office'] -> o usuário é Master (app e dash)
SE role ambassador && APPS ['office'] -> o usuário é Embaixador (apenas app)
SE role admin -> o usuário é admin (apenas dash)*/

function checkAccesLevel(level = []) {
  let user = JSON.parse(localStorage.getItem("USER"));

  if (user?.is_super_admin === 1) {
    return true;
  } else if (
    user?.roles[0]?.name === "admin" &&
    !level.includes("ambassador")
  ) {
    return true;
  } else if (user?.roles[0]?.name === "ambassador" && user?.apps?.length) {
    let app = _.find(user?.apps, ["name", "dashboard"]);
    return app && level.includes(user?.roles[0]?.name);
  }

  return user?.roles[0]?.name;
}

function checkSuperAdmin(level = []) {
  let user = JSON.parse(localStorage.getItem("USER"));

  if (user?.is_super_admin === 1) {
    return true;
  }

  return false;
}

function Trim(strTexto) {
  // Substitúi os espaços vazios no inicio e no fim da string por vazio.
  return strTexto.replace(/^s+|s+$/g, "");
}

// Função para validação de CEP.
function IsCEP(strCEP, blnVazio) {
  // Caso o CEP não esteja nesse formato ele é inválido!
  var objER = /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/;

  strCEP = Trim(strCEP);
  if (strCEP.length > 0) {
    if (objER.test(strCEP)) return true;
    else return false;
  } else return blnVazio;
}

export { validarCNPJ, IsCEP, formatCnpjCpf, checkAccesLevel, checkSuperAdmin };
