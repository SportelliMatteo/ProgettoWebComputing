package com.restbook.model.domain;

import static org.apache.commons.lang3.Validate.*;
public class Email {

    private final String value;

    private final String regex = "[a-zA-Z0-9\\.]+@[a-z]+\\.[a-z]+";
    private final int min_len = 6;
    private final int max_len = 60;

    public Email(String value) {
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
