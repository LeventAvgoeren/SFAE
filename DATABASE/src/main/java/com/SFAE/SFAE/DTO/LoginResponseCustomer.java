package com.SFAE.SFAE.DTO;

public class LoginResponseCustomer {
    private String id;
    private String role;
    private String Token;
    public LoginResponseCustomer(String id, String role, String Token) {
        this.id = id;
        this.role = role;
        this.Token = Token;
    }

    public String getId() {
        return id;
    }

    public String getRole() {
        return role;
    }

    public String getToken(){
        return Token;
    }
}
