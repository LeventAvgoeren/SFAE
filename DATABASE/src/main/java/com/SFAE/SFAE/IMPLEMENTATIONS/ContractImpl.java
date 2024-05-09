package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.sql.Statement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Payment;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.INTERFACE.ContractInterface;

@Component
public class ContractImpl implements ContractInterface {
  @Autowired
  private JdbcTemplate jdbcTemplate;
 
  @Autowired
  private CustomerImp customerImpl;

  @Autowired
  private WorkerImpl workerImpl;

  @Override
  public Contract getContract(long id) {
    List<Contract> result = jdbcTemplate.query(
                "SELECT * FROM Contract WHERE ID = ?",
                ps -> {
                    ps.setInt(1, (int) id);
                },
                (rs, rowNum) -> createContract(rs));

        if (!result.isEmpty() ) {
            return result.get(0);
        }
        return null;
  }

  @Override
  public Contract updateContract(ContractDTO contract) {
    int result = jdbcTemplate.update(
      "UPDATE contract SET job_type = ?, adress = ?, payment = ?, description = ?, status_order = ?, range = ? WHERE id = ?",
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
  public Contract createContract(ContractDTO contract) {

    //gibt mir den passenden worker zu dem gesuchten job 
    Worker worker=workerImpl.findWorkerByJob(contract.getJobType());

    String jobType = contract.getJobType();
    String address = contract.getAdress();
    String payment = contract.getPayment();
    String description = contract.getDescription();
    String statusOrder = contract.getStatusOrder();
    Double range = contract.getRange();
    Customer customer = customerImpl.findCustomerbyID(contract.getCustomerId());


     jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection.prepareStatement(
            "INSERT INTO Contract (job_type, adress, payment, description, status_order, range, customer_id, worker_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

            ps.setString(1, jobType);
            ps.setString(2, address);
            ps.setString(3, payment);
            ps.setString(4, description);
            ps.setString(5, statusOrder);
            ps.setDouble(6, range);
            ps.setLong(7, customer.getId());
            ps.setLong(8, worker.getId());
            return ps;
  });
  return new Contract(JobList.valueOf(jobType), address, Payment.valueOf(payment), description,StatusOrder.valueOf(statusOrder), range, customer, worker);
}


private Contract createContract(ResultSet rs) {
  try {
    Long id = rs.getLong("id");
    String jobType = rs.getString("job_type");
    String adress = rs.getString("adress");
    String payment = rs.getString("payment");
    String description = rs.getString("description");
    String statusOrder = rs.getString("status_order");
    double range = rs.getDouble("range");
    Long customerId = rs.getLong("customer_id");
    Long workerId = rs.getLong("worker_id");

    Customer customer =customerImpl.findCustomerbyID(customerId);
    Worker worker= workerImpl.findWorkersbyID(workerId);

    return new Contract(id,JobList.valueOf(jobType),adress,Payment.valueOf(payment),description,StatusOrder.valueOf(statusOrder),range,customer,worker);
    //return dataFactory.createWorker(id, name, location, password, email, status, range, jobType, statusOrder,minPayment, rating, verification);
  } catch (SQLException e) {
    throw new IllegalArgumentException("Error"+e);
  }

}

}
