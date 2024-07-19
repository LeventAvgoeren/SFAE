package com.SFAE.SFAE.DTO;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

/**
 * @author erayzor
 */
@Data
public class CustomerDTO {
    private String id;

    @NotEmpty
    @NotBlank(message = "Name is required")
    private String name;

    @NotEmpty
    @NotBlank(message = "Email is required")
    private String email;

    @NotEmpty
    @NotBlank(message = "Password is required")
    private String password;

    @NotEmpty
    @NotBlank(message = "Role is required")
    private String role;

    @NotEmpty
    @NotBlank(message = "profileBase64 is required")
    private String profileBase64;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "CustomerDTO{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public boolean hasNull(){
        return name == null || email == null || password == null || role == null;
    }

    public String getProfileBase64() {
        return profileBase64;
    }

    public void setProfileBase64(String profileBase64) {
        this.profileBase64 = profileBase64;
    }
}
