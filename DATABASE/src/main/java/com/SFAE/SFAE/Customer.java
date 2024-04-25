package com.SFAE.SFAE;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "customer")
public class Customer {

    @Id
    private long id;
    private String name;
    private String password;
    private String email;

    
}
