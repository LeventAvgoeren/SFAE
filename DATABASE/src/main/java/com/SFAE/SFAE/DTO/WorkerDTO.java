package com.SFAE.SFAE.DTO;


public class WorkerDTO {
  private String name;
  private String location;
  private String password;
  private String email;
  private String status;
  private String statusOrder;
  private Float range;
  private String jobType;
  private Float minPayment;
  private Double rating;
  private Boolean verification;


  
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
  public void setPassword(String password) {
    this.password = password;
  }
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
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
  public Boolean getVerification() {
    return verification;
  }
  public void setVerification(Boolean verification) {
    this.verification = verification;
  }
  public String getStatus() {
    return status;
  }
  public void setStatus(String status) {
    this.status = status;
  }
  public String getStatusOrder() {
    return statusOrder;
  }
  public void setStatusOrder(String statusOrder) {
    this.statusOrder = statusOrder;
  }
  public Float getRange() {
    return range;
  }
  public void setRange(Float range) {
    this.range = range;
  }
  public String getJobType() {
    return jobType;
  }
  public void setJobType(String jobType) {
    this.jobType = jobType;
  }
  @Override
  public String toString() {
    return "WorkerDTO [name=" + name + ", location=" + location + ", password=" + password + ", email=" + email
        + ", status=" + status + ", statusOrder=" + statusOrder + ", range=" + range + ", jobType=" + jobType
        + ", minPayment=" + minPayment + ", rating=" + rating + ", verification=" + verification + "]";
  }

}
