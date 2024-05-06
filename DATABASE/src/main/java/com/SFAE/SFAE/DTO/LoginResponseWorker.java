package com.SFAE.SFAE.DTO;

public class LoginResponseWorker {
    private String id;
    private String Token;

    
    public LoginResponseWorker(String id,  String Token) {
        this.id = id;
        this.Token = Token;
    }

    public String getId() {
        return id;
    }


    public String getToken(){
        return Token;
    }
    
}
