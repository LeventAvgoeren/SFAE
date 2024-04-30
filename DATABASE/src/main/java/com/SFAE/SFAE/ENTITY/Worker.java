package com.SFAE.SFAE.ENTITY;




import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StartusOrder;
import com.SFAE.SFAE.ENUM.Status;

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
 * @author Levent
 */

@Data
@Entity
@Table(name="Worker")


public class Worker {

@Id
@Column(name = "id")
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(name = "name")
@Size(max=100)
private String name;

@Column(name = "location")
@Size(max=100)
private String location;

@Column(name = "password")
@Size(min = 3, max = 100)
private String password;

@Column(name = "email" ,unique = true)
@Email
@Size(max=100)
private String email;

@Column(name = "status")
@Enumerated(EnumType.STRING)
private Status status;

@Column(name = "statusOrder")
@Enumerated(EnumType.STRING)
private StartusOrder statusOrder;

@Column(name = "range")
private Double range;

@Column(name = "jobType")
@Enumerated(EnumType.STRING)
private JobList jobType;

@Column(name = "minPayment")
private Double minPayment;

@Column(name = "rating")
private Double rating;

@Column(name = "verification")
private Boolean verification;



public Worker( String name, String location, String password, Status status, StartusOrder statusOrder,
Double range, JobList jobType, Double minPayment, Double rating, Boolean verification,String email) {
  
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
  this.email=email;
}
// Getters
public String getName() {
  return name;
}

public String getLocation() {
  return location;
}

public String getPassword() {
  return password;
}

public String getEmail() {
  return email;
}

public Status getStatus() {
  return status;
}

public StartusOrder getStatusOrder() {
  return statusOrder;
}

public Double getRange() {
  return range;
}

public JobList getJobType() {
  return jobType;
}

public Double getMinPayment() {
  return minPayment;
}

public Double getRating() {
  return rating;
}

public Boolean getVerification() {
  return verification;
}

// Setters
public void setName(String name) {
  this.name = name;
}

public void setLocation(String location) {
  this.location = location;
}

public void setPassword(String password) {
  this.password = password;
}

public void setEmail(String email) {
  this.email = email;
}

public void setStatus(Status status) {
  this.status = status;
}

public void setStatusOrder(StartusOrder statusOrder) {
  this.statusOrder = statusOrder;
}

public void setRange(Double range) {
  this.range = range;
}

public void setJobType(JobList jobType) {
  this.jobType = jobType;
}

public void setMinPayment(Double minPayment) {
  this.minPayment = minPayment;
}

public void setRating(Double rating) {
  this.rating = rating;
}

public void setVerification(Boolean verification) {
  this.verification = verification;
}

}
