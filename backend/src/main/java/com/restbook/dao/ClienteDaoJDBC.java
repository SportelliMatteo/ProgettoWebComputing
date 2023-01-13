package com.restbook.dao;

import com.restbook.model.Cliente;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ClienteDaoJDBC extends ClienteDao {

    private static ClienteDaoJDBC instance = null;

    private final String getAllQuery = "select * from cliente;";
    private final String insertUsername = "insert into cliente values(?, null, '', '')";
    private final String getUserCliente = "select * from cliente where username_cliente=?;";
    private String updateNumeroClienteQuery = "update cliente set numero=? where username_cliente=?";
    private String updateIndirizzoClienteQuery = "update cliente set indirizzo=? where username_cliente=?";
    private String updateIntolleranzeClienteQuery = "update cliente set intolleranze_alimentari=? where username_cliente=?";
    private final String rimuoviClienteQuery = "delete from cliente where username_cliente=?";

    private ClienteDaoJDBC() {}

    public static ClienteDaoJDBC getInstance() {
        if(instance == null)
            instance = new ClienteDaoJDBC();

        return instance;
    }

    @Override
    public List<Cliente> getAll() throws SQLException {
        List <Cliente> list = new ArrayList<>();
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllQuery);
        while(rs.next()) {
            Cliente cliente = Cliente.parseFromDB(rs);
            list.add(cliente);
        }

        stm.close();
        return list;
    }

    @Override
    public void save(Cliente obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(insertUsername);
        stm.setString(1, obj.getUsernameCliente());

        stm.execute();
        stm.close();
    }

    @Override
    public Cliente get(String usernameCliente) throws SQLException {
        Cliente cliente = null;
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getUserCliente);
        stm.setString(1, usernameCliente);

        ResultSet rs = stm.executeQuery();
        if(rs.next()) {
            cliente = Cliente.parseFromDB(rs);
        }

        rs.close();
        stm.close();

        return cliente;
    }

    @Override
    public void updateNumeroCliente(Cliente cliente, String numero) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateNumeroClienteQuery);
        stm.setString(1, numero);
        stm.setString(2, cliente.getUsernameCliente());

        stm.execute();
        stm.close();
    }

    @Override
    public void updateIndirizzoCliente(Cliente cliente, String indirizzo) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateIndirizzoClienteQuery);
        stm.setString(1, indirizzo);
        stm.setString(2, cliente.getUsernameCliente());

        stm.execute();
        stm.close();
    }

    @Override
    public void updateIntolleranzeCliente(Cliente cliente, String intolleranze) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateIntolleranzeClienteQuery);
        stm.setString(1, intolleranze);
        stm.setString(2, cliente.getUsernameCliente());

        stm.execute();
        stm.close();
    }

    @Override
    public void rimuoviCliente(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(rimuoviClienteQuery);
        stm.setString(1, username);

        stm.execute();
        stm.close();

    }

}
