const entidadesEmpresariais = [
  {
    codigo: "201-1",
    natureza: "Empresa Pública",
    entity: "Administrador, Diretor ou Presidente",
    qualification: "05, 10 ou 16"
  },
  {
    codigo: "203-8",
    natureza: "Sociedade de Economia Mista",
    entity: "Diretor ou Presidente",
    qualification: "10 ou 16"
  },
  {
    codigo: "204-6",
    natureza: "Sociedade Anônima Aberta",
    entity: "Administrador, Diretor ou Presidente",
    qualification: "05, 10 ou 16"
  },
  {
    codigo: "205-4",
    natureza: "Sociedade Anônima Fechada",
    entity: "Administrador, Diretor ou Presidente",
    qualification: "05, 10 ou 16"
  },
  {
    codigo: "206-2",
    natureza: "Sociedade Empresária Limitada",
    entity: "Administrador ou Sócio-Administrador",
    qualification: "05 ou 49"
  },
  {
    codigo: "207-0",
    natureza: "Sociedade Empresária em Nome Coletivo",
    entity: "Sócio-Administrador",
    qualification: "49"
  },
  {
    codigo: "208-9",
    natureza: "Sociedade Empresária em Comandita Simples",
    entity: "Sócio Comanditado",
    qualification: "24"
  },
  {
    codigo: "209-7",
    natureza: "Sociedade Empresária em Comandita por\nAções",
    entity: "Diretor ou Presidente",
    qualification: "10 ou 16"
  },
  {
    codigo: "212-7",
    natureza: "Sociedade em Conta de Participação",
    entity: "Procurador ou Sócio Ostensivo",
    qualification: "17 ou 31"
  },
  {
    codigo: "213-5",
    natureza: "Empresário (Individual)",
    entity: "Empresário",
    qualification: "50"
  },
  {
    codigo: "214-3",
    natureza: "Cooperativa",
    entity: "Diretor ou Presidente",
    qualification: "10 ou 16"
  },
  {
    codigo: "215-1",
    natureza: "Consórcio de Sociedades",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "216-0",
    natureza: "Grupo de Sociedades",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "217-8",
    natureza: "Estabelecimento, no Brasil, de Sociedade\nEstrangeira",
    entity: "Procurador",
    qualification: "17"
  },
  {
    codigo: "219-4",
    natureza:
      "Estabelecimento, no Brasil, de Empresa\nBinacional Argentino-Brasileira",
    entity: "Procurador",
    qualification: "17"
  },
  {
    codigo: "221-6",
    natureza: "Empresa Domiciliada no Exterior",
    entity: "Procurador",
    qualification: "17"
  },
  {
    codigo: "222-4",
    natureza: "Clube/Fundo de Investimento",
    entity: "Responsável",
    qualification: "43"
  },
  {
    codigo: "223-2",
    natureza: "Sociedade Simples Pura",
    entity: "Administrador ou Sócio-Administrador",
    qualification: "05 ou 49"
  },
  {
    codigo: "224-0",
    natureza: "Sociedade Simples Limitada",
    entity: "Administrador ou Sócio-Administrador",
    qualification: "05 ou 49"
  },
  {
    codigo: "225-9",
    natureza: "Sociedade Simples em Nome Coletivo",
    entity: "Sócio-Administrador",
    qualification: "49"
  },
  {
    codigo: "226-7",
    natureza: "Sociedade Simples em Comandita Simples",
    entity: "Sócio Comanditado",
    qualification: "24"
  },
  {
    codigo: "227-5",
    natureza: "Empresa Binacional",
    entity: "Diretor",
    qualification: "10"
  },
  {
    codigo: "228-3",
    natureza: "Consórcio de Empregadores",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "229-1",
    natureza: "Consórcio Simples",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "230-5",
    natureza:
      "Empresa Individual de Responsabilidade Limitada (de Natureza Empresária)",
    entity:
      "Administrador, Procurador ou Titular Pessoa Física Residente ou Domiciliado no Brasil",
    qualification: "05, 17 ou 65"
  },
  {
    codigo: "231-3",
    natureza:
      "Empresa Individual de Responsabilidade Limitada (de Natureza Simples)",
    entity:
      "Administrador, Procurador ou Titular Pessoa Física Residente ou Domiciliado no Brasil",
    qualification: "05,17 ou 65"
  },
  {
    codigo: "303-4",
    natureza: "Serviço Notarial e Registral (Cartório)",
    entity: "Tabelião ou Oficial de Registro",
    qualification: "32 ou 42"
  },
  {
    codigo: "306-9",
    natureza: "Fundação Privada",
    entity: "Administrador, Diretor, Presidente ou\nFundador",
    qualification: "05, 10, 16 ou\n54"
  },
  {
    codigo: "307-7",
    natureza: "Serviço Social Autônomo",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "308-5",
    natureza: "Condomínio Edilício",
    entity: "Administrador ou Síndico\n(Condomínio)",
    qualification: "05 ou 19"
  },
  {
    codigo: "310-7",
    natureza: "Comissão de Conciliação Prévia",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "311-5",
    natureza: "Entidade de Mediação e Arbitragem",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "312-3",
    natureza: "Partido Político",
    entity: "Administrador ou Presidente",
    qualification: "05 ou 16"
  },
  {
    codigo: "313-1",
    natureza: "Entidade Sindical",
    entity: "Administrador ou Presidente",
    qualification: "05 ou 16"
  },
  {
    codigo: "320-4",
    natureza:
      "Estabelecimento, no Brasil, de Fundação ou\nAssociação Estrangeiras",
    entity: "Procurador",
    qualification: "17"
  },
  {
    codigo: "321-2",
    natureza: "Fundação ou Associação domiciliada no\nexterior",
    entity: "Procurador",
    qualification: "17"
  },
  {
    codigo: "322-0",
    natureza: "Organização Religiosa",
    entity: "Administrador, Diretor ou Presidente",
    qualification: "05, 10 ou 16"
  },
  {
    codigo: "323-9",
    natureza: "Comunidade Indígena",
    entity: "Responsável Indígena",
    qualification: "61"
  },
  {
    codigo: "324-7",
    natureza: "Fundo Privado",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "399-9",
    natureza: "Associação Privada",
    entity: "Administrador, Diretor ou Presidente",
    qualification: "05, 10 ou 16"
  },
  {
    codigo: "401-4",
    natureza: "Empresa Individual Imobiliária",
    entity: "Titular",
    qualification: "34"
  },
  {
    codigo: "408-1",
    natureza: "Contribuinte Individual",
    entity: "Produtor Rural",
    qualification: "59"
  },
  {
    codigo: "409-0",
    natureza: "Candidato a Cargo Político Eletivo",
    entity: "Candidato a Cargo Político Eletivo",
    qualification: "51"
  }
];

const adminPulic = [
  {
    codigo: "101-5",
    natureza: "Órgão Público do Poder Executivo Federal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "102-3",
    natureza:
      "Órgão Público do Poder Executivo Estadual\nou do Distrito Federal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "103-1",
    natureza: "Órgão Público do Poder Executivo Municipal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "104-0",
    natureza: "Órgão Público do Poder Legislativo Federal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "105-8",
    natureza:
      "Órgão Público do Poder Legislativo Estadual\nou do Distrito Federal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "106-6",
    natureza: "Órgão Público do Poder Legislativo Municipal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "107-4",
    natureza: "Órgão Público do Poder Judiciário Federal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "108-2",
    natureza: "Órgão Público do Poder Judiciário Estadual",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "110-4",
    natureza: "Autarquia Federal",
    entity: "Administrador ou Presidente",
    qualification: "05 ou 16"
  },
  {
    codigo: "111-2",
    natureza: "Autarquia Estadual ou do Distrito Federal",
    entity: "Administrador ou Presidente",
    qualification: "05 ou 16"
  },
  {
    codigo: "112-0",
    natureza: "Autarquia Municipal",
    entity: "Administrador ou Presidente",
    qualification: "05 ou 16"
  },
  {
    codigo: "113-9",
    natureza: "Fundação Federal",
    entity: "Presidente",
    qualification: "16"
  },
  {
    codigo: "114-7",
    natureza: "Fundação Estadual ou do Distrito Federal",
    entity: "Presidente",
    qualification: "16"
  },
  {
    codigo: "115-5",
    natureza: "Fundação Municipal",
    entity: "Presidente",
    qualification: "16"
  },
  {
    codigo: "116-3",
    natureza: "Órgão Público Autônomo Federal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "117-1",
    natureza: "Órgão Público Autônomo Estadual ou do\nDistrito Federal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "118-0",
    natureza: "Órgão Público Autônomo Municipal",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "119-8",
    natureza: "Comissão Polinacional",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "120-1",
    natureza: "Fundo Público",
    entity: "Administrador",
    qualification: "05"
  },
  {
    codigo: "121-0",
    natureza: "Associação Pública",
    entity: "Presidente",
    qualification: "16"
  }
];

const extraterritoriais = [
  {
    codigo: "501-0",
    natureza: "Organização Internacional",
    entity: "Representante de Organização\nInternacional",
    qualification: "41"
  },
  {
    codigo: "502-9",
    natureza: "Representação Diplomática Estrangeira",
    entity:
      "Diplomata, Cônsul, Ministro de Estado\ndas Relações Exteriores ou Cônsul\nHonorário",
    qualification: "39, 40, 46 ou\n60"
  },
  {
    codigo: "503-7",
    natureza: "Outras Instituições Extraterritoriais",
    entity: "Representante da Instituição\nExtraterritorial",
    qualification: "62"
  }
];

export { entidadesEmpresariais, adminPulic, extraterritoriais };
