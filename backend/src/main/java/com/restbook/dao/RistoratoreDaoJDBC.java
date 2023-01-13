package com.restbook.dao;

import com.restbook.model.Ristoratore;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class RistoratoreDaoJDBC extends RistoratoreDao{

    private static RistoratoreDaoJDBC instance = null;

    private final String getAllQuery = "select * from ristoratore;";
    private final String insertUsernameAndName = "insert into ristoratore values(?, '', '', '', '', '', '', '', ?)";
    private final String getRistoranteFromUsername = "select * from ristoratore where username_ristoratore=?";
    private String updateDescrizioneRistoranteQuery = "update ristoratore set descrizione=? where username_ristoratore=?";
    private String updateIndirizzoRistoranteQuery = "update ristoratore set indirizzo=? where username_ristoratore=?";
    private String updateNumeroRistoranteQuery = "update ristoratore set numero=? where username_ristoratore=?";
    private String updateIntolleranzeRistoranteQuery = "update ristoratore set intolleranze=? where username_ristoratore=?";
    private String updateLinkMenuRistoranteQuery = "update ristoratore set link_menu=? where username_ristoratore=?";
    private String updateFileMenuQuery = "update ristoratore set file_menu=? where username_ristoratore=?";
    private String updateCopertinaQuery = "update ristoratore set copertina=? where username_ristoratore=?";
    private String updateTavolo2RistoranteQuery = "update ristoratore set tavoloda2=? where username_ristoratore=?";
    private String updateTavolo5RistoranteQuery = "update ristoratore set tavoloda5=? where username_ristoratore=?";
    private String updateTavolo10RistoranteQuery = "update ristoratore set tavoloda10=? where username_ristoratore=?";
    private String deleteRistoranteFromUsernameQuery = "delete from ristoratore where username_ristoratore=?";

    private RistoratoreDaoJDBC(){}

    public static RistoratoreDaoJDBC getInstance() {
        if(instance == null)
            instance = new RistoratoreDaoJDBC();

        return instance;
    }

    @Override
    public List<Ristoratore> getAll() throws SQLException {
        List <Ristoratore> list = new ArrayList<>();
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllQuery);
        while(rs.next()) {
            Ristoratore ristoratore = Ristoratore.parseFromDB(rs);
            list.add(ristoratore);
        }

        stm.close();
        return list;
    }

    @Override
    public void save(Ristoratore obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(insertUsernameAndName);
        stm.setString(1, obj.getUsernameRistoratore());
        stm.setString(2, obj.getNome());

        stm.execute();
        stm.close();
    }

    @Override
    public Ristoratore get(String usernameRistoratore) throws SQLException {
        Ristoratore ristoratore = null;
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getRistoranteFromUsername);
        stm.setString(1, usernameRistoratore);

        ResultSet rs = stm.executeQuery();
        if(rs.next()) {
            ristoratore = Ristoratore.parseFromDB(rs);
        }

        rs.close();
        stm.close();

        return ristoratore;
    }

    @Override
    public void updateDescrizioneRistorante(Ristoratore ristorante, String descrizione) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateDescrizioneRistoranteQuery);
        stm.setString(1, descrizione);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }

    @Override
    public void updateIndirizzoRistorante(Ristoratore ristorante, String indirizzo) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateIndirizzoRistoranteQuery);
        stm.setString(1, indirizzo);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }

    @Override
    public void updateNumeroRistorante(Ristoratore ristorante, String numero) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateNumeroRistoranteQuery);
        stm.setString(1, numero);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }

    @Override
    public void updateIntolleranzeRistoratore(Ristoratore ristoratore, String intolleranze) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateIntolleranzeRistoranteQuery);
        stm.setString(1, intolleranze);
        stm.setString(2, ristoratore.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }

    @Override
    public void updateLinkMenuRistorante(Ristoratore ristorante, String linkMenu) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateLinkMenuRistoranteQuery);
        stm.setString(1, linkMenu);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }

    @Override
    public void updateFileMenu(byte[] fileMenu, Ristoratore ristorante) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateFileMenuQuery);
        stm.setBytes(1, fileMenu);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();

    }

    @Override
    public void updateCopertinaRistorante(byte[] copertina, Ristoratore ristorante) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateCopertinaQuery);
        stm.setBytes(1, copertina);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();

    }

    @Override
    public void updateTavolo2(Ristoratore ristorante, int tavolo2) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateTavolo2RistoranteQuery);
        stm.setInt(1, tavolo2);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }
    @Override
    public void updateTavolo5(Ristoratore ristorante, int tavolo5) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateTavolo5RistoranteQuery);
        stm.setInt(1, tavolo5);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }
    @Override
    public void updateTavolo10(Ristoratore ristorante, int tavolo10) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateTavolo10RistoranteQuery);
        stm.setInt(1, tavolo10);
        stm.setString(2, ristorante.getUsernameRistoratore());

        stm.execute();
        stm.close();
    }

    @Override
    public List<Ristoratore> filterRestaurants(String s) throws SQLException {
        List <Ristoratore> list = new ArrayList<>();
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllQuery);
        while(rs.next()) {
            Ristoratore ristoratore = Ristoratore.parseFromDB(rs);
            String NomeRistorante=ristoratore.getNome();
            if (NomeRistorante.toLowerCase().contains(s.toLowerCase())) {
                list.add(ristoratore);
            }
        }

        stm.close();
        return list;
    }

    @Override
    public void deleteRistoranteFromUsername(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deleteRistoranteFromUsernameQuery);
        stm.setString(1, username);

        stm.execute();
        stm.close();
    }

    @Override
    public List<Ristoratore> filterRestaurantsIntolleranza(List<String> intolleranzeUtente) throws SQLException {
        ArrayList <Ristoratore> list = new ArrayList<>();
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllQuery);
        while(rs.next()) {
            Ristoratore ristoratore = Ristoratore.parseFromDB(rs);
            String[] intol=ristoratore.getIntolleranze().split("-");
            ArrayList<String> intolleranze=new ArrayList<String>();
            for (int i=0;i<intol.length;i++) {
                intolleranze.add(intol[i]);
            }
            list.add(ristoratore);
            for (String i : intolleranzeUtente) {
                if(!intolleranze.contains(i)) {
                    list.remove(ristoratore);
                    break;
                }
            }
        }

        stm.close();
        return list;
    }


}
