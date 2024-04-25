package com.SFAE.SFAE;

import org.springframework.stereotype.Component;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="Worker")

public class Worker {

@Id
private Long id;
private String name;
private String location;
private String password;
private Status status;
private StartusOrder startusOrder;
private Float range;
private JobList jobType;
private Float minPayment;
private Double rating;
private Boolean veification;






    
}
