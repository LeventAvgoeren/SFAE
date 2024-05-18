package com.SFAE.SFAE.ENDPOINTS;




import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.RatingDTO;
import com.SFAE.SFAE.DTO.WorkerDTO;

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

    @GetMapping("/login")
    ResponseEntity<?> checkLoginStatus(HttpServletRequest request, HttpServletResponse response);

    @PostMapping("/logout")
    ResponseEntity<?>logout(HttpServletResponse response);

    @GetMapping("/all")
    ResponseEntity<?> countAllWorkers();

    @PutMapping("/rating")
    ResponseEntity<Boolean> avgRating(@RequestBody RatingDTO id);
}

