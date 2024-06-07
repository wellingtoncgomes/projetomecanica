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
  $.get("lista-agendamentos", function(agendamentos) {
    agendamentos.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    agendamentos.forEach(function(agendamento) {
      // Formatar a data e o horário
      var dataFormatada = new Date(agendamento.date).toLocaleString();
      
      // Criar uma string com as informações formatadas
      var info = `
      <div class="w3-card-4  w3-margin" id="component">
      <h6 class="w3-text-indigo"><i class="fa fa-user fa-fw w3-margin-right"></i>${agendamento.client} - <span class="w3-tag w3-indigo w3-round">${dataFormatada}</span> - ${agendamento.service}</h6>
      <button class="btn-delete" data-id="${agendamento.id}">Excluir</button>
      </div>`;
      
      // Criar um elemento <li> com o texto formatado e adicionar à lista
      $("<ol></ol>")
        .html(info) // Usar .html() em vez de .text() para interpretar as tags HTML
        .appendTo("ul#agendamentos");
    });
  });
});
$(function() {
  $.get("list-comments", function(comments) {
    comments.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    comments.forEach(function(comment) {
      // Formatar a data e o horário
      var dataFormatada = new Date(comment.date).toLocaleString();
      
      // Criar uma string com as informações formatadas
      var comment = `
      <h6 class="w3-text-indigo">
      <i class="fa fa-user fa-fw w3-margin-right">${comment.client}</i>
      </h6>
      <p>${comment.assessment}</p>
      <hr>
      </div>`

      // Criar um elemento <li> com o texto formatado e adicionar à lista
      $("<ol></ol>")
        .html(comment) // Usar .html() em vez de .text() para interpretar as tags HTML
        .appendTo("ul#comment");
    });
  });
});

$(".btn-delete").on("click", function() {
  var id = $(this).data("id");
  console.log(id);
  $.post("/excluir-agendamento", { id: id }, function() {
    // Atualizar a página após a exclusão do agendamento
    window.location.reload();
  });
});

$(function() {
  $.get("list-profile", function(profile) {
    // Verifique se o perfil está vazio ou indefinido
    updateProfileInfo(profile)
    updateAutomakers(profile)
    updateOpeningHours(profile)
    updateServices(profile)
    updatePartners(profile)
  });
});
function updatePartners(profileData) {
  const partners = document.getElementById('profile.partners')
  partners.innerHTML = profileData.partners.map(element => {
      return `
      <div class="w3-card-4  w3-margin" id="component">
      <h5 class="w3-opacity"><span class="w3-tag w3-indigo w3-round">${element.name}</span></h5>
      <img src="${element.img}">
      <p class="w3-text-gray"><b>${element.description}</b></p>
      </div>`      
  }).join('')
}
function updateServices(profileData) {
  const services = document.getElementById('profile.services')
  services.innerHTML = profileData.services.map(element => {
      return `
      <div class="w3-card-4  w3-margin" id="component">
      <h5 class="w3-opacity"><b>${element.name}</b></h5>
      <img src="${element.img}">
      <p class="w3-text-indigo"><span class="w3-tag w3-indigo w3-round">Apartir de R$${element.price}</span></p>
      </div>`      
  }).join('')
}


function updateOpeningHours(profileData) {
  const openingHours = document.getElementById('profile.openingHours')
  openingHours.innerHTML = profileData.updateOpeningHours.map(element => {
      return `
      <section key=${element.weekday}>
      <li>${element.weekday}</li>
      <ol>${element.time}</ol>
      </section>`
  }).join('')
}

function updateAutomakers(profileData) {
  const automakers = document.getElementById('profile.skills.automakers')
  automakers.innerHTML = profileData.skills.automakers.map(skill => `<li><img src="${skill.logo}" alt="${skill.name}" title="${skill.name}"></li>`).join('')
}

function updateProfileInfo(profileData) {
  const photo = document.getElementById('profile.photo')
  photo.src = profileData.photo
  photo.alt = profileData.name

  const name = document.getElementById('profile.name')
  name.innerText = profileData.name

  const about = document.getElementById('aboutProfile')
  about.innerText = profileData.about

  const job = document.getElementById('profile.job')
  job.innerText = profileData.job

  const location = document.getElementById('profile.location')
  location.innerText = profileData.location

  const phone = document.getElementById('profile.phone')
  phone.innerText = profileData.phone
  phone.href = `tel:${profileData.phone}`

  const email = document.getElementById('profile.email')
  email.innerText = profileData.email
  email.href = `mailto:${profileData.email}`
}

const acordeonTriggers = document.querySelectorAll('.acordeon .trigger')

acordeonTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
        const acordeon = trigger.parentElement
        const isOpen = acordeon.classList.contains('open')

        if (isOpen) {
            acordeon.classList.remove('open')
        } else {
            acordeon.classList.add('open')
        }
    })
})