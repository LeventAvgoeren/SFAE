package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StartusOrder;
import com.SFAE.SFAE.ENUM.Status;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Service.PasswordHasher;
/**
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

  @Override
  public long countWorker() {
    List<Object> result = jdbcTemplate.query(

        "SELECT COUNT(ID) FROM CUSTOMER",

        (rs, rowNum) -> {
          long count = rs.getInt(1);
          return count;
        });
    if (result.isEmpty()) {
      return 0;
    } else {
      return result.size();
    }
  }

  @Override
  public Iterable<Worker> findAllWorker() {

    var result = jdbcTemplate.queryForStream(

        "SELECT * FROM Worker",

        (rs, rowNum) -> createWorker(rs))
        .filter(opt -> opt.isPresent())
        .map(opt -> opt.get())
        .collect(Collectors.toList());
    return result;
  }

  @Override
  public Worker findWorkersbyID(long id) {

    List<Optional<Worker>> result = jdbcTemplate.query(

        "SELECT * FROM WORKER WHERE id = ?",
        // Damit setzt man das frage zeichen auf die erste stelle des platzhalters ?
        ps -> {

          ps.setInt(1, (int) id);
        },

        (rs, rowNum) -> createWorker(rs)
        );
        if (!result.isEmpty() && result.get(0).isPresent()) {
          return  result.get(0).get();
      }
      return null;

  }

  @Override
  public Worker findWorkerbyName(String name) {
    List<Optional<Worker>> result = jdbcTemplate.query(
      "SELECT * FROM WORKER WHERE name = ?",
        ps -> {
          ps.setString(1, name );
        },
        (rs, rowNum) -> {

         
          String location = rs.getString("location");
          String password = rs.getString("password");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Double range = rs.getDouble("range");
          String jobType = rs.getString("jobType");
          Double minPayment = rs.getDouble("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(name, location, password, email, status, range, jobType, statusOrder,
              minPayment, rating, verification);

        });
        if (!result.isEmpty() && result.get(0).isPresent()) {
          return  result.get(0).get();
      }
      return null;
  }

  @Override
  public Boolean deleteWorkerById(long id) {
    if(id<0){
      throw new IllegalArgumentException("Wrong Id"+id);
    }
    try{
      int deleted = jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection
                    .prepareStatement("DELETE FROM WORKER WHERE ID = ?;");
                ps.setLong(1, (Long)id);
                return ps;
            });
            if(deleted!=1){
              return false;
            }
            return true;
    }
     catch(Error error){
      throw new IllegalArgumentException("Conflict deleting Id"+id);
     }

  }
  @Override
  public Worker updateWorker(WorkerDTO data) {
    String password=encoder.hashPassword(data.getPassword());
      int rowsAffected = jdbcTemplate.update(
              "UPDATE worker SET name = ?, location = ?, password = ?, status = ?, status_order = ?, range = ?, job_type = ?, min_payment = ?, rating = ?, verification = ?, email = ? WHERE id = ?",
              ps -> {
                  // Setzen der Parameter
                  ps.setString(1, data.getName());
                  ps.setString(2, data.getLocation());
                  ps.setString(3, password);
                  ps.setString(4, data.getStatus());
                  ps.setString(5, data.getStatusOrder());
                  ps.setDouble(6, data.getRange());
                  ps.setString(7, data.getJobType());
                  ps.setDouble(8, data.getMinPayment());
                  ps.setDouble(9, data.getRating());
                  ps.setBoolean(10, data.getVerification());
                  ps.setString(11, data.getEmail());
                  ps.setLong(12, data.getId());
              }
      );
  
      // Überprüfen, ob das Update erfolgreich war
      if (rowsAffected > 0) {
          // Das Update war erfolgreich, daher können Sie den aktualisierten Worker zurückgeben
          return new Worker(data.getName(), data.getLocation(), password, Status.valueOf(data.getStatus()), StartusOrder.valueOf(data.getStatusOrder()), data.getRange(),JobList.valueOf(data.getJobType()), data.getMinPayment(), data.getRating(), data.getVerification(), data.getEmail());
      } else {
          // Das Update war nicht erfolgreich
          return null;
      }
  }
  

  @Override
  public Worker createWorker(WorkerDTO rs) {
  
      
      String name = rs.getName();
      String location = rs.getLocation();
      String password = encoder.hashPassword(rs.getPassword());
      String email = rs.getEmail();
      String status = rs.getStatus();
      String statusOrder = rs.getStatusOrder();
      Double range = rs.getRange();
      String jobType = rs.getJobType();
      Double minPayment = rs.getMinPayment();
      Double rating = rs.getRating();
      Boolean verification = rs.getVerification();
      jdbcTemplate.update(connection -> {

        PreparedStatement ps = connection.prepareStatement("INSERT INTO Worker (name, location, password, status, status_order, range, job_type, min_Payment, rating, verification, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
        ps.setString(1, name);
        ps.setString(2, location);
        ps.setString(3, password);
        ps.setString(4, status);
        ps.setString(5, statusOrder);
        ps.setDouble(6, range);
        ps.setString(7, jobType);
        ps.setDouble(8, minPayment);
        ps.setDouble(9, rating);
        ps.setBoolean(10, verification);
        ps.setString(11,  email);
    
        return ps;
    });
      
      return new Worker(name, location, password,Status.valueOf(status) ,StartusOrder.valueOf(statusOrder) , range,JobList.valueOf(jobType), minPayment, rating, verification, email);

}
  
  

  //Creating Customer as an Object from the Database
    private Optional<Worker> createWorker(ResultSet rs) {
        try {
       
          String name = rs.getString("name");
          String location = rs.getString("location");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("status_order");
          Double range = rs.getDouble("range");
          String jobType = rs.getString("job_type");
          Double minPayment = rs.getDouble("min_payment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");


            return dataFactory.createWorker(name, location, location, email, status, range, jobType, statusOrder,minPayment, rating, verification);

        } catch(SQLException e) { }

        return Optional.empty();
    }
}
