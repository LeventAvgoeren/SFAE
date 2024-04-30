package com.SFAE.SFAE.INTERFACE;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.http.ResponseEntity;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENTITY.Worker;
/**
 * @author Levent
 */

@RepositoryRestResource
public interface WorkerInterface {

  long countWorker();

  Iterable<Worker> findAllWorker();

  Worker findWorkersbyID(long id);

  Worker findWorkerbyName(String Name);

  Boolean deleteWorkerById(long id);

  Worker updateWorker(WorkerDTO data);

  Worker createWorker (WorkerDTO rs);

  Worker findWorkerbyEmail(String email);
}
