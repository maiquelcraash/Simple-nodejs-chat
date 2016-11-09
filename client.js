/**
 * Created by maiquel on 08/11/16.
 */

(function () {
	"use strict";

	var net = require("net");

	//conecta a um server na porta 3000 (por padrão ele pega o host localhost)
	var client = net.connect(3000);

	client.on("connect", function () {
		client.write("Hello, I am the client!");
	});

	client.on("data", function (data) {
		console.log(data.toString());
	});

	client.on("end", function () {								//quando a conexão for encerrada, fecha o client
		process.exit();
	});

	process.stdin.on("readable", function () {					//listener para teclado
		var message = process.stdin.read();						//le conteudo digitado
		if (!message) return;									//verifica se não é null
		message = message.toString().replace(/\n/, ''); 		//retira o \n

		client.write(message);									//escreve na conexão

	});

}());