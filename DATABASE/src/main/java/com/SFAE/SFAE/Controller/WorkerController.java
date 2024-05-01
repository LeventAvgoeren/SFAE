package com.SFAE.SFAE.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENDPOINTS.WorkerEp;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Security.JWT;
import com.SFAE.SFAE.Service.Authentication;
import com.SFAE.SFAE.Service.MailService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;



/**
 * @author Levent
 */

//Klasse dient als Communication zwischen frontend und backend 
@RestController
public class WorkerController implements WorkerEp {

    @Autowired
    private WorkerInterface dao;

    @Autowired 
    private JWT jwt;

    @Autowired
    MailService mail;

    @Override
    public ResponseEntity<Worker> createWorker(@RequestBody WorkerDTO worker) {
        if(worker==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        try{
            Worker builded=dao.createWorker(worker);
            
                return ResponseEntity.status(HttpStatus.CREATED).body(builded);
        }
        catch(Exception e){
            throw new IllegalArgumentException(e);
        }
        
    }

    @Override
    public ResponseEntity<?> deleteWorkerById(long id) {
        if(id<0){
            return ResponseEntity.badRequest().body("id can be <0 or is null");
        }
        try{
            boolean result=dao.deleteWorkerById(id);
            if(result){
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        }
        catch(Error error){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    @Override
    public ResponseEntity<Iterable<Worker>> findAllWorker() {
       try{
                    var worker =dao.findAllWorker();
            return ResponseEntity.status(HttpStatus.OK).body(worker);
       }
       catch(Exception e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
       }
      
     
    }

    @Override
    public ResponseEntity<?> findWorkersbyID(long id) {
        if(id<0){
            return ResponseEntity.badRequest().body("id can be <0 or is null");
        }
            Worker found=dao.findWorkersbyID(id);


        return ResponseEntity.status(HttpStatus.OK).body(found);
    }

    @Override
    public ResponseEntity<?> findWorkerByName(String name) {
        if(name.length()<0){
            return ResponseEntity.badRequest().body("Name is null");
        }
          Worker found=dao.findWorkerbyName(name);
          return ResponseEntity.status(HttpStatus.OK).body(found);
        }

    @Override
    public ResponseEntity<Worker> updateWorker(@RequestBody WorkerDTO jsonData) {
        if(jsonData ==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        try{
            dao.updateWorker(jsonData);
            
        }
        catch(Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @Override
    public ResponseEntity<?> loginWorker(@RequestBody LoginRequest login) {
        if(login.getEmail()== null||login.getPassword() == null){
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try{
            String token=jwt.loginWorkerJWT(login.getEmail(),login.getPassword());
            if(token==null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.ok().body(token);
        }
       catch(Exception e) {
        return ResponseEntity.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).build();
       }
    }


}
