package com.restbook.dao;

import com.restbook.model.Preferito;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class PreferitoJDBC extends PreferitoDao{

    private static PreferitoJDBC instance = null;

    private final String getAllQuery = "select * from preferito;";
    private final String insertPreferito = "insert into preferito values(?, ?, ?,?)";
    private final String deletePreferito = "delete from preferito where username_cliente=? and username_ristoratore=? and nome=?";
    private final String deletePreferitoFromUsernameQuery = "delete from preferito where username_cliente=?";
    private final String deletePreferitoRistoranteFromUsernameQuery = "delete from preferito where username_ristoratore=?";

    private PreferitoJDBC(){}

    public static PreferitoJDBC getInstance() {
        if(instance == null)
            instance = new PreferitoJDBC();

        return instance;
    }

    @Override
    public List<Preferito> getAll() throws SQLException {
        List <Preferito> list = new ArrayList<>();
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllQuery);
        while(rs.next()) {
            Preferito preferito = Preferito.parseFromDB(rs);
            list.add(preferito);
        }

        stm.close();
        return list;
    }

    @Override
    public void save(Preferito obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(insertPreferito);
        stm.setString(1, obj.getUsername_cliente());
        stm.setString(2, obj.getUsername_ristoratore());
        stm.setString(3, obj.getNome());
        stm.setString(4, obj.getCopertina());

        stm.execute();
        stm.close();
    }

    @Override
    public void delete(Preferito obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deletePreferito);
        stm.setString(1, obj.getUsername_cliente());
        stm.setString(2, obj.getUsername_ristoratore());
        stm.setString(3, obj.getNome());

        stm.execute();
        stm.close();
    }

    @Override
    public void deletePreferitiFromUsername(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deletePreferitoFromUsernameQuery);
        stm.setString(1, username);


        stm.execute();
        stm.close();
    }

    @Override
    public void deletePreferitiRistoranteFromUsername(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deletePreferitoRistoranteFromUsernameQuery);
        stm.setString(1, username);


        stm.execute();
        stm.close();
    }

    @Override
    public Preferito getPreferitoByNomeAndUsername(String usernameCliente, String nomeRistorante) {
        String q="select * from preferito where username_cliente=? and nome=? ";
        Preferito preferito = new Preferito();
        try {
            PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(q);
            stm.setString(1, usernameCliente);
            stm.setString(2, nomeRistorante);

            ResultSet rs = stm.executeQuery();
            if(rs.next()) {
                Preferito p = new Preferito();
                p = Preferito.parseFromDB(rs);
                preferito = p;
            }
            rs.close();
            stm.close();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return preferito;
    }

}
