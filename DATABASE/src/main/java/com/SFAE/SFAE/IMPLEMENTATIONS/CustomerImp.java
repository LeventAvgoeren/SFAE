package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.INTERFACE.CustomerRepository;
import com.SFAE.SFAE.Service.PasswordHasher;
import com.SFAE.SFAE.Service.PictureService;

/**
 * Implements the customer management operations defined in the
 * CustomerInterface.
 * This class provides methods to interact with the database for creating,
 * deleting, updating,
 * and finding customers based on different criteria. It uses JdbcTemplate for
 * database interactions
 * and PasswordHasher for password encryption.
 * 
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

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PictureService pictureService;

    @Autowired
    @Lazy
    private ContractImpl contract;

    @Autowired
    WorkerImpl worker;


    /**
     * Counts the total number of customers in the database.
     * Uses a SQL query to count all entries in the CUSTOMER table.
     *
     * @return the total number of customers
     */
    @Override
    public long countCustomer() {
        List<Object> result = jdbcTemplate.query(
                "SELECT COUNT(ID) FROM CUSTOMER",
                (rs, rowNum) -> {
                    long count = rs.getInt(1);
                    return count;
                });
        return result.size() > 0 ? (long) (result.get(0)) : 0;
    }

    /**
     * Retrieves all customers from the database.
     * Each customer is converted into a Customer object if present.
     * This method uses a SQL query to fetch all records from the CUSTOMER table.
     *
     * @return an iterable collection of Customer objects
     */

     @Override
     public Iterable<Customer> findAllCustomer() {
 
         return jdbcTemplate.queryForStream(
                 "SELECT * FROM CUSTOMER",
                 (rs, rowNum) -> createCustomer(rs))
                 .filter(opt -> opt.isPresent())
                 .map(opt -> opt.get())
                 .collect(Collectors.toList());
     }

    /**
     * Finds and returns a customer by their ID.
     * This method queries the database for a customer with the specified ID and
     * maps the result to a Customer object.
     * If no customer is found, returns null.
     *
     * @param id the unique identifier of the customer
     * @return the Customer object or null if not found
     */
    @Override
    public Customer findCustomerbyID(String id) {
        List<Optional<Customer>> result = jdbcTemplate.query(
                "SELECT * FROM CUSTOMER WHERE ID = ?",
                ps -> {
                    ps.setString(1, id);
                },
                (rs, rowNum) -> createCustomer(rs));

        // Verifyin if the List is empty
        if (!result.isEmpty() && result.get(0).isPresent()) {
            return result.get(0).get();
        }

        return null;
    }

    /**
     * Retrieves a customer by their name.
     * Queries the database for a customer with the specified name. If found,
     * returns the Customer object,
     * otherwise returns null.
     *
     * @param name the name of the customer to find
     * @return the Customer object or null if not found
     */
    @Override
    public Customer findCustomerbyName(String name) {
        List<Optional<Customer>> results = jdbcTemplate.query(
                "SELECT * FROM CUSTOMER WHERE name = ?",
                ps -> {
                    ps.setString(1, name);
                },
                (rs, rowNum) -> createCustomer(rs));

        // Verifyin if the List is empty
        if (!results.isEmpty() && results.get(0).isPresent()) {
            return results.get(0).get();
        }

        return null;
    }

    private Optional<Customer> createCustomer(ResultSet rs) {
        try {
            String id = rs.getString("ID");
            String name = rs.getString("NAME");
            String password = rs.getString("PASSWORD");
            String email = rs.getString("EMAIL");
            String role = rs.getString("ROLE");
            Boolean confirm = rs.getBoolean("CONFIRM");
            String statusOrder= rs.getString("contract_status");
            return dataFactory.createCustomer(id, name, password, email, role,confirm,statusOrder);

        } catch (SQLException e) {
        }

        return Optional.empty();
    }

    /**
     * Creates a new customer in the database using the provided customer data.
     * The method hashes the password and inserts the customer details into the
     * database.
     * Returns the newly created customer object.
     *
     * @param jsonData the data transfer object containing customer information
     * @return the newly created Customer object or null if creation fails
     */
    @Override
    public Customer createCustomer(CustomerDTO jsonData) {
        try {
            byte[] defaultImage = worker.loadDefaultProfilePicture();
            var pic=pictureService.saveImageAsLargeObject(defaultImage);
            String name = jsonData.getName();
            String password = encoder.hashPassword(jsonData.getPassword());
            String email = jsonData.getEmail();
            Boolean confirm = false;
            StatusOrder statusOrder= StatusOrder.valueOf("UNDEFINED");
            if (password == null || name == null || email == null) {
                return null;
            }
            Customer customer = new Customer(name, password, email, pic,confirm,statusOrder);
            customerRepository.save(customer);
            return customer;
    
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }



    /**
     * Deletes a customer from the database by their ID.
     * This method performs a SQL update to remove the customer with the specified
     * ID.
     * Returns true if the deletion was successful, false otherwise.
     *
     * @param id the unique identifier of the customer to delete
     * @return true if the customer was successfully deleted, false otherwise
     */

    @Override
    public Boolean deleteCustomerById(String id) {
        if(!id.startsWith("C")){
            throw new IllegalArgumentException("Id is not customer");
        }

       
    try {
          //Wenn der customer aufträge hat und die auf acc sind soll ein error kommen 
          List<Contract> contractList=contract.getContractByCustomerId(id);
          if(contractList!=null){
              for (Contract contractData : contractList) {
                  if(contractData.getStatusOrder().equals(StatusOrder.ACCEPTED)){
                      throw new IllegalArgumentException("You can not delete your account if you have open contracts");
                  }
              }
          }
        
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException("You can not delete your account if you have open contracts");
    }
      

 
            try {
                //Setze den contract auf null bevor ich lösche um den fehler zu 
                //umgehen DataIntegrityViolationException 
                jdbcTemplate.update(
                    "UPDATE Contract SET customer_id = NULL WHERE customer_id = ?",
                    ps -> ps.setString(1, id)
                );
            
                //löschen des customer;
                
                int deleted = jdbcTemplate.update(
                    "DELETE FROM customer WHERE ID = ?",
                    ps -> ps.setString(1, id)
                );
                
                if (deleted != 1) {
                    throw new IllegalArgumentException("Id could not been deleted");
                }
                return true;
            } catch (Error error) {
                return false;
            }
        
        
       
    }

    /**
     * Updates the details of an existing customer in the database.
     * This method takes customer data from a DTO, applies changes in the database,
     * and returns the updated customer.
     * If the update is successful, the updated customer is retrieved and returned.
     *
     * @param jsonData the DTO containing updated customer data
     * @return the updated Customer object or null if the update fails
     */
    @Override
    public Customer updateCustomer(CustomerDTO jsonData) {

        if (!jsonData.getPassword().startsWith("$2a$")) {
            jsonData.setPassword(encoder.hashPassword(jsonData.getPassword()));
        }

        Long[] imageOid = { null };

        if (jsonData.getProfileBase64() != null && !jsonData.getProfileBase64().isEmpty()) {
            try {
                byte[] imageBytes = Base64.getDecoder().decode(jsonData.getProfileBase64());
                imageOid[0] = pictureService.saveImageAsLargeObject(imageBytes);
            } catch (Exception e) {
                e.getStackTrace();
            }
        }

        int result = jdbcTemplate.update(
                "UPDATE CUSTOMER SET name = ?, password = ?, email = ?, role = ?, profile_picture_blob = ? WHERE ID = ?",
                ps -> {
                    ps.setString(1, jsonData.getName());
                    ps.setString(2, (jsonData.getPassword()));
                    ps.setString(3, jsonData.getEmail());
                    ps.setString(4, jsonData.getRole());
                    ps.setLong(5, imageOid[0]);
                    ps.setString(6, jsonData.getId());

                });

        // Verifyin if the List is empty
        if (result > 0) {
            return findCustomerbyID(jsonData.getId());
        }

        return null;
    }

    /**
     * Finds a customer by their email address.
     * This method queries the database for a customer with the specified email and
     * returns the Customer object if found.
     *
     * @param email the email address of the customer to find
     * @return the Customer object or null if not found
     */
    public Customer findEmail(String Email) {

        List<Optional<Customer>> results = jdbcTemplate.query(
                "SELECT * FROM customer WHERE email = ?",
                ps -> {
                    ps.setString(1, Email);
                },
                (rs, rowNum) -> createCustomer(rs));

        if (!results.isEmpty() && results.get(0).isPresent()) {
            return results.get(0).get();
        }

        return null;
    }

    /**
     * Retrieves the hashed password of a customer based on their email address.
     * This method performs a database query to fetch the password of the customer
     * with the given email.
     * Returns the hashed password or null if no customer is found.
     *
     * @param email the email address of the customer whose password is to be
     *              retrieved
     * @return the hashed password or null if the customer is not found
     */
    public String getCustomerPasswordByEmail(String Email) {
        List<Optional<Customer>> results = jdbcTemplate.query(
                "SELECT password FROM CUSTOMER WHERE email = ?",
                ps -> {
                    ps.setString(1, Email);
                },
                (rs, rowNum) -> createCustomer(rs));

        if (!results.isEmpty() && results.get(0).isPresent() && results.get(0).get() instanceof Customer) {
            return results.get(0).get().getPassword();
        }

        return null;
    }

    @Override
    public boolean updatePassword(String password, String Id) {
        int result = jdbcTemplate.update(
                "UPDATE CUSTOMER SET password = ? WHERE id = ?",
                ps -> {
                    ps.setString(1, encoder.hashPassword(password));
                    ps.setString(2, Id);
                });

        if (result > 0) {
            return true;
        }

        return false;
    }

    @Override
    public byte[] getProfilePictureByCustomerId(String id) {
        if (id.isEmpty()) {
            throw new IllegalArgumentException("Id not given");
        }

        List<Integer> oids = jdbcTemplate.query(
                "SELECT profile_picture_blob FROM Customer WHERE ID = ?",
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

    @Override
    public boolean verifyEmail(String id) {
       if(id==null || !id.startsWith("C")){
        throw new IllegalArgumentException("Id isnt given or not customer id "+id);
       }
       int result = jdbcTemplate.update(
        "UPDATE CUSTOMER SET confirm = TRUE WHERE id = ?",
        ps -> ps.setString(1, id)
);

        if (result > 0) {
            return true;
        }

        return false;
    }

    @Override
    public boolean updateWorkerRole(String id,String role) {
        int result = jdbcTemplate.update(
            "UPDATE CUSTOMER SET ROLE = ? WHERE ID=?",
            ps-> {
                ps.setString(1, role);
                ps.setString(2, id);
            });
            if(result>0){
                return true;
            }
            else{
                return false;
            }
    }

    @Override
    public boolean updateContractStatusCustomer(String id, String statusOrder) {
       
        if(id.isEmpty() || statusOrder.isEmpty()){
            throw new IllegalArgumentException("id or status is empty");
        }
        int result = jdbcTemplate.update(
            "UPDATE CUSTOMER SET contract_status = ? where id=?",
            ps->{
                ps.setString(1, statusOrder);
                ps.setString(2, id);
            });

            if(result>0){
                return true;
            }
            else{
                return false;
            }
    }

}
