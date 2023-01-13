package com.restbook.controller;

import com.restbook.dao.ClienteDaoJDBC;
import com.restbook.dao.UserDaoJDBC;
import com.restbook.model.Cliente;
import com.restbook.model.User;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.ArrayList;

@RestController
@CrossOrigin(origins = {"*"})
public class ClienteController {

    private interface UpdateClienteFunction {
        String call(Cliente cliente, String username) throws SQLException, IllegalStateException;
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/createCliente")
    public JSONObject createNewCliente(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        try {

            String username = (String) body.get("username");

            Cliente cliente = ClienteDaoJDBC.getInstance().get(username);

            if(cliente != null) {
                response.setStatus(Protocol.CLIENTE_ALREADY_EXISTS);
                resp.put("msg", "Cliente già esistente");
                return resp;
            }else {
                Cliente newCliente = new Cliente();
                newCliente.setUsernameCliente(username);

                ClienteDaoJDBC.getInstance().save(newCliente);

                response.setStatus(Protocol.OK);
                resp.put("msg", "Cliente creato con successo");

                return resp;
            }


        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Internal server error");

            return resp;
        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "Cliente is not valid");

            return resp;
        }
    }

    @GetMapping("/getCliente")
    public JSONObject getClienteData(HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        String token = request.getHeader("Authorization");

        if (token != null && !token.isEmpty()) {
            try {

                User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);
                if (user == null) {
                    response.setStatus(Protocol.INVALID_TOKEN);
                    resp.put("msg", "The auth token is not valid");

                    return resp;
                }

                Cliente cliente = ClienteDaoJDBC.getInstance().get(user.getUsername());
                if (cliente == null) {
                    response.setStatus(Protocol.INVALID_CREDENTIALS);
                    resp.put("msg", "Username errato");
                    return resp;
                }

                response.setStatus(Protocol.OK);
                resp.put("cliente", cliente);

                return resp;

            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(Protocol.SERVER_ERROR);
                resp.put("msg", "Internal server error");

                return resp;
            }
        }

        response.setStatus(Protocol.INVALID_TOKEN);
        resp.put("msg", "The auth token is not valid");
        return resp;
    }

    public JSONObject updateClienteTemplate(HttpServletRequest request, HttpServletResponse response,
                                         ClienteController.UpdateClienteFunction fun) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();

        try {
            // cerco l'utente che ha quel token di accesso
            User user = UserDaoJDBC.getInstance().findByToken(token);

            // se non trovo l'utente, rispondo con error 5000
            if (user == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "The auth token is not valid");

                return resp;
            }

            Cliente cliente = ClienteDaoJDBC.getInstance().get(user.getUsername());
            if (cliente == null) {
                response.setStatus(Protocol.INVALID_CREDENTIALS);
                resp.put("msg", "Username errato");
                return resp;
            }

            String ok = fun.call(cliente, token);
            response.setStatus(200);
            resp.put("msg", ok);

            return resp;

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Internal server error");

            return resp;
        } catch (IllegalStateException e2) {
            response.setStatus(Protocol.WRONG_CREDENTIALS);
            resp.put("msg", "The old password doesn't match");

            return resp;
        }
    }

    @PostMapping("/updateNumeroCliente")
    public JSONObject updateNumeroCliente(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newNumero = (String) obj.get("numero");

            ClienteController.UpdateClienteFunction fun = (cliente, username) -> {
                ClienteDaoJDBC.getInstance().updateNumeroCliente(cliente, newNumero);
                return "Numero changed successfully";
            };

            return updateClienteTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateIndirizzoCliente")
    public JSONObject updateIndirizzoCliente(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newIndirizzo = (String) obj.get("indirizzo");

            ClienteController.UpdateClienteFunction fun = (cliente, username) -> {
                ClienteDaoJDBC.getInstance().updateIndirizzoCliente(cliente, newIndirizzo);
                return "Indirizzo changed successfully";
            };

            return updateClienteTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateIntolleranzeCliente")
    public JSONObject updateIntolleranzeCliente(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            ArrayList<String> newIntolleranze = (ArrayList) obj.get("intolleranze");
            String temp = "";
            for (String intolleranze : newIntolleranze){
                temp = temp + intolleranze + "-";
            }

            String intolleranzeUtente = StringUtils.chop(temp);
            ClienteController.UpdateClienteFunction fun = (cliente, username) -> {
                ClienteDaoJDBC.getInstance().updateIntolleranzeCliente(cliente, intolleranzeUtente);
                return "Intolleranze changed successfully";
            };

            return updateClienteTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

}
