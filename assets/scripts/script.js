let nome, statusCode, texto = "Qual seu lindo nome?";

const divMsg = document.getElementById("mensagens");

const sucessCode = 200, errorCode = 400, timeConnect = 5000, timeSearch = 3000;

const pagReload = () => window.location.reload();

function enviarMsg() {
    const input = document.querySelector(`input`).value;

    const promisse = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages`,
        { from: `${nome.name}`, to: `Todos`, text: `${input}`, type: `message` });

    promisse.then(buscarMensagens);
    promisse.catch(pagReload);
}

function tipoMsg(mensagem) {
    if (mensagem.type === `message`) {
        divMsg.innerHTML += `<div data-test="message">
        <b>(${mensagem.time})&nbsp;</b> <span>${mensagem.from}&nbsp;</span> para&nbsp; <span>
        ${mensagem.to}</span>: ${mensagem.text}
        </div>`;
    } else if (mensagem.type === `status`) {
        divMsg.innerHTML += `<div class="statusMsg" data-test="message">
        <b>(${mensagem.time})&nbsp;</b><span>${mensagem.from}&nbsp;</span>${mensagem.text}
        </div>`;
    } else {
        divMsg.innerHTML += `<div class="privateMsg" data-test="message">
        <b>(${mensagem.time})&nbsp;</b> <span>${mensagem.from}&nbsp;</span> reservadamente para&nbsp; <span>
        ${mensagem.to}</span>: ${mensagem.text}
        </div>`;
    }
}

function exibirMsg(mensagem) {
    divMsg.innerHTML = "";
    mensagem.forEach(tipoMsg);
    divMsg.lastChild.scrollIntoView(true);
}

function processarMensagens(mensagens) {
    const message = mensagens.data.filter(Msg => Msg.type === `message` || Msg.type === `status`
        || (Msg.type === `private_message` & (Msg.from === nome || Msg.to === nome)));
    exibirMsg(message);
}

function buscarMensagens() {
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages`);
    promisse.then(processarMensagens);
}

function manterConexao() {
    axios.post(`https://mock-api.driven.com.br/api/v6/uol/status`, nome);
}

function sucessoLogin(sucesso) {
    statusCode = sucesso.status;
    if (statusCode === sucessCode) {
        setInterval(manterConexao, timeConnect);
        buscarMensagens();
        setInterval(buscarMensagens, timeSearch);
    }
}

function erroLogin(erro) {
    statusCode = erro.response.status;
    if (statusCode === errorCode) {
        texto = "Esse nome já está em uso ! Insira outro";
        login();
    }
}

function login() {
    const str = prompt(`${texto}`);
    nome = { name: `${str}` };

    const promisse = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants`, nome);

    promisse.then(sucessoLogin);
    promisse.catch(erroLogin);
}

login();