package com.restbook.controller;

import com.restbook.dao.*;
import com.restbook.model.domain.Username;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/adminRest")
public class AdminRestController {

    @SuppressWarnings("unchecked")
    private JSONObject checkAdminUser(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(true);
        JSONObject resp = new JSONObject();
        Object username = (Object) session.getAttribute("username");

        if(!(username instanceof String)) {
            response.setStatus(403);
            resp.put("msg", "Forbidden");
            return resp;
        }

        String userStr = (String) username;

        try {
            if(!UserDaoJDBC.getInstance().isUserAdmin(new Username(userStr))) {
                response.setStatus(403);
                resp.put("msg", "Questo user non è un admin");

                return resp;
            }

            resp.put("msg", "OK");
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "Dati invalidi");

            return resp;
        } catch (SQLException e) {
            response.setStatus(403);
            resp.put("msg", "Errore server interno");

            return resp;
        }
    }

    @SuppressWarnings("unchecked")
    @DeleteMapping("/bannaCliente")
    public JSONObject bannaCliente(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = checkAdminUser(request, response);
        if(!((String)resp.get("msg")).equals("OK"))
            return resp;

        try {
            PrenotazioneDaoJDBC.getInstance().rimuoviPrenotazioneDaUsername((String) obj.get("username"));
            PreferitoJDBC.getInstance().deletePreferitiFromUsername((String) obj.get("username"));
            ClienteDaoJDBC.getInstance().rimuoviCliente((String) obj.get("username"));
            UserDaoJDBC.getInstance().deleteUserFromUsername((String) obj.get("username"));

            response.setStatus(Protocol.OK);
            resp.put("msg", "Cliente rimosso con successo");

            return resp;
        } catch(SQLException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", e.getMessage());

            return resp;
        } catch(ClassCastException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "Username invalido");

            return resp;
        }
    }

    @SuppressWarnings("unchecked")
    @DeleteMapping("/bannaRistorante")
    public JSONObject bannaRistorante(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = checkAdminUser(request, response);
        if(!((String)resp.get("msg")).equals("OK"))
            return resp;

        try {
            PrenotazioneDaoJDBC.getInstance().rimuoviPrenotazioneRistoranteDaUsername((String) obj.get("username"));
            PreferitoJDBC.getInstance().deletePreferitiRistoranteFromUsername((String) obj.get("username"));
            RistoratoreDaoJDBC.getInstance().deleteRistoranteFromUsername((String) obj.get("username"));
            UserDaoJDBC.getInstance().deleteUserFromUsername((String) obj.get("username"));

            response.setStatus(Protocol.OK);
            resp.put("msg", "Ristorante rimosso con successo");

            return resp;
        } catch(SQLException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", e.getMessage());

            return resp;
        } catch(ClassCastException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "Username invalido");

            return resp;
        }
    }

    @DeleteMapping("/eliminaRecensione")
    public JSONObject eliminaRecensione(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = checkAdminUser(request, response);
        if(!((String)resp.get("msg")).equals("OK"))
            return resp;

        try {
            RecensioneDaoJDBC.getInstance().deleteRecensioneFromCodiceRecensione(Integer.parseInt((String) obj.get("codice_recensione")));

            response.setStatus(Protocol.OK);
            resp.put("msg", "Recensione rimossa con successo");

            return resp;
        } catch(SQLException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", e.getMessage());

            return resp;
        } catch(ClassCastException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "Id invalido");
            
            return resp;
        }
    }

}
