package com.SFAE.SFAE.ENTITY;

import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Payment;
import com.SFAE.SFAE.ENUM.StatusOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


/**
 * Represents a contract entity in the system.
 * 
 * A contract represents an agreement between a customer and a worker for a specific job.
 * It contains details such as job type, address, payment method, description, status order, range, and associated customer and worker.
 * 
 * @author Levent
 */

@Data
@Entity
@Table(name = "contract")
public class Contract {
  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "jobType")
  @Enumerated(EnumType.STRING)
  private JobList jobType;

  @Column(name = "adress")
  private String adress;

  @Column(name = "payment")
  @Enumerated(EnumType.STRING)
  private Payment payment;

  @Column(name = "description")
  private String description;

  @Column(name = "statusOrder")
  @Enumerated(EnumType.STRING)
  private StatusOrder statusOrder;

  @Column(name = "range")
  private Double range;

  @ManyToOne
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @ManyToOne
  @JoinColumn(name = "worker_id")
  private Worker worker;

  public Contract(JobList jobType, String adress, Payment payment, String description, StatusOrder statusOrder,
      Double range, Customer customer, Worker worker) {
    this.jobType = jobType;
    this.adress = adress;
    this.payment = payment;
    this.description = description;
    this.statusOrder = statusOrder;
    this.range = range;
    this.customer = customer;
    this.worker = worker;
  }
  
//With id
  public Contract(Long id, JobList jobType, String adress, Payment payment, String description, StatusOrder statusOrder,
      Double range, Customer customer, Worker worker) {
    this.jobType = jobType;
    this.adress = adress;
    this.payment = payment;
    this.description = description;
    this.statusOrder = statusOrder;
    this.range = range;
    this.customer = customer;
    this.worker = worker;
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public JobList getJobType() {
    return jobType;
  }

  public void setJobType(JobList jobType) {
    this.jobType = jobType;
  }

  public String getAdress() {
    return adress;
  }

  public void setAdress(String adress) {
    this.adress = adress;
  }

  public Payment getPayment() {
    return payment;
  }

  public void setPayment(Payment payment) {
    this.payment = payment;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public StatusOrder getStatusOrder() {
    return statusOrder;
  }

  public void setStatusOrder(StatusOrder statusOrder) {
    this.statusOrder = statusOrder;
  }

  public Double getRange() {
    return range;
  }

  public void setRange(Double range) {
    this.range = range;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public Worker getWorker() {
    return worker;
  }

  public void setWorker(Worker worker) {
    this.worker = worker;
  }
}