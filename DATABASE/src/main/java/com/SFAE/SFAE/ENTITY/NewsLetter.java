package com.SFAE.SFAE.ENTITY;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a newsletter subscription entity in the system.
 * This entity stores details about a newsletter subscription, including the customer's email.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="NewsLetters")
public class NewsLetter {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="id")
  private Long id;

  @Column(name="customer_Email")
  private String customerEmail;


  
}
