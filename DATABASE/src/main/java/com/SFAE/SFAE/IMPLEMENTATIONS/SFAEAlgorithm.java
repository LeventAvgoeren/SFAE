package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.util.List;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Worker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * @author erayzor
 * @authoer levent
 */

@Component
public class SFAEAlgorithm {

  @Autowired
  private JdbcTemplate jdbcTemplate;
    

    public void getBestWorkerforTheJob(CustomerDTO customer){

      

    }
}
