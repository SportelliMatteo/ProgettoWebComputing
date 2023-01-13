package com.restbook.model.domain;

import static org.apache.commons.lang3.Validate.*;

public class Nome {
    private final String value;

    public Nome(String value) {
        notNull(value);
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }

}
