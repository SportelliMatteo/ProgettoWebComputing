package com.restbook.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restbook.model.domain.*;

import java.sql.ResultSet;
import java.sql.SQLException;

public class User {

    private Username username;
    private Nome nome;
    private Email email;
    @JsonIgnore
    private Password password;
    private Tipologia tipologiaUtente;
    private byte[] avatar;
    private boolean isGoogleUser;

    public void setUsername(Username username) {
        this.username = username;
    }

    public String getUsername() {
        return username.toString();
    }

    public void setNome(Nome nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome.toString();
    }

    public String getEmail() {
        return email.toString();
    }

    public void setEmail(Email email) {
        this.email = email;
    }

    public boolean isGoogleUser() {
        return isGoogleUser;
    }
    public void setGoogleUser(boolean isGoogleUser) {
        this.isGoogleUser = isGoogleUser;
    }
    public byte[] getAvatar() {
        return avatar;
    }
    public void setAvatar(byte[] avatar) {
        this.avatar = avatar;
    }

    public void setPassword(Password password) {
        this.password = password;
    }

    public String getPassword() {
        return password.toString();
    }

    public void setTipologiaUtente(Tipologia tipologiaUtente) {
        this.tipologiaUtente = tipologiaUtente;
    }

    public String getTipologiaUtente() {
        return tipologiaUtente.toString();
    }

    @JsonIgnore
    public Username getUsernameField() {
        return username;
    }

    public static User parseFromDB(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException {
        User user = new User();
        user.setEmail(new Email(rs.getString("email")));
        user.setAvatar(rs.getBytes("avatar"));
        user.setNome(new Nome(rs.getString("nome")) );
        user.setUsername(new Username((rs.getString("username"))));
        user.setTipologiaUtente(new Tipologia(rs.getString("tipologia")) );

        String googleId = rs.getString("google_id");
        if(googleId != null && googleId.length() > 0)
            user.setGoogleUser(true);

        return user;
    }

}
