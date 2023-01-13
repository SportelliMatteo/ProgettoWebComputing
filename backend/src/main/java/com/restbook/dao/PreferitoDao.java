package com.restbook.dao;

import com.restbook.model.Preferito;

import java.sql.SQLException;
import java.util.List;

public abstract class PreferitoDao implements Dao<Preferito> {

    public abstract List<Preferito> getAll() throws SQLException;
    public abstract void save(Preferito obj) throws SQLException;
    public abstract void delete(Preferito obj) throws SQLException;
    public abstract void deletePreferitiFromUsername(String username) throws SQLException;
    public abstract void deletePreferitiRistoranteFromUsername(String username) throws SQLException;
    public abstract Preferito getPreferitoByNomeAndUsername(String usernameCliente, String nomeRistorante);

}
