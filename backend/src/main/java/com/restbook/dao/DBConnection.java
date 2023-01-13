package com.restbook.dao;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

    private static DBConnection instance;
    private String username = "postgres";
    private String pass = "admin";
    private String url = "jdbc:postgresql://localhost:5432/postgres";

    private Connection dbConnection = null;

    private DBConnection() {
        try {
            dbConnection = DriverManager.getConnection(url, username, pass);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static DBConnection getInstance() {
        if(instance == null)
            instance = new DBConnection();

        return instance;
    }

    public Connection getConnection() {
        return dbConnection;
    }
}

