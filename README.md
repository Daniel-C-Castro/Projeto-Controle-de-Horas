# Projeto-Controle-de-Horas

1. Descrição

Uma API que registra e guarda informações sobre horário de início e fim de um período de estudo/trabalho/projeto. Salva no banco de dados (json) e permite consultas posteriores. Essas consultas do banco de horas fornecem a data e horário das entradas e o período de tempo passado entre cada entrada e saída. No banco também fica registrado o nome do usuário. Futuramente, em caso de melhoria, já está previsto verificação por senha e mais funcionalidades, incluindo uma interface para o usuário.

O projeto está sendo executado através do script com nodemon, no VS Code. Foram utilizados o express, nodemon e date-fns.

Possui 3 rotas.

1. /entrada/:nomeUsuario - Pela qual o usuário coloca seu nome e dá entrada para contagem de tempo.

Caso seja a primeira vez do usuário, o sistema colocará seu nome no banco de dados e criará um histórico para que possa armazenar seus pontos para futura consulta.Caso
Além disso, é claro, cria uma data(horário) para que possa ser feito o cálculo de tempo quando for dado o ponto de saída.

Obs: Essa rota já tem uma funcionalidade que impede o usuário de dar um entrada enquanto houver outra entrada pendente(sem fechamento - horário de saída).

2. /saida/:nomeUsuario.
   O usuário coloca seu nome e fica sabendo quanto tempo passou desde sua ultima entrada até aquele momento.

Obs: essa rota também possui uma funcionalidade que impede que o usuário bata ponto de saída, se este não tiver um ponto de entrada em aberto.

3. /historico/:nomeUsuario/:mes

Nessa rota o usuario informa seu nome e mês que deseja saber seu histórico de horas. Ao solicitar, o usuario recebe dia e hora de entrada e saída e o período de tempo de cada entrada-saída.
