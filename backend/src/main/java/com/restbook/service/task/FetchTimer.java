package com.restbook.service.task;

import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;


import com.restbook.dao.DBConnection;

@Component
public class FetchTimer implements DisposableBean, Runnable {


    private final int FREQUENCY_TOKEN_EXPIRY = 1000 * 60 * 60 * 24; //24 ore

    private long lastUpdateTokenCheck = 0;

    private Thread myThread;
    boolean isRunning = true;

    public FetchTimer() {
        myThread = new Thread(this);
        this.myThread.start();
    }

    @Override
    public void run() {
        while(isRunning) {
            if(System.currentTimeMillis() - lastUpdateTokenCheck > FREQUENCY_TOKEN_EXPIRY) {
                checkExpiredTokens();
                lastUpdateTokenCheck = System.currentTimeMillis();
            }
        }
    }

    private void checkExpiredTokens() {
        System.out.println(java.time.LocalDateTime.now() + " CHECKING Expired Tokens");
        String query = "select check_tokens_expiration();";
        try {
            Statement stm = DBConnection.getInstance().getConnection().createStatement();
            stm.execute(query);

            stm.close();
        } catch (SQLException e) {
            e.printStackTrace();
            return;
        }

        System.out.println(java.time.LocalDateTime.now() + " REMOVED Expired Tokens");

    }

    @Override
    public void destroy() throws Exception {
        isRunning = false;
    }
}