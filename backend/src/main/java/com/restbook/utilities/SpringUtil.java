package com.restbook.utilities;

import org.springframework.security.crypto.bcrypt.BCrypt;

import java.security.SecureRandom;
import java.util.Base64;

public class SpringUtil {

    private static final SecureRandom secureRandom = new SecureRandom(); //threadsafe
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe

    public static String generateNewToken() {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    public static String hashPassword(String pass) {
        return BCrypt.hashpw(pass, BCrypt.gensalt(12));
    }

    public static boolean checkPassword(String hashPw, String plainPw) {
        return BCrypt.checkpw(plainPw, hashPw);
    }

}
