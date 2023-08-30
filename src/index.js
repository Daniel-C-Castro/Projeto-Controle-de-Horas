/* rota para criar hora de entrada
1. saber o nome do usuario que está dando entrada
2. '/entrada/:nomeUsuario'

Os valores de timestamp servirão para calcular o tempo passado
Esses valores vão ser obtidos somente para isso

Serão guardados os valores de timestamp das entradas,
quando tiver o timestamp de saida, será feito o calculo de tempo
E ambos serão apagados, permanecendo no banco de dados somente as datas e horas 

*/
const express = require('express');

const { rotas } = require('./rotas/routes');

const app = express();

app.use(express.json());

app.use(rotas);

app.listen(8000);