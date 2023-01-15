package com.restbook.controller;

import com.restbook.dao.ClienteDaoJDBC;
import com.restbook.dao.PreferitoJDBC;
import com.restbook.dao.UserDaoJDBC;
import com.restbook.model.Cliente;
import com.restbook.model.Preferito;
import com.restbook.model.Prenotazione;
import com.restbook.model.User;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = {"*"})
public class PreferitoController {

    @PostMapping("/createPreferito")
    public JSONObject createNewPreferito(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {

            User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);
            String usernameRistoratore = (String) body.get("usernameRistoratore");
            String nome = (String) body.get("nome");
            String copertina = (String) body.get("copertina");

            if (ClienteDaoJDBC.getInstance().get(user.getUsername()) != null){
                Preferito preferito = new Preferito();
                preferito.setUsername_ristoratore(usernameRistoratore);
                preferito.setUsername_cliente(user.getUsername());
                preferito.setNome(nome);
                preferito.setCopertina(copertina);

                PreferitoJDBC.getInstance().save(preferito);

                response.setStatus(Protocol.OK);
                resp.put("msg", "Preferito creato con successo");

                return resp;
            }else{
                response.setStatus(Protocol.CLIENTE_NOT_EXISTS);
                resp.put("msg", "Il cliente non esiste");

                return resp;
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Internal server error");

            return resp;
        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "Preferito is not valid");

            return resp;
        }
    }

    @PostMapping("/eliminaPreferito")
    public JSONObject deletePreferito(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {

            User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);
            System.out.println(user.getUsername());
            String usernameRistoratore = (String) body.get("usernameRistoratore");

            String nome = (String) body.get("nome");


            if (ClienteDaoJDBC.getInstance().get(user.getUsername()) != null){
                Preferito preferito = new Preferito();
                preferito.setUsername_ristoratore(usernameRistoratore);
                preferito.setUsername_cliente(user.getUsername());
                preferito.setNome(nome);

                PreferitoJDBC.getInstance().delete(preferito);

                response.setStatus(Protocol.OK);
                resp.put("msg", "Preferito eliminato con successo");

                return resp;
            }else{
                response.setStatus(Protocol.CLIENTE_NOT_EXISTS);
                resp.put("msg", "Il cliente non esiste");

                return resp;
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Internal server error");

            return resp;
        } catch (IllegalArgumentException | NullPointerException e2) {
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "Preferito is not valid");

            return resp;
        }
    }

    @PostMapping("/getPreferiti")
    private List<Preferito> getPreferiti(HttpServletRequest request) throws SQLException {
        String token = request.getHeader("Authorization");
        List <Preferito> list = null;
        if (token != null && !token.isEmpty()) {
            try {
                User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);
                list = PreferitoJDBC.getInstance().getAll();

                List<Preferito> preferiti = new ArrayList<>();
                for (Preferito p : list){
                    if (p.getUsername_cliente().equals(user.getUsername())) {
                        preferiti.add(p);
                    }
                }
                return preferiti;
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

    @PostMapping("/getPreferito")
    private JSONObject getPreferito(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) throws SQLException {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();

        User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);
        if (user == null ){
            response.setStatus(Protocol.INVALID_DATA);
            return resp;
        }

        String nomeRistorante = (String) body.get("nomeRistorante");
        Preferito preferito = PreferitoJDBC.getInstance().getPreferitoByNomeAndUsername(user.getUsername(), nomeRistorante);

        if(preferito.getNome() != null){
            response.setStatus(Protocol.OK);
            resp.put("preferito", preferito);
            return resp;
        }else{
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("preferito", preferito);
            return resp;
        }


    }

}
