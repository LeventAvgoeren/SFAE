package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
/**
 * @author Levent
 */

@Component
public class WorkerImpl implements WorkerInterface {

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

        (rs, rowNum) -> {

          long id = rs.getLong("id");
          String name = rs.getString("name");
          String location = rs.getString("location");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Float range = rs.getFloat("range");
          Float jobType = rs.getFloat("jobType");
          String minPayment = rs.getString("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(id, name, location, location, email, status, range, minPayment, statusOrder,
              jobType, rating, verification);
        })
        .filter(opt -> opt.isPresent())
        .map(opt -> opt.get())
        .collect(Collectors.toList());
    return result;
  }

  @Override
  public Optional<Worker> findWorkersbyID(long id) {

    List<Optional<Worker>> result = jdbcTemplate.query(

        "SELECT * FROM WORKER WHERE ID = ?",
        // Damit setzt man das frage zeichen auf die erste stelle des platzhalters ?
        ps -> {

          ps.setLong(1, (long) id);
        },

        (rs, rowNum) -> {
          /*
           * Extract values from ResultSet.
           */

          String name = rs.getString("name");
          String location = rs.getString("location");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Float range = rs.getFloat("range");
          String jobType = rs.getString("jobType");
          Float minPayment = rs.getFloat("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(id, name, location, location, email, status, range, jobType, statusOrder,
              minPayment, rating, verification);
        });
    return result.size() > 0 ? result.get(0) : Optional.empty();

  }

  @Override
  public Optional<Worker> findWorkerbyName(String name) {
    List<Optional<Worker>> result = jdbcTemplate.query(
        "SELECT * FROM CUSTOMER WHERE NAME LIKE ?",
        ps -> {
          ps.setString(1, "%" + name + "%");
        },
        (rs, rowNum) -> {

          long id = rs.getLong("id");
          String location = rs.getString("location");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Float range = rs.getFloat("range");
          String jobType = rs.getString("jobType");
          Float minPayment = rs.getFloat("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(id, name, location, location, email, status, range, jobType, statusOrder,
              minPayment, rating, verification);

        });
    if (!result.isEmpty()) {
      return result.get(0);
    } else {
      return null;
    }
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
                ps.setInt(1, (int)id);
                return ps;
            });
            if(deleted!=1){
              throw new IllegalArgumentException("Id Coudnt deleted");
            }
            return true;
    }
     catch(Error error){
      throw new IllegalArgumentException("Conflict deleting Id"+id);
     }

  }

  @Override
  public Worker updateWorker(Map<String, Object> map) {
    
    throw new UnsupportedOperationException("Unimplemented method 'updateCustomer'");
  }

  @Override
  public Optional<Worker> createWorker(Map<String, Object> rs) {
    try {
      long id = (Long)rs.get("id");
      String name = (String)rs.get("name");
      String location = (String) rs.get("location");
      String email = (String) rs.get("email");
      String status = (String) rs.get("status");
      String statusOrder =(String) rs.get("statusOrder");
      Float range = (Float)rs.get("range");
      String jobType = (String) rs.get("jobType");
      Float minPayment =(Float) rs.get("minPayment");
      Double rating = (Double)rs.get("rating");
      Boolean verification =(Boolean) rs.get("verification");


        return dataFactory.createWorker(id, name, location, location, email, status, range, jobType, statusOrder,minPayment, rating, verification);

    } catch(Exception e) {}

    return Optional.empty();
}
  
  

  //Creating Customer as an Object from the Database
    private Optional<Worker> createWorker(ResultSet rs) {
        try {
          long id = rs.getLong("id");
          String name = rs.getString("name");
          String location = rs.getString("location");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Float range = rs.getFloat("range");
          String jobType = rs.getString("jobType");
          Float minPayment = rs.getFloat("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");


            return dataFactory.createWorker(id, name, location, location, email, status, range, jobType, statusOrder,minPayment, rating, verification);

        } catch(SQLException e) { }

        return Optional.empty();
    }
}
