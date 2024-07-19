package com.SFAE.SFAE.ENTITY;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.SFAE.SFAE.INTERFACE.CustomerRepository;

import java.io.Serializable;
import java.util.List;

/**
 Custom ID generator for Customer.
@author erayzor*/

public class CustomIdGenerator implements IdentifierGenerator, ApplicationContextAware {
    private static ApplicationContext context;

    @Override
    public void setApplicationContext(@SuppressWarnings("null") ApplicationContext applicationContext) {
        CustomIdGenerator.context = applicationContext;
    }

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        CustomerRepository customerRepository = context.getBean(CustomerRepository.class);

        List<Customer> cus = customerRepository.findAllOrderedById();

        long count = 1 + customerRepository.count();

        int lastID = 0;
        for (Customer customer : cus) {
            String id = customer.getId();
            String[] idSplitted = id.split("C");
            if(Integer.valueOf(idSplitted[1]) - lastID >= 2){
               count = lastID + 1;
               break;
            }
            lastID = Integer.valueOf(idSplitted[1]);
        }
        return "C" + count; 
    }
}