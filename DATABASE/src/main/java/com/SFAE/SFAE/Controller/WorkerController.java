package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;




@RestController
public class WorkerController {
    @Autowired
    WorkerInterface WIn;
       
    @PostMapping("/addWorker")
    public void addWoker(@RequestBody Worker entity) {
        //TODO: process POST request
        WIn.save(entity);
    }


}
