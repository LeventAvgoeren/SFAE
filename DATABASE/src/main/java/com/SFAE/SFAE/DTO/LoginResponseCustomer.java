package com.SFAE.SFAE.DTO;

public class LoginResponseCustomer {
    private String id;
    private String role;

    public LoginResponseCustomer(String id, String role) {
        this.id = id;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public String getRole() {
        return role;
    }
}
