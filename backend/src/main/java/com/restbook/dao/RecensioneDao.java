package com.restbook.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.restbook.model.Recensione;

public abstract class RecensioneDao {
    public abstract Recensione getRecensione(String Utente,String Ristorante);
    public abstract ArrayList<Recensione> getRecensioniRistorante(String Ristorante);
    public abstract boolean DeleteRecensione(String Utente,String Ristorante);
    public abstract boolean insertRecensione(Recensione recensione);
    public abstract List<Recensione> getAll() throws SQLException;
    public abstract void deleteRecensioneFromCodiceRecensione(int id_recensione) throws SQLException;


}