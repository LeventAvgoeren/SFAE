package com.SFAE.SFAE.ENTITY;

import java.util.ArrayList;

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
import jakarta.persistence.Lob;
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
  private JobList[] jobType;

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

  @Column(name = "RatingAV")
  private ArrayList<Double> ratingAV = new ArrayList<>();

  @Lob
  @Column(name = "profile_picture_blob", nullable = true)
  private Long profilePictureOid;

  @Column(name = "slogan")
  private String slogan;


  public Worker(String id, String name, String location, String password, String email, Status status, StatusOrder statusOrder, Double range, JobList[] jobType, Double minPayment, Double rating, Boolean verification, Double latitude, Double longitude, String slogan){
    this.id = id;
    this.name = name;
    this.location = location;
    this.password = password;
    this.email = email;
    this.status = status;
    this.statusOrder = statusOrder;
    this.range = range;
    this.jobType = jobType;
    this.minPayment = minPayment;
    this.rating = rating;
    this.verification = verification;
    this.latitude = latitude;
    this.longitude = longitude;
    this.slogan = slogan;
}

  public Worker() {
  }

  public Worker(String name, String location, String password, Status status, StatusOrder statusOrder,
      Double range, JobList[] jobType, Double minPayment, Double rating, Boolean verification, String email,
      double latitude, double longitude, ArrayList<Double> ratingAv,Long profilePictureOid, String slogan) {

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
    this.latitude = latitude;
    this.longitude = longitude;
    this.ratingAV = new ArrayList<>();
    this.ratingAV.add(1.0);
    this.profilePictureOid = profilePictureOid;
    this.slogan = slogan;
  }

  public Worker(String id, String name, String location, String password, Status status, StatusOrder statusOrder,
      Double range, JobList[] jobType, Double minPayment, Double rating, Boolean verification, String email,
      double latitude, double longitude,Long profilePictureOid, String slogan) {
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
    this.latitude = latitude;
    this.longitude = longitude;
    this.profilePictureOid = profilePictureOid;
    this.slogan = slogan;
  }

  public Worker(String name, String location, String password, Status status, StatusOrder statusOrder,
      Double range, JobList[] jobType, Double minPayment, Double rating, Boolean verification, String email,
      double latitude, double longitude, String slogan) {
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
    this.latitude = latitude;
    this.longitude = longitude;
    this.slogan = slogan;
  }

  public Worker(String name, String location, String password, @Email String email, Double latitude, Double longitude, String slogan) {
    this.name = name;
    this.location = location;
    this.password = password;
    this.email = email;
    this.latitude = latitude;
    this.longitude = longitude;
    this.slogan = slogan;
  }

  public Worker(Double range, JobList[] jobType,Double minPayment) {
    this.range = range;
    this.jobType = jobType;
    this.minPayment = minPayment;
  }

}
