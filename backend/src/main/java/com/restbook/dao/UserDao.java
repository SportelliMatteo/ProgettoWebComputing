package com.restbook.dao;

import com.restbook.model.User;
import com.restbook.model.domain.*;

import java.sql.SQLException;
import java.util.List;

public abstract class UserDao implements Dao<User> {

    public abstract List<User> getAll() throws SQLException;
    public abstract List<String> getAllUsername() throws SQLException;
    public abstract void save(User obj) throws SQLException;
    public abstract void saveGoogleUser(User obj, String googleId) throws SQLException;
    public abstract boolean isGoogleAccount(Email mail) throws SQLException;

    public abstract User findByToken(String token) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract User findByEmail(Email email) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract User findByEmailAndTipologia(Email email) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract User findTipologiaByUsername(Username username) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract User findByTokenWithAvatar(String token) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract String getToken(String username) throws SQLException;

    public abstract User checkCredentials(Tipologia tipologia, Username username, Password password) throws SQLException;
    public abstract User checkCredentialsForPassword(Username username, Password password) throws SQLException;

    public abstract User checkGoogleCredentials(String google_id, Email email) throws SQLException;
    public abstract void saveToken(String user, String token) throws SQLException;

    public abstract void updateUserEmail(Email email, String token) throws SQLException;
    public abstract void updateUserAvatar(byte[] avatar, String token) throws SQLException;
    public abstract void resetUserAvatar(String token) throws SQLException;
    public abstract void updateUserPassword(Password newPass, String token) throws SQLException;
    public abstract void updateUserPasswordByEmail(Password newPass, Email email) throws SQLException;
    public abstract void deleteToken(String token) throws SQLException;
    public abstract boolean isUserAdmin(Username username) throws SQLException;
    public abstract void updateUserNome(Nome nome, String token) throws SQLException;
    public abstract User findUserByUsername(String username) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract void deleteUserFromUsername(String username) throws SQLException;

}
