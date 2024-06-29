package com.SFAE.SFAE.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.LoginResponseCustomer;
import com.SFAE.SFAE.DTO.PasswordResetRequest;
import com.SFAE.SFAE.DTO.RoleDTO;
import com.SFAE.SFAE.DTO.Token;
import com.SFAE.SFAE.ENDPOINTS.CustomerEP;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.Role;
import com.SFAE.SFAE.ENUM.TokenType;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.IMPLEMENTATIONS.WorkerImpl;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.INTERFACE.TokenRepository;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Security.JWT;
import com.SFAE.SFAE.Service.Authentication;
import com.SFAE.SFAE.Service.MailService;
import com.SFAE.SFAE.Service.TokenMailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;
import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.BindingResult;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controller for handling customer-related operations.
 * This class provides endpoints for managing customers including creation,
 * deletion, updating,
 * and retrieving customer details by various identifiers.
 *
 * @author erayzor
 */

@RestController
class CustomerController implements CustomerEP {

    @Autowired
    private CustomerInterface dao;

    @Autowired
    private Authentication auth;

    @Autowired
    private CustomerImp cus;

    @Autowired
    private MailService mail;

    @Autowired
    private JWT jwt;

    @Autowired
    private WorkerInterface wao;

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private TokenMailService mailService;


    @Autowired
    private WorkerImpl wor;

    /**
     * Finds a customer by their ID.
     * If the customer is found, returns a ResponseEntity containing the customer
     * data.
     * If the customer ID is negative, or the customer is not found, appropriate
     * HTTP status is returned.
     *
     * @param id the ID of the customer to find
     * @return ResponseEntity containing the customer or an error message
     */
    @Override
    public ResponseEntity<Customer> findCustomerById(String id) {
        if (!id.startsWith("C")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            Customer found = dao.findCustomerbyID(id);
            if (found != null) {
                return ResponseEntity.status(HttpStatus.OK).body(found);
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Async
    public void sendWelcomeEmail(CustomerDTO customerData) {
        try {
            mail.sendHtmlMessage(customerData.getEmail(),
                    "Willkommen bei SFAE - Ihre Lösung für schnelle und kompetente Hilfe",
                    "<html><body>" +
                            "<p>Lieber " + customerData.getName() + ",</p>" +
                            "<p>herzlich willkommen bei SFAE! Wir freuen uns, dass Sie sich für unseren Service entschieden haben.</p>"
                            +
                            "<p>SFAE ist Ihre zuverlässige Dienstleistungsplattform, auf der Sie schnell und einfach Hilfe für verschiedene Anliegen finden können. Unser Ziel ist es, Ihnen den besten Facharbeiter in Ihrer Nähe mit der passenden Qualifikation zur Verfügung zu stellen.</p>"
                            +
                            "<p>Egal ob Sie einen Handwerker, IT-Spezialisten, Reinigungskraft oder einen anderen Fachmann benötigen – bei SFAE finden Sie garantiert den richtigen Ansprechpartner. Unser benutzerfreundliches System stellt sicher, dass Sie innerhalb kürzester Zeit den passenden Experten für Ihre Bedürfnisse finden.</p>"
                            +
                            "<p>Wir sind überzeugt, dass Sie mit unserem Service zufrieden sein werden und freuen uns darauf, Ihnen bei Ihren Anliegen behilflich zu sein.</p>"
                            +
                            "<p>Bei Fragen oder Anregungen stehen wir Ihnen jederzeit zur Verfügung.</p>" +
                            "<p>Mit freundlichen Grüßen,</p>" +
                            "<p>Ihr SFAE-Team</p>" +
                            "</body></html>");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    /**
     * Creates a new customer from the provided CustomerDTO object.
     * Validates the customer data before saving. If the validation fails, or the
     * customer data is incomplete,
     * a BAD_REQUEST is returned. On successful creation, sends a welcome email and
     * returns the created customer data.
     *
     * @param customerData  the customer data to create
     * @param bindingResult contains errors if validation fails
     * @return ResponseEntity indicating success or failure of creation
     */
    @Override
    public ResponseEntity<?> createCustomer(@Valid @RequestBody CustomerDTO customerData, BindingResult bindingResult) {

        //Abfrage ob alles vorhanden ist 
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .collect(Collectors.toList()));
        }



        // 8 Zeichen, 1 Sonderzeichen, 1 Großbuchtsaben und eine Zahl
        String passwordTest = customerData.getPassword();
        String regex = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*\\d).{8,}$";
        Pattern pattern = Pattern.compile(regex);


        //guckem ob passwort passt von der sicherheit
        if (!pattern.matcher(passwordTest).matches()) {
            return ResponseEntity.status(400).build();
        }

        
        try {
            //erstellen 
            Customer customer = dao.createCustomer(customerData);
            if (customer != null) {
            //token erstellen
            String token = mailService.createToken(0, customer.getId(), TokenType.VERIFYCUSTOMER);

            String link = "https://localhost:3000/verifyEmail?token=" + token;
      

            //Email senden zum verifizieren
            mail.sendHtmlMessage(customerData.getEmail(), "Bestätigung Ihrer E-Mail-Adresse",
                            "<html><body>" +
                                    "Hallo " + customerData.getName() + ",<br>" +
                                    "Vielen Dank für die Registrierung bei unserem Service.<br>" +
                                    "Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden <a href='" + link
                                    + "'><button style='background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;'>Bestätigungs-Button</button></a> klicken. Dieser Link ist nur für kurze Zeit gültig.<br>" +
                                    "Wenn Sie die Registrierung nicht angefordert haben, können Sie diese E-Mail einfach ignorieren.<br><br>"
                                    +
                                    "Bei Fragen oder Problemen wenden Sie sich bitte an unseren Support.<br><br>"
                                    +
                                    "Mit freundlichen Grüßen,<br>" +
                                    "Ihr Unternehmen-Team" +
                                    "</body></html>");

            sendWelcomeEmail(customerData);
            return ResponseEntity.status(HttpStatus.CREATED).body(customer);
            }
            else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

            }

        } catch (DataAccessException | MessagingException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    /**
     * Deletes a customer by their ID.
     * If the deletion is successful, returns an OK status.
     * If the customer ID is negative or the customer cannot be found, returns the
     * appropriate error status.
     *
     * @param id the ID of the customer to delete
     * @return ResponseEntity indicating success or failure of deletion
     */
    @Override
    public ResponseEntity<?> deleteCustomerById(String id) {
        if (!id.startsWith("C")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            boolean Answer = dao.deleteCustomerById(id);

            if (Answer) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Retrieves all customers from the database.
     * This method returns an Iterable of all Customer entities. If the database
     * access is successful,
     * it returns the customers with an HTTP status of OK. In case of any data
     * access issues,
     * logs the error and returns an INTERNAL_SERVER_ERROR status.
     *
     * @return ResponseEntity containing either an Iterable of Customer objects or
     *         an error status.
     * @throws DataAccessException if there is a problem accessing the database
     */
    @Override
    public ResponseEntity<Iterable<?>> findAllCustomers() {
        try {
            Iterable<Customer> customer = dao.findAllCustomer();
            System.out.println(customer);
            return ResponseEntity.status(HttpStatus.OK).body(customer);
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Finds a customer by their name.
     * Returns a ResponseEntity with customer details if found.
     * If the name is blank or the customer is not found, returns appropriate error
     * status.
     *
     * @param name the name of the customer to find
     * @return ResponseEntity containing the customer or an error message
     */
    @Override
    public ResponseEntity<Customer> findCustomerByName(String name) {
        if (name.isBlank() || name.isEmpty() || name == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Customer name is empty. ", HttpStatus.BAD_REQUEST.value()));
        }

        try {
            Customer customer = dao.findCustomerbyName(name);
            if (customer != null) {
                return ResponseEntity.status(HttpStatus.OK).body(customer);
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Updates a customer's data.
     * Validates the provided data before updating. If the validation fails or
     * required fields are missing,
     * returns a BAD_REQUEST. On successful update, returns the updated customer
     * data.
     *
     * @param jsonData      the customer data to update
     * @param bindingResult contains errors if validation fails
     * @return ResponseEntity indicating success or failure of the update
     */
    @Override
    public ResponseEntity<?> updateCustomer(@Valid @RequestBody CustomerDTO jsonData, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .collect(Collectors.toList()));
        }

        String passwordTest = jsonData.getPassword();
        String regex = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*\\d).{8,}$";
        Pattern pattern = Pattern.compile(regex);

        if (!pattern.matcher(passwordTest).matches()) {
            return ResponseEntity.status(400).build();
        }

        if (jsonData.getId() == null || jsonData.hasNull()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            Role.valueOf(jsonData.getRole());
            Customer customer = dao.updateCustomer(jsonData);
            if (customer != null) {
                return ResponseEntity.status(HttpStatus.OK).body(customer);
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Handles customer login requests.
     * Validates the login request data. If the validation fails, returns a
     * BAD_REQUEST with details of the errors.
     * On successful login, returns a token and customer details. If authentication
     * fails, returns NOT_FOUND.
     *
     * @param loginRequest  the login request details
     * @param bindingResult contains errors if validation fails
     * @return ResponseEntity containing the login token and customer data or an
     *         error message
     */
    @Override
    public ResponseEntity<?> LoginCustomer(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult,
            HttpServletResponse response) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .collect(Collectors.toList()));
        }

        try {
            String token = auth.loginCustomer(loginRequest.getEmail(), loginRequest.getPassword(), response);
            if(token=="a"){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authentication failed");
            }
            
            if (token != null) {
                Customer customer = cus.findEmail(loginRequest.getEmail());

                Cookie cookie = new Cookie("access_token", token);
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/");
                response.addCookie(cookie);

                return ResponseEntity.status(HttpStatus.OK)
                        .body(new LoginResponseCustomer(String.valueOf(customer.getId()),
                                customer.getRole().toString(), token));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Authentication failed");
            }
        } catch (DataAccessException dax) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database access error");
        }
    }

    /**
     * Logs out the user by removing the access token cookie from the response.
     * 
     * @param response The HTTP servlet response.
     * @return A ResponseEntity with status code 204 (No Content) indicating
     *         successful logout.
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
     * Checks the login status of the user based on the presence of an access token
     * cookie.
     * 
     * @param request  The HTTP servlet request.
     * @param response The HTTP servlet response.
     * @return A ResponseEntity with the login status as JSON if the access token is
     *         found, otherwise returns a ResponseEntity with status code 400 (Bad
     *         Request).
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
     * Counts all customers registered in the system.
     * 
     * @return ResponseEntity containing the count of all Customer or an error if
     *         the
     *         operation fails.
     */
    @Override
    public ResponseEntity<?> countAllCustomers() {
        try {
            long counter = dao.countCustomer();
            return ResponseEntity.status(HttpStatus.OK).body(counter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @Override
    public ResponseEntity<?> requestResetPassword(String email) {
        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        email = email.replace("\"", "");
        Customer foundCustomer = cus.findEmail(email);
        if (foundCustomer != null) {
            String token = mailService.createToken(0, foundCustomer.getId(), TokenType.PASSWORDRESET);

            String link = "https://localhost:3000/newPassword?token=" + token;

            try {
                mail.sendHtmlMessage(foundCustomer.getEmail(), "Passwort zurücksetzen",
                        "<html><body>" +
                                "Hallo " + foundCustomer.getName() + ",<br>" +
                                "Sie haben beantragt ihr Passwort zu ändern.<br>" +
                                "Unter diesem <a href='" + link
                                + "'>Link</a> können Sie ihr Passwort ändern. Der Link läuft nach 5 Minuten ab.<br>" +
                                "Bei Fragen oder für weitere Informationen stehen wir Ihnen gerne zur Verfügung.<br><br>"
                                +
                                "Mit freundlichen Grüßen,<br>" +
                                "Ihr SFAE-Team" +
                                "</body></html>");
            } catch (MessagingException e) {
                e.printStackTrace();
            }

            return ResponseEntity.status(HttpStatus.OK).body(token);
        }

        Worker worker = wor.findWorkerbyEmail(email);
        System.out.println(email);
        if (worker != null) {
            String token = mailService.createToken(0, worker.getId(), TokenType.PASSWORDRESET);

            String link = "https://localhost:3000/newPassword?token=" + token;

            try {
                mail.sendHtmlMessage(worker.getEmail(), "Passwort zurücksetzen",
                        "<html><body>" +
                                "Hallo " + worker.getName() + ",<br>" +
                                "Sie haben beantragt ihr Passwort zu ändern.<br>" +
                                "Unter diesem <a href='" + link
                                + "'>Link</a> können Sie ihr Passwort ändern. Der Link läuft nach 5 Minuten ab.<br>" +
                                "Bei Fragen oder für weitere Informationen stehen wir Ihnen gerne zur Verfügung.<br><br>"
                                +
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
    public ResponseEntity<?> resetPassword(PasswordResetRequest data) {
        if (data == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String passwordTest = data.getPassword();
        String regex = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*\\d).{8,}$";
        Pattern pattern = Pattern.compile(regex);

        if (!pattern.matcher(passwordTest).matches()) {
            return ResponseEntity.status(400).build();
        }
        Token token = mailService.validateToken(data.getToken());
        if (token == null) {
            return ResponseEntity.status(HttpStatus.GONE).build();
        }
        System.out.println(token);
        if (token.getReceiver().startsWith("C")) {
            if (cus.updatePassword(data.getPassword(), token.getReceiver())) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        }

        if (token.getReceiver().startsWith("W")) {
            if (wao.updatePassword(data.getPassword(), token.getReceiver())) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @Override
    public ResponseEntity<?> getCustomerImageAsBase64(String id) {
        if (id.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            byte[] imageBytes = dao.getProfilePictureByCustomerId(id);

            if (imageBytes != null && imageBytes.length > 0) {
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                return ResponseEntity.status(HttpStatus.OK).body(base64Image);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    @Override
    public ResponseEntity<?> verifyEmail(String token) {
        System.out.println("Bin AUCH DABEI --------------");
        System.out.println(token);
       //Token data = tokenRepository.findByToken(token);
       Token data = mailService.validateToken(token);

        System.out.println(data+ "  HALLO");
        if (token == null) {
            System.out.println("HAAAAALLLLLo");
            throw new IllegalArgumentException("No Token given");
        }
        try {
            boolean result = dao.verifyEmail(data.getReceiver());
            System.out.println("result------"+result);
            if (result) {
                return ResponseEntity.status(HttpStatus.OK).build();

            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

    @Override
    public ResponseEntity<?> updateWorkerRole(RoleDTO data) {
        if (!data.getRole().equals("ADMIN") && !data.getRole().equals("CUSTOMER")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Role is not ADMIN or CUSTOMER");
        }
        try {
            Boolean result=dao.updateWorkerRole(data.getId(), data.getRole());

            if(result){
                return ResponseEntity.status(HttpStatus.OK).body(result);
            }
            else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

}
