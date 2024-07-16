package com.SFAE.SFAE.ENDPOINTS;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.SFAE.SFAE.DTO.NewsDTO;
import com.SFAE.SFAE.ENUM.JobList;

/**
 * REST API endpoints for managing the newsletter operations.
 */
@RequestMapping("/newsLetter")
public interface NewsLetterEp {

    /**
     * Saves the provided email address to the newsletter subscription list.
     * 
     * @param emailCustomer The email address of the customer to be added to the newsletter list.
     * @return ResponseEntity<?> indicating the result of the save operation.
     *         Returns HttpStatus.OK if the email is successfully saved, HttpStatus.BAD_REQUEST if the provided email is invalid.
     */
    @PostMapping("")
    ResponseEntity<?> safeEmailToNewsLetter(@RequestBody String emailCustomer);

    /**
     * Sends emails to customers when a new Worker with a new Job applies.
     * 
     * @param jobType The list of JobList objects representing the types of jobs for which emails are to be sent.
     * @return ResponseEntity<?> indicating the result of the email sending operation.
     *         Returns HttpStatus.OK if the emails are successfully sent, HttpStatus.BAD_REQUEST if the provided job types are invalid.
     */
    @PostMapping("/sendNews")
    ResponseEntity<?> sendEmailToCustomer(@RequestBody List<JobList> jobType);



    /**
     * Sends a custom email to customers based on the provided NewsDTO object.
     * 
     * @param news The NewsDTO object containing the details of the custom email to be sent.
     * @return ResponseEntity<?> indicating the result of the email sending operation.
     *         Returns HttpStatus.OK if the email is successfully sent, HttpStatus.BAD_REQUEST if the provided news data is invalid.
     */
    @PostMapping("/sendOwnNews")
    ResponseEntity<?> sendOwnEmailToCustomer(@RequestBody NewsDTO news);

    /**
     * Retrieves all emails that have been sent as part of the newsletter.
     * 
     * @return ResponseEntity<?> containing the list of all sent emails.
     *         Returns HttpStatus.OK if the emails are successfully retrieved.
     */
    @GetMapping("")
    ResponseEntity<?> getAllEmailsSend();
}
