function adicionarServico() {
    var descricao = document.getElementById("descricao").value;
    var valor = parseFloat(document.getElementById("valor").value);
  
    if (!descricao || isNaN(valor) || valor <= 0) {
      alert("Por favor, preencha a descrição e o valor corretamente.");
      return;
    }
  
    var table = document.getElementById("tabelaOrcamento");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2); // Adicionando uma nova célula para o botão de remoção
    cell1.innerHTML = descricao;
    cell2.innerHTML = "R$ " + valor.toFixed(2);
    cell3.innerHTML = "<button onclick='removerServico(this)'>Remover</button>"; // Botão de remoção
    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";   
}
  
function gerarOrcamento() {
  // Obtendo informações do formulário
  var nome = document.getElementById("nome").value;
  var data = document.getElementById("data").value;
  var modelo = document.getElementById("modelo").value;
  var placa = document.getElementById("placa").value;
  var contato = document.getElementById("contato").value;

  // Criando objeto de orçamento
  var orcamento = {
      "client": nome,
      "date": data,
      "amount": "", // Será preenchido posteriormente
      "contact": contato,
      "vehicleModel": modelo,
      "vehiclePlate": placa,
      "services": [] // Inicialmente vazio
  };

  // Obtendo informações da tabela de orçamento
  var table = document.getElementById("tabelaOrcamento");
  for (var i = 1; i < table.rows.length; i++) {
      var descricao = table.rows[i].cells[0].innerText;
      var valor = parseFloat(table.rows[i].cells[1].innerText.replace("R$ ", ""));
      // Adicionando serviço ao objeto de orçamento
      orcamento.services.push({
          "descricao": descricao,
          "valor": valor
      });
  }

  // Calculando o total do orçamento
  var total = 0;
  for (var j = 0; j < orcamento.services.length; j++) {
      total += orcamento.services[j].valor;
  }
  orcamento.amount = total.toFixed(2);

  // Enviando os dados para o backend
  fetch('/orcamentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orcamento)
  })
  .then(response => response.json())
  .then(data => {
    window.location.href = data.redirectUrl;
  })
  .catch(error => {
    console.error('Erro:', error);
  });
}

function removerServico(button) {
    var row = button.parentNode.parentNode; 
    row.parentNode.removeChild(row); 
}