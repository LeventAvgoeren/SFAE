package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.sql.Statement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Payment;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.INTERFACE.ContractInterface;
import com.SFAE.SFAE.Service.PasswordHasher;

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
                "SELECT * FROM CUSTOMER WHERE ID = ?",
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
  public Contract updateContract(Contract contract) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateContract'");
  }

  @Override
  public boolean deleteContract(long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteContract'");
  }

  @Override
  public Contract createContract(Contract contract) {

    String jobType = contract.getJobType().name();
    String address = contract.getAdress();
    String payment = contract.getPayment().name();
    String description = contract.getDescription();
    String statusOrder = contract.getStatusOrder().name();
    Double range = contract.getRange();
    Customer customer = customerImpl.findCustomerbyID(contract.getCustomer().getId());
    Worker worker = workerImpl.findWorkersbyID(contract.getWorker().getId());

     jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection.prepareStatement(
            "INSERT INTO Contract (job_type, address, payment, description, status_order, range, customer_id, worker_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",Statement.RETURN_GENERATED_KEYS);

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
  return new Contract(JobList.valueOf(statusOrder), address, Payment.valueOf(payment), description,StatusOrder.valueOf(statusOrder), range, customer, worker);
}


private Contract createContract(ResultSet rs) {
  try {
    Long id = rs.getLong("id");
    String jobType = rs.getString("job_type");
    String adress = rs.getString("adress");
    String payment = rs.getString("payment");
    String description = rs.getString("description");
    String statusOrder = rs.getString("status_Order");
    double range = rs.getDouble("range");
    Long customerId = rs.getLong("customer_id");
    Long workerId = rs.getLong("worker_id");

    Customer customer =customerImpl.findCustomerbyID(customerId);
    Worker worker= workerImpl.findWorkersbyID(workerId);

    return new Contract(id,JobList.valueOf(statusOrder),adress,Payment.valueOf(payment),description,StatusOrder.valueOf(statusOrder),range,customer,worker);
    //return dataFactory.createWorker(id, name, location, password, email, status, range, jobType, statusOrder,minPayment, rating, verification);
  } catch (SQLException e) {
    throw new IllegalArgumentException("Error"+e);
  }

}

}
