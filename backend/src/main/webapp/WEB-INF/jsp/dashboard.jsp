<%--
  Created by IntelliJ IDEA.
  User: matteo
  Date: 11/01/23
  Time: 11:25
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>RestBook - Amministratore</title>
    <script src="../../javascript/dashboard.js" type="module"></script>
    <link rel="stylesheet" href="../../admin-assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>

<body>
<div class="accedi">
    <div class="column-1 box1">
        <div class="Auth-form-container">
            <form method="POST" action="doLogin" class="Auth-form">
                <div class="Auth-form-content">
                    <h3 class="Auth-form-title">Dashboard amministratore</h3>
                    <div class="tornaAllaHome">
                        <a href="doLogout">
                            <div id="logoutBtn" class="logoutButton">
                                <p class="logoutLink">Logout</p>
                            </div>
                        </a>
                    </div>
                    <div class="form-group mt-3">
                        <label>Clienti</label>
                        <table class="table table-dark">
                            <thead class="thead-dark">
                            <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Numero</th>
                                <th scope="col">Indirizzo</th>
                                <th scope="col">Intolleranze</th>
                            </tr>
                            </thead>
                            <tbody id="listaClienti">
                            <c:forEach items="${clienti}" var="clienti" varStatus="loop">
                            <tr>
                                <td>${clienti.usernameCliente}</td>
                                <td>${clienti.numero}</td>
                                <td>${clienti.indirizzo}</td>
                                <td>${clienti.intolleranze}</td>
                            </tr>
                            </c:forEach>
                        </table>
                        <fieldset>
                            <input type="text" id="usernameCliente" class="form-control mt-1" placeholder="Inserisci username cliente da bannare" />
                        </fieldset>
                        <div class="btnContainer">
                            <div id="rimuoviClienteBtn" class="logoutButton">
                                <p class="logoutLink">Banna cliente</p>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mt-3">
                        <label>Ristoranti</label>
                        <table class="table table-dark">
                            <thead class="thead-dark">
                            <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Descrizione</th>
                                <th scope="col">Indirizzo</th>
                                <th scope="col">Numero</th>
                                <th scope="col">Intolleranze</th>
                            </tr>
                            </thead>
                            <tbody id="listaRistoranti">
                            <c:forEach items="${ristoranti}" var="ristoranti" varStatus="loop">
                            <tr>
                                <td>${ristoranti.usernameRistoratore}</td>
                                <td>${ristoranti.nome}</td>
                                <td>${ristoranti.descrizione}</td>
                                <td>${ristoranti.indirizzo}</td>
                                <td>${ristoranti.numero}</td>
                                <td>${ristoranti.intolleranze}</td>
                            </tr>
                            </c:forEach>
                        </table>
                        <fieldset>
                            <input type="text" id="usernameRistorante" class="form-control mt-1" placeholder="Inserisci username ristorante da bannare" />
                        </fieldset>
                        <div class="btnContainer">
                            <div id="rimuoviRistoranteBtn" class="logoutButton">
                                <p class="logoutLink"> Banna ristorante </p>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mt-3">
                        <label>Recensioni</label>
                        <table class="table table-dark">
                            <thead class="thead-dark">
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Ristorante</th>
                                <th scope="col">Testo</th>
                                <th scope="col">Voto</th>
                            </tr>
                            </thead>
                            <tbody id="listaRecensioni">
                            <c:forEach items="${recensioni}" var="recensioni" varStatus="loop">
                            <tr>
                                <td>${recensioni.id_recensione}</td>
                                <td>${recensioni.utente}</td>
                                <td>${recensioni.ristorante}</td>
                                <td>${recensioni.recensione}</td>
                                <td>${recensioni.voto}</td>
                            </tr>
                            </c:forEach>
                        </table>
                        <fieldset>
                            <input type="text" id="codiceRecensione"  class="form-control mt-1" placeholder="Inserisci id recensione da eliminare" />
                        </fieldset>
                        <div class="btnContainer">
                            <div id="eliminaRecensioneBtn" class="logoutButton">
                                <p class="logoutLink"> Elimina recensione </p>
                            </div>
                        </div>
                    </div>

                    <c:if test="${error != null}">
                        <div style="background-color: #BB1E10; border-radius: 5px; text-align: center; padding-top: 2px;";>
                            <p style="color: white; font-size: 0.9em; font-weight: bold; font-family: sans-serif; ">${error}</p>
                        </div>
                    </c:if>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="https://code.jquery.com/jquery-3.6.0.js"
        integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
        crossorigin="anonymous"></script>
</body>

</html>

