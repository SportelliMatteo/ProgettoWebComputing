package com.restbook.controller;

import com.restbook.service.Ristorante;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
public class RestBookDataController {

    @GetMapping("/ristorantName")
    private String getNomeRistorante(){
        return Ristorante.getInstance().getNomeRistorante();
    }

}
