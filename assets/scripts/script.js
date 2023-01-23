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

function processarMensagens(mensagens) {
    divMsg.innerHTML = "";

    mensagens.data.forEach(Msg => {
        if (Msg.type === `message`) {
            divMsg.innerHTML += `<div data-test="message">
            <b>(${Msg.time})&nbsp;</b> <span>${Msg.from}&nbsp;</span> para&nbsp; <span>
            ${Msg.to}</span>: ${Msg.text}
            </div>`;
        } else if (Msg.type === `status`) {
            divMsg.innerHTML += `<div class="statusMsg" data-test="message">
            <b>(${Msg.time})&nbsp;</b><span>${Msg.from}&nbsp;</span>${Msg.text}
            </div>`;
        } else if (Msg.from === nome.name || Msg.to === nome.name) {
            divMsg.innerHTML += `<div class="privateMsg" data-test="message">
            <b>(${Msg.time})&nbsp;</b> <span>${Msg.from}&nbsp;</span> reservadamente para&nbsp; <span>
            ${Msg.to}</span>: ${Msg.text}
            </div>`;
        }
    });
    
    divMsg.lastChild.scrollIntoView(true);
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