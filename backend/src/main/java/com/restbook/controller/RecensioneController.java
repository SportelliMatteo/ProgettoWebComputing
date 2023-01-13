package com.restbook.controller;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.restbook.dao.UserDaoJDBC;
import com.restbook.model.User;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.restbook.dao.RecensioneDaoJDBC;
import com.restbook.model.Recensione;

@RestController
@CrossOrigin(origins = {"*"})
public class RecensioneController {



    @PostMapping("/createRecensione")
    public JSONObject createRecensione(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {

            User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);

            String ristorante = (String) body.get("ristorante");

            Recensione recensione= RecensioneDaoJDBC.getInstance().getRecensione(user.getUsername(), ristorante);

            if(recensione != null) {
                response.setStatus(Protocol.CLIENTE_ALREADY_EXISTS);
                resp.put("msg", "Recensione già esistente");
                return resp;
            } else {
                Recensione newRecensione = new Recensione();
                newRecensione.setUtente(user.getUsername());
                newRecensione.setRistorante(ristorante);
                newRecensione.setRecensione((String) body.get("recensione"));
                if(((String) body.get("voto")).equals("false")){
                    newRecensione.setVoto("0");
                }else{
                    newRecensione.setVoto((String) body.get("voto"));
                }
                if((String) body.get("immagine") != null) {
                    String immagine = (String) body.get("immagine");
                    byte[] img = Base64.getDecoder().decode(immagine.split(",")[1].getBytes("UTF-8"));
                    newRecensione.setImmagine(img);
                }
                newRecensione.setUsername_ristorante((String) body.get("usernameRistoratore"));
                RecensioneDaoJDBC.getInstance().insertRecensione(newRecensione);
                response.setStatus(Protocol.OK);
                resp.put("msg", "Ristoratore creato con successo");

                return resp;
            }


        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "the portfolio name is not valid");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }


    }
    @PostMapping("/getRecensioni")
    public List<Recensione> getRecensioni(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) throws SQLException {
        List <Recensione> list = RecensioneDaoJDBC.getInstance().getRecensioniRistorante((String) body.get("usernameRistorante"));
        return list;
    }

    @PostMapping("/getRecensioniRistoratore")
    public List<Recensione> getRecensioniRistoratore(HttpServletRequest request) throws SQLException {
        String token = request.getHeader("Authorization");
        List<Recensione> list = null;
        if (token != null && !token.isEmpty()) {
            try {
                // cerco l'utente che ha quel token di accesso
                User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);

                list = RecensioneDaoJDBC.getInstance().getRecensioniRistorante(user.getUsername());


                return list;

            } catch (SQLException e) {
                throw new RuntimeException(e);
            } catch (NullPointerException e) {
                throw new RuntimeException(e);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException(e);
            }
        }
        return list;
    }

            @PostMapping("/deleteRecensione")
    public JSONObject deleteRecensione(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) throws SQLException {
            String token = request.getHeader("Authorization");
            JSONObject resp = new JSONObject();
            try {
                User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);
                RecensioneDaoJDBC.getInstance().DeleteRecensione(user.getUsername(), (String) body.get("ristorante"));

                response.setStatus(Protocol.OK);
                resp.put("msg", "Recensione eleminata con successo");
                return resp;
            } catch (SQLException e) {
                throw new RuntimeException(e);
            } catch (NullPointerException e) {
                throw new RuntimeException(e);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException(e);
            }
        }
    }