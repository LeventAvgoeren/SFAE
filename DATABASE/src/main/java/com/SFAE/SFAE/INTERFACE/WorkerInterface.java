package com.SFAE.SFAE.INTERFACE;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.DTO.WorkerPrefrencesDTO;
import com.SFAE.SFAE.DTO.WorkerProfileDTO;
import com.SFAE.SFAE.DTO.WorkerStatus;
import com.SFAE.SFAE.ENTITY.Worker;

/**
 * Interface for managing Worker entities.
 * 
 * @author Levent
 */
// @RepositoryRestResource
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
  Worker findWorkersbyID(String id);

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
  Boolean deleteWorkerById(String id);

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

  /**
   * Retrieves a Worker by their job type.
   * 
   * This method retrieves a Worker entity from the database based on their job
   * type.
   * 
   * @param jobType The type of job of the Worker to find.
   * @return A Worker entity if found based on the provided job type, otherwise
   *         null.
   */
  Worker findWorkerByJob(String jobType);

  /**
   * Updates the average rating of a Worker based on new ratings provided.
   *
   * This method is intended to update a Worker's average rating when new feedback
   * is received.
   * It recalculates the average based on the existing rating values stored and
   * the new rating provided,
   * ensuring the Worker's profile reflects the most current assessment of their
   * performance.
   *
   * @param rating The new rating to incorporate into the average.
   * @param id     The unique identifier of the Worker whose rating is being
   *               updated.
   * @return True if the average rating was successfully updated, false if the
   *         update fails,
   *         for example if the Worker does not exist or the database operation
   *         fails.
   */
  Boolean avgWorkerRating(Double rating, String id);

  Boolean updatePassword(String password, String Id);
  
  Boolean updateStatusByWorkerId(String workerId,String status);

  Boolean updateOrderStatusByWorkerId(String workerId,String statusOrder);

  byte[] getProfileImageByworkerId(String id);

  WorkerStatus getWorkerStatus(String id);

  Worker updateWorkerProfile(WorkerProfileDTO data);

  Worker updateWorkerPreferences(WorkerPrefrencesDTO data);

}
