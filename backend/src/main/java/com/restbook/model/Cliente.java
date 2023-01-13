package com.restbook.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Cliente{

    private String numero;
    private String usernameCliente;
    private String indirizzo;
    private String intolleranze;

    public void setIntolleranze(String intolleranze) {
        this.intolleranze = intolleranze;
    }

    public String getIntolleranze() {
        return intolleranze;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getUsernameCliente() {
        return usernameCliente;
    }

    public void setUsernameCliente(String usernameCliente) {
        this.usernameCliente = usernameCliente;
    }

    public static Cliente parseFromDB(ResultSet rs) throws SQLException {
        Cliente cliente = new Cliente();
        cliente.setUsernameCliente(rs.getString("username_cliente"));
        cliente.setNumero(rs.getString("numero"));
        cliente.setIndirizzo(rs.getString("indirizzo"));
        cliente.setIntolleranze(rs.getString("intolleranze_alimentari"));
        return cliente;
    }

}
