package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.sql.Array;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.ENUM.Status;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerRepository;
import com.SFAE.SFAE.Service.PasswordHasher;

import io.jsonwebtoken.io.IOException;

/**
 * Implementation of WorkerInterface for managing Worker entities.
 * 
 * @author Levent
 */
@Component
public class WorkerImpl implements WorkerInterface {
  @Autowired
  private PasswordHasher encoder;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Autowired
  private DataFactoryImp dataFactory;

  @Autowired
  private WorkerRepository workerRepository;

  /**
   * Counts the number of Workers in the database.
   * 
   * @return the count of Workers.
   */
  @Override
  public long countWorker() {
    List<Object> result = jdbcTemplate.query(
        "SELECT COUNT(ID) FROM WORKER",
        (rs, rowNum) -> {
          long count = rs.getInt(1);
          return count;
        });
    return result.size() > 0 ? (long) (result.get(0)) : 0;
  }

  /**
   * Retrieves all Workers from the database.
   * 
   * @return an Iterable collection of Worker entities.
   */
  @Override
  public Iterable<Worker> findAllWorker() {

    var result = jdbcTemplate.queryForStream(

        "SELECT * FROM WORKER",

        (rs, rowNum) -> createWorker(rs))
        .filter(opt -> opt.isPresent())
        .map(opt -> opt.get())
        .collect(Collectors.toList());
    return result;
  }

  /**
   * Finds a Worker by their ID.
   * 
   * @param id the ID of the Worker.
   * @return a Worker object or null if not found.
   */
  @Override
  public Worker findWorkersbyID(String id) {
    if (!id.startsWith("W")) {
      throw new IllegalArgumentException("Id is not Worker");
    }

    List<Optional<Worker>> result = jdbcTemplate.query(

        "SELECT * FROM WORKER WHERE id = ?",
        ps -> {

          ps.setString(1, id);
        },

        (rs, rowNum) -> createWorker(rs));
    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;

  }

  /**
   * Finds a Worker by their name.
   * 
   * @param name the name of the Worker.
   * @return a Worker object or null if not found.
   */
  @Override
  public Worker findWorkerbyName(String name) {
    if (name == null) {
      throw new IllegalArgumentException("name is null");
    }
    List<Optional<Worker>> result = jdbcTemplate.query(
        "SELECT * FROM WORKER WHERE name = ?",
        ps -> {
          ps.setString(1, name);
        },
        (rs, rowNum) -> createWorker(rs));
    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;
  }

  /**
   * Deletes a Worker by their ID.
   * 
   * @param id the ID of the Worker to delete.
   * @return true if the Worker was deleted, false otherwise.
   */
  @Override
  public Boolean deleteWorkerById(String id) {
    if (!id.startsWith("W")) {
      throw new IllegalArgumentException("Wrong Id" + id);
    }
    try {
      int deleted = jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection
            .prepareStatement("DELETE FROM WORKER WHERE ID = ?;");
        ps.setString(1, id);
        return ps;
      });
      if (deleted != 1) {
        return false;
      }
      return true;
    } catch (Error error) {
      throw new IllegalArgumentException("Conflict deleting Id" + id);
    }

  }

  /**
   * Updates a Worker's details in the database.
   * 
   * @param data the WorkerDTO containing updated Worker data.
   * @return the updated Worker object or null if the update fails.
   */
  @Override
  public Worker updateWorker(WorkerDTO data) {
    if (data == null) {
      throw new IllegalArgumentException("data is null" + data);
    }
    try {
      Worker found = findWorkersbyID(data.getId());
      if (found == null) {
        throw new IllegalArgumentException("id is null");
      }
    } catch (Exception e) {
      throw new IllegalArgumentException("Id dos not exist");
    }

    if (!data.getPassword().startsWith("$2a$")) {
      data.setPassword(encoder.hashPassword(data.getPassword()));
    }

    int rowsAffected = jdbcTemplate.update(
        "UPDATE WORKER SET name = ?, location = ?, password = ?, status = ?, status_order = ?, range = ?, job_type = ?, min_payment = ?, rating = ?, verification = ?, email = ? , latitude = ? , longitude =? WHERE id = ?",
        ps -> {
          ps.setString(1, data.getName());
          ps.setString(2, data.getLocation());
          ps.setString(3, data.getPassword());
          ps.setString(4, data.getStatus());
          ps.setString(5, data.getStatusOrder());
          ps.setDouble(6, data.getRange());
          ps.setString(7, data.getJobType());
          ps.setDouble(8, data.getMinPayment());
          ps.setDouble(9, data.getRating());
          ps.setBoolean(10, data.getVerification());
          ps.setString(11, data.getEmail());
          ps.setDouble(12, data.getLatitude());
          ps.setDouble(13, data.getLongitude());
          ps.setString(14, data.getId());
        });

    if (rowsAffected > 0) {

      return new Worker(data.getName(), data.getLocation(), data.getPassword(), Status.valueOf(data.getStatus()),
          StatusOrder.valueOf(data.getStatusOrder()), data.getRange(), JobList.valueOf(data.getJobType()),
          data.getMinPayment(), data.getRating(), data.getVerification(), data.getEmail(), data.getLatitude(),
          data.getLongitude());
    } else {
      return null;
    }
  }

  /**
   * Creates a new Worker in the database.
   * 
   * @param rs the WorkerDTO containing the Worker data.
   * @return the newly created Worker object.
   */
  @Override
  public Worker createWorker(WorkerDTO rs) {
    if (rs.getName() == null || rs.getLocation() == null || rs.getPassword() == null ||
        rs.getJobType() == null || rs.getMinPayment() == null || rs.getEmail() == null) {
      throw new IllegalArgumentException("Some data are empty");
    }
    try {
      String name = rs.getName();
      String location = rs.getLocation();
      String password = encoder.hashPassword(rs.getPassword());
      String email = rs.getEmail();
      Double range = rs.getRange();
      String jobType = rs.getJobType();
      Double minPayment = rs.getMinPayment();
      Double rating = 0.1;
      Boolean verification = false;
      double latitude = rs.getLatitude();
      double longitude = rs.getLongitude();

      Worker worker = new Worker(name, location, password, Status.valueOf("AVAILABLE"),
          StatusOrder.valueOf("UNDEFINED"), range, JobList.valueOf(jobType), minPayment, rating, verification, email,
          latitude, longitude);
      workerRepository.save(worker);
      return worker;
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }

  }

  /**
   * Finds a Worker by their email address.
   * 
   * @param email the email of the Worker.
   * @return a Worker object or null if not found.
   */
  @Override
  public Worker findWorkerbyEmail(String email) {
    if (email == null) {
      throw new IllegalArgumentException("Email is empty");
    }

    List<Optional<Worker>> result = jdbcTemplate.query(
        "SELECT * FROM WORKER WHERE email = ?",
        ps -> {
          ps.setString(1, email);
        },
        (rs, rowNum) -> createWorker(rs));

    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;
  }

  /**
   * Helper method to construct a Worker object from a ResultSet.
   * 
   * @param rs the ResultSet containing Worker data.
   * @return an Optional containing the Worker or empty if SQL exception occurs.
   */
  private Optional<Worker> createWorker(ResultSet rs) {
    try {
      String id = rs.getString("id");
      String name = rs.getString("name");
      String location = rs.getString("location");
      String password = rs.getString("password");
      String email = rs.getString("email");
      String status = rs.getString("status");
      String statusOrder = rs.getString("status_order");
      Double range = rs.getDouble("range");
      String jobType = rs.getString("job_type");
      Double minPayment = rs.getDouble("min_payment");
      Double rating = rs.getDouble("rating");
      Boolean verification = rs.getBoolean("verification");
      double latitude = rs.getDouble("latitude");
      double longitude = rs.getDouble("longitude");

      return dataFactory.createWorker(id, name, location, password, email, status, range, jobType, statusOrder,
          minPayment, rating, verification, latitude, longitude);

    } catch (SQLException e) {
    }

    return Optional.empty();
  }

  /**
   * Retrieves a Worker by their job type.
   * 
   * This method retrieves a Worker entity from the database based on their job
   * type.
   * 
   * @param jobType The type of job of the Worker to find.
   * @return A Worker entity if found based on the provided job type, otherwise
   *         null.
   */
  @Override
  public Worker findWorkerByJob(String jobType) {
    List<Optional<Worker>> result = jdbcTemplate.query(
        "SELECT * FROM WORKER WHERE job_type = ?",
        ps -> {
          ps.setString(1, jobType);
        },
        (rs, rowNum) -> createWorker(rs));

    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;
  }

  @Override
  public Boolean avgWorkerRating(Double rating, String id) {

    List<Double> currentRatings = jdbcTemplate.query(
        "SELECT ratingav FROM WORKER WHERE id = ?",
        (rs, rowNum) -> {
          byte[] data = rs.getBytes("ratingav");
          if (data != null) {
              try {
                  return deserializeList(data);
              } catch (IOException | ClassNotFoundException e) {
                  throw new RuntimeException("Error deserializing ratingav", e);
              } catch (java.io.IOException e) {

                return new ArrayList<Double>();
              }
          } else {
              return new ArrayList<Double>();
          }
      }
  ).stream().findFirst().orElse(new ArrayList<>());
    currentRatings.add(rating);

    Double avg = 0.0;
    for (Double rat : currentRatings) {
      avg += rat;
    }

    Double result = avg / currentRatings.size();

    int rowsAffected = jdbcTemplate.update(
        "UPDATE WORKER SET RatingAV = ?, rating = ? WHERE id = ?",
        ps -> {
          Array sqlArray = ps.getConnection().createArrayOf("DOUBLE", currentRatings.toArray());
          ps.setArray(1, sqlArray);
          ps.setDouble(2, result);
          ps.setString(3, id);
        });

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }

  }



private List<Double> deserializeList(byte[] data) throws IOException, ClassNotFoundException, java.io.IOException {
    ByteArrayInputStream bis = new ByteArrayInputStream(data);
    ObjectInputStream ois = new ObjectInputStream(bis);
    return (List<Double>) ois.readObject();
}


}
