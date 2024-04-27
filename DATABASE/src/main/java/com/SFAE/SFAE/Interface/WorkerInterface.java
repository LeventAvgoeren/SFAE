package com.SFAE.SFAE.INTERFACE;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.SFAE.SFAE.ENTITY.Worker;
/**
 * @author Levent
 */

@RepositoryRestResource
public interface WorkerInterface {

  long countWorker();

  Iterable<Worker> findAllWorker();

  Optional<Worker> findWorkersbyID(long id);

  Optional<Worker> findWorkerbyName(String Name);

  boolean deleteWorkerById(long id);

  boolean updateWorker(Map<String, Object> map);
}
