let nome, statusCode;

const divMsg = document.getElementById("mensagens");

function enviarMsg() {
    const input = document.querySelector(`input`).value;

    const promisse = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages`,
        { from: `${nome.name}`, to: `Todos`, text: `${input}`, type: `message` });

    promisse.then(sucessoEnvio => buscarMensagens());
    promisse.catch(erroEnvio => window.location.reload());
}

function tipoMsg (mensagem) {
    if (mensagem.type === `message`) {
        divMsg.innerHTML += `<div data-test="message">
        <b>(${mensagem.time})&nbsp;</b> <span>${mensagem.from}&nbsp;</span> para&nbsp; <span>
        ${mensagem.to}</span>: ${mensagem.text}
        </div>`;
    }
    else {
        divMsg.innerHTML += `<div class="cinza" data-test="message">
        <b>(${mensagem.time})&nbsp;</b><span>${mensagem.from}&nbsp;</span>${mensagem.text}
        </div>`;
    }
}

function exibirMsg(mensagem) {
    mensagem.forEach(tipoMsg);
    divMsg.lastChild.scrollIntoView(true);
}

function processarMensagens(mensagens) {
    const message = mensagens.data.filter(message => message.type === `message` || message.type === `status`);
    exibirMsg(message);
}

function buscarMensagens() {
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages`);
    promisse.then(processarMensagens);
}

function manterConexao() {
    const promisse = axios.post(`https://mock-api.driven.com.br/api/v6/uol/status`, nome);
}

function sucessoLogin(sucesso) {
    statusCode = sucesso.status;
    if (statusCode === 200) {
        setInterval(manterConexao, 5000);
        setInterval(buscarMensagens, 3000);
    }
}

function erroLogin(erro) {
    statusCode = erro.response.status;
    if (statusCode === 400) {
        alert("Esse nome já está em uso !");
        login();
    }
}

function login() {
    nome = { name: `${prompt("Qual seu lindo nome?")}` };

    const promisse = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants`, nome);

    promisse.then(sucessoLogin);
    promisse.catch(erroLogin);
}

login();