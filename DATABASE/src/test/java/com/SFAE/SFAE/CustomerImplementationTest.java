package com.SFAE.SFAE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class CustomerImplementationTest {

  @Autowired
  CustomerInterface dao;

  @Test
  public void countCustomer() {
    long result = dao.countCustomer();
    assertNotEquals(0, result);
  }

  @Test
  public void findAllCustomer() {
    List<Customer> list = new ArrayList<>();
    long result = dao.countCustomer();
    Iterable<Customer> customers = dao.findAllCustomer();
    for (Customer customer : customers) {
      list.add(customer);
    }
    assertNotNull(customers);
    assertTrue(result == list.size());
    assertTrue(customers instanceof Iterable<Customer>);
  }

  @Test
  public void findCustomerById() {
    Customer result = dao.findCustomerbyID("C1");
    assertNotNull(result);
    assertTrue(result.getId().equals("C1"));
    assertTrue(result instanceof Customer);

  }

  @Test
  public void findCustomerByIdWorngId() {
    Customer result = dao.findCustomerbyID("CC11");
    assertNull(result);
  }

  @Test
  public void findCustomerByName() {
    Customer found = dao.findCustomerbyName("MaxMuster");
    assertNotNull(found);
    assertTrue(found.getName().equals("MaxMuster"));
    assertTrue(found instanceof Customer);

  }

  @Test
  public void findCustomerByNameWrongName() {
    Customer found = dao.findCustomerbyName("WrongName");
    assertNull(found);
  }

  @Test
  public void CreateCustomer() {
    CustomerDTO customerDTO = new CustomerDTO();
    customerDTO.setName("Levent");
    customerDTO.setEmail("Halladadadddcyo@gmail.com");
    customerDTO.setPassword("Levent123!");
    Customer result = dao.createCustomer(customerDTO);
    assertNotNull(customerDTO);
    assertEquals(customerDTO.getName(), result.getName());
  }

  @Test
  public void CreateCustomerWrongData() {
    CustomerDTO customerDTO = new CustomerDTO();
    customerDTO.setEmail("Hallovvx@gmail.com");
    customerDTO.setPassword("Levent123!");
    Customer result = dao.createCustomer(customerDTO);

    assertNull(result);
  }

  @Test
  public void deleteCustomer() {
    Boolean result = dao.deleteCustomerById("C1");
    assertTrue(result);
  }

  @Test
  public void deleteCustomerError() {

    assertThrows(IllegalArgumentException.class, () -> {
      dao.deleteCustomerById("C1000");
    }, "Id could not been deleted");
  }

  @Test
  public void deleteCustomerByidWithOpenContracts() {
      assertThrows(IllegalArgumentException.class, () -> {
          dao.deleteCustomerById("C9");
      }, "You can not delete your account if you have open contracts");
  }

  @Test
  public void deleteCustomerByidWithNotOpen() {
   assertTrue(dao.deleteCustomerById("C2"));
  }
}
