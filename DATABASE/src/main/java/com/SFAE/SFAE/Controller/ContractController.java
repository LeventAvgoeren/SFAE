package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.ENDPOINTS.ContractEP;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Payment;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.IMPLEMENTATIONS.SFAEAlgorithm;
import com.SFAE.SFAE.INTERFACE.ContractInterface;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Service.MailService;
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
  private CustomerInterface custo;


  @Autowired
  private MailService mail;

  @Autowired
  SFAEAlgorithm sfae;

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

      while(iterator.hasNext()){
          lastEntry = iterator.next();
      }

    
      System.out.println(lastEntry);
      contract.setWorkerId(lastEntry.getKey().getId());

      Contract created = dao.createContract(contract);
      if (created != null) {
        Worker found=work.findWorkersbyID(String.valueOf(contract.getWorkerId()));
        Customer foundCustomer= custo.findCustomerbyID(String.valueOf(contract.getCustomerId()));
        
       mail.sendSimpleMessage(found.getEmail(), "Jobangebot erhalten\n\n" ,
       "Sehr geehrte/r " + found.getName() + ",\n\n" +
       "wir freuen uns, Ihnen mitteilen zu können, dass wir ein neues Jobangebot erhalten haben. Unten finden Sie die Details zum Auftrag:\n\n" +
       "Auftraggeber: " + foundCustomer.getName() + "\n" +
       "Jobtyp: " + contract.getJobType() + "\n" +
       "Beschreibung: " + contract.getDescription() + "\n" +
       "Adresse: " + contract.getAdress() + "\n" +
       "Zahlung: " + contract.getPayment() + "\n" +
       "Entfernung: " + contract.getRange() + " km\n\n" +
       "Bei Fragen oder für weitere Informationen stehen wir Ihnen gerne zur Verfügung.\n\n" +
       "Mit freundlichen Grüßen,\n" +
       "Ihr SFAE-Team\n");

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
      }

    } catch (DataAccessException dax) {
      logger.error("Database access error: " + dax.getMessage(), dax);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
  }

  @Override
  public ResponseEntity<?> deleteContactById(long id) {
    if (id < 0) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    try {
      boolean result = dao.deleteContract(id);
      if (result) {
        return ResponseEntity.status(HttpStatus.OK).build();
      }
      else{
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }

    } catch (DataAccessException dax) {
      logger.error("Database access error: " + dax.getMessage(), dax);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

  }

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

  @Override
  public ResponseEntity<?> countAllCContracts() {
    try{
      long counter=dao.countContracts();
  return ResponseEntity.status(HttpStatus.OK).body(counter);
  }
  catch(Exception e){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
  }
  }

  @Override
  public ResponseEntity<?> findContractByWorkerId(String id) {
    try{

      List<Contract> contract =dao.getContractByCustomerId(id);

      return ResponseEntity.status(HttpStatus.OK).body(contract);
    }
    catch(Exception e){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

  }


}
