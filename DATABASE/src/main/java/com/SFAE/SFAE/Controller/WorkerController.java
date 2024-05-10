package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.LoginResponseWorker;
import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENDPOINTS.WorkerEp;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Security.JWT;
import com.SFAE.SFAE.Service.MailService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Controller for managing Worker entities.
 * 
 * This class handles communication between the frontend and backend, providing
 * endpoints
 * for creating, deleting, updating, and retrieving Worker entities.
 * 
 * @author Levent
 */
@RestController
public class WorkerController implements WorkerEp {

    @Autowired
    private WorkerInterface dao;

    @Autowired
    private JWT jwt;

    @Autowired
    MailService mail;

    /**
     * Endpoint for creating a new Worker.
     * 
     * @param worker The WorkerDTO object containing details of the new Worker.
     * @return ResponseEntity containing the created Worker entity or an error
     *         response.
     */
    @Override
    public ResponseEntity<Worker> createWorker(@RequestBody WorkerDTO worker) {
        if (worker == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        }
        try {
            Worker builded = dao.createWorker(worker);
            if (builded != null) {
                mail.sendSimpleMessage(worker.getEmail(), "Wilkommen bei SFAE", "Worker erstellt");
                return ResponseEntity.status(HttpStatus.CREATED).body(builded);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

    }

    /**
     * Endpoint for deleting a Worker by its ID.
     * 
     * @param id The ID of the Worker to delete.
     * @return ResponseEntity indicating the success or failure of the deletion
     *         operation.
     */
    @Override
    public ResponseEntity<?> deleteWorkerById(long id) {
        if (id < 0) {
            return ResponseEntity.badRequest().body("id can be <0 or is null");
        }
        try {
            boolean result = dao.deleteWorkerById(id);
            if (result) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        } catch (Error error) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Endpoint for retrieving all Workers.
     * 
     * @return ResponseEntity containing an Iterable collection of Worker entities
     *         or an error response.
     */
    @Override
    public ResponseEntity<Iterable<Worker>> findAllWorker() {
        try {
            var worker = dao.findAllWorker();

            return ResponseEntity.status(HttpStatus.OK).body(worker);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint for retrieving a Worker by its ID.
     * 
     * @param id The ID of the Worker to retrieve.
     * @return ResponseEntity containing the retrieved Worker entity or an error
     *         response.
     */
    @Override
    public ResponseEntity<?> findWorkersbyID(long id) {
        if (id < 0) {
            return ResponseEntity.badRequest().body("id can be <0 or is null");
        }
        try {
            Worker found = dao.findWorkersbyID(id);
            if (found != null) {
                return ResponseEntity.status(HttpStatus.OK).body(found);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    /**
     * Endpoint for retrieving a Worker by its name.
     * 
     * @param name The name of the Worker to retrieve.
     * @return ResponseEntity containing the retrieved Worker entity or an error
     *         response.
     */
    @Override
    public ResponseEntity<?> findWorkerByName(String name) {
        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().body("Name is null");
        }
        try {
            Worker found = dao.findWorkerbyName(name);
            if (found != null) {
                return ResponseEntity.status(HttpStatus.OK).body(found);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    /**
     * Endpoint for updating a Worker.
     * 
     * @param jsonData The WorkerDTO object containing updated fields for the
     *                 Worker.
     * @return ResponseEntity indicating the success or failure of the update
     *         operation.
     */
    @Override
    public ResponseEntity<Worker> updateWorker(@RequestBody WorkerDTO jsonData) {
        if (jsonData == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        try {
            dao.updateWorker(jsonData);

        } catch(DataAccessException dax){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Endpoint for logging in a Worker.
     * 
     * @param login The LoginRequest object containing password and email.
     * @return ResponseEntity containing the login response or an error response.
     */
    @Override
    public ResponseEntity<?> loginWorker(@RequestBody LoginRequest login, HttpServletResponse response) {
        if (login.getEmail() == null || login.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            String token = jwt.loginWorkerJWT(login.getEmail(), login.getPassword());
            if (token == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Worker worker = dao.findWorkerbyEmail(login.getEmail());

             Cookie cookie = new Cookie("access_token", token);
                cookie.setHttpOnly(true);
                cookie.setSecure(true); 
                cookie.setPath("/");
                cookie.setMaxAge(300); 
                response.addCookie(cookie);

            return ResponseEntity.ok().body(new LoginResponseWorker(String.valueOf(worker.getId()), token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("access_token", null);
                cookie.setHttpOnly(true);
                cookie.setSecure(true); 
                cookie.setPath("/");
                cookie.setMaxAge(0); 
                response.addCookie(cookie);
        
                return ResponseEntity.notFound().build();
    }

}
