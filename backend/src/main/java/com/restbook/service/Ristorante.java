package com.restbook.service;

public class Ristorante {

    private String nomeRistorante = "ciao";

    private Ristorante(){
        nomeRistorante = "ciao";
    }

    private static Ristorante instance = null;

    public static Ristorante getInstance() {
        if(instance == null)
            instance = new Ristorante();
        return instance;
    }
    public String getNomeRistorante() {
        return nomeRistorante;
    }

}
