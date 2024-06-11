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

   @PutMapping("/passwordreset")
   ResponseEntity<?> requestResetPassword(@RequestBody String email);

   @PutMapping("/updatepassword")
   ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest data);

   @GetMapping("/{id}/image")
   ResponseEntity<?> getWorkerImageAsBase64(@PathVariable("id") String id);

   @PutMapping("/status/{id}")
   ResponseEntity<?> updateWorkerStatus(@PathVariable("id") String id, @RequestBody String status);

   @PutMapping("/statusOrder/{id}")
   ResponseEntity<?> updateWorkerStatusOrder(@PathVariable("id") String id, @RequestBody String orderStatus);
   
   @GetMapping("/statuse/{id}")
   ResponseEntity<?> getWorkerStatuse(@PathVariable("id") String id);

   @PutMapping("/profil")
   ResponseEntity<?> updateWorkerProfil(@RequestBody WorkerProfileDTO data);
   
   @PutMapping("/preferences")
   ResponseEntity<?> updateWorkerPreferences(@RequestBody WorkerPrefrencesDTO data);

   @PutMapping("/verifyEmailWorker/{token}")
   ResponseEntity<?> verifyEmail(@PathVariable("token") String token);

}

