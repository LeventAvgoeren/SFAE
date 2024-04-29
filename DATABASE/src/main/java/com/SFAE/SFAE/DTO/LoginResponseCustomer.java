package com.SFAE.SFAE.DTO;

public class LoginResponseCustomer {
    private Long id;
    private String role;

    public LoginResponseCustomer(Long id, String role) {
        this.id = id;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getRole() {
        return role;
    }
}
