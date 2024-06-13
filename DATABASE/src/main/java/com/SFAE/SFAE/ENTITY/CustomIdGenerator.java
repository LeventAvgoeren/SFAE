package com.SFAE.SFAE.ENTITY;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.SFAE.SFAE.INTERFACE.CustomerRepository;
import com.SFAE.SFAE.INTERFACE.WorkerRepository;

import java.io.Serializable;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author erayzor
 */

public class CustomIdGenerator implements IdentifierGenerator, ApplicationContextAware {
    private static ApplicationContext context;
  private static final Logger logger = LoggerFactory.getLogger(CustomWorkerIdGenerator.class);
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        CustomIdGenerator.context = applicationContext;
    }

  @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
      
        WorkerRepository workerRepository = context.getBean(WorkerRepository.class);
        List<Worker> workers = workerRepository.findAllOrderedById();

        logger.debug("Number of workers found: " + workers.size());

        long count = 1;
        if (!workers.isEmpty()) {
            int lastID = 0;
            for (Worker worker : workers) {
                String id = worker.getId();
                logger.debug("Processing Worker ID: " + id);
                String[] idSplitted = id.split("W");
                int currentID = Integer.parseInt(idSplitted[1]);
                if (currentID - lastID >= 2) {
                    count = lastID + 1;
                    break;
                }
                lastID = currentID;
            }
            if (count == 1) { // Falls keine Lücke gefunden wurde
                count = Integer.parseInt(workers.get(workers.size() - 1).getId().split("W")[1]) + 1;
            }
        }
        logger.debug("Generated Worker ID: W" + count);
        return "W" + count;

    }
}
