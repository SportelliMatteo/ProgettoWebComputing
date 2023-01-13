package com.restbook.controller;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.restbook.controller.transfers.Credentials;
import com.restbook.controller.transfers.FullCredentials;
import com.restbook.dao.UserDaoJDBC;
import com.restbook.model.User;
import com.restbook.model.domain.*;
import com.restbook.utilities.EmailSenderService;
import com.restbook.utilities.SpringUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = { "*" })
public class AuthController {

    private interface UpdateUserFunction {
        String call(User user, String token) throws SQLException, IllegalStateException;
    }


    @SuppressWarnings("unchecked")
    @PostMapping("/registration")
    public JSONObject doRegistration(@RequestBody FullCredentials credentials, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {
            User utente = new User();

            utente.setUsername(new Username(credentials.username));
            utente.setNome(new Nome(credentials.nome));
            utente.setEmail(new Email(credentials.email));
            utente.setPassword(new Password(credentials.password));
            utente.setTipologiaUtente(new Tipologia(credentials.tipologia));

            UserDaoJDBC.getInstance().save(utente);
            EmailSenderService.sendEmail(credentials.email.toString(), "Benvenuto!", EmailSenderService.REGISTRATION_MESSAGES);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            if (credentials.tipologia.equals("Cliente"))
                response.setStatus(Protocol.CLIENTE);
            if (credentials.tipologia.equals("Ristoratore"))
                response.setStatus(Protocol.RISTORATORE);
            if (credentials.tipologia.equals("Amministratore"))
                response.setStatus(Protocol.AMMINISTRATORE);
            resp.put("msg", "Account creato con successo");
            return resp;
        } catch (SQLException e) {
            if (e.getMessage().contains("violates unique constraint")) {
                response.setStatus(Protocol.USER_ALREADY_EXISTS);
                resp.put("msg", "Utente già registrato");
            } else {
                response.setStatus(Protocol.SERVER_ERROR);
                resp.put("msg", "Errore server interno");
            }

            return resp;
        } catch (IllegalArgumentException | NullPointerException e2) {
            e2.printStackTrace();
            response.setStatus(Protocol.INVALID_CREDENTIALS);
            resp.put("msg", "Le credenziali fornite non sono valide");

            return resp;
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/login")
    public JSONObject doLogin(@RequestBody Credentials credentials, HttpServletResponse response) {
        User utente = null;
        JSONObject resp = new JSONObject();
        try {
            utente = UserDaoJDBC.getInstance().checkCredentials(new Tipologia(credentials.tipologia), new Username(credentials.username),
                    new Password(credentials.password));
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server interno");

            return resp;
        } catch (IllegalArgumentException | NullPointerException e2) {
            e2.printStackTrace();
            response.setStatus(Protocol.INVALID_CREDENTIALS);
            resp.put("msg", "Le credenziali fornite non sono valide");

            return resp;
        }

        if (utente == null) {
            response.setStatus(Protocol.WRONG_CREDENTIALS);
            resp.put("msg", "Combinazione invalida di username e password");
            return resp;
        }

        String token = "";

        try {

            token = UserDaoJDBC.getInstance().getToken(credentials.username);

            // se il token è vuoto, ne genero uno nuovo
            if (token.isEmpty()) {
                String newToken = SpringUtil.generateNewToken();
                UserDaoJDBC.getInstance().saveToken(credentials.username, newToken);

                token = newToken;
            }

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            if (credentials.tipologia.equals("Cliente"))
                response.setStatus(Protocol.CLIENTE);
            if (credentials.tipologia.equals("Ristoratore"))
                response.setStatus(Protocol.RISTORATORE);
            if (credentials.tipologia.equals("Amministratore"))
                response.setStatus(Protocol.AMMINISTRATORE);
            resp.put("key", token);

            return resp;

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server interno");

            return resp;
        }

    }

    @SuppressWarnings("unchecked")
    @GetMapping("/checkLogin")
    public JSONObject checkLogin(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();

        if (token != null && !token.isEmpty()) {
            try {
                // cerco l'utente che ha quel token di accesso
                User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);

                // se non trovo l'utente, rispondo con error 5000
                if (user == null) {
                    response.setStatus(Protocol.INVALID_TOKEN);
                    resp.put("msg", "Il token non è valido");

                    return resp;
                }

                // altrimenti, restituisco 200 e l'oggetto user
                response.setStatus(Protocol.OK);
                resp.put("user", user);
                return resp;

            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(Protocol.SERVER_ERROR);
                resp.put("msg", "Errore server interno");

                return resp;
            }
        }

        // se non ho trovato il token, restituisco il codice di errore
        response.setStatus(Protocol.INVALID_TOKEN);
        resp.put("msg", "Il token non è valido");
        return resp;
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/logout")
    public JSONObject doLogout(HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        String token = request.getHeader("Authorization");

        if (token != null && !token.isEmpty()) {
            try {
                // cerco l'utente che ha quel token di accesso
                User user = UserDaoJDBC.getInstance().findByToken(token);

                // se non trovo l'utente, rispondo con error 5000
                if (user == null) {
                    response.setStatus(Protocol.INVALID_TOKEN);
                    resp.put("msg", "Il token non è valido");

                    return resp;
                }

                // altrimenti invalido il token
                UserDaoJDBC.getInstance().deleteToken(token);
                UserDaoJDBC.getInstance().saveToken(user.getUsername(), "");
                response.setStatus(Protocol.OK);
                resp.put("msg", "Logout effettuato con successo");

                return resp;

            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(Protocol.SERVER_ERROR);
                resp.put("msg", "Internal server error");

                return resp;
            }
        }

        // se non ho trovato il token, restituisco il codice di errore
        response.setStatus(Protocol.INVALID_TOKEN);
        resp.put("msg", "Il token non è valido");

        return resp;

    }

    @SuppressWarnings({ "unchecked"})
    @PostMapping("/loginGoogle")
    public JSONObject doLoginGoogle(@RequestBody JSONObject obj, HttpServletResponse response) {
        User utente = null;
        JSONObject res = new JSONObject();

        List<String> usernames = new ArrayList<>();

        try {
            String username = (String) obj.get("username");
            String nome = (String) obj.get("nome");
            String tipologia = (String) obj.get("tipologia");
            utente = UserDaoJDBC.getInstance().findByEmailAndTipologia(new Email((String) obj.get("email")));

            usernames = UserDaoJDBC.getInstance().getAllUsername();

            //se non esiste nessun utente registrato con quella mail, posso procedere con il login incompleto, richiedendo l'username
            if (utente == null && username == null && nome == null && tipologia == null) {
                response.setStatus(Protocol.INCOMPLETE_GOOGLE_LOGIN);
                res.put("msg", "Per favore inserisci l'username e riprova");
                return res;
            }
            //è arrivato l'username e posso completare la creazione dell'account google e il login
            else if(utente == null && username != null && nome != null && tipologia != null) {
                utente = new User();
                utente.setEmail(new Email((String) obj.get("email")));
                utente.setUsername(new Username(username));
                utente.setNome(new Nome(nome));
                utente.setTipologiaUtente(new Tipologia(tipologia));
                utente.setGoogleUser(true);

                for (String u : usernames){
                    if (u.equals(utente.getUsername())){
                        response.setStatus(Protocol.USERAME_ALREADY_EXISTS);
                        res.put("msg", "Questo username già esiste");
                        return res;
                    }
                }
                UserDaoJDBC.getInstance().saveGoogleUser(utente, (String) obj.get("google_id"));
                EmailSenderService.sendEmail(obj.get("email").toString(), "Welcome!", EmailSenderService.REGISTRATION_MESSAGES);
            }
            else {
                if(UserDaoJDBC.getInstance().isGoogleAccount(new Email((String) obj.get("email"))))
                    utente = UserDaoJDBC.getInstance().checkGoogleCredentials((String) obj.get("google_id"), new Email((String) obj.get("email")));
                else {
                    response.setStatus(Protocol.USER_ALREADY_EXISTS);
                    res.put("msg", "Questa email è giù registrata");
                    return res;
                }
            }

            String token = "";

            token = UserDaoJDBC.getInstance().getToken(utente.getUsername().toString());

            // se il token è vuoto, ne genero uno nuovo
            if (token.isEmpty()) {
                String newToken = SpringUtil.generateNewToken();
                UserDaoJDBC.getInstance().saveToken(utente.getUsername().toString(), newToken);

                token = newToken;
            }

            String tipologia2 = utente.getTipologiaUtente();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            if (tipologia2.equals("Cliente"))
                response.setStatus(Protocol.CLIENTE);
            if (tipologia2.equals("Ristoratore"))
                response.setStatus(Protocol.RISTORATORE);
            if (tipologia2.equals("Amministratore"))
                response.setStatus(Protocol.AMMINISTRATORE);
            res.put("key", token);
            return res;

        } catch (IllegalArgumentException | NullPointerException e) {
            e.printStackTrace();
            response.setStatus(Protocol.INVALID_CREDENTIALS);
            res.put("msg", "Le credenziali non sono valide");

            return res;
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            res.put("msg", "Errore server interno");

            return res;

        }
    }

    @PostMapping("/tipologia")
    public JSONObject getTipologia(@RequestBody JSONObject obj, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        Username username = new Username((String) obj.get("username"));
        String tipologia = "";
        if (username != null) {
            try {

                // cerco l'utente che ha quel token di accesso
                User user = UserDaoJDBC.getInstance().findTipologiaByUsername(username);

                // se non trovo l'utente, rispondo con error 5000
                if (username == null) {
                    response.setStatus(Protocol.INVALID_TOKEN);
                    resp.put("msg", "Il token non è valido");

                    return resp;
                }

                tipologia = user.getTipologiaUtente();
                if (tipologia.equals("Cliente"))
                    response.setStatus(Protocol.CLIENTE);
                if (tipologia.equals("Ristoratore"))
                    response.setStatus(Protocol.RISTORATORE);
                if (tipologia.equals("Amministratore"))
                    response.setStatus(Protocol.AMMINISTRATORE);

                return resp;

            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(Protocol.SERVER_ERROR);
                resp.put("msg", "Errore server interno");
            }


        }

        return resp;

    }

    @SuppressWarnings("unchecked")
    public JSONObject updateUserTemplate(HttpServletRequest request, HttpServletResponse response,
                                         UpdateUserFunction fun) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();

        try {
            // cerco l'utente che ha quel token di accesso
            User user = UserDaoJDBC.getInstance().findByToken(token);

            // se non trovo l'utente, rispondo con error 5000
            if (user == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "Il token non è valido");

                return resp;
            }

            String ok = fun.call(user, token);
            response.setStatus(200);
            resp.put("msg", ok);

            return resp;

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server interno");

            return resp;
        } catch (IllegalStateException e2) {
            response.setStatus(Protocol.WRONG_CREDENTIALS);
            resp.put("msg", "La vecchia password non combacia");

            return resp;
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/updateUserAvatar")
    public JSONObject updateUserAvatar(@RequestBody JSONObject obj, HttpServletRequest request,
                                       HttpServletResponse response) {
        try {
            String avatar = (String) obj.get("image");
            byte[] img = Base64.getDecoder().decode(avatar.split(",")[1].getBytes("UTF-8"));

            UpdateUserFunction fun = (user, token) -> {
                UserDaoJDBC.getInstance().updateUserAvatar(img, token);
                return "Avatar aggiornato con successo";
            };

            return updateUserTemplate(request, response, fun);
        } catch (UnsupportedEncodingException e) {
            JSONObject resp = new JSONObject();
            resp.put("msg", "Immagine non valida");
            response.setStatus(Protocol.INVALID_DATA);

            return resp;
        }
    }

    @DeleteMapping("/resetUserAvatar")
    public JSONObject resetUserAvatar(HttpServletRequest request, HttpServletResponse response) {

        UpdateUserFunction fun = (user, token) -> {
            UserDaoJDBC.getInstance().resetUserAvatar(token);
            return "Avatar aggiornato con successo";
        };

        return updateUserTemplate(request, response, fun);
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/forgotpassword")
    public JSONObject resetPassword(@RequestBody JSONObject obj, HttpServletResponse response) {
        User utente = null;

        try {
            utente = UserDaoJDBC.getInstance().findByEmail(new Email((String) obj.get("email")));

            if(UserDaoJDBC.getInstance().isGoogleAccount(new Email((String) obj.get("email")))) {
                response.setStatus(Protocol.INVALID_DATA);
                JSONObject resp = new JSONObject();
                resp.put("msg", "Cannot update the password of a google account");
                return resp;
            }

            if (utente != null) {
                String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.?#$%^&+=!";
                String pwd = RandomStringUtils.random(30, characters);
                Password newPassword = new Password(pwd);
                Email email = new Email((String) obj.get("email"));
                EmailSenderService.sendPasswordResetEmail(email.toString(), pwd);
                UserDaoJDBC.getInstance().updateUserPasswordByEmail(newPassword, email);
                response.setStatus(Protocol.OK);
                JSONObject resp = new JSONObject();
                resp.put("msg", "Account created succesffully");
                return resp;
            }
        } catch (SQLException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided password is not valid");

            return resp;

        } catch (IllegalArgumentException | NullPointerException e2) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided password is not valid");

            return resp;

        }
        return obj;
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/updateUserEmail")
    public JSONObject updateUserEmail(@RequestBody JSONObject obj, HttpServletRequest request,
                                      HttpServletResponse response) {
        try {
            Email newMail = new Email((String) obj.get("email"));

            UpdateUserFunction fun = (user, token) -> {
                UserDaoJDBC.getInstance().updateUserEmail(newMail, token);
                return "Email changed successfully";
            };

            return updateUserTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @PostMapping("/updateUserNome")
    public JSONObject updateUserNome(@RequestBody JSONObject obj, HttpServletRequest request,
                                      HttpServletResponse response) {
        try {
            Nome newNome = new Nome((String) obj.get("nome"));

            UpdateUserFunction fun = (user, token) -> {
                UserDaoJDBC.getInstance().updateUserNome(newNome, token);
                return "Nome changed successfully";
            };

            return updateUserTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided email is not valid");

            return resp;
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/updateUserPassword")
    public JSONObject updateUserPassword(@RequestBody JSONObject obj, HttpServletRequest request,
                                         HttpServletResponse response) {
        try {
            Password oldPassword = new Password((String) obj.get("old_password"));
            Password newPassword = new Password((String) obj.get("new_password"));

            UpdateUserFunction fun = (user, token) -> {
                if (UserDaoJDBC.getInstance().checkCredentialsForPassword(user.getUsernameField(), oldPassword) != null) {
                    UserDaoJDBC.getInstance().updateUserPassword(newPassword, token);
                    return "Password changed successfully";
                }

                throw new IllegalStateException();
            };

            return updateUserTemplate(request, response, fun);
        } catch (IllegalArgumentException | NullPointerException e) {
            JSONObject resp = new JSONObject();
            response.setStatus(Protocol.INVALID_DATA);
            resp.put("msg", "The provided password is not valid");

            return resp;
        }
    }


}
