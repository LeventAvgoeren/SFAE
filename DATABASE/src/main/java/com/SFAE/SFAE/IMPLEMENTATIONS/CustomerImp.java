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
    public Customer findCustomerbyID(long id) {
        List<Optional<Customer>> result = jdbcTemplate.query(
                "SELECT * FROM CUSTOMER WHERE ID = ?",
                ps -> {
                    ps.setInt(1, (int) id);
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

    private Optional<Customer> createCustomer(ResultSet rs) { // For the class
        try {
            long id = rs.getInt("ID");
            String name = rs.getString("NAME");
            String password = rs.getString("PASSWORD");
            String email = rs.getString("EMAIL");
            String role = rs.getString("ROLE");

            return dataFactory.createCustomer(id, name, password, email, role);

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
    public Customer createCustomer(CustomerDTO jsonData) { // For the Endpoint
        try {
            String name = jsonData.getName();
            String password = encoder.hashPassword(jsonData.getPassword());
            String email = jsonData.getEmail();

            if (password.equals(null) || name.equals(null) || email.equals(null)) {
                return null;
            }

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection
                        .prepareStatement("INSERT INTO CUSTOMER (NAME, PASSWORD, EMAIL, ROLE) VALUES (?, ?, ?, ?)");
                ps.setString(1, name);
                ps.setString(2, password);
                ps.setString(3, email);
                ps.setString(4, String.valueOf(Role.CUSTOMER));
                return ps;
            });

            return new Customer(name, password, email);

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
    public Boolean deleteCustomerById(long id) {
        if (id < 0) {
            throw new IllegalArgumentException("Wrong Id" + id);
        }
        try {
            int deleted = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection
                        .prepareStatement("DELETE FROM CUSTOMER WHERE ID = ?;");
                ps.setInt(1, (int) id);
                return ps;
            });
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
        int result = jdbcTemplate.update(
                "UPDATE customer SET name = ?, password = ?, email = ?, role = ? WHERE ID = ?",
                ps -> {
                    ps.setString(1, jsonData.getName());
                    ps.setString(2, encoder.hashPassword(jsonData.getPassword()));
                    ps.setString(3, jsonData.getEmail());
                    ps.setString(4, jsonData.getRole());
                    ps.setLong(5, jsonData.getId());

                });

        // Verifyin if the List is empty
        if (result > 0) {
            return findCustomerbyID(Long.valueOf(jsonData.getId()));
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
                "SELECT password FROM customer WHERE email = ?",
                ps -> {
                    ps.setString(1, Email);
                },
                (rs, rowNum) -> createCustomer(rs));

        if (!results.isEmpty() && results.get(0).isPresent() && results.get(0).get() instanceof Customer) {
            return results.get(0).get().getPassword();
        }

        return null;
    }

}
