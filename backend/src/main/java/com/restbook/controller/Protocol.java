package com.restbook.controller;

public class Protocol {

    public static final int OK = 200;
    public static final int SERVER_ERROR = 500;
    public static final int INVALID_TOKEN = 5000;
    public static final int INVALID_CREDENTIALS = 403;
    public static final int INCOMPLETE_GOOGLE_LOGIN = 450;
    public static final int WRONG_CREDENTIALS = 401;
    public static final int CLIENTE_NOT_EXISTS = 402;
    public static final int USER_ALREADY_EXISTS = 409;
    public static final int USERAME_ALREADY_EXISTS = 410;
    public static final int PRENOTAZIONE_ALREADY_EXISTS = 411;
    public static final int PRENOTAZIONE_ALREADY_ACCEPTED = 412;
    public static final int PRENOTAZIONE_NON_MODIFICABILE = 413;
    public static final int INVALID_DATA = 5020;
    public static final int INVALID_ORARIO = 5030;
    public static final int CLIENTE_ALREADY_EXISTS = 5050;

    //Tipologia
    public static final int CLIENTE = 201;
    public static final int RISTORATORE = 202;
    public static final int AMMINISTRATORE = 203;

}
