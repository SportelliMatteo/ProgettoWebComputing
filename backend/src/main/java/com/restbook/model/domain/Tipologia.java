package com.restbook.model.domain;

import static org.apache.commons.lang3.Validate.notNull;

public class Tipologia {

    private final String value;

    public Tipologia(String value) {
        notNull(value);
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }


}
