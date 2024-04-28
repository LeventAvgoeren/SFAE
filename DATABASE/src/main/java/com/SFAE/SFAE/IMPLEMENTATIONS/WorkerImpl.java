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
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StartusOrder;
import com.SFAE.SFAE.ENUM.Status;
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
          String password = rs.getString("password");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Float range = rs.getFloat("range");
          Float jobType = rs.getFloat("jobType");
          String minPayment = rs.getString("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(id, name, location, password, email, status, range, minPayment, statusOrder,
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
          String password = rs.getString("password");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Float range = rs.getFloat("range");
          String jobType = rs.getString("jobType");
          Float minPayment = rs.getFloat("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(id, name, location, password, email, status, range, jobType, statusOrder,
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
          String password = rs.getString("password");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Float range = rs.getFloat("range");
          String jobType = rs.getString("jobType");
          Float minPayment = rs.getFloat("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(id, name, location, password, email, status, range, jobType, statusOrder,
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
    
    List<Object> results = jdbcTemplate.query(
            "UPDATE WORKER SET NAME = ?, LOCATION = ?, PASSWORD = ?, STATUS = ?, STATUSORDER = ?, RANGE = ?, JOBTYPE = ?, MINPAYMENT = ?, RATING = ?, VERIFICATION = ?, EMAIL = ? WHERE id = ?",
            ps -> {
                // Setze den Parameter mit Wildcards für eine teilweise Übereinstimmung
                ps.setString(1, (String) map.get("NAME"));
                ps.setString(2, (String) map.get("LOCATION"));
                ps.setString(3, (String) map.get("PASSWORD"));
                ps.setString(4, Status.valueOf((String) map.get("STATUS")).name());
                ps.setString(5, StartusOrder.valueOf((String) map.get("STATUSORDER")).name());
                ps.setFloat(6,  (Float) map.get("RANGE"));
                ps.setString(7, JobList.valueOf((String) map.get("JOBTYPE")).name());
                ps.setFloat(8,  (Float) map.get("MINPAYMENT"));
                ps.setDouble(9, (Double) map.get("RATING"));
                ps.setBoolean(10,(Boolean) map.get("VERIFICATION"));
                ps.setString(11,(String) map.get("EMAIL"));
                ps.setLong(12, ( (Number)  map.get("ID")).longValue());
            },
            (rs, rowNum) -> createWorker(rs)
        );
    
        // Verifyin if the List is empty
        if (!results.isEmpty() && results.get(0) instanceof Worker) {
            return (Worker) results.get(0);
        }
        return null;
    
  }

  @Override
  public Optional<Worker> createWorker(Worker rs) {
    try {
      long id = rs.getId();
      String name = rs.getName();
      String location = rs.getLocation();
      String password = rs.getPassword();
      String email = rs.getEmail();
      Status status = rs.getStatus();
      StartusOrder statusOrder = rs.getStatusOrder();
      Float range = rs.getRange();
      JobList jobType = rs.getJobType();
      Float minPayment = rs.getMinPayment();
      Double rating = rs.getRating();
      Boolean verification = rs.getVerification();

      jdbcTemplate.update(connection -> {
          PreparedStatement ps = connection.prepareStatement("INSERT INTO Worker (ID, NAME, LOCATION,PASSWORD,STATUS, STATUSORDER, RANGE, JOBTYPE, MINPAYMENT, RATING, VERIFICATION, EMAIL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)");
          ps.setLong(1, id);
          ps.setString(2, name);
          ps.setString(3, location);
          ps.setString(4, password);
          ps.setString(5, status.name()); 
          ps.setString(6, statusOrder.name()); 
          ps.setFloat(7, range);
          ps.setString(8, jobType.name()); 
          ps.setFloat(9, minPayment);
          ps.setDouble(10, rating);
          ps.setBoolean(11, verification);
          ps.setString(12, email);
          ps.executeUpdate(); 
          return ps;
      });
      
      return Optional.of(new Worker(id, name, location, password, status, statusOrder, range, jobType, minPayment, rating, verification, email));

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