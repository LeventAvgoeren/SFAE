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

         
          String name = rs.getString("name");
          String location = rs.getString("location");
          String password = rs.getString("password");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Double range = rs.getDouble("range");
          Double jobType = rs.getDouble("jobType");
          String minPayment = rs.getString("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");

          return dataFactory.createWorker(name, location, password, email, status, range, minPayment, statusOrder,
              jobType, rating, verification);
        })
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
                ps.setDouble(6,  (Double) map.get("RANGE"));
                ps.setString(7, JobList.valueOf((String) map.get("JOBTYPE")).name());
                ps.setDouble(8,  (Double) map.get("MINPAYMENT"));
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
  public Worker createWorker(WorkerDTO rs) {
  
      
      String name = rs.getName();
      String location = rs.getLocation();
      String password = rs.getPassword();
      String email = rs.getEmail();
      String status = rs.getStatus();
      String statusOrder = rs.getStatusOrder();
      Double range = rs.getRange();
      String jobType = rs.getJobType();
      Double minPayment = rs.getMinPayment();
      Double rating = rs.getRating();
      Boolean verification = rs.getVerification();
      jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection.prepareStatement("INSERT INTO Worker (name, location, password, status, status_Order, range, job_type, min_Payment, rating, verification, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
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
      
      return null;

}
  
  

  //Creating Customer as an Object from the Database
    private Optional<Worker> createWorker(ResultSet rs) {
        try {
       
          String name = rs.getString("name");
          String location = rs.getString("location");
          String email = rs.getString("email");
          String status = rs.getString("status");
          String statusOrder = rs.getString("statusOrder");
          Double range = rs.getDouble("range");
          String jobType = rs.getString("jobType");
          Double minPayment = rs.getDouble("minPayment");
          Double rating = rs.getDouble("rating");
          Boolean verification = rs.getBoolean("verification");


            return dataFactory.createWorker(name, location, location, email, status, range, jobType, statusOrder,minPayment, rating, verification);

        } catch(SQLException e) { }

        return Optional.empty();
    }
}
