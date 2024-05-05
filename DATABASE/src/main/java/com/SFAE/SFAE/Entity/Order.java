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

import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "Order")
public class Order{
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

  //TODO: Customer und Worker PK/FK
}