package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.util.Optional;

import javax.net.ssl.SSLEngineResult.Status;

import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Role;
import com.SFAE.SFAE.ENUM.StartusOrder;
import com.SFAE.SFAE.INTERFACE.DataFactoryInterface;

/**
 * Non-public implementation class of DataFactory interface
 * 
 * @author erayzor
 */

@Component
final class DataFactoryImp implements DataFactoryInterface{

    @Override
    public Optional<Customer> createCustomer(long id, String name, String password, String email, String role) {
       try{
        return Optional.of(
            new Customer(id, name, password, email, Role.valueOf(role))
        );
       } catch(IllegalArgumentException iax){

       }

       return Optional.empty();
    }

    @Override
    public Optional<Worker> createWorker(long id, String name, String location, String password, String email,
            String status, Float range, String jobType, String StatusOrder, Float minPayment, Double rating, Boolean verification) {
      try{
        return Optional.of(
            new Worker(id, name,  location, password, Status.valueOf(status),  StartusOrder.valueOf(StatusOrder),  range, JobList.valueOf(jobType), minPayment, rating, verification, email)
        );
      }catch(IllegalArgumentException iax){

      }

      return Optional.empty();
    }
    
}
