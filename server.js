/**
 * Created by maiquel on 08/11/16.
 */

(function () {
	"use strict";

	var net = require("net");

	var connections = [];					//array que guarda as connections
	var broadcast = function (message, origin) {
		connections.forEach(function (connection) {
			if (connection === origin) return;										//compara para ver se a mensagem n vai para o mesmo cara que mandou ela
			connection.write(message);
		});
	};

	//cria servidor escutando na porta 3000 (listener de connections)
	var server = net.createServer(function (connection) {							//callback é uma connection
		connections.push(connection);

		connection.write("Hello, i am the server");									//avisa o client que conectou

		connection.on("data", function (data) {										//fica ouvindo resposta do client
			var command = data.toString();
			if (command.indexOf("/nickname") === 0) {								//verifica se vem prefixado o nickname
				var nickname = command.replace("/nickname ", '');					//retira o texto nickname
				broadcast(connection.nickname + " now is " + nickname, connection);	//avisa os outros clients sobre a troca de nickname
				connection.nickname = nickname;										//adiciona nickname na conexão
				return;
			}
			broadcast(connection.nickname + " > " + data, connection);											//e depois espalha para os outros clientes
		});

		connection.on("end", function () {											//detecta que o client saiu
			broadcast(connection.nickname + " has left!", connection);				//avisa que o client saiu aos demais
			connections.splice(connections.indexOf(connection), 1);					//remove a conexão do array de conections
		});
	}).listen(3000);


}());