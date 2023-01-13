package com.restbook.controller;

import com.restbook.dao.ClienteDaoJDBC;
import com.restbook.dao.PrenotazioneDaoJDBC;
import com.restbook.dao.RistoratoreDaoJDBC;
import com.restbook.dao.UserDaoJDBC;
import com.restbook.model.Cliente;
import com.restbook.model.Prenotazione;
import com.restbook.model.Ristoratore;
import com.restbook.model.User;
import com.restbook.utilities.EmailSenderService;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@CrossOrigin(origins = {"*"})
public class PrenotazioneController {

    private interface UpdatePrenotazioneFunction {
        String call(Prenotazione prenotazione, String codice_prenotazione) throws SQLException, IllegalStateException;
    }

    public String generateCode() {
        List<String> codiciPrenotazione = new ArrayList<>();

        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        return generatedString;

    }

    @PostMapping("/insertPrenotazione")
    public JSONObject nuovaPrenotazione(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {

            String usernameRistorante = (String) body.get("usernameRistorante");
            String usernameCliente = (String) body.get("usernameCliente");
            String data = (String) body.get("data");
            String orario = (String) body.get("orario");
            String note = (String) body.get("note");
            String tipologiaTavolo = (String) body.get("tipologiaTavolo");
            String nomeRistorante = (String) body.get("nomeRistorante");

            //Controllo che sia un cliente a fare la prenotazione e non un ristoratore
            List<Cliente> clienti = ClienteDaoJDBC.getInstance().getAll();
            boolean check = false;
            for (Cliente c : clienti){
                if (c.getUsernameCliente().equals(usernameCliente)){
                    check = true;
                }else{
                    check = false;
                }
            }

            User utente = UserDaoJDBC.getInstance().findUserByUsername(usernameCliente);
            List<Prenotazione> prenotazioni = PrenotazioneDaoJDBC.getInstance().getAll();
            boolean prenotazioneEsistente = false;

            for (Prenotazione p : prenotazioni){
                if (p.getOrario().equals(orario) && p.getUsername_cliente().equals(usernameCliente) && p.getData().equals(data) &&
                        p.getUsername_ristorante().equals(usernameRistorante) && p.getTipologiaTavolo().equals(tipologiaTavolo) && (p.getStato().equals("In elaborazione") || p.getStato().equals("Confermata"))){
                    prenotazioneEsistente = true;
                }
            }

            if(orario.equals("Orario...")){
                response.setStatus(Protocol.INVALID_ORARIO);
                resp.put("msg", "Orario non selezionato");
                return resp;
            }
            if(prenotazioneEsistente) {
                response.setStatus(Protocol.PRENOTAZIONE_ALREADY_EXISTS);
                resp.put("msg", "Prenotazione già esistente");
                return resp;
            }else{
                if (check) {
                    Prenotazione newPrenotazione = new Prenotazione();
                    newPrenotazione.setUsername_ristorante(usernameRistorante);
                    newPrenotazione.setUsername_cliente(usernameCliente);
                    newPrenotazione.setData(data);
                    newPrenotazione.setOrario(orario);
                    newPrenotazione.setNote(note);
                    newPrenotazione.setTipologiaTavolo(tipologiaTavolo);
                    newPrenotazione.setCodice_prenotazione(generateCode());
                    newPrenotazione.setNomeRistorante(nomeRistorante);
                    newPrenotazione.setStato("In elaborazione");

                    PrenotazioneDaoJDBC.getInstance().save(newPrenotazione);

                    EmailSenderService.sendEmailPrenotazioneInCorso(utente.getEmail(), "La tua prenotazione!", EmailSenderService.PRENOTAZIONE_IN_CORSO,
                            "Riepilogo prenotazione: " + "\n" +
                                     "Codice prenotazione: " + generateCode() + "\n" +
                                     "Nome ristorante: " + nomeRistorante + "\n" +
                                     "Data: " + data + "\n" +
                                     "Orario: " + orario + "\n" +
                                     "Tipologia tavolo: " + tipologiaTavolo +
                                     "\n" + "\n" +
                                     "Tra qualche istante riceverà l'email di conferma prenotazione!");

                    response.setStatus(Protocol.OK);
                    resp.put("msg", "Prenotazione effettuata con successo");

                    return resp;
                }else{
                    response.setStatus(Protocol.CLIENTE_NOT_EXISTS);
                    resp.put("msg", "Il cliente non esiste");

                    return resp;
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Internal server error");

            return resp;
        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "La prenotazione non è valida");

            return resp;
        }
    }

    @PostMapping("/getPrenotazioni")
    private List<Prenotazione> getPrenotazioni(HttpServletRequest request) throws SQLException {
        String token = request.getHeader("Authorization");
        List <Prenotazione> list = null;
        if (token != null && !token.isEmpty()) {
            try {
                // cerco l'utente che ha quel token di accesso
                User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);

                list = PrenotazioneDaoJDBC.getInstance().getAll();


                List<Prenotazione> prenotazioni = new ArrayList<>();
                for (Prenotazione p : list){
                    if (p.getUsername_ristorante().equals(user.getUsername())) {
                        prenotazioni.add(p);
                    }
                }
                return prenotazioni;
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

    @PostMapping("/getPrenotazioniCliente")
    private List<Prenotazione> getPrenotazioniCliente(HttpServletRequest request) throws SQLException {

        String token = request.getHeader("Authorization");

        List <Prenotazione> list = null;

        if (token != null && !token.isEmpty()) {
            try {
                // cerco l'utente che ha quel token di accesso
                User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);

                list = PrenotazioneDaoJDBC.getInstance().getAll();

                List<Prenotazione> prenotazioni = new ArrayList<>();
                for (Prenotazione p : list){
                    if (p.getUsername_cliente().equals(user.getUsername())) {
                        prenotazioni.add(p);
                    }
                }
                return prenotazioni;
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

    @PostMapping("/confermaPrenotazione")
    public JSONObject confermaPrenotazione(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {

            String codicePrenotazione = (String) body.get("codice_prenotazione");

            Prenotazione prenotazione = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(codicePrenotazione);
            User utente = UserDaoJDBC.getInstance().findUserByUsername(prenotazione.getUsername_cliente());

            PrenotazioneDaoJDBC.getInstance().updateStatoPrenotazione("Confermata", prenotazione.getCodice_prenotazione());

            EmailSenderService.sendEmailPrenotazioneCompletata(utente.getEmail(), "Prenotazione confermata!", EmailSenderService.PRENOTAZIONE_COMPLETATA,
                    "Riepilogo prenotazione: " + "\n" +
                            "Codice prenotazione: " + prenotazione.getCodice_prenotazione() + "\n" +
                            "Nome ristorante: " + prenotazione.getNomeRistorante() + "\n" +
                            "Data: " + prenotazione.getData() + "\n" +
                            "Orario: " + prenotazione.getOrario() + "\n" +
                            "Tipologia tavolo: " + prenotazione.getTipologiaTavolo() +
                            "\n" + "\n" +
                            "La tua prenotazione è stata confermata!");

            Ristoratore ristoratore = RistoratoreDaoJDBC.getInstance().get(prenotazione.getUsername_ristorante());

            if(prenotazione.getTipologiaTavolo().equals("2 persone")){
                RistoratoreDaoJDBC.getInstance().updateTavolo2(ristoratore, ristoratore.getTavolo2()-1);
            }
            if(prenotazione.getTipologiaTavolo().equals("5 persone")){
                RistoratoreDaoJDBC.getInstance().updateTavolo5(ristoratore, ristoratore.getTavolo5()-1);
            }
            if(prenotazione.getTipologiaTavolo().equals("10 persone")){
                RistoratoreDaoJDBC.getInstance().updateTavolo10(ristoratore, ristoratore.getTavolo10()-1);
            }

            response.setStatus(Protocol.OK);
            resp.put("msg", "La prenotazione è stata confermata");

            return resp;

        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "La prenotazione non è stata confermata");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/rifiutaPrenotazione")
    public JSONObject rifiutaPrenotazione(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {

            String codicePrenotazione = (String) body.get("codice_prenotazione");

            Prenotazione prenotazione = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(codicePrenotazione);
            User utente = UserDaoJDBC.getInstance().findUserByUsername(prenotazione.getUsername_cliente());

            PrenotazioneDaoJDBC.getInstance().updateStatoPrenotazione("Rifiutata", prenotazione.getCodice_prenotazione());

            EmailSenderService.sendEmailPrenotazioneRifiutata(utente.getEmail(), "Prenotazione rifiutata!", EmailSenderService.PRENOTAZIONE_RIFIUTATA,
                    "Riepilogo prenotazione: " + "\n" +
                            "Codice prenotazione: " + prenotazione.getCodice_prenotazione() + "\n" +
                            "Nome ristorante: " + prenotazione.getNomeRistorante() + "\n" +
                            "Data: " + prenotazione.getData() + "\n" +
                            "Orario: " + prenotazione.getOrario() + "\n" +
                            "Tipologia tavolo: " + prenotazione.getTipologiaTavolo() +
                            "\n" + "\n" +
                            "La tua prenotazione è stata rifutata!");

            response.setStatus(Protocol.OK);
            resp.put("msg", "La prenotazione è stata rifutata");

            return resp;

        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "La prenotazione non è stata rifutata");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/cancellaPrenotazione")
    public JSONObject cancellaPrenotazione(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {

            String codicePrenotazione = (String) body.get("codice_prenotazione");

            Prenotazione prenotazione = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(codicePrenotazione);
            User utente = UserDaoJDBC.getInstance().findUserByUsername(prenotazione.getUsername_cliente());

            if (prenotazione.getStato().equals("In elaborazione")) {
                PrenotazioneDaoJDBC.getInstance().updateStatoPrenotazione("Cancellata", prenotazione.getCodice_prenotazione());

                EmailSenderService.sendEmailPrenotazioneCancellata(utente.getEmail(), "Prenotazione cancellata!", EmailSenderService.PRENOTAZIONE_CANCELLATA,
                        "Riepilogo prenotazione: " + "\n" +
                                "Codice prenotazione: " + prenotazione.getCodice_prenotazione() + "\n" +
                                "Nome ristorante: " + prenotazione.getNomeRistorante() + "\n" +
                                "Data: " + prenotazione.getData() + "\n" +
                                "Orario: " + prenotazione.getOrario() + "\n" +
                                "Tipologia tavolo: " + prenotazione.getTipologiaTavolo() +
                                "\n" + "\n" +
                                "La tua prenotazione è stata cancellata!");

                response.setStatus(Protocol.OK);
                resp.put("msg", "La prenotazione è stata cancellata");

                return resp;
            }else{
                response.setStatus(Protocol.PRENOTAZIONE_ALREADY_ACCEPTED);
                resp.put("msg", "La prenotazione è stata già confermata dal ristorante");

                return resp;
            }

        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "La prenotazione non è stata cancellata");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public JSONObject updatePrenotazioneTemplate(HttpServletRequest request, HttpServletResponse response, PrenotazioneController.UpdatePrenotazioneFunction fun) {
        String codice_prenotazione = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();

        try {
            Prenotazione prenotazione = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(codice_prenotazione);

            String ok = fun.call(prenotazione, codice_prenotazione);
            response.setStatus(200);
            resp.put("msg", ok);

            return resp;

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Internal server error");

            return resp;
        }
    }

    @PostMapping("/updateTipologia")
    public JSONObject updateTipologia(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {
            String newTipologia = (String) obj.get("tipologia");
            String newCodicePrenotazione = (String) obj.get("codice_prenotazione");

            Prenotazione prenotazione2 = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(newCodicePrenotazione);
            if (prenotazione2.getStato().equals("In elaborazione")){
                PrenotazioneController.UpdatePrenotazioneFunction fun = (prenotazione, codice_prenotazione) -> {
                    PrenotazioneDaoJDBC.getInstance().updateTipologiaTavoloPrenotazione(newTipologia, newCodicePrenotazione);
                    return "Tipologia tavolo changed successfully";
                };
                return updatePrenotazioneTemplate(request, response, fun);
            }else{
                response.setStatus(Protocol.PRENOTAZIONE_NON_MODIFICABILE);
                resp.put("msg", "La prenotazione non è modificabile!");

                return resp;
            }

        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/updateData")
    public JSONObject updateData(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {
            String newData = (String) obj.get("data");
            String newCodicePrenotazione = (String) obj.get("codice_prenotazione");

            Prenotazione prenotazione2 = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(newCodicePrenotazione);
            if (prenotazione2.getStato().equals("In elaborazione") && !prenotazione2.getData().equals(newData)){
                PrenotazioneController.UpdatePrenotazioneFunction fun = (prenotazione, codice_prenotazione) -> {
                    PrenotazioneDaoJDBC.getInstance().updateDataPrenotazione(newData, newCodicePrenotazione);
                    return "Data changed successfully";
                };
                return updatePrenotazioneTemplate(request, response, fun);
            }else{
                response.setStatus(Protocol.PRENOTAZIONE_NON_MODIFICABILE);
                resp.put("msg", "La prenotazione non è modificabile!");

                return resp;
            }

        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/updateOrario")
    public JSONObject updateOrario(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {
            String newOrario = (String) obj.get("orario");
            String newCodicePrenotazione = (String) obj.get("codice_prenotazione");

            Prenotazione prenotazione2 = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(newCodicePrenotazione);
            if (prenotazione2.getStato().equals("In elaborazione")){
                PrenotazioneController.UpdatePrenotazioneFunction fun = (prenotazione, codice_prenotazione) -> {
                    PrenotazioneDaoJDBC.getInstance().updateOrarioPrenotazione(newOrario, newCodicePrenotazione);
                    return "Orario changed successfully";
                };
                return updatePrenotazioneTemplate(request, response, fun);
            }else{
                response.setStatus(Protocol.PRENOTAZIONE_NON_MODIFICABILE);
                resp.put("msg", "La prenotazione non è modificabile!");

                return resp;
            }

        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/updateNote")
    public JSONObject updateNote(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {
            String newNote = (String) obj.get("note");
            String newCodicePrenotazione = (String) obj.get("codice_prenotazione");

            Prenotazione prenotazione2 = PrenotazioneDaoJDBC.getInstance().findPrenotazioneByCodice(newCodicePrenotazione);
            if (prenotazione2.getStato().equals("In elaborazione")){
                PrenotazioneController.UpdatePrenotazioneFunction fun = (prenotazione, codice_prenotazione) -> {
                    PrenotazioneDaoJDBC.getInstance().updateNotePrenotazione(newNote, newCodicePrenotazione);
                    return "Note changed successfully";
                };
                return updatePrenotazioneTemplate(request, response, fun);
            }else{
                response.setStatus(Protocol.PRENOTAZIONE_NON_MODIFICABILE);
                resp.put("msg", "La prenotazione non è modificabile!");

                return resp;
            }

        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }



}
