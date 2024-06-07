$(function() {
    // Função para carregar os orçamentos
    function loadOrcamentos() {
        $.get("lista-orcamentos", function(orcamentos) {
            orcamentos.sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            });
            orcamentos.forEach(function(orcamento) {
                // Formatar a data e o horário
                var dataFormatada = new Date(orcamento.date).toLocaleString();

                // Criar uma string com as informações formatadas
                var info = `
                <div class="w3-card-4  w3-margin" id="component">
                    <h3 class="w3-opacity"><b>${orcamento.client}</b></h3>
                    <p>${orcamento.date}</p>
                    <p class="w3-text-indigo"><span class="w3-tag w3-indigo w3-round">Valor Total R$${orcamento.amount}</span></p>
                    <ul id="services">
                        ${orcamento.services.map(service => `<ol>Serviço: ${service.descricao} -----------> Valor: R$${service.valor}</ol>`).join('')}
                    </ul>
                    <form class="form-recibo" action="/excluir-orcamento" method="POST">
                        <input type="hidden" name="id" value="${orcamento.id}">
                        <button type="button" class="btn-excluirOrcamento">Excluir Orçamento</button>
                    </form>
                </div>`;

                // Adicionar o orçamento ao elemento <ul>
                $("ul#orcamentos").append(info);
            });
        });
    }

    // Carregar os orçamentos quando a página é carregada
    loadOrcamentos();

    // Adicionar um evento de clique para excluir o orçamento
    $("ul#orcamentos").on("click", ".btn-excluirOrcamento", function() {
        var form = $(this).closest(".form-recibo"); // Encontrar o formulário pai
        var id = form.find("input[name='id']").val();
        
        $.post(form.attr("action"), { id: id }, function() {
            // Recarregar os orçamentos após a exclusão
            $("ul#orcamentos").empty(); // Limpar a lista antes de recarregar
            loadOrcamentos(); // Recarregar os orçamentos
        });
    });
});