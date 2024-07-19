package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.sql.Array;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.DTO.WorkerPrefrencesDTO;
import com.SFAE.SFAE.DTO.WorkerProfileDTO;
import com.SFAE.SFAE.DTO.WorkerStatus;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.ENUM.Status;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerRepository;
import com.SFAE.SFAE.Service.PasswordHasher;
import com.SFAE.SFAE.Service.PictureService;

import io.jsonwebtoken.io.IOException;
import org.springframework.util.StreamUtils;

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

  @Autowired
  private PictureService pictureService;

  @Autowired
  @Lazy
  private ContractImpl contract;

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
      throw new IllegalArgumentException("Wrong Id");
    }
    try {
      List<Contract> contractList = contract.getContractByWorkerId(id);
      if (contractList != null) {
        for (Contract contractData : contractList) {
          if (contractData.getStatusOrder().equals(StatusOrder.ACCEPTED)) {
            throw new IllegalArgumentException("You can not delete your account if you have open contracts");
          }
        }
      }

    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("You can not delete your account if you have open contracts");
    }

    try {

      // Setze den contract auf null bevor ich lösche um den fehler zu
      // umgehen DataIntegrityViolationException
      jdbcTemplate.update(
          "UPDATE Contract SET worker_id = NULL WHERE worker_id = ?",
          ps -> ps.setString(1, id));

      // löschen des workers;
      int deleted = jdbcTemplate.update(
          "DELETE FROM Worker WHERE ID = ?",
          ps -> ps.setString(1, id));

      if (deleted != 1) {
        return false;
      }

      return true;
    } catch (Exception e) {
      throw new IllegalArgumentException("Conflict deleting Id: " + id, e);
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

    Long[] imageOid = { null };

    if (data.getProfileBase64() != null && !data.getProfileBase64().isEmpty()) {
      try {
        byte[] imageBytes = Base64.getDecoder().decode(data.getProfileBase64());
        imageOid[0] = pictureService.saveImageAsLargeObject(imageBytes);
      } catch (Exception e) {
        e.getStackTrace();
      }
    }

    int rowsAffected = jdbcTemplate.update(
        "UPDATE WORKER SET name = ?, location = ?, password = ?, status = ?, status_order = ?, range = ?, job_type = ?, min_payment = ?, rating = ?, verification = ?, email = ? , latitude = ? , longitude =?, profile_picture_blob = ?, slogan=? WHERE id = ?",
        ps -> {
          Connection connection = ps.getConnection();

          Array jobTypeArray = connection.createArrayOf("VARCHAR", Arrays.stream(data.getJobType())
              .toArray(String[]::new));
          ps.setString(1, data.getName());
          ps.setString(2, data.getLocation());
          ps.setString(3, data.getPassword());
          ps.setString(4, data.getStatus());
          ps.setString(5, data.getStatusOrder());
          ps.setDouble(6, data.getRange());
          ps.setArray(7, jobTypeArray);
          ps.setDouble(8, data.getMinPayment());
          ps.setDouble(9, data.getRating());
          ps.setBoolean(10, data.getVerification());
          ps.setString(11, data.getEmail());
          ps.setDouble(12, data.getLatitude());
          ps.setDouble(13, data.getLongitude());
          ps.setLong(14, imageOid[0]);
          ps.setString(15, data.getSlogan());
          ps.setString(16, data.getId());

        });

    if (rowsAffected > 0) {
      JobList[] list = new JobList[data.getJobType().length];
      for (int i = 0; i < data.getJobType().length; i++) {
        list[i] = JobList.valueOf(data.getJobType()[i]);
      }

      return new Worker(data.getName(), data.getLocation(), data.getPassword(), Status.valueOf(data.getStatus()),
          StatusOrder.valueOf(data.getStatusOrder()), data.getRange(), list,
          data.getMinPayment(), data.getRating(), data.getVerification(), data.getEmail(), data.getLatitude(),
          data.getLongitude(), data.getSlogan());
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

      byte[] defaultImage = pictureService.loadDefaultProfilePicture();
      var pic = pictureService.saveImageAsLargeObject(defaultImage);
      String name = rs.getName();
      String location = rs.getLocation();
      String password = encoder.hashPassword(rs.getPassword());
      String email = rs.getEmail();
      Double range = rs.getRange();
      String[] jobType = rs.getJobType();
      Double minPayment = rs.getMinPayment();
      Double rating = 1.0;
      ArrayList<Double> ratingAv = new ArrayList<>();
      ratingAv.add(1.0);
      Boolean verification = false;
      double latitude = rs.getLatitude();
      double longitude = rs.getLongitude();
      String slogan = rs.getSlogan();
      Boolean confirm = false;

      JobList[] list = new JobList[jobType.length];
      for (int i = 0; i < jobType.length; i++) {
        list[i] = JobList.valueOf(jobType[i].toUpperCase());
      }

      Worker worker = new Worker(name, location, password, Status.valueOf("AVAILABLE"),
          StatusOrder.valueOf("UNDEFINED"), range, list, minPayment, rating, verification, email,
          latitude, longitude, ratingAv, pic, slogan, confirm);
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
      String jobTypeString = rs.getString("job_type");
      jobTypeString = jobTypeString.replace("{", "");
      jobTypeString = jobTypeString.replace("}", "");
      jobTypeString = jobTypeString.replace("\"", "");

      String[] jobType = jobTypeString.split(",");

      Double minPayment = rs.getDouble("min_payment");
      Double rating = rs.getDouble("rating");
      Boolean verification = rs.getBoolean("verification");
      double latitude = rs.getDouble("latitude");
      double longitude = rs.getDouble("longitude");
      Boolean confirm = rs.getBoolean("confirm");
      // byte[] picture = rs.getBytes("profile_picture_blob");
      // var pic=pictureService.saveImageAsLargeObject(picture);

      String slogan = rs.getString("slogan");

      return dataFactory.createWorker(id, name, location, password, email, status, range, jobType, statusOrder,
          minPayment, rating, verification, latitude, longitude, slogan, confirm);

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
        "SELECT * FROM WORKER WHERE ? = ANY(string_to_array(trim(both '{}' FROM job_type), ','))",
        ps -> {
          ps.setString(1, jobType);
        },
        (rs, rowNum) -> createWorker(rs));

    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;
  }

  /**
   * Updates the average rating of a Worker.
   * 
   * This method calculates the new average rating for a Worker based on
   * additional rating data provided.
   * The new average is persisted in the database.
   * 
   * @param rating The new rating to be added.
   * @param id     The unique identifier of the Worker whose rating is to be
   *               updated.
   * @return True if the update is successful, false otherwise.
   */
  @Override
  public Boolean avgWorkerRating(Double rating, String id) {

    List<Double> currentRatings = jdbcTemplate.query(
        "SELECT ratingav FROM WORKER WHERE id = ?",
        ps -> {
          ps.setString(1, id);
        },
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
        }).stream().findFirst().orElse(new ArrayList<>());

    currentRatings.add(rating);

    Double avg = 0.0;
    for (Double rat : currentRatings) {
      avg += rat;
    }

    double gänsehaut = avg /= currentRatings.size();

    int rowsAffected = jdbcTemplate.update(
        "UPDATE WORKER SET rating = ?, ratingav = ?  WHERE id = ?",
        ps -> {
          ps.setDouble(1, gänsehaut);
          byte[] serialisedRating = serializeList(currentRatings);
          ps.setBytes(2, serialisedRating);
          ps.setString(3, id);
        });

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * Serializes a list of Double objects into a byte array.
   * 
   * This method is used internally to serialize rating lists for storage in a
   * database.
   * 
   * @param list The list of Doubles to serialize.
   * @return A byte array containing the serialized list.
   * @throws IOException If an input/output error occurs during serialization.
   */

  private byte[] serializeList(List<Double> list) throws IOException {
    ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
    ObjectOutputStream out;
    try {
      out = new ObjectOutputStream(byteOut);
      out.writeObject(list);
      out.flush();
    } catch (java.io.IOException e) {
      e.printStackTrace();
    }

    return byteOut.toByteArray();
  }

  /**
   * Deserializes a list of Double objects from a byte array.
   * 
   * This method is used internally to deserialize lists of ratings from database
   * storage.
   * 
   * @param data The byte array containing the serialized list.
   * @return The deserialized list of Doubles.
   * @throws IOException            If an input/output error occurs during
   *                                deserialization.
   * @throws ClassNotFoundException If the class of a serialized object cannot be
   *                                found.
   */
  @SuppressWarnings("unchecked")
  private List<Double> deserializeList(byte[] data) throws IOException, ClassNotFoundException, java.io.IOException {
    ByteArrayInputStream bis = new ByteArrayInputStream(data);
    ObjectInputStream ois = new ObjectInputStream(bis);
    return (List<Double>) ois.readObject();
  }

  /**
   * Updates the password of a worker.
   * 
   * @param password The new password to be set.
   * @param Id The ID of the worker whose password is to be updated.
   * @return true if the password is successfully updated, false otherwise.
   */
  @Override
  public Boolean updatePassword(String password, String Id) {

    int result = jdbcTemplate.update(
        "UPDATE WORKER SET password = ? WHERE id = ?",
        ps -> {
          ps.setString(1, encoder.hashPassword(password));
          ps.setString(2, Id);
        });

    if (result > 0) {
      return true;
    }

    return false;
  }


  /**
   * Loads the default profile picture.
   * 
   * @return A byte array representing the default profile picture.
   * @throws java.io.IOException if an I/O error occurs.
   */
  public byte[] loadDefaultProfilePicture() throws java.io.IOException {
    try {
      ClassPathResource imgFile = new ClassPathResource("static/images/default_profile.jpeg");
      return StreamUtils.copyToByteArray(imgFile.getInputStream());
    } catch (IOException e) {
      e.printStackTrace();
      return new byte[0];
    }
  }

  /**
   * Updates the status of a worker based on the provided worker ID and status.
   * 
   * @param workerId The ID of the worker to update the status for.
   * @param status The new status to be set for the worker.
   * @return true if the status is successfully updated, false otherwise.
   */
  @Override
  public Boolean updateStatusByWorkerId(String workerId, String status) {

    int row = jdbcTemplate.update(
        "UPDATE WORKER SET  status = ? WHERE id = ?",
        ps -> {
          ps.setString(1, status);
          ps.setString(2, workerId);
        });

    if (row > 0) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * Updates the order status of a worker based on the provided worker ID and status order.
   * 
   * @param workerId The ID of the worker to update the order status for.
   * @param statusOrder The new order status to be set for the worker.
   * @return true if the order status is successfully updated, false otherwise.
   */
  @Override
  public Boolean updateOrderStatusByWorkerId(String workerId, String statusOrder) {
    int row = jdbcTemplate.update(
        "UPDATE WORKER SET status_order = ? WHERE id = ?",
        ps -> {
          ps.setString(1, statusOrder);
          ps.setString(2, workerId);
        });

    if (row > 0) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * Retrieves the profile image of a worker by their ID.
   * 
   * @param id The ID of the worker whose profile image is to be retrieved.
   * @return A byte array representing the profile image, or null if no image is found.
   * @throws IllegalArgumentException if the ID is not provided.
   */
  @Override
  public byte[] getProfileImageByworkerId(String id) {
    if (id.isEmpty()) {
      throw new IllegalArgumentException("Id not given");
    }

    List<Integer> oids = jdbcTemplate.query(
        "SELECT profile_picture_blob FROM Worker WHERE ID = ?",
        ps -> {
          ps.setString(1, id);
        },
        (rs, rowNum) -> rs.getInt("profile_picture_blob"));
    if (oids.isEmpty()) {
      return null;
    }

    Integer oid = oids.get(0);
    return pictureService.readLargeObject(oid);
  }

  /**
   * Retrieves the status of a worker by their ID.
   * 
   * @param id The ID of the worker whose status is to be retrieved.
   * @return The status of the worker.
   * @throws IllegalArgumentException if the ID is not provided or if the status is empty.
   */
  @Override
  public WorkerStatus getWorkerStatus(String id) {
    if (id == null) {
      throw new IllegalArgumentException("Id isnt given");
    }
    List<WorkerStatus> status = jdbcTemplate.query(
        "SELECT status, status_order FROM Worker WHERE ID = ?",
        ps -> {
          ps.setString(1, id);
        },
        (rs, rowNum) -> {
          return new WorkerStatus(rs.getString("status"), rs.getString("status_order"));
        });

    if (status.isEmpty()) {
      throw new IllegalArgumentException("Status is empty");
    } else {
      return status.get(0);
    }
  }

 /**
   * Updates the profile of a worker based on the provided worker profile data.
   * 
   * @param data The WorkerProfileDTO object containing the necessary data to update the worker's profile.
   * @return The updated Worker object, or null if the update fails.
   * @throws IllegalArgumentException if the provided data is null or if the worker ID does not exist.
   */
  @Override
  public Worker updateWorkerProfile(WorkerProfileDTO data) {
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

    Long[] imageOid = { null };

    if (data.getProfileBase64() != null && !data.getProfileBase64().isEmpty()) {
      try {
        byte[] imageBytes = Base64.getDecoder().decode(data.getProfileBase64());
        imageOid[0] = pictureService.saveImageAsLargeObject(imageBytes);
      } catch (Exception e) {
        e.getStackTrace();
      }
    }
    try {
      int rowsAffected = jdbcTemplate.update(
          "UPDATE WORKER SET name = ?, location = ?, password = ?, email = ? , latitude = ? , longitude =?, profile_picture_blob = ?, slogan=? WHERE id = ?",
          ps -> {
            ps.setString(1, data.getName());
            ps.setString(2, data.getLocation());
            ps.setString(3, data.getPassword());
            ps.setString(4, data.getEmail());
            ps.setDouble(5, data.getLatitude());
            ps.setDouble(6, data.getLongitude());
            ps.setLong(7, imageOid[0]);
            ps.setString(8, data.getSlogan());
            ps.setString(9, data.getId());
          });

      if (rowsAffected > 0) {
        return new Worker(data.getName(), data.getLocation(), data.getPassword(), data.getEmail(), data.getLatitude(),
            data.getLongitude(), data.getSlogan());
      } else {
        return null;
      }
    } catch (Exception e) {
      throw new IllegalArgumentException("Updated failed");
    }

  }

  /**
   * Updates the preferences of a worker based on the provided worker preferences data.
   * 
   * @param data The WorkerPrefrencesDTO object containing the necessary data to update the worker's preferences.
   * @return The updated Worker object, or null if the update fails.
   * @throws IllegalArgumentException if the provided data is null.
   */
  @Override
  public Worker updateWorkerPreferences(WorkerPrefrencesDTO data) {
    if (data == null) {
      throw new IllegalArgumentException("No Data " + data);
    }

    String jobTypesString = String.join(",", data.getJobType());

    try {
      int rowsAffected = jdbcTemplate.update(
          "UPDATE WORKER SET range = ?, job_type = ?, min_payment = ? WHERE id = ?",
          ps -> {
            ps.setDouble(1, data.getRange());
            ps.setString(2, jobTypesString);
            ps.setDouble(3, data.getMinPayment());
            ps.setString(4, data.getId());
          });

      if (rowsAffected > 0) {
        JobList[] list = new JobList[data.getJobType().length];
        for (int i = 0; i < data.getJobType().length; i++) {
          list[i] = JobList.valueOf(data.getJobType()[i]);
        }

        return new Worker(data.getRange(), list, data.getMinPayment());
      } else {
        return null;
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new IllegalArgumentException("Updated failed");
    }

  }


  /**
   * Verifies the email of a worker.
   * 
   * @param id The ID of the worker to verify.
   * @return true if the email is successfully verified, false otherwise.
   * @throws IllegalArgumentException if the ID is not provided or is not a valid worker ID.
   */
  @Override
  public boolean verifyEmail(String id) {
    if (id == null || !id.startsWith("W")) {
      throw new IllegalArgumentException("Id isnt given or not customer id " + id);
    }
    int result = jdbcTemplate.update(
        "UPDATE WORKER SET confirm = TRUE WHERE id = ?",
        ps -> ps.setString(1, id));

    if (result > 0) {
      return true;
    }

    return false;
  }

}
