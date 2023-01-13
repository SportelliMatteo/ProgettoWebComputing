<%--
  Created by IntelliJ IDEA.
  User: matteo
  Date: 11/01/23
  Time: 11:36
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
  <title>RestBook - Amministratore login</title>
  <link rel="stylesheet" href="../../admin-assets/css/login.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>

<body>
<div class="containerTitle">
  <h1 class="h1Title">RestBook - Amministratore</h1>
</div>
<div class="accedi">
  <div class="column-1 box1">
    <div class="Auth-form-container">
      <form method="POST" action="doLogin" class="Auth-form">
        <div class="Auth-form-content">
          <h3 class="Auth-form-title">Accedi</h3>

          <div class="form-group mt-3">
            <label>Tipologia</label>
            <input name="tipologia" type="text" class="form-control mt-1" placeholder="Amministratore" value="Amministratore" readonly/>
          </div>
          <div class="form-group mt-3">
            <label>Username</label>
            <input type="text" name="username" class="form-control mt-1" placeholder="mariorossi" />
          </div>
          <div class="form-group mt-3">
            <label>Password</label>
            <input type="password" name="password" class="form-control mt-1" placeholder="Password" />
          </div>
          <div class="d-grid gap-2 mt-3">
            <button type="submit" class="button">
                 ACCEDI
            </button>
          </div>
          <c:if test="${error != null}">
            <div style="background-color: #BB1E10; border-radius: 5px; text-align: center; padding-top: 2px;";>
              <p style="color: white; font-size: 0.9em; font-weight: bold; font-family: sans-serif; ">${error}</p>
            </div>
          </c:if>
          <div class="tornaAllaHome">
            <label> TORNA ALLA <a href="http://localhost:3000/"> HOME </a> </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</body>

</html>
