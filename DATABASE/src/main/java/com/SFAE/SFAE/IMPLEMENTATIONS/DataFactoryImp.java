package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.util.Optional;



import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Status;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.INTERFACE.DataFactoryInterface;

/**
 * Non-public implementation class of DataFactory interface
 * 
 * @author erayzor
 */

@Component
final class DataFactoryImp implements DataFactoryInterface{

    @Override
    public Optional<Customer> createCustomer(String id, String name, String password, String email, String role, Boolean confirm,String statusOrder) {
       try{
      Optional<Customer> customer = Optional.of(
            new Customer( id, name, password, email, String.valueOf(role),confirm,StatusOrder.valueOf(statusOrder))
        );

        if(customer.isPresent()){
          return customer;
        }
       } catch(IllegalArgumentException iax){

       }

       return Optional.empty();
    }

    @Override
    public Optional<Worker> createWorker(String id, String name, String location, String password, String email,
            String status, Double range, String[] jobType, String Statusorder, Double minPayment, Double rating, Boolean verification, Double latitude, Double longitude, String slogan,Boolean confirm) {
                
                JobList[] list = new JobList[jobType.length];
                if(jobType.length < 2){
                    for(int i= 0; i < jobType.length; i ++) {
                        list[i] = JobList.valueOf(jobType[i]);
                    }
                } else{
                    list[0] = JobList.valueOf(jobType[0]);
                }
             
        try {
            return Optional.of(
                new Worker(id, name, location, password, email, Status.valueOf(status), StatusOrder.valueOf(Statusorder), range, list, minPayment, rating, verification, latitude, longitude, slogan,confirm)
            );
        } catch (IllegalArgumentException iax) {
        }
    
        return Optional.empty();
    }
    
    }
