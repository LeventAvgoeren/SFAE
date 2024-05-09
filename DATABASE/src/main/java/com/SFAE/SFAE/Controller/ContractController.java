package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.ENDPOINTS.ContractEP;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.INTERFACE.ContractInterface;
import com.SFAE.SFAE.Service.MailService;
import org.slf4j.Logger;

@RestController
public class ContractController implements ContractEP {
  private Logger logger;

  @Autowired
  private ContractInterface dao;

  @Autowired
  private MailService mail;

  @Override
  public ResponseEntity<?> createContract(ContractDTO contract) {

    if (contract == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    try {
      Contract created = dao.createContract(contract);
      if (created != null) {
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
      }
    } catch (Exception e) {
      return ResponseEntity.status((HttpStatus.INTERNAL_SERVER_ERROR)).build();
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

    } catch (Exception e) {
      return ResponseEntity.status((HttpStatus.INTERNAL_SERVER_ERROR)).build();
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
  }

  @Override
  public ResponseEntity<?> updateContract(Contract contract) {
    
    throw new UnsupportedOperationException("Unimplemented method 'updateContract'");
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


}
