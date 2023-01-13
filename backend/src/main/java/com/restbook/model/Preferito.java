package com.restbook.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Preferito {

    private String username_cliente;
    private String username_ristoratore;
    private String nome;
    private String copertina;

    public String getCopertina() {
        return copertina;
    }
    public void setCopertina(String copertina) {
        this.copertina = copertina;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getUsername_cliente() {
        return username_cliente;
    }
    public void setUsername_cliente(String username_cliente) {
        this.username_cliente = username_cliente;
    }
    public String getUsername_ristoratore() {
        return username_ristoratore;
    }
    public void setUsername_ristoratore(String username_ristoratore) {
        this.username_ristoratore = username_ristoratore;
    }

    public static Preferito parseFromDB(ResultSet rs) throws SQLException {
        Preferito preferito = new Preferito();
        preferito.setUsername_ristoratore(rs.getString("username_ristoratore"));
        preferito.setUsername_cliente(rs.getString("username_cliente"));
        preferito.setNome(rs.getString("nome"));
        preferito.setCopertina(rs.getString("copertina"));
        return preferito;
    }

}
