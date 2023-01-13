package com.restbook.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Recensione {
    private String utente,ristorante,voto,recensione;
    private byte[] immagine;
    private Integer id_recensione;
    private String username_ristorante;

    public String getUsername_ristorante() {
        return username_ristorante;
    }

    public void setUsername_ristorante(String username_ristorante) {
        this.username_ristorante = username_ristorante;
    }

    public Integer getId_recensione() {
        return id_recensione;
    }
    private void setId_recensione(Integer id_recensione) {
        this.id_recensione = id_recensione;
    }
    public String getUtente() {
        return utente;
    }
    public void setUtente(String utente) {
        this.utente = utente;
    }
    public String getRistorante() {
        return ristorante;
    }
    public void setRistorante(String ristorante) {
        this.ristorante = ristorante;
    }
    public String getVoto() {
        return voto;
    }
    public void setVoto(String voto) {
        this.voto = voto;
    }
    public String getRecensione() {
        return recensione;
    }
    public void setRecensione(String recensione) {
        this.recensione = recensione;
    }
    public byte[] getImmagine() {
        return immagine;
    }
    public void setImmagine(byte[] immagine) {
        this.immagine = immagine;
    }

    public static Recensione parseFromDB(ResultSet rs) throws SQLException {
        Recensione recensione=new Recensione();
        recensione.setUtente(rs.getString("utente"));
        recensione.setRistorante(rs.getString("ristorante"));
        recensione.setVoto(rs.getString("voto"));
        recensione.setId_recensione(rs.getInt("codice_recensione"));
        recensione.setRecensione(rs.getString("recensione"));
        if (rs.getBytes("immagine") != null) {
            recensione.setImmagine(rs.getBytes("immagine"));
        }
        recensione.setUsername_ristorante(rs.getString("username_ristorante"));
        return recensione;
    }

}