
var express = require("express");
const pdf = require('html-pdf');
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var path = require("path");

var adapter = new FileSync("./db/database.json");
var db = low(adapter);
var adapterProfile = new FileSync("./db/Profile.json");
var dbProfile = low(adapterProfile);
var app = express();
var bodyParser = require("body-parser");
const srcPath = __dirname;
const { v4: uuidv4 } = require('uuid');

app.use(express.static(path.join(srcPath, "public")));
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/lista-orcamentos", function (request, response) {
 
  const orcamentos = db.get("budgets").value();

  response.json(orcamentos);
});
app.get("/lista-agendamentos", function (request, response) {
  var agendamentos = db.get("agendamentos").value(); 
  response.send(agendamentos); 
});
app.get("/list-comments", function (request, response) {
  var comments = db.get("comments").value(); 
  response.send(comments); 
});

app.get("/list-profile", function (request, response) {
  var profile = dbProfile.value(); 
  response.send(profile); 
});

app.post("/agendar", urlencodedParser, function (request, response) {
  const id = uuidv4(); 
  db.get("agendamentos").push({ id: id, client: request.body.client, date: request.body.date, service: request.body.service }).write();
  response.redirect("/");
});

app.post("/excluir-agendamento", urlencodedParser, function (request, response) {
  const id = request.body.id; 
  db.get("agendamentos").remove({ id: id }).write(); 
  response.redirect("/");
});

app.post("/excluir-orcamento", urlencodedParser, function (request, response) {
  const id = request.body.id; 
  db.get("budgets").remove({ id: id }).write(); 
  response.redirect("/");
});

app.post("/atualizar-agendamento", urlencodedParser, function (request, response) {
  const id = request.body.id; 
  const newDate = request.body.newDate;

  db.get("agendamentos").find({ id: id }).assign({ date: newDate }).write();
  
  response.send("Agendamento atualizado com sucesso.");
});
app.post('/orcamentos', (req, res) => {
  console.log('Dados recebidos no backend:', req.body);

  const orcamento = req.body;
  
  orcamento.id = uuidv4();

  db.get('budgets').push(orcamento).write();

  res.json({ redirectUrl: '/orcamentos' });
});
app.post("/gerar-recibo", urlencodedParser, function (request, response) {
  const id = request.body.id;
  const orcamento = db.get("orcamentos").find({ id: id }).value(); 

 
  generateReceipt(orcamento)
    .then((pdfBytes) => {
      // Enviar o recibo em PDF como resposta
      response.setHeader('Content-Type', 'application/pdf');
      response.send(pdfBytes);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send("Erro ao gerar o recibo em PDF.");
    });
});
app.get("/gerar-recibo", function (req, res) {
  const orcamentoId = req.query.id; 
  console.log(orcamentoId)
  const pdfBytes =   generateReceipt(orcamentoId)
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="recibo.pdf"');
  res.send(pdfBytes);
});

async function generateReceipt(orcamentoId) {
  try {
    
    const orcamento = db.get("budgets").find({ id: orcamentoId }).value();

    if (!orcamento) {
      throw new Error('Orçamento não encontrado');
    }

    let html = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .info {
            margin-bottom: 10px;
          }
          .service {
            margin-left: 20px;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Recibo</h1>
        </div>
        <div class="info">
          <p><strong>Cliente:</strong> ${orcamento.client}</p>
          <p><strong>Data:</strong> ${orcamento.date}</p>
          <p><strong>Contato:</strong> ${orcamento.contact}</p>
          <p><strong>Modelo do Veículo:</strong> ${orcamento.vehicleModel}</p>
          <p><strong>Placa do Veículo:</strong> ${orcamento.vehiclePlate}</p>
        </div>
        <div class="services">
          <p><strong>Serviços:</strong></p>
          <ul>
    `;

   
    orcamento.services.forEach((service, index) => {
      html += `<li><span class="service">Serviço ${index + 1}:</span> ${service.descricao} - Valor: R$ ${service.valor.toFixed(2)}</li>`;
    });


    const totalAmount = orcamento.services.reduce((total, service) => total + service.valor, 0);
    html += `</ul><p><strong>Valor Total:</strong> R$ ${totalAmount.toFixed(2)}</p></div></body></html>`;

    
    const options = { format: 'A4' };

    
    return new Promise((resolve, reject) => {
      pdf.create(html, options).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao gerar o recibo:', error);
    throw error;
  }
}


// Empties the database and re-populates users with the default users
/*app.get("/reset", function (request, response) {
  // Clear the databaase
  db.get("users").remove().write();
  // Set the database up again
  defaultUsers.forEach(function (user) {
    db.get("users").push({ name: user.name }).write();
  });
  response.redirect("/");
});*/

//VIEWS
app.get("/", function (request, response) {
  response.sendFile(path.join(srcPath, "views", "index.html"));
});
app.get("/orcamentos", function (request, response) {
  response.sendFile(path.join(srcPath, "views", "./orcamentos/orcamentos.html"));
});


app.get("/agendar", function (request, response) {
  response.sendFile(path.join(srcPath, "views", "./agendar/agendar.html"));
});

app.get("/agendamentos", function (request, response) {
  response.sendFile(path.join(srcPath, "views", "./agendamentos/agendamentos.html",));
});

app.get("/contato", function (request, response) {
  response.sendFile(path.join(srcPath, "views", "./contato/contato.html",));
});

app.get("/recibos", function (request, response) {
  response.sendFile(path.join(srcPath, "views", "./recibo/recibos.html",));
});


// Listen on port 8080
var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
 