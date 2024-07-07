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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="NewsLetters")
public class NewsLetter {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="id")
  private String id;

  @Column(name="customer_Email")
  private String customerEmail;

  @Column(name="news")
  private String news;

  public NewsLetter(String customerEmail, String news) {
    this.customerEmail = customerEmail;
    this.news = news;
  }


  
}
