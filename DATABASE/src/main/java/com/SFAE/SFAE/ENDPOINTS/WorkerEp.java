package com.SFAE.SFAE.ENDPOINTS;




import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.PasswordResetRequest;
import com.SFAE.SFAE.DTO.RatingDTO;
import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.DTO.WorkerPrefrencesDTO;
import com.SFAE.SFAE.DTO.WorkerProfileDTO;
import com.SFAE.SFAE.ENTITY.Worker;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


 /**
 * Worker Endpoint Interface.
 * 
 * This interface defines RESTful endpoints for managing Worker entities.
 * 
 * @author  Levent
 */
 @RequestMapping("/worker")
public interface WorkerEp {
  

     /**
     * Creates a new Worker entity from the provided DTO.
     * 
     * @param worker The WorkerDTO containing the details of the new Worker.
     * @return ResponseEntity containing the created Worker entity.
     */
    @PostMapping("")
    ResponseEntity<Worker> createWorker(@RequestBody WorkerDTO worker);


     /**
     * Deletes a Worker entity based on the provided ID.
     * 
     * @param id The ID of the Worker to be deleted.
     * @return ResponseEntity with appropriate HTTP status code.
     */
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteWorkerById(@PathVariable("id") String id);


     /**
     * Retrieves all Worker entities.
     * 
     * @return ResponseEntity containing an Iterable of all Worker entities.
     */
    @GetMapping("")
    ResponseEntity<Iterable<Worker>> findAllWorker();


    /**
     * Retrieves a Worker entity based on the provided ID.
     * 
     * @param id The ID of the Worker.
     * @return ResponseEntity containing the requested Worker, if found.
     */
    @GetMapping("/{id}")
    ResponseEntity<?> findWorkersbyID(@PathVariable("id") String id);



     /**
     * Retrieves a Worker entity based on the provided name.
     * 
     * @param name The name of the Worker.
     * @return ResponseEntity containing the requested Worker, if found.
     */
    @GetMapping("/usr/{name}")
    ResponseEntity<?>findWorkerByName(@PathVariable String name);

    /**
     * Updates a Worker entity based on the provided WorkerDTO.
     * 
     * @param jsonData The WorkerDTO containing the updated data.
     * @return ResponseEntity containing the updated Worker entity.
     */
    @PutMapping("")
    ResponseEntity<Worker> updateWorker(@RequestBody WorkerDTO jsonData);

     /**
     * Authenticates a Worker based on login credentials.
     * 
     * @param login The LoginRequest containing the Worker's login details.
     * @return ResponseEntity indicating the result of the authentication process.
     */
    @PostMapping("/login")
    ResponseEntity<?> loginWorker(@RequestBody LoginRequest login,HttpServletResponse response);


    /**
 * Retrieves the current login status of a Worker.
 * 
 * This method checks whether a Worker is currently logged in by examining session or token-based authentication information.
 * 
 * @param request The HttpServletRequest which may contain the session or authentication token.
 * @return ResponseEntity indicating the login status (true if logged in, false otherwise).
 */
    @GetMapping("/login")
    ResponseEntity<?> checkLoginStatus(HttpServletRequest request, HttpServletResponse response);



/**
 * Logs out a Worker by clearing the session or authentication tokens.
 * 
 * This method is responsible for securely logging out a Worker, ensuring that any session information
 * or authentication tokens are invalidated.
 * 
 * @param response The HttpServletResponse where the logout procedure is applied.
 * @return ResponseEntity indicating the result of the logout operation (typically HTTP 204 No Content on success).
 */    
@PostMapping("/logout")
    ResponseEntity<?>logout(HttpServletResponse response);

/**
 * Counts all registered Workers in the system.
 * 
 * This method retrieves the total number of Workers registered, providing a count that can be used for
 * administrative or reporting purposes.
 * 
 * @return ResponseEntity containing the total number of Workers as a Long or an error response if unable to perform the operation.
 */
    @GetMapping("/all")
    ResponseEntity<?> countAllWorkers();


/**
 * Updates the average rating of a Worker.
 * 
 * This method calculates and updates the average rating of a Worker based on new rating input. It is typically
 * used to update the Worker's profile with new feedback from clients or peers.
 * 
 * @param ratingDto The RatingDTO containing the new rating and Worker ID.
 * @return ResponseEntity indicating the success of the rating update (true on success, false otherwise).
 */
   @PutMapping("/rating")
   ResponseEntity<Boolean> avgRating(@RequestBody RatingDTO id);

/**
 * Requests a password reset for the worker associated with the provided email.
 * 
 * @param email The email address of the worker requesting a password reset.
 * @return ResponseEntity<?> indicating the result of the password reset request.
 *         Returns HttpStatus.OK if the request is successful, HttpStatus.NOT_FOUND if no worker is associated with the provided email.
 */ 
   @PutMapping("/passwordreset")
   ResponseEntity<?> requestResetPassword(@RequestBody String email);


/**
 * Resets the password for the worker based on the provided password reset request data.
 * 
 * @param data The PasswordResetRequest object containing the necessary data to reset the password.
 * @return ResponseEntity<?> indicating the result of the password reset operation.
 *         Returns HttpStatus.OK if the password is successfully reset, HttpStatus.BAD_REQUEST if the provided data is invalid.
 */
   @PutMapping("/updatepassword")
   ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest data);

/**
 * Retrieves the worker's image as a Base64 encoded string based on the provided worker ID.
 * 
 * @param id The ID of the worker whose image is to be retrieved.
 * @return ResponseEntity<?> containing the worker's image in Base64 format.
 *         Returns HttpStatus.OK if the image is successfully retrieved, HttpStatus.NOT_FOUND if the worker does not exist or has no image.
 */
   @GetMapping("/{id}/image")
   ResponseEntity<?> getWorkerImageAsBase64(@PathVariable("id") String id);

/**
 * Updates the status of the worker based on the provided worker ID and status.
 * 
 * @param id The ID of the worker to update the status for.
 * @param status The new status to be set for the worker.
 * @return ResponseEntity<?> indicating the result of the status update operation.
 *         Returns HttpStatus.OK if the status is successfully updated, HttpStatus.BAD_REQUEST if the provided status is invalid, HttpStatus.NOT_FOUND if the worker does not exist.
 */
   @PutMapping("/status/{id}")
   ResponseEntity<?> updateWorkerStatus(@PathVariable("id") String id, @RequestBody String status);

/**
 * Updates the status of the worker's order based on the provided worker ID and order status.
 * 
 * @param id The ID of the worker to update the order status for.
 * @param orderStatus The new order status to be set for the worker.
 * @return ResponseEntity<?> indicating the result of the order status update operation.
 *         Returns HttpStatus.OK if the order status is successfully updated, HttpStatus.BAD_REQUEST if the provided order status is invalid, HttpStatus.NOT_FOUND if the worker does not exist.
 */
   @PutMapping("/statusOrder/{id}")
   ResponseEntity<?> updateWorkerStatusOrder(@PathVariable("id") String id, @RequestBody String orderStatus);
   
 /**
 * Retrieves the status of the worker based on the provided worker ID.
 * 
 * @param id The ID of the worker whose status is to be retrieved.
 * @return ResponseEntity<?> containing the worker's status.
 *         Returns HttpStatus.OK if the status is successfully retrieved, HttpStatus.NOT_FOUND if the worker does not exist.
 */  
   @GetMapping("/statuse/{id}")
   ResponseEntity<?> getWorkerStatuse(@PathVariable("id") String id);

/**
 * Updates the profile of the worker based on the provided worker profile data.
 * 
 * @param data The WorkerProfileDTO object containing the necessary data to update the worker's profile.
 * @return ResponseEntity<?> indicating the result of the profile update operation.
 *         Returns HttpStatus.OK if the profile is successfully updated, HttpStatus.BAD_REQUEST if the provided data is invalid.
 */ 
   @PutMapping("/profil")
   ResponseEntity<?> updateWorkerProfil(@RequestBody WorkerProfileDTO data);
   
 /**
 * Updates the preferences of the worker based on the provided worker preferences data.
 * 
 * @param data The WorkerPrefrencesDTO object containing the necessary data to update the worker's preferences.
 * @return ResponseEntity<?> indicating the result of the preferences update operation.
 *         Returns HttpStatus.OK if the preferences are successfully updated, HttpStatus.BAD_REQUEST if the provided data is invalid.
 */  
   @PutMapping("/preferences")
   ResponseEntity<?> updateWorkerPreferences(@RequestBody WorkerPrefrencesDTO data);


/**
 * Verifies the worker's email based on the provided token.
 * 
 * @param token The token used to verify the worker's email.
 * @return ResponseEntity<?> indicating the result of the email verification.
 *         Returns HttpStatus.OK if the email is successfully verified, HttpStatus.FORBIDDEN if the token is invalid or expired.
 */
   @PutMapping("/verifyEmailWorker/{token}")
   ResponseEntity<?> verifyEmail(@PathVariable("token") String token);

}

