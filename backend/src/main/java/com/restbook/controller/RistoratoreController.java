package com.restbook.controller;

import com.restbook.dao.ClienteDaoJDBC;
import com.restbook.dao.RistoratoreDaoJDBC;
import com.restbook.dao.UserDaoJDBC;
import com.restbook.model.Cliente;
import com.restbook.model.Ristoratore;
import com.restbook.model.User;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@CrossOrigin(origins = {"*"})
public class RistoratoreController {


    private interface UpdateRistoratoreFunction {
        String call(Ristoratore ristoratore, String username) throws SQLException, IllegalStateException;
    }

    @PostMapping("/createRistoratore")
    public JSONObject createNewRistoratore(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {

        JSONObject resp = new JSONObject();

        try {

            String username = (String) body.get("username");

            Ristoratore ristoratore = RistoratoreDaoJDBC.getInstance().get(username);

            if(ristoratore != null) {
                response.setStatus(Protocol.CLIENTE_ALREADY_EXISTS);
                resp.put("msg", "Ristoratore già esistente");
                return resp;
            }else {
                Ristoratore newRistoratore = new Ristoratore();
                newRistoratore.setUsernameRistoratore(username);

                User user = UserDaoJDBC.getInstance().findUserByUsername(username);
                newRistoratore.setNome(user.getNome());

                RistoratoreDaoJDBC.getInstance().save(newRistoratore);

                response.setStatus(Protocol.OK);
                resp.put("msg", "Ristoratore creato con successo");

                return resp;
            }


        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Internal server error");

            return resp;
        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "the portfolio name is not valid");

            return resp;
        }
    }

    @GetMapping("/getRistoratore")
    public JSONObject getRistoratoreData(HttpServletRequest request, HttpServletResponse response) {
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

                Ristoratore ristoratore = RistoratoreDaoJDBC.getInstance().get(user.getUsername());
                if (ristoratore == null) {
                    response.setStatus(Protocol.INVALID_CREDENTIALS);
                    resp.put("msg", "Username errato");
                    return resp;
                }

                response.setStatus(Protocol.OK);
                resp.put("ristoratore", ristoratore);

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

    public JSONObject updateRistoratoreTemplate(HttpServletRequest request, HttpServletResponse response,
                                            RistoratoreController.UpdateRistoratoreFunction fun) {
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

            Ristoratore ristoratore = RistoratoreDaoJDBC.getInstance().get(user.getUsername());
            if (ristoratore == null) {
                response.setStatus(Protocol.INVALID_CREDENTIALS);
                resp.put("msg", "Username errato");
                return resp;
            }

            String ok = fun.call(ristoratore, token);
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

    @PostMapping("/updateDescrizioneRistorante")
    public JSONObject updateDescrizioneRistorante(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newDescrizione = (String) obj.get("descrizione");

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateDescrizioneRistorante(ristoratore, newDescrizione);
                return "Descrizione changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateIndirizzoRistorante")
    public JSONObject updateIndirizzoRistorante(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newIndirizzo = (String) obj.get("indirizzo");

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateIndirizzoRistorante(ristoratore, newIndirizzo);
                return "Indirizzo changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateNumeroRistorante")
    public JSONObject updateNumeroRistorante(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newNumero = (String) obj.get("numero");

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateNumeroRistorante(ristoratore, newNumero);
                return "Numero changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateIntolleranzeRistorante")
    public JSONObject updateIntolleranzeRistorante(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            ArrayList<String> newIntolleranze = (ArrayList) obj.get("intolleranze");
            String temp = "";
            for (String intolleranze : newIntolleranze){
                temp = temp + intolleranze + "-";
            }

            String intolleranzeUtente = StringUtils.chop(temp);
            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateIntolleranzeRistoratore(ristoratore, intolleranzeUtente);
                return "Intolleranze changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateLinkMenuRistorante")
    public JSONObject updateLinkMenuRistorante(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newLinkMenu = (String) obj.get("linkMenu");

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateLinkMenuRistorante(ristoratore, newLinkMenu);
                return "Link menù changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateFileMenu")
    public JSONObject updateFileMenuRistoratore(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String fileMenu = (String) obj.get("fileMenu");
            byte[] file = Base64.getDecoder().decode(fileMenu.split(",")[1].getBytes("UTF-8"));

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateFileMenu(file, ristoratore);
                return "File menu updated successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (UnsupportedEncodingException e) {
            JSONObject resp = new JSONObject();
            resp.put("msg", "Invalid image");
            response.setStatus(Protocol.INVALID_DATA);

            return resp;
        }
    }

    @PostMapping("/updateCopertinaRistorante")
    public JSONObject updateCopertinaRistorante(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String copertinaRistorante = (String) obj.get("copertinaRistorante");
            byte[] img = Base64.getDecoder().decode(copertinaRistorante.split(",")[1].getBytes("UTF-8"));

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateCopertinaRistorante(img, ristoratore);
                return "Copertina updated successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (UnsupportedEncodingException e) {
            JSONObject resp = new JSONObject();
            resp.put("msg", "Invalid image");
            response.setStatus(Protocol.INVALID_DATA);

            return resp;
        }
    }

    @GetMapping("/getRistoranti")
    private List<Ristoratore> getRistoranti() throws SQLException {
        List <Ristoratore> list = RistoratoreDaoJDBC.getInstance().getAll();
        return list;
    }

    @GetMapping("/getRistoranteFromUsername")
    public JSONObject getRistoranteFromUsername(HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        String username = request.getHeader("Authorization");

        if (username != null && !username.isEmpty()) {
            try {

                Ristoratore ristoratore = RistoratoreDaoJDBC.getInstance().get(username);
                if (ristoratore == null) {
                    response.setStatus(Protocol.INVALID_CREDENTIALS);
                    resp.put("msg", "Username errato");
                    return resp;
                }

                response.setStatus(Protocol.OK);
                resp.put("ristoratore", ristoratore);

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

    @PostMapping("/updateTavolo2")
    public JSONObject updateTavolo2(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newTavolo2 = (String) obj.get("tavolo2");

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateTavolo2(ristoratore, Integer.parseInt(newTavolo2));
                return "Disponibilità tavolo da 2 changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateTavolo5")
    public JSONObject updateTavolo5(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newTavolo5 = (String) obj.get("tavolo5");

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateTavolo5(ristoratore, Integer.parseInt(newTavolo5));
                return "Disponibilità tavolo da 5 changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateTavolo10")
    public JSONObject updateTavolo10(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        try {
            String newTavolo10 = (String) obj.get("tavolo10");

            RistoratoreController.UpdateRistoratoreFunction fun = (ristoratore, username) -> {
                RistoratoreDaoJDBC.getInstance().updateTavolo10(ristoratore, Integer.parseInt(newTavolo10));
                return "Disponibilità tavolo da 10 changed successfully";
            };

            return updateRistoratoreTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }


    @PostMapping("/filterRistoranti")
    private List<Ristoratore> filterRistoranti(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) throws SQLException {
        List <Ristoratore> list = RistoratoreDaoJDBC.getInstance().filterRestaurants((String) obj.get("Ricerca"));
        return list;
    }

    @PostMapping("/filterRistorantiIntolleranze")
    private List<Ristoratore> filterRistorantiIntolleranze(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        String token = request.getHeader("Authorization");
        List<Ristoratore> list = new ArrayList<>();

        try {
            User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);

            ArrayList<String> intolleranzeUtente = new ArrayList<>();

            Cliente cliente = ClienteDaoJDBC.getInstance().get(user.getUsername());

            String[] intol = cliente.getIntolleranze().split("-");

            for (int i = 0; i < intol.length; i++) {
                intolleranzeUtente.add(intol[i]);
            }

            list = RistoratoreDaoJDBC.getInstance().filterRestaurantsIntolleranza(intolleranzeUtente);

            return list;
        }
        catch (Exception e){
            return list;
        }
    }

}
