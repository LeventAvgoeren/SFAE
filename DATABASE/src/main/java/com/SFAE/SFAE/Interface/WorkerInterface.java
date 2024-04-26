package com.SFAE.SFAE.INTERFACE;

import java.util.Optional;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.SFAE.SFAE.ENTITY.Worker;

@RepositoryRestResource
public interface WorkerInterface {

  long countWorker();

  Iterable<Worker> findAllWorker();

  Optional<Worker> findWorkersbyID(long id);

  Optional<Worker> findWorkerbyName(String Name);
}
