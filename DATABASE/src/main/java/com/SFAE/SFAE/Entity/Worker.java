package com.SFAE.SFAE.Entity;


import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

import com.SFAE.SFAE.JobList;
import com.SFAE.SFAE.StartusOrder;
import com.SFAE.SFAE.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.Data;

@EnableAutoConfiguration
@Data
@Entity
@Table(name="Worker")

public class Worker {

@Id
@Column(name = "id")
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
@Column(name = "name")
private String name;
@Column(name = "location")
private String location;
@Column(name = "password")
private String password;
@Column(name = "status")
private Status status;
@Column(name = "statusOrder")
private StartusOrder statusOrder;
@Column(name = "range")
private Float range;
@Column(name = "jobType")
private JobList jobType;
@Column(name = "minPayment")
private Float minPayment;
@Column(name = "rating")
private Double rating;
@Column(name = "verification")
private Boolean verification;



public Worker(Long id, String name, String location, String password, Status status, StartusOrder statusOrder,
    Float range, JobList jobType, Float minPayment, Double rating, Boolean verification) {
  this.id = id;
  this.name = name;
  this.location = location;
  this.password = password;
  this.status = status;
  this.statusOrder = statusOrder;
  this.range = range;
  this.jobType = jobType;
  this.minPayment = minPayment;
  this.rating = rating;
  this.verification = verification;
}

}
