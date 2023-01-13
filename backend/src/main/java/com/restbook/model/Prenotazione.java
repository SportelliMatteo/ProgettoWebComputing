package com.restbook.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Prenotazione {

    private String username_ristorante;
    private String username_cliente;
    private String data;
    private String orario;
    private String note;
    private String tipologiaTavolo;
    private String nomeRistorante;
    private String stato;


    public String getStato() {
        return stato;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }

    public String getNomeRistorante() {
        return nomeRistorante;
    }

    public void setNomeRistorante(String nomeRistorante) {
        this.nomeRistorante = nomeRistorante;
    }

    private String codice_prenotazione;

    public String getCodice_prenotazione() {
        return codice_prenotazione;
    }

    public void setCodice_prenotazione(String codice_prenotazione) {
        this.codice_prenotazione = codice_prenotazione;
    }

    public String getTipologiaTavolo() {
        return tipologiaTavolo;
    }
    public void setTipologiaTavolo(String tipologiaTavolo) {
        this.tipologiaTavolo = tipologiaTavolo;
    }
    public String getUsername_ristorante() {
        return username_ristorante;
    }

    public void setUsername_ristorante(String username_ristorante) {
        this.username_ristorante = username_ristorante;
    }

    public String getUsername_cliente() {
        return username_cliente;
    }

    public void setUsername_cliente(String username_cliente) {
        this.username_cliente = username_cliente;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getOrario() {
        return orario;
    }

    public void setOrario(String orario) {
        this.orario = orario;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public static Prenotazione parseFromDB(ResultSet rs) throws SQLException {
        Prenotazione prenotazione = new Prenotazione();
        prenotazione.setUsername_ristorante(rs.getString("username_ristorante"));
        prenotazione.setUsername_cliente(rs.getString("username_cliente"));
        prenotazione.setOrario(rs.getString("orario"));
        prenotazione.setData(rs.getString("data"));
        prenotazione.setNote(rs.getString("note"));
        prenotazione.setTipologiaTavolo(rs.getString("tipologia_tavolo"));
        prenotazione.setCodice_prenotazione(rs.getString("codice_prenotazione"));
        prenotazione.setNomeRistorante(rs.getString("nome_ristorante"));
        prenotazione.setStato(rs.getString("stato"));
        return prenotazione;
    }
}
