package com.SFAE.SFAE.ENTITY;

import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StartusOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="Order")

public class Order {

  @Id
  @Column(name = "id")
  private String id;
  @Column(name = "jobtype")
  private JobList jobtype;
  @Column(name = "adress")
  private String adress;
  @Column(name = "payment")
  private Float payment;
  @Column(name = "status")
  private StartusOrder status;
  @Column(name = "range")
  private Float range;
  @Column(name = "workerID")
  private Worker worker;
  @Column(name = "customerID")
  private Long customer;

  public Order(String id, JobList jobtype, String adress, Float payment, StartusOrder status, Float range,
      Worker worker, Customer customer) {
    this.id = id;
    this.jobtype = jobtype;
    this.adress = adress;
    this.payment = payment;
    this.status = status;
    this.range = range;
    this.worker = worker;
    this.customer = getCustomer().getId();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public JobList getJobtype() {
    return jobtype;
  }

  public void setJobtype(JobList jobtype) {
    this.jobtype = jobtype;
  }

  public String getAdress() {
    return adress;
  }

  public void setAdress(String adress) {
    this.adress = adress;
  }

  public Float getPayment() {
    return payment;
  }

  public void setPayment(Float payment) {
    this.payment = payment;
  }

  public StartusOrder getStatus() {
    return status;
  }

  public void setStatus(StartusOrder status) {
    this.status = status;
  }

  public Float getRange() {
    return range;
  }

  public void setRange(Float range) {
    this.range = range;
  }

  public Worker getWorker() {
    return worker;
  }

  public void setWorker(Worker worker) {
    this.worker = worker;
  }

 
  @Override
  public String toString() {
    return "Order [id=" + id + ", jobtype=" + jobtype + ", adress=" + adress + ", payment=" + payment + ", status="
        + status + ", range=" + range + ", worker=" + worker + ", customer=" + customer + "]";
  }
}
