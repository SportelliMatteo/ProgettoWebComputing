package com.restbook.model.domain;

import static org.apache.commons.lang3.Validate.*;

public class Username {

    private final String value;
    private final String regex = "[a-zA-Z0-9_]+";
    private final int min_len = 2;
    private final int max_len = 25;

    public Username(String value) {
        notNull(value);
        inclusiveBetween(min_len, max_len, value.length());
        matchesPattern(value, regex);
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }

}
