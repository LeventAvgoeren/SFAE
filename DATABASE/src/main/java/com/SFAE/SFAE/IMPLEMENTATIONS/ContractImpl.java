package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.INTERFACE.ContractInterface;

public class ContractImpl implements ContractInterface {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Override
  public Contract getContract(long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getContract'");
  }

  @Override
  public Contract updateContract(Contract contract) {
    int result = jdbcTemplate.update(
      "UPDATE contract SET jobType = ?, adress = ?, payment = ?, description = ?, statusOrder = ?, range = ? WHERE id = ?",
      ps -> {
          ps.setString(1, contract.getJobType().toString());
          ps.setString(2, contract.getAdress());
          ps.setString(3, contract.getPayment().toString());
          ps.setString(4, contract.getDescription());
          ps.setString(5, contract.getStatusOrder().toString());
          ps.setDouble(6, contract.getRange());
          ps.setLong(7, contract.getId());
      });

    if (result > 0) {
      return getContract(Long.valueOf(contract.getId()));
    }

    return null;
  }

  @Override
  public boolean deleteContract(long id) {
      if(id < 0){
        throw new IllegalArgumentException("Wrong Id: " + id);
      }

      try{
          int deleted = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection
                        .prepareStatement("DELETE FROM CONTRACT WHERE ID = ?;");
                ps.setInt(1, (int) id);
                return ps;
            });

            if (deleted != 1) {
                throw new IllegalArgumentException("Id could not been deleted");
            }
            return true;
      } catch (DataAccessException dax){
        return false;
      }
  }

  @Override
  public Contract createContract(Contract contract) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'createContract'");
  }
  
}
