package com.restbook.dao;

import com.restbook.model.Prenotazione;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class PrenotazioneDaoJDBC extends PrenotazioneDao{

    private static PrenotazioneDaoJDBC instance = null;

    private final String getAllQuery = "select * from prenotazione;";
    private final String insertPrenotazione = "insert into prenotazione values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private final String findPrenotazioneByCodice = "select * from prenotazione where codice_prenotazione=?;";
    private String updateStatoPrenotazioneQuery = "update prenotazione set stato=? where codice_prenotazione=?";
    private String updateTiplogiaPrenotazioneQuery = "update prenotazione set tipologia_tavolo=? where codice_prenotazione=?";
    private String updateDataPrenotazioneQuery = "update prenotazione set data=? where codice_prenotazione=?";
    private String updateOrarioPrenotazioneQuery = "update prenotazione set orario=? where codice_prenotazione=?";
    private String updateNotePrenotazioneQuery = "update prenotazione set note=? where codice_prenotazione=?";
    private String rimuoviPrenotazioniDaUsernameQuery = "delete from prenotazione where username_cliente=?";
    private String rimuoviPrenotazioniRistoranteDaUsernameQuery = "delete from prenotazione where username_ristorante=?";

    private PrenotazioneDaoJDBC(){}

    public static PrenotazioneDaoJDBC getInstance() {
        if(instance == null)
            instance = new PrenotazioneDaoJDBC();

        return instance;
    }

    @Override
    public List<Prenotazione> getAll() throws SQLException {
        List <Prenotazione> list = new ArrayList<>();
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllQuery);
        while(rs.next()) {
            Prenotazione prenotazione = Prenotazione.parseFromDB(rs);
            list.add(prenotazione);
        }

        stm.close();
        return list;
    }

    @Override
    public void save(Prenotazione obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(insertPrenotazione);
        stm.setString(1, obj.getUsername_ristorante());
        stm.setString(2, obj.getUsername_cliente());
        stm.setString(3, obj.getOrario());
        stm.setString(4, obj.getData());
        stm.setString(5, obj.getNote());
        stm.setString(6, obj.getCodice_prenotazione());
        stm.setString(7, obj.getTipologiaTavolo());
        stm.setString(8, obj.getNomeRistorante());
        stm.setString(9, obj.getStato());


        stm.execute();
        stm.close();
    }

    @Override
    public Prenotazione findPrenotazioneByCodice(String codice_prenotazione) throws SQLException, IllegalArgumentException, NullPointerException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findPrenotazioneByCodice);

        stm.setString(1, codice_prenotazione);

        ResultSet rs = stm.executeQuery();
        Prenotazione prenotazione = null;
        if (rs.next()) {
            prenotazione = new Prenotazione();
            prenotazione.setUsername_ristorante(rs.getString("username_ristorante"));
            prenotazione.setUsername_cliente(rs.getString("username_cliente"));
            prenotazione.setOrario(rs.getString("orario"));
            prenotazione.setData(rs.getString("data"));
            prenotazione.setNote(rs.getString("note"));
            prenotazione.setCodice_prenotazione(rs.getString("codice_prenotazione"));
            prenotazione.setTipologiaTavolo(rs.getString("tipologia_tavolo"));
            prenotazione.setNomeRistorante(rs.getString("nome_ristorante"));
            prenotazione.setStato(rs.getString("stato"));
        }

        rs.close();
        stm.close();

        return prenotazione;
    }

    @Override
    public void updateStatoPrenotazione(String stato, String codice_prenotazione) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateStatoPrenotazioneQuery);
        stm.setString(1, stato);
        stm.setString(2, codice_prenotazione);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateTipologiaTavoloPrenotazione(String tipologia, String codice_prenotazione) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateTiplogiaPrenotazioneQuery);
        stm.setString(1, tipologia);
        stm.setString(2, codice_prenotazione);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateDataPrenotazione(String data, String codice_prenotazione) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateDataPrenotazioneQuery);
        stm.setString(1, data);
        stm.setString(2, codice_prenotazione);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateOrarioPrenotazione(String orario, String codice_prenotazione) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateOrarioPrenotazioneQuery);
        stm.setString(1, orario);
        stm.setString(2, codice_prenotazione);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateNotePrenotazione(String note, String codice_prenotazione) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateNotePrenotazioneQuery);
        stm.setString(1, note);
        stm.setString(2, codice_prenotazione);

        stm.execute();
        stm.close();
    }

    @Override
    public void rimuoviPrenotazioneDaUsername(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(rimuoviPrenotazioniDaUsernameQuery);
        stm.setString(1, username);

        stm.execute();
        stm.close();
    }

    @Override
    public void rimuoviPrenotazioneRistoranteDaUsername(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(rimuoviPrenotazioniRistoranteDaUsernameQuery);
        stm.setString(1, username);

        stm.execute();
        stm.close();
    }


}
