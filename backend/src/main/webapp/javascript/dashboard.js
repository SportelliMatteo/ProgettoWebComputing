const address = "localhost:8080";
const rimuoviClienteUrl = `http://${address}/adminRest/bannaCliente`;
const rimuoviRistoranteUrl = `http://${address}/adminRest/bannaRistorante`;
const eliminaRecensioneUrl = `http://${address}/adminRest/eliminaRecensione`;


window.onload = function() {
    addEvents();
}

function addEvents() {
    document.querySelector("#rimuoviClienteBtn").addEventListener('click', rimuoviCliente);
    document.querySelector("#rimuoviRistoranteBtn").addEventListener('click', rimuoviRistorante);
    document.querySelector("#eliminaRecensioneBtn").addEventListener('click', eliminaRecensione);
}

//fa la richiesta per rimuovere un cliente
const rimuoviCliente = () => {
    const username = $("#usernameCliente")[0].value;

    $.ajax({
        method: 'DELETE',
        url: rimuoviClienteUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            'username': username,
        }),
        success: function(resp) {
            alert("Cliente rimosso con successo!");
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}

//fa la richiesta per rimuovere un ristorante
const rimuoviRistorante = () => {
    const username = $("#usernameRistorante")[0].value;

    $.ajax({
        method: 'DELETE',
        url: rimuoviRistoranteUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            'username': username,
        }),
        success: function(resp) {
            alert("Ristorante rimosso con successo!");
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}

//fa la richiesta per rimuovere una recensione
const eliminaRecensione = () => {
    const codice_recensione = $("#codiceRecensione")[0].value;

    $.ajax({
        method: 'DELETE',
        url: eliminaRecensioneUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            'codice_recensione': codice_recensione,
        }),
        success: function(resp) {
            alert("Recensione rimossa con successo!");
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}

//crea il nodo che conterrà il popup di conferma
const confirmPopup = (title, text, onConfirm, onCancel) => {
    const backgroundDiv = document.createElement("div");
    backgroundDiv.className = "background-blurrer";

    const popupDiv = document.createElement("div");
    popupDiv.className = "confirm-popup";

    const popupUl = document.createElement("ul");
    popupUl.className = "popup-list";

    const titleNode = document.createElement("p");
    titleNode.className = "popup-title";
    titleNode.innerText = title;

    const textNode = document.createElement("span");
    textNode.className = "popup-text";
    textNode.innerText = text;

    const confirmBtn = document.createElement("p");
    confirmBtn.className = "popup-btn popup-confirm";
    confirmBtn.innerText = "Confirm";
    confirmBtn.onclick = onConfirm;

    const cancelBtn = document.createElement("p");
    cancelBtn.className = "popup-btn popup-cancel";
    cancelBtn.innerText = "Cancel";
    cancelBtn.onclick = onCancel;

    popupUl.appendChild(titleNode);
    popupUl.appendChild(textNode);
    popupUl.appendChild(confirmBtn);
    popupUl.appendChild(cancelBtn);

    popupDiv.appendChild(popupUl);
    backgroundDiv.appendChild(popupDiv);

    return backgroundDiv;
}