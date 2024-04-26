package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;


/**
 * @author erayzor
 */
@Component
public class CustomerImp implements CustomerInterface {


    @Autowired
    private JdbcTemplate jdbcTemplate;

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
    public Optional<Customer> findCustomerbyID(long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findCustomerbyID'");
    }

    @Override
    public Customer findCustomerbyName(String Name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findCustomerbyName'");
    }


    //Creating Customer as an Object from the Database
    private Optional<Customer> createCustomer(ResultSet rs) {
        try {
            long id = rs.getInt("ID");
            String name = rs.getString("NAME");
            String password = rs.getString("PASSWORD");
            String email = rs.getString("EMAIL");
            String role = rs.getString("ROLE");
       
            //
            return dataFactory.createCustomer(id, name, password, email, role);
        //
        } catch(SQLException e) { }
        //
        return Optional.empty();
    }    
}
