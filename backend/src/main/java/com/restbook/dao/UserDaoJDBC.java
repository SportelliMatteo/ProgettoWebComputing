package com.restbook.dao;

import com.restbook.model.User;
import com.restbook.model.domain.*;
import com.restbook.utilities.SpringUtil;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;


public class UserDaoJDBC extends UserDao{

    private static UserDaoJDBC instance;

    private String findByTokenQuery = "select * from utente where token=? and token !=''";
    private String findByEmailQuery = "select * from utente where email=? and email != ''";
    private String findByEmailAndTipologiaQuery = "select * from utente where email=? and email != ''";
    private String findTipologiaByUsernameQuery = "select tipologia from utente where username=? and username != ''";
    private String findByTokenNoAvatarQuery = "select username, email from utente where token=? and token !=''";
    private String checkCredentialsQuery = "select * from utente where username=? and google_id is null";
    private String checkGoogleCredentialsQuery = "select username, nome, email, tipologia from utente where google_id=? and email=?";
    private String saveTokenQuery = "update utente set token=? where username=?";
    private String saveUserQuery = "insert into utente values(?, ?, ?, ?, ?, null, null, '')";
    private String saveGoogleUser = "insert into utente values(?, ?, ?, null, ?, ?, null, '')";
    private String getTokenQuery = "select token from utente where username=?";
    private String updateUserEmailQuery = "update utente set email=? where token=? and google_id is null";
    private String updateUserNomeQuery = "update utente set nome=? where token=?";
    private String updateUserPasswordQuery = "update utente set password=? where token=?";
    private String updateUserPasswordByEmailQuery = "update utente set password=? where email=?";
    private String updateAvatarQuery = "update utente set avatar=? where token=?";
    private String resetAvatarQuery = "update utente set avatar=null where token=?";
    private String getAllUsers = "select * from utente";
    private String deleteTokenQuery = "delete from tokens where token=?";
    private String checkUserAdmin = "select * from utente where username=?";
    private String checkIsGoogleAccount = "select google_id from utente where email=?;";
    private String findUserByUsernameQuery = "select * from utente where username=?;";
    private String removeUserFromUsernameQuery = "delete from utente where username=?;";

    private UserDaoJDBC() {
    }

    public static UserDaoJDBC getInstance() {
        if (instance == null)
            instance = new UserDaoJDBC();

        return instance;
    }

    @Override
    public List<User> getAll() throws SQLException {
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllUsers);

        ArrayList<User> users = new ArrayList<>();

        while (rs.next()) {
            User utente = User.parseFromDB(rs);
            users.add(utente);
        }

        stm.close();
        rs.close();

        return users;
    }

    @Override
    public List<String> getAllUsername() throws SQLException {
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllUsers);

        ArrayList<String> usernames = new ArrayList<>();

        while (rs.next()) {
            User utente = User.parseFromDB(rs);
            String username = utente.getUsername();
            usernames.add(username);
        }

        stm.close();
        rs.close();

        return usernames;
    }

    @Override
    public void save(User obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveUserQuery);
        stm.setString(1, obj.getUsername());
        stm.setString(2, StringUtils.capitalize(obj.getNome()));
        stm.setString(3, obj.getEmail());
        stm.setString(4, SpringUtil.hashPassword(obj.getPassword()));
        stm.setString(5, StringUtils.capitalize(obj.getTipologiaUtente()));

        stm.execute();

        stm.close();
    }

    @Override
    public void saveGoogleUser(User obj, String googleId) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveGoogleUser);
        stm.setString(1, obj.getUsername());
        stm.setString(2, StringUtils.capitalize(obj.getNome()));
        stm.setString(3, obj.getEmail());
        stm.setString(4, StringUtils.capitalize(obj.getTipologiaUtente()));
        stm.setString(5, googleId);

        stm.execute();

        stm.close();
    }

    @Override
    public User findByToken(String token) throws SQLException, IllegalArgumentException, NullPointerException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByTokenNoAvatarQuery);

        stm.setString(1, token);

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = new User();
            utente.setUsername(new Username(rs.getString("username")));
            utente.setEmail(new Email(rs.getString("email")));
        }

        rs.close();
        stm.close();

        return utente;
    }

    @Override
    public User findUserByUsername(String username) throws SQLException, IllegalArgumentException, NullPointerException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findUserByUsernameQuery);

        stm.setString(1, username);

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = new User();
            utente.setUsername(new Username(rs.getString("username")));
            utente.setNome(new Nome(rs.getString("nome")));
            utente.setEmail(new Email(rs.getString("email")));
            utente.setTipologiaUtente(new Tipologia(rs.getString("tipologia")));
        }

        rs.close();
        stm.close();

        return utente;
    }

    @Override
    public User findByEmail(Email email) throws SQLException, IllegalArgumentException, NullPointerException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByEmailQuery);
        stm.setString(1, email.toString());

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = new User();
            utente.setEmail(new Email(rs.getString("email")));
        }

        rs.close();
        stm.close();

        return utente;
    }

    @Override
    public User findByEmailAndTipologia(Email email) throws SQLException, IllegalArgumentException, NullPointerException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByEmailAndTipologiaQuery);
        stm.setString(1, email.toString());

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = new User();
            utente.setEmail(new Email(rs.getString("email")));
            utente.setTipologiaUtente(new Tipologia(rs.getString("tipologia")));
        }

        rs.close();
        stm.close();

        return utente;
    }

    @Override
    public User findTipologiaByUsername(Username username) throws SQLException, IllegalArgumentException, NullPointerException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findTipologiaByUsernameQuery);
        stm.setString(1, username.toString());

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = new User();
            utente.setTipologiaUtente(new Tipologia(rs.getString("tipologia")));
        }

        rs.close();
        stm.close();

        return utente;
    }

    @Override
    public User checkCredentials(Tipologia tipologia, Username username, Password password) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkCredentialsQuery);
        stm.setString(1, username.toString());


        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            String dbPassword = rs.getString("password");
            String dbTipologia = rs.getString("tipologia");

            //se la password è null, significa che è un account google
            if(password == null)
                return utente;

            if (tipologia.toString().equals(dbTipologia)){
                if (SpringUtil.checkPassword(dbPassword, password.toString())) {
                    utente = User.parseFromDB(rs);
                }
            }

        }

        rs.close();
        stm.close();

        return utente;

    }

    @Override
    public User checkCredentialsForPassword(Username username, Password password) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkCredentialsQuery);
        stm.setString(1, username.toString());


        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            String dbPassword = rs.getString("password");

            //se la password è null, significa che è un account google
            if(password == null)
                return utente;


            if (SpringUtil.checkPassword(dbPassword, password.toString())) {
                utente = User.parseFromDB(rs);

            }

        }

        rs.close();
        stm.close();

        return utente;

    }

    @Override
    public User checkGoogleCredentials(String google_id, Email email) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkGoogleCredentialsQuery);
        stm.setString(1, google_id);
        stm.setString(2, email.toString());

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = new User();
            utente.setUsername(new Username(rs.getString("username")));
            utente.setNome(new Nome(rs.getString("nome")));
            utente.setEmail(new Email(email.toString()));
            utente.setTipologiaUtente(new Tipologia(rs.getString("tipologia")));
            utente.setGoogleUser(true);
        }

        rs.close();
        stm.close();

        return utente;

    }


    @Override
    public void saveToken(String user, String token) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveTokenQuery);
        stm.setString(1, token);
        stm.setString(2, user);

        stm.execute();

        stm.close();
    }

    @Override
    public String getToken(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getTokenQuery);
        stm.setString(1, username);

        ResultSet rs = stm.executeQuery();
        String token = "";
        if (rs.next())
            token = rs.getString("token");

        rs.close();
        stm.close();

        return token;

    }

    @Override
    public void updateUserEmail(Email email, String token) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserEmailQuery);
        stm.setString(1, email.toString());
        stm.setString(2, token);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateUserNome(Nome nome, String token) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserNomeQuery);
        stm.setString(1, nome.toString());
        stm.setString(2, token);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateUserPassword(Password newPass, String token) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserPasswordQuery);
        stm.setString(1, SpringUtil.hashPassword(newPass.toString()));
        stm.setString(2, token);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateUserAvatar(byte[] avatar, String token) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateAvatarQuery);
        stm.setBytes(1, avatar);
        stm.setString(2, token);

        stm.execute();
        stm.close();

    }

    @Override
    public void resetUserAvatar(String token) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(resetAvatarQuery);
        stm.setString(1, token);

        stm.execute();
        stm.close();

    }

    @Override
    public User findByTokenWithAvatar(String token)
            throws SQLException, NullPointerException, IllegalArgumentException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByTokenQuery);
        stm.setString(1, token);

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = User.parseFromDB(rs);
        }

        rs.close();
        stm.close();

        return utente;
    }

    public void deleteToken(String token) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deleteTokenQuery);
        stm.setString(1, token);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateUserPasswordByEmail(Password newPass, Email email) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserPasswordByEmailQuery);
        stm.setString(1, SpringUtil.hashPassword(newPass.toString()));
        stm.setString(2, email.toString());

        stm.execute();
        stm.close();
    }

    @Override
    public boolean isUserAdmin(Username username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkUserAdmin);
        stm.setString(1, username.toString());

        ResultSet rs = stm.executeQuery();

        boolean res = false;
        if(rs.next()) {
            String tipologia = rs.getString("tipologia");
            if (tipologia.equals("Amministratore")) {
                res = true;
            }
        }

        rs.close();
        stm.close();

        return res;
    }

    @Override
    public boolean isGoogleAccount(Email mail) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkIsGoogleAccount);
        stm.setString(1, mail.toString());

        ResultSet rs = stm.executeQuery();
        boolean res = false;
        if(rs.next()) {
            String id = rs.getString("google_id");
            if(id != null && id.length() > 0)
                res = true;
        }

        rs.close();
        stm.close();

        return res;
    }

    @Override
    public void deleteUserFromUsername(String username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(removeUserFromUsernameQuery);
        stm.setString(1, username);


        stm.execute();
        stm.close();
    }

}
