package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENUM.Role;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.Service.PasswordHasher;


/**
 * @author erayzor
 */
@Component
public class CustomerImp implements CustomerInterface {
    @Autowired
    private PasswordHasher encoder; 

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataFactoryImp dataFactory;

    @Override
    public long countCustomer() {
        List<Object> result = jdbcTemplate.query(
            "SELECT COUNT(ID) FROM CUSTOMER",
            (rs, rowNum) -> {
                long count = rs.getInt(1);
                return count;
            }
        );
        return result.size() > 0? (long)(result.get(0)) : 0;
    }

    @Override
    public Iterable<Customer> findAllCustomer() {
      
        return jdbcTemplate.queryForStream(
            "SELECT * FROM CUSTOMER",
            (rs, rowNum) -> createCustomer(rs)
        )
        .filter(opt -> opt.isPresent())
        .map(opt -> opt.get())
        .collect(Collectors.toList());
    }

    @Override
    public Customer findCustomerbyID(long id) {
        List<Optional<Customer>> result = jdbcTemplate.query(
            "SELECT * FROM CUSTOMER WHERE ID = ?",
            ps -> {
                ps.setInt(1, (int)id);
            },
            (rs, rowNum) -> createCustomer(rs)
        );
          // Verifyin if the List is empty
          if (!result.isEmpty() && result.get(0).isPresent()) {
            return  result.get(0).get();
        }

        return null;
    }

    /**
     * find Customer just by Name.
     */
    @Override
    public Customer findCustomerbyName(String name) {
       
        List<Optional<Customer>> results = jdbcTemplate.query(
            "SELECT * FROM CUSTOMER WHERE name = ?",
            ps -> {
                ps.setString(1, name );
            },
            (rs, rowNum) -> createCustomer(rs)
        );
            
        // Verifyin if the List is empty
        if (!results.isEmpty() && results.get(0).isPresent()) {
            return  results.get(0).get();
        }
    
        return null; 
    }

    

    //Creating Customer as an Object from the Database
    private Optional<Customer> createCustomer(ResultSet rs) { // For the class
        try {
            long id = rs.getInt("ID");
            String name = rs.getString("NAME");
            String password = rs.getString("PASSWORD");
            String email = rs.getString("EMAIL");
            String role = rs.getString("ROLE");
       
           
            return dataFactory.createCustomer(id, name, password, email, role);
       
        } catch(SQLException e) { }
        
        return Optional.empty();
    }

    @Override
    public Customer createCustomer(CustomerDTO jsonData) { // For the Endpoint
        try {
            String name = jsonData.getName();
            String password = encoder.hashPassword(jsonData.getPassword());
            String email = jsonData.getEmail();
            String role = jsonData.getRole();
    
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement("INSERT INTO CUSTOMER ( NAME, PASSWORD, EMAIL, ROLE) VALUES (?, ?, ?, ?)");
                ps.setString(1, name);
                ps.setString(2, password);
                ps.setString(3, email);
                ps.setString(4, role);
                return ps;
            });
    
            return new Customer( name, password, email, Role.valueOf(role));
    
        } catch (Exception e) {
            e.printStackTrace(); 
        }
    
        return null;
    }
    

    @Override
    public Boolean deleteCustomerById(long id) {
        if(id<0){
        throw new IllegalArgumentException("Wrong Id"+id);
        }
        try{
        int deleted = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection
                        .prepareStatement("DELETE FROM CUSTOMER WHERE ID = ?;");
                    ps.setInt(1, (int)id);
                    return ps;
                });
                if(deleted!=1){
                throw new IllegalArgumentException("Id could not been deleted");
                }
                return true;
            }
        catch(Error error){
         return false;
        }
    }

    @Override
    public Customer updateCustomer(CustomerDTO jsonData) {
        int result =  jdbcTemplate.update(
            "UPDATE customer SET name = ?, password = ?, email = ?, role = ? WHERE ID = ?",
            ps -> {
                ps.setString(1, jsonData.getName());
                ps.setString(2, encoder.hashPassword(jsonData.getPassword()));
                ps.setString(3, jsonData.getEmail());
                ps.setString(4, jsonData.getRole());
                ps.setLong(5, jsonData.getId()); 

            }
        );
    
        // Verifyin if the List is empty
        if(result > 0){
            return findCustomerbyID(Long.valueOf(jsonData.getId()));
        }
    
        return null; 
    }

   
}
