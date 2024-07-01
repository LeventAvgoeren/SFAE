package com.SFAE.SFAE.ENTITY;

import java.io.Serializable;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.springframework.context.ApplicationContext;
import org.hibernate.id.IdentifierGenerator;
import org.springframework.context.ApplicationContextAware;

import com.SFAE.SFAE.INTERFACE.WorkerRepository;
/**
 
@author erayzor*/
public class CustomWorkerIdGenerator implements IdentifierGenerator, ApplicationContextAware {
    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        CustomWorkerIdGenerator.context = applicationContext;
    }

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        WorkerRepository workerRepository = context.getBean(WorkerRepository.class);
        List<String> cus = workerRepository.findAllOrderedById();

        long count = 1 + workerRepository.count();
        if(workerRepository.count() > 2 ){
        int lastID = 0;
        for (String worker : cus) {
            String id = worker;
            String[] idSplitted = id.split("W");
            if(Integer.valueOf(idSplitted[1]) - lastID >= 2){
               count = lastID + 1;
               break;
            }
            lastID = Integer.valueOf(idSplitted[1]);
        }
        }



        return "W" + count; 
    }
}