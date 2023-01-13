package com.restbook.dao;

import com.restbook.model.Cliente;

import java.sql.SQLException;
import java.util.List;

public abstract class ClienteDao implements Dao<Cliente> {

    public abstract List<Cliente> getAll() throws SQLException;
    public abstract void save(Cliente obj) throws SQLException;
    public abstract Cliente get(String usernameCliente) throws SQLException;
    public abstract void updateNumeroCliente(Cliente cliente, String numero) throws SQLException;
    public abstract void updateIndirizzoCliente(Cliente cliente, String indirizzo) throws SQLException;
    public abstract void updateIntolleranzeCliente(Cliente cliente, String intolleranze) throws SQLException;
    public abstract void rimuoviCliente(String username) throws SQLException;


}
