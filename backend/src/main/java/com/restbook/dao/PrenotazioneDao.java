package com.restbook.dao;

import com.restbook.model.Prenotazione;

import java.sql.SQLException;
import java.util.List;

public abstract class PrenotazioneDao implements Dao<Prenotazione> {

    public abstract List<Prenotazione> getAll() throws SQLException;
    public abstract void save(Prenotazione obj) throws SQLException;
    public abstract Prenotazione findPrenotazioneByCodice(String codice_prenotazione) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract void updateStatoPrenotazione(String stato, String codice_prenotazione) throws SQLException;
    public abstract void updateTipologiaTavoloPrenotazione(String tipologia, String codice_prenotazione) throws SQLException;
    public abstract void updateDataPrenotazione(String data, String codice_prenotazione) throws SQLException;
    public abstract void updateOrarioPrenotazione(String orario, String codice_prenotazione) throws SQLException;
    public abstract void updateNotePrenotazione(String note, String codice_prenotazione) throws SQLException;
    public abstract void rimuoviPrenotazioneDaUsername(String username) throws SQLException;
    public abstract void rimuoviPrenotazioneRistoranteDaUsername(String username) throws SQLException;
}
