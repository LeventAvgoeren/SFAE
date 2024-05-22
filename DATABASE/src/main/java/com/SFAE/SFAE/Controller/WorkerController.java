package com.SFAE.SFAE.Controller;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.LoginResponseWorker;
import com.SFAE.SFAE.DTO.PasswordResetRequest;
import com.SFAE.SFAE.DTO.RatingDTO;
import com.SFAE.SFAE.DTO.Token;
import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENDPOINTS.WorkerEp;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.TokenType;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Security.JWT;
import com.SFAE.SFAE.Service.MailService;
import com.SFAE.SFAE.Service.TokenMailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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
    private MailService mail;

    @Autowired
    private TokenMailService mailService;

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
                // mail.sendSimpleMessage(worker.getEmail(), "Wilkommen bei SFAE", "Worker
                // erstellt");
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
    public ResponseEntity<?> deleteWorkerById(String id) {
        if (!id.startsWith("W")) {
            return ResponseEntity.badRequest().body("idis not for Worker");
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
    public ResponseEntity<?> findWorkersbyID(String id) {
        if (!id.startsWith("W")) {
            return ResponseEntity.badRequest().body("Id is not for Worker");
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
            Worker found = dao.updateWorker(jsonData);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(found);
        } catch(DataAccessException dax){
          
            System.out.println(dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

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

    /**
     * Logs out a Worker by clearing the JWT token cookie.
     * 
     * @param response The HttpServletResponse to which the cookie is attached.
     * @return ResponseEntity with HTTP status 204 (No Content) indicating that the
     *         Worker has been successfully logged out.
     */
    @Override
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("access_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.status(204).build();
    }

    /**
     * Checks the login status of a Worker by validating the JWT token stored in a
     * cookie.
     * 
     * @param request  The HttpServletRequest from which to retrieve cookies.
     * @param response The HttpServletResponse for sending back any necessary
     *                 responses.
     * @return ResponseEntity containing the login data as JSON or a false boolean
     *         value if no valid token is found.
     */

    @Override
    public ResponseEntity<?> checkLoginStatus(HttpServletRequest request, HttpServletResponse response) {
        String jwtString = request.getCookies() != null ? Arrays.stream(request.getCookies())
                .filter(c -> "access_token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null) : null;

        if (jwtString == null) {
            return ResponseEntity.status(400).body(false);
        }

        Claims loginData = jwt.decodeToken(jwtString);

        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writeValueAsString(loginData);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body(false);
        }
    }

    /**
     * Counts all workers registered in the system.
     * 
     * @return ResponseEntity containing the count of all Workers or an error if the
     *         operation fails.
     */
    @Override
    public ResponseEntity<?> countAllWorkers() {

        try {
            long counter = dao.countWorker();
            return ResponseEntity.status(HttpStatus.OK).body(counter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Calculates and updates the average rating for a Worker based on a new rating.
     * 
     * @param rating The RatingDTO object containing the new rating and the ID of
     *               the Worker to be rated.
     * @return ResponseEntity with HTTP status OK if the average rating was
     *         successfully updated, or throws an IllegalArgumentException if an
     *         error occurs.
     */
    @Override
    public ResponseEntity<Boolean> avgRating(RatingDTO rating) {
        try {
            dao.avgWorkerRating(rating.getRating(), rating.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            throw new IllegalArgumentException("Fehler:" + e);
        }
    }

    @Override
    public ResponseEntity<?> requestResetPassword(String email) {
          if(email == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        email = email.replace("\"", "");
        Worker foundCustomer = dao.findWorkerbyEmail(email);
        if(foundCustomer != null){
            String token = mailService.createToken(1, foundCustomer.getId(), TokenType.PASSWORDRESET);
        
            String link = "https://localhost:3000/newPassword?token=" + token; 

            try {
                mail.sendHtmlMessage(foundCustomer.getEmail(), "Email zurücksetzen",
                    "<html><body>" +
                        "Hallo " + foundCustomer.getName() + ",<br>" +
                        "Sie haben beantragt ihr Passwort zu ändern.<br>"+
                        "Unter diesem <a href='" + link + "'>Link</a> können Sie ihr Passwort ändern. Der Link läuft nach 5 Minuten ab.<br>" +
                        "Bei Fragen oder für weitere Informationen stehen wir Ihnen gerne zur Verfügung.<br><br>" +
                        "Mit freundlichen Grüßen,<br>" +
                        "Ihr SFAE-Team" +
                        "</body></html>");  
            } catch (MessagingException e) {
                e.printStackTrace();
            }

            return ResponseEntity.status(HttpStatus.OK).body(token);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Override
    public ResponseEntity<?> resetPassword(PasswordResetRequest data) { //The frontend doesnt use this route. It uses instead the customer route.
         if(data == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Token token = mailService.validateToken(data.getToken());
        if(token == null){
            return ResponseEntity.status(HttpStatus.GONE).build();
        }

        if(dao.updatePassword(data.getPassword(), token.getReceiver())){
            return ResponseEntity.status(HttpStatus.OK).build();
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

   

}
