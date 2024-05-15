package com.SFAE.SFAE.ENTITY;

import org.hibernate.annotations.GenericGenerator;

import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.ENUM.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a Worker entity in the system.
 * This class defines attributes and behavior of a Worker.
 * 
 * @author Levent
 */
@Data
@Entity
@Table(name = "WORKER")
public class Worker {

  @Id
  @GeneratedValue(generator = "custom-generator")
  @GenericGenerator(name = "custom-generator", strategy = "com.SFAE.SFAE.ENTITY.CustomWorkerIdGenerator")
  @Column(name = "ID", updatable = false, nullable = false)
  private String id;

  @Size(max = 100)
  @Column(name = "name")
  private String name;

  @Size(max = 100)
  @Column(name = "location")
  private String location;

  @Size(min = 3, max = 100)
  @Column(name = "password", length = 50)
  private String password;

  @Column(name = "email", unique = true)
  @Email
  private String email;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  private Status status;

  @Column(name = "statusOrder")
  @Enumerated(EnumType.STRING)
  private StatusOrder statusOrder;

  @Column(name = "range")
  @DecimalMin(value = "0.0", inclusive = false)
  @DecimalMax(value = "10.0")
  private Double range;

  @Column(name = "jobType")
  @Enumerated(EnumType.STRING)
  private JobList jobType;

  @Column(name = "minPayment")
  @DecimalMin(value = "0.0", inclusive = false)
  private Double minPayment;

  @Column(name = "rating")
  @DecimalMin(value = "0.0", inclusive = false)
  @DecimalMax(value = "5.0")
  private Double rating;

  @Column(name = "verification")
  private Boolean verification;

  
  @Column(name = "latitude")
  private Double latitude;
  
  @Column(name = "longitude")
  private Double longitude;

  public Worker(){}

  public Worker(String name, String location, String password, Status status, StatusOrder statusOrder,
      Double range, JobList jobType, Double minPayment, Double rating, Boolean verification, String email,double latitude,double longitude) {

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
    this.email = email;
    this.latitude=latitude;
    this.longitude=longitude;
  }

  public Worker(String id, String name, String location, String password, Status status, StatusOrder statusOrder,
      Double range, JobList jobType, Double minPayment, Double rating, Boolean verification, String email,double latitude,double longitude) {
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
    this.email = email;
    this.latitude=latitude;
    this.longitude=longitude;
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

  public StatusOrder getStatusOrder() {
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

  public void setStatusOrder(StatusOrder statusOrder) {
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
