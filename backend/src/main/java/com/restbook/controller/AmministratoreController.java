package com.restbook.controller;

import com.restbook.dao.ClienteDaoJDBC;
import com.restbook.dao.RecensioneDaoJDBC;
import com.restbook.dao.RistoratoreDaoJDBC;
import com.restbook.dao.UserDaoJDBC;
import com.restbook.model.Cliente;
import com.restbook.model.Recensione;
import com.restbook.model.Ristoratore;
import com.restbook.model.User;
import com.restbook.model.domain.Password;
import com.restbook.model.domain.Tipologia;
import com.restbook.model.domain.Username;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
@CrossOrigin(origins = {"*"})
@RequestMapping("/admin")
public class AmministratoreController {

    @GetMapping("/login")
    public String adminLogin() {
        return "login";
    }

    @PostMapping("/doLogin")
    public String doLogin(HttpServletRequest request, HttpServletResponse response,
                          String username, String password, String tipologia) throws IOException {
        User utente = null;

        try {
            utente = UserDaoJDBC.getInstance().checkCredentials(new Tipologia(tipologia), new Username(username), new Password(password));
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);

            request.setAttribute("error", "Errore server, per favore riprova!");

            return "login";
        } catch (IllegalArgumentException | NullPointerException e2) {
            e2.printStackTrace();
            response.setStatus(Protocol.INVALID_CREDENTIALS);
            request.setAttribute("error", "Credenziali invalide, per favore riprova!");

            return "login";
        }

        if(utente == null) {
            response.setStatus(Protocol.WRONG_CREDENTIALS);
            request.setAttribute("error", "Username/password non corrette, per favore riprova!");
            return "login";
        }

        HttpSession session = request.getSession(true);
        session.setAttribute("username", username);

        response.sendRedirect("/admin/dashboard");
        return "dashboard";
    }

    @GetMapping("/dashboard")
    public String getDashboard(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        HttpSession session = request.getSession(true);
        Object username = (Object) session.getAttribute("username");

        if(!(username instanceof String)) {
            request.setAttribute("text", "Username non valido");
            return "errorPage";
        }

        String userStr = (String) username;

        try {
            if(!UserDaoJDBC.getInstance().isUserAdmin(new Username(userStr))) {
                request.setAttribute("text", "Questo user non è un admin");
                return "errorPage";
            }
        } catch (IllegalArgumentException | NullPointerException e) {
            request.setAttribute("text", "Username non valido");
            return "errorPage";
        } catch (SQLException e) {
            request.setAttribute("text", "Errore server, per favore riprova!");
            return "errorPage";
        }

        List<Cliente> clienti = new ArrayList<>();
        List<Ristoratore> ristoranti = new ArrayList<>();
        List<Recensione> recensioni = new ArrayList<>();

        try {
            clienti = ClienteDaoJDBC.getInstance().getAll();
            ristoranti = RistoratoreDaoJDBC.getInstance().getAll();
            recensioni = RecensioneDaoJDBC.getInstance().getAll();
            Collections.sort(clienti, (cliente1, cliente2) -> cliente1.getUsernameCliente().toLowerCase().compareTo(cliente2.getUsernameCliente().toLowerCase()));
            Collections.sort(ristoranti, (ristorante1, ristorante2) -> ristorante1.getNome().compareTo(ristorante2.getNome()));
        } catch (SQLException e) {
            e.printStackTrace();
        }

        request.setAttribute("clienti", clienti);
        request.setAttribute("ristoranti", ristoranti);
        request.setAttribute("recensioni", recensioni);

        return "dashboard";
    }

    @GetMapping("/doLogout")
    public void doLogout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        if(session != null)
            session.invalidate();

        response.sendRedirect("/admin/login");
    }

}
