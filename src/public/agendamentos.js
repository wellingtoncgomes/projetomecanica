/*$(function() {
  $.get("/users", function(users) {
    users.forEach(function(user) {
      $("<li></li>")
        .text(user.name)
        .appendTo("ul#users");
    });
  });
});*/

$(function() {
  // Função para carregar os agendamentos
  function loadAgendamentos() {
    $.get("lista-agendamentos", function(agendamentos) {
      agendamentos.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
      });
      agendamentos.forEach(function(agendamento) {
        // Formatar a data e o horário
        var dataFormatada = new Date(agendamento.date).toLocaleString();
        
        // Criar uma string com as informações formatadas
        var info = `
        <div class="w3-card-4 w3-margin" id="component">
        <h6 class="w3-text-indigo"><i class="fa fa-user fa-fw w3-margin-right"></i>${agendamento.client} - <span class="w3-tag w3-indigo w3-round">${dataFormatada}</span> - ${agendamento.service}</h6>
        <form class="form-update" action="/atualizar-agendamento" method="POST">
          <input type="hidden" name="id" value="${agendamento.id}">
          <input type="datetime-local" name="newDate" placeholder="Nova data e hora" required>
          <button type="submit" class="btn-update">Atualizar</button>
        </form>
        <form class="form-delete" action="/excluir-agendamento" method="POST">
          <input type="hidden" name="id" value="${agendamento.id}">
          <button type="submit" class="btn-delete">Excluir</button>
        </form>
        </div>`;
      
        // Adicionar o agendamento ao elemento <ul>
        $("<ol></ol>")
          .html(info)
          .appendTo("ul#agendamentos");
      });
    });
  }

  // Carregar os agendamentos quando a página é carregada
  loadAgendamentos();

  // Adicionar um evento de envio para os formulários de atualização
  $("ul#agendamentos").on("submit", ".form-update", function(event) {
    event.preventDefault(); // Evitar o comportamento padrão de envio do formulário
    
    var form = $(this);
    var id = form.find("input[name='id']").val();
    var newDate = form.find("input[name='newDate']").val();
    
    $.post(form.attr("action"), { id: id, newDate: newDate }, function() {
      // Recarregar os agendamentos após a atualização
      $("ul#agendamentos").empty(); // Limpar a lista antes de recarregar
      loadAgendamentos(); // Recarregar os agendamentos
    });
  });

  // Adicionar um evento de envio para os formulários de exclusão
  $("ul#agendamentos").on("submit", ".form-delete", function(event) {
    event.preventDefault(); // Evitar o comportamento padrão de envio do formulário
    
    var form = $(this);
    var id = form.find("input[name='id']").val();
    
    $.post(form.attr("action"), { id: id }, function() {
      // Recarregar os agendamentos após a exclusão
      $("ul#agendamentos").empty(); // Limpar a lista antes de recarregar
      loadAgendamentos(); // Recarregar os agendamentos
    });
  });
});