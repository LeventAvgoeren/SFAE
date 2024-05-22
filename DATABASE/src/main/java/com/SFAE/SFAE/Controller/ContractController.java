package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.DTO.Token;
import com.SFAE.SFAE.ENDPOINTS.ContractEP;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Payment;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.ENUM.TokenType;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.IMPLEMENTATIONS.SFAEAlgorithm;
import com.SFAE.SFAE.INTERFACE.ContractInterface;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Service.MailService;
import com.SFAE.SFAE.Service.TokenMailService;

import jakarta.mail.MessagingException;

import org.slf4j.Logger;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import javax.validation.Valid;

@RestController
public class ContractController implements ContractEP {
  private Logger logger;

  @Autowired
  private ContractInterface dao;

  @Autowired
  private WorkerInterface work;

  @Autowired
  private CustomerImp custo;

  @Autowired
  private MailService mail;

  @Autowired
  private SFAEAlgorithm sfae;

  @Autowired
  private TokenMailService tokenService;


  @Override
  public ResponseEntity<?> createContract(@Valid ContractDTO contract, BindingResult bindingResult) {

    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
          .map(fieldError -> fieldError.getDefaultMessage())
          .collect(Collectors.toList()));
    }

    if (contract == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    try {

      Map<Worker, Double> best = sfae.getBestWorkersforTheJob(contract);

      List<Map.Entry<Worker, Double>> entries = new ArrayList<>(best.entrySet());
      entries.sort(Map.Entry.comparingByValue());

      Iterator<Entry<Worker, Double>> iterator = entries.iterator();
      Entry<Worker, Double> lastEntry = null;

      while (iterator.hasNext()) {
        lastEntry = iterator.next();
      }

      Contract created = dao.createContract(contract);
      if (created != null) {
        System.out.println(lastEntry.getKey().getId());
        Worker found = work.findWorkersbyID(String.valueOf(lastEntry.getKey().getId()));
        Customer foundCustomer = custo.findCustomerbyID(String.valueOf(contract.getCustomerId()));

        String token= tokenService.createToken(created.getId(), lastEntry.getKey().getId(), TokenType.CONTRACT);
        String link = "https://localhost:3000/contract?token=" + token; 

        mail.sendHtmlMessage(found.getEmail(), "Jobangebot erhalten",
            "<html><body>" +
                "wir freuen uns, Ihnen mitteilen zu können, dass wir ein neues Jobangebot erhalten haben. Unten finden Sie die Details zum Auftrag:<br><br>"
                +
                "<strong>Auftraggeber:</strong> " + foundCustomer.getName() + "<br>" +
                "<strong>Jobtyp:</strong> " + contract.getJobType() + "<br>" +
                "<strong>Beschreibung:</strong> " + contract.getDescription() + "<br>" +
                "<strong>Adresse:</strong> " + contract.getAdress() + "<br>" +
                "<strong>Zahlung:</strong> " + contract.getPayment() + "<br>" +
                "<strong>Zahlung:</strong> " + contract.getMaxPayment() + "€<br>" +
                "<strong>Entfernung:</strong> " + contract.getRange() + " km<br><br>" +
                "Unter diesem <a href='" + link + "'>Link</a> können Sie die Anfrage bestätigen. Sie haben 5 Minuten Zeit die Anfrage anzunehmen.<br>" +
                "Bei Fragen oder für weitere Informationen stehen wir Ihnen gerne zur Verfügung.<br><br>" +
                "Mit freundlichen Grüßen,<br>" +
                "Ihr SFAE-Team" +
                "</body></html>");

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
      }

    } catch (DataAccessException dax) {
      logger.error("Database access error: " + dax.getMessage(), dax);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } catch (MessagingException e) {
      e.printStackTrace();
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
  }

  /**
 * Deletes a contract by its unique identifier.
 *
 * @param id the unique identifier of the contract to be deleted.
 * @return ResponseEntity indicating the success or failure of the deletion process.
 *         Returns HttpStatus.OK if the contract is successfully deleted, HttpStatus.NOT_FOUND
 *         if the contract does not exist, or HttpStatus.INTERNAL_SERVER_ERROR in case of
 *         database access issues.
 */
  @Override
  public ResponseEntity<?> deleteContactById(long id) {
    if (id < 0) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    try {
      boolean result = dao.deleteContract(id);
      if (result) {
        return ResponseEntity.status(HttpStatus.OK).build();
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }

    } catch (DataAccessException dax) {
      logger.error("Database access error: " + dax.getMessage(), dax);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

  }

  /**
 * Updates the details of an existing contract.
 *
 * @param contract the contract DTO that contains the updated contract details.
 * @param bindingResult captures validation errors related to the contract DTO.
 * @return ResponseEntity containing the updated contract or an error message if the update fails.
 */
  @Override
  public ResponseEntity<?> updateContract(@Valid ContractDTO contract, BindingResult bindingResult) {

    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
          .map(fieldError -> fieldError.getDefaultMessage())
          .collect(Collectors.toList()));
    }

    if (contract == null || contract.getId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          String.format("Contract or Contract Id is empty.", HttpStatus.BAD_REQUEST.value()));
    }

    try {
      JobList.valueOf(contract.getJobType());
      Payment.valueOf(contract.getPayment());
      StatusOrder.valueOf(contract.getStatusOrder());
      Contract updatedContract = dao.updateContract(contract);
      if (updatedContract != null) {
        return ResponseEntity.status(HttpStatus.OK).body(updatedContract);
      }
    } catch (DataAccessException dax) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
  }

  /**
 * Retrieves a contract by its unique identifier.
 *
 * @param id the unique identifier of the contract to be retrieved.
 * @return ResponseEntity containing the contract if found, or an appropriate error status.
 */
  @Override
  public ResponseEntity<?> findContractById(long id) {
    if (id < 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          String.format("Contract id: %d negative", id, HttpStatus.BAD_REQUEST.value()));
    }
    try {
      Contract Answer = dao.getContract(id);

      if (Answer != null) {
        return ResponseEntity.status(HttpStatus.OK).body(Answer);
      }
    } catch (DataAccessException dax) {
      logger.error("Database access error: " + dax.getMessage(), dax);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
  }

  
/**
 * Counts all contracts currently managed by the system.
 *
 * @return ResponseEntity containing the count of all contracts or an error if the operation fails.
 */
  @Override
  public ResponseEntity<?> countAllCContracts() {
    try {
      long counter = dao.countContracts();
      return ResponseEntity.status(HttpStatus.OK).body(counter);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  /**
 * Retrieves all contracts associated with a specific customer ID.
 *
 * @param id the customer ID used to retrieve related contracts.
 * @return ResponseEntity containing a list of contracts or an error if no contracts found.
 */
  @Override
  public ResponseEntity<?> findContractByCustomerId(String id) {
    try {

      List<Contract> contract = dao.getContractByCustomerId(id);

      return ResponseEntity.status(HttpStatus.OK).body(contract);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

  }

  /**
 * Retrieves all contracts associated with a specific worker ID.
 *
 * @param id the worker ID used to retrieve related contracts.
 * @return ResponseEntity containing a list of contracts or an error if no contracts found.
 */
  @Override
  public ResponseEntity<?> findContractByWorkerId(String id) {
    try {
      List<Contract> contractWorker = dao.getContractByWorkerId(id);
      return ResponseEntity.status(HttpStatus.OK).body(contractWorker);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  /**
 * Sets or updates a contract based on the acceptance status provided.
 *
 * @param data the contract DTO containing the details to be updated.
 * @param accepted boolean value indicating if the contract update is accepted.
 * @return ResponseEntity indicating the result of the operation, either success or an appropriate error status.
 */
@Override
  public ResponseEntity<?> setContract(ContractDTO data, Boolean accpeted) {
    if(data==null){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    
    if(accpeted){
      Boolean result =dao.updateWorkerId(data.getId(),data.getWorkerId());
      work.updateStatusByWorkerId(data.getWorkerId(), "INAVAILABLE");
      work.updateOrderStatusByWorkerId(data.getWorkerId(), "ACCEPTED");
      dao.updateOrderStatus(data.getId(), "ACCEPTED");
      if(result){
        return ResponseEntity.status(HttpStatus.OK).build();
      }
      else{
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }

    }
    else{
      work.updateStatusByWorkerId(data.getWorkerId(), "AVAILABLE");
      work.updateOrderStatusByWorkerId(data.getWorkerId(), "DECLINED");
      dao.updateOrderStatus(data.getId(), "DECLINED");
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

  }

  /**
 * Validates a given token for authenticity and currency.
 *
 * @param token the token to be validated.
 * @return ResponseEntity indicating whether the token is valid (true) or not (false).
 */
  @Override
  public ResponseEntity<?> validateToken(String token) {
      if(token == null){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }

       Token getToken = tokenService.validateToken(token);
      if(getToken != null){
        return ResponseEntity.status(HttpStatus.OK).body(getToken);
      }

      return ResponseEntity.status(HttpStatus.GONE).body(false);
  }

  @Override
  public ResponseEntity<?> getUserFromEmail(String email) {
    if(email == null){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    email = email.replace("\"", "");
    System.out.println(email);
    Worker foundWorker = work.findWorkerbyEmail(email);

    if(foundWorker != null){
      System.out.println("WORKER");
      return ResponseEntity.status(HttpStatus.FOUND).body(foundWorker);
    }

    Customer foundCustomer = custo.findEmail(email);

    if(foundCustomer != null){
      return ResponseEntity.status(HttpStatus.FOUND).body(foundCustomer);
    }

    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
  }

  @Override
  public ResponseEntity<?> getContractStatus(Long contractId) {

    try {
      String status=dao.getStatusFromContract(contractId);
      if(status!=null){
        return ResponseEntity.status(HttpStatus.OK).body(status);
      }
      else{
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }
    
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

}
