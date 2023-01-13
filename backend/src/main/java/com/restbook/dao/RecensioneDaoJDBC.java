package com.restbook.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.restbook.model.Recensione;

public class RecensioneDaoJDBC extends RecensioneDao{
    private static RecensioneDaoJDBC instance = null;
    private RecensioneDaoJDBC(){}

    private final String getAllQuery = "select * from recensione;";
    private String removeRecensioneQuery = "delete from recensione where codice_recensione=?;";

    public static RecensioneDaoJDBC getInstance() {
        if(instance == null)
            instance = new RecensioneDaoJDBC();

        return instance;
    }

    @Override
    public List<Recensione> getAll() throws SQLException {
        List <Recensione> list = new ArrayList<>();
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllQuery);
        while(rs.next()) {
            Recensione recensione = Recensione.parseFromDB(rs);
            list.add(recensione);
        }

        stm.close();
        return list;
    }

    @Override
    public Recensione getRecensione(String Utente, String Ristorante) {
        String q="select * from recensione where utente=? and ristorante=? ";
        Recensione recensione= new Recensione();
        try {
            PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(q);
            stm.setString(1, Utente);
            stm.setString(2, Ristorante);
            ResultSet rs = stm.executeQuery();
            if(rs.next()) {
                recensione= Recensione.parseFromDB(rs);
            }
            else {
                return null;
            }
            rs.close();
            stm.close();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return recensione;
    }

    @Override
    public boolean DeleteRecensione(String Utente, String Ristorante) {
        String q="DELETE  from recensione where utente=? and ristorante=? ";
        try {
            PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(q);
            stm.setString(1, Utente);
            stm.setString(2, Ristorante);
            stm.execute();
            stm.close();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public boolean insertRecensione(Recensione recensione) {
        String q="insert into recensione values(?,?,?,?,?,?)";
        try {
            PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(q);
            stm.setString(1, recensione.getUtente());
            stm.setString(2, recensione.getRistorante());
            stm.setString(3, recensione.getVoto());
            stm.setString(4, recensione.getRecensione());
            stm.setBytes(5, recensione.getImmagine());
            stm.setString(6, recensione.getUsername_ristorante());
            stm.executeUpdate();
            stm.close();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public ArrayList<Recensione> getRecensioniRistorante(String usernameRistorante) {
        String q="select * from recensione where username_ristorante=? ";
        ArrayList<Recensione> recensioni= new ArrayList();
        try {
            PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(q);
            stm.setString(1, usernameRistorante);
            ResultSet rs = stm.executeQuery();
            while(rs.next()) {
                Recensione rec=new Recensione();
                rec= Recensione.parseFromDB(rs);
                recensioni.add(rec);
            }
            rs.close();
            stm.close();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return recensioni;
    }

    @Override
    public void deleteRecensioneFromCodiceRecensione(int id_recensione) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(removeRecensioneQuery);
        stm.setInt(1, id_recensione);


        stm.execute();
        stm.close();
    }



}