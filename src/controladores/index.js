const fs = require("fs/promises");

const { getDate, getMonth, format } = require("date-fns");

const lerArquivo = async (caminhoArquivo) => {
  return await fs.readFile(caminhoArquivo);
};

const startTempo = async (req, res) => {
  const { nomeUsuario } = req.params;

  try {
    const horaEntrada = new Date();

    let usuarios = await fs.readFile("./src/bancodedados/bancodehoras.json");

    let parseUsuarios = JSON.parse(usuarios);

    const jaExiste = parseUsuarios.usuarios.find((pessoa) => {
      return pessoa.nome === nomeUsuario;
    });

    if (!jaExiste) {
      parseUsuarios.usuarios.push({
        nome: nomeUsuario,
        entradas: [horaEntrada],
        saidas: [],
        times: [],
      });
    }

    const indexUsuario = parseUsuarios.usuarios.findIndex((usuario) => {
      return usuario.nome === nomeUsuario;
    });

    const entradasQuantidade =
      parseUsuarios.usuarios[indexUsuario].entradas.length;
    const saidasQuantidade = parseUsuarios.usuarios[indexUsuario].saidas.length;
    console.log(entradasQuantidade, saidasQuantidade);
    if (entradasQuantidade > saidasQuantidade + 1) {
      return res
        .status(402)
        .json(
          "Você precisar bater o ponto de saída antes de dar entrada novamente"
        );
    }

    if (jaExiste) {
      parseUsuarios.usuarios[indexUsuario].entradas.push(horaEntrada);
    }

    await fs.writeFile(
      "./src/bancodedados/bancodehoras.json",
      JSON.stringify(parseUsuarios)
    );
    const dateFormatado = format(horaEntrada, "d'/'MMM'-'HH':'mm");

    return res.status(201).json(`${nomeUsuario}: ${dateFormatado}`);
  } catch (erro) {
    return res.send(erro.message);
  }
};

const stopTempo = async (req, res) => {
  try {
    const { nomeUsuario } = req.params;

    const horaSaida = new Date();

    const timeStampSaida = +horaSaida;

    const usuarios = await fs.readFile("./src/bancodedados/bancodehoras.json");

    const parseUsuarios = JSON.parse(usuarios);

    const jaExiste = parseUsuarios.usuarios.find((pessoa) => {
      return pessoa.nome === nomeUsuario;
    });

    if (!jaExiste) {
      return res
        .status(404)
        .json(
          "O usuário não está cadastrado. É necessário ter um ponto de entrada antes de solicitar o ponto de saída! Caso não conste no banco de dados, o usuário é automaticamente cadastrado ao dar o ponto de entrada."
        );
    }

    const indexUsuario = parseUsuarios.usuarios.findIndex((usuario) => {
      return usuario.nome === nomeUsuario;
    });

    const entradasQuantidade =
      parseUsuarios.usuarios[indexUsuario].entradas.length;
    const saidasQuantidade = parseUsuarios.usuarios[indexUsuario].saidas.length;

    if (entradasQuantidade <= saidasQuantidade) {
      return res
        .status(402)
        .json(
          "Você precisar bater o ponto de entrada antes de bater o ponto de saida"
        );
    }

    parseUsuarios.usuarios[indexUsuario].saidas.push(horaSaida);

    const entradas = parseUsuarios.usuarios[indexUsuario].entradas;
    const horaEntrada = entradas[entradas.length - 1];
    const timeStampEntrada = Date.parse(horaEntrada);

    const tempo = (timeStampSaida - timeStampEntrada) / 60000;

    parseUsuarios.usuarios[indexUsuario].times.push({
      dia: horaEntrada,
      tempo: tempo,
    });

    await fs.writeFile(
      "./src/bancodedados/bancodehoras.json",
      JSON.stringify(parseUsuarios)
    );

    const dateFormatado = format(horaSaida, "d'/'MMM'-'HH':'mm");
    return res
      .status(201)
      .json(`${nomeUsuario}: ${dateFormatado} - ${tempo.toFixed(2)} min`);
  } catch (erro) {
    res.status(500).json(erro.message);
  }
};

const historicoMes = async (req, res) => {
  try {
    const { nomeUsuario, mes } = req.params;

    const usuarios = await fs.readFile("./src/bancodedados/bancodehoras.json");
    const parseUsuarios = JSON.parse(usuarios);

    const jaExiste = parseUsuarios.usuarios.find((pessoa) => {
      return pessoa.nome === nomeUsuario;
    });

    if (!jaExiste) {
      return res.status(404).json("Usuário não consta no banco de dados.");
    }

    const indexUsuario = parseUsuarios.usuarios.findIndex((usuario) => {
      return usuario.nome === nomeUsuario;
    });

    const entradas = parseUsuarios.usuarios[indexUsuario].entradas;

    const arrayEntradas = entradas.map((entrada) => entrada.split(""));

    const arrayEntradasMes = arrayEntradas.filter((entrada) => {
      return entrada[6] === mes;
    });

    const entradasMes = arrayEntradasMes.map((entrada) => {
      return entrada.join("");
    });

    const entradasFormatadas = entradasMes.map((entrada) => {
      return format(Date.parse(entrada), "d'/'MM'-'HH':'mm");
    });

    const times = parseUsuarios.usuarios[indexUsuario].times;

    const historico = { HistoricoMes: [], Usuario: nomeUsuario };

    let i = 0;
    for (let item of entradasFormatadas) {
      let time = Math.floor(times[i].tempo);
      let horas;
      let minutos;
      let segundos;
      if (time < 3600) {
        horas = 0;
        minutos = (time % 3600) / 60;
        segundos = time % 60;
      }

      if (time >= 3600) {
        horas = time / 3600;
        minutos = (time % 3600) / 60;
        segundos = time % 60;
      }

      historico.HistoricoMes.push({
        Data: item,
        Tempo: `${horas.toFixed(0)}:${minutos.toFixed(0)}:${segundos.toFixed(
          0
        )}`,
      });
      i++;
    }

    return res.status(201).json(historico);
  } catch (erro) {
    res.status(500).json(erro.message);
  }
};

module.exports = {
  startTempo,
  stopTempo,
  historicoMes,
};
