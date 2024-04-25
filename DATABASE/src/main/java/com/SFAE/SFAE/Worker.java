package com.SFAE.SFAE;

import org.springframework.stereotype.Component;

@Component
public class Worker {

Long id;
String name;
String location;
String password;
Status status;
StartusOrder startusOrder;
Float range;
JobList jobType;
Float minPayment;
Double rating;
Boolean veification;

public Worker(Long id, String name, String location, String password, Status status, StartusOrder startusOrder,
Float range, JobList jobType, Float minPayment, Double rating, Boolean veification) {
  this.id = id;
  this.name = name;
  this.location = location;
  this.password = password;
  this.status = status;
  this.startusOrder = startusOrder;
  this.range = range;
  this.jobType = jobType;
  this.minPayment = minPayment;
  this.rating = rating;
  this.veification = veification;
}


public Long getId() {
  return id;
}


public String getName() {
  return name;
}


public void setName(String name) {
  this.name = name;
}


public String getLocation() {
  return location;
}


public void setLocation(String location) {
  this.location = location;
}


public String getPassword() {
  return password;
}


public void updatePassword(String password) {
  this.password = password;
}


public Status getStatus() {
  return status;
}


public void setStatus(Status status) {
  this.status = status;
}


public StartusOrder getStartusOrder() {
  return startusOrder;
}


public void setStartusOrder(StartusOrder startusOrder) {
  this.startusOrder = startusOrder;
}


public Float getRange() {
  return range;
}


public void setRange(Float range) {
  this.range = range;
}


public JobList getJobType() {
  return jobType;
}


public void setJobType(JobList jobType) {
  this.jobType = jobType;
}


public Float getMinPayment() {
  return minPayment;
}


public void setMinPayment(Float minPayment) {
  this.minPayment = minPayment;
}


public Double getRating() {
  return rating;
}


public void setRating(Double rating) {
  this.rating = rating;
}


public Boolean getVeification() {
  return veification;
}


public void setVeification(Boolean veification) {
  this.veification = veification;
}




    
}
