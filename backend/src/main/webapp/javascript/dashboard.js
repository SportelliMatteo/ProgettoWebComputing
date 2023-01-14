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
        success: function() {
            $("#listaClienti").children('tr').each((idx, item) => {
                if(item.children['0'].innerText === username) {
                    item.remove();
                    alert("Cliente rimosso con successo!");
                    return;
                }
            });
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
        success: function() {
            $("#listaRistoranti").children('tr').each((idx, item) => {
                if(item.children['0'].innerText === username) {
                    item.remove();
                    alert("Ristorante rimosso con successo!");
                    return;
                }
            });
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
        success: function() {
            $("#listaRecensioni").children('tr').each((idx, item) => {
                if(item.children['0'].innerText === codice_recensione) {
                    item.remove();
                    alert("Recensione rimossa con successo!");
                    return;
                }
            });
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}