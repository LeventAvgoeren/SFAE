package com.SFAE.SFAE.ENTITY;


import com.SFAE.SFAE.ENUM.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * @author erayzor
 */

@Data
@Entity
@Table(name="CUSTOMER")
public class Customer {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Size(max=100)
    @Column(name = "NAME")
    private String name;

    @Size(min = 6, max = 100)
    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "EMAIL",unique = true)
    @Email
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE")
    private Role role;

    public Customer( String name, String password, String email) { 
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = Role.CUSTOMER;
    }

    
    public Customer( Long id, String name, String password, String email) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    
    public Customer( long id, String name, String password, String email, String role) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = Role.valueOf(role);
    }

    public long getId() {
        return id;
    }

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

    public Role getRole(){
        return role;
    }

    @Override
    public String toString() {
    return "Customer{" +
           "id=" + id +
           ", name='" + name + '\'' +
           ", password='" + password + '\'' +
           ", email='" + email + '\'' +
           ", role=" + role +
           '}';
    }
}
