package com.SFAE.SFAE.INTERFACE;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.http.ResponseEntity;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENTITY.Worker;

/**
 * Interface for managing Worker entities.
 * 
 * @author Levent
 */
//@RepositoryRestResource
public interface WorkerInterface {

  /**
   * Counts the total number of Worker entities in the database.
   *
   * @return The total count of Workers.
   */
  long countWorker();

  /**
   * Retrieves all Workers from the database.
   *
   * @return An Iterable collection of Worker entities.
   */
  Iterable<Worker> findAllWorker();

  /**
   * Retrieves a Worker by their unique identifier.
   *
   * @param id The unique ID of the Worker.
   * @return A Worker entity if found, otherwise null.
   */
  Worker findWorkersbyID(long id);

  /**
   * Finds a Worker by their name.
   *
   * @param name The name of the Worker to find.
   * @return A Worker entity if found, otherwise null.
   */
  Worker findWorkerbyName(String name);

  /**
   * Deletes a Worker from the database by their ID.
   *
   * @param id The ID of the Worker to delete.
   * @return True if the deletion was successful, otherwise false.
   */
  Boolean deleteWorkerById(long id);

  /**
   * Updates the details of an existing Worker in the database.
   *
   * @param data The WorkerDTO object containing updated fields for the Worker.
   * @return The updated Worker entity, or null if the update fails.
   */
  Worker updateWorker(WorkerDTO data);

  /**
   * Creates a new Worker in the database based on the provided data.
   *
   * @param rs The WorkerDTO object containing the details of the new Worker.
   * @return The newly created Worker entity.
   */
  Worker createWorker(WorkerDTO rs);

  /**
   * Finds a Worker by their email address.
   *
   * @param email The email address of the Worker.
   * @return A Worker entity if found, otherwise null.
   */
  Worker findWorkerbyEmail(String email);
}