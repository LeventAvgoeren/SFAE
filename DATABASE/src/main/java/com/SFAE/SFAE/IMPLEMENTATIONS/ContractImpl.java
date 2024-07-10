package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.Payment;
import com.SFAE.SFAE.ENUM.Status;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.ENUM.TokenType;
import com.SFAE.SFAE.INTERFACE.ContractInterface;
import com.SFAE.SFAE.INTERFACE.ContractRepository;
import com.SFAE.SFAE.Service.MailService;
import com.SFAE.SFAE.Service.TokenMailService;

@Component
public class ContractImpl implements ContractInterface {
  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Autowired
  @Lazy
  private CustomerImp customerImpl;

  @Autowired
  @Lazy
  private WorkerImpl workerImpl;

  @Autowired
  private ContractRepository contractRepository;

  @Autowired
  private SFAEAlgorithm algo;

  @Autowired
  private TokenMailService tokenService;

  @Autowired
  private MailService mail;

  @Autowired
  private CustomerImp custo;

  /**
   * Retrieves a specific contract by its ID from the database.
   *
   * @param id The ID of the contract to retrieve.
   * @return The requested Contract if found, otherwise returns null.
   */
  @Override
  public Contract getContract(long id) {
    List<Contract> result = jdbcTemplate.query(
        "SELECT * FROM Contract WHERE ID = ?",
        ps -> {
          ps.setInt(1, (int) id);
        },
        (rs, rowNum) -> createContract(rs));

    if (!result.isEmpty()) {
      return result.get(0);
    }
    return null;
  }

  /**
   * Updates an existing contract in the database using the provided ContractDTO
   * object.
   *
   * @param contract A ContractDTO containing the new details for the contract.
   * @return The updated Contract if successful, null if the update fails.
   */

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

  /**
   * Deletes a contract from the database based on its ID.
   *
   * @param id The ID of the contract to delete.
   * @return true if the contract was successfully deleted, false otherwise.
   */
  @Override
  public boolean deleteContract(long id) {
    if (id < 0) {
      throw new IllegalArgumentException("Wrong Id: " + id);
    }

    try {
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
    } catch (DataAccessException dax) {
      return false;
    }
  }

  /**
   * Creates a new contract in the database based on the provided ContractDTO
   * object.
   *
   * @param contract A ContractDTO containing the contract details.
   * @return The newly created Contract.
   */
  @Override
  public Contract createContract(ContractDTO contract) {

    String jobType = contract.getJobType();
    String address = contract.getAdress();
    String payment = contract.getPayment();
    String description = contract.getDescription();
    String statusOrder = contract.getStatusOrder();
    Double range = contract.getRange();
    Double maxPayment = contract.getMaxPayment();
    Customer customer = customerImpl.findCustomerbyID(String.valueOf(contract.getCustomerId()));

    Contract newContract = new Contract(JobList.valueOf(jobType), address, Payment.valueOf(payment), description,
        StatusOrder.valueOf(statusOrder), range, customer, maxPayment);

    return contractRepository.save(newContract);
  }

  /**
   * Internal helper method to create a Contract object from a ResultSet.
   *
   * @param rs ResultSet from a SQL query.
   * @return A new Contract object filled with data from the ResultSet.
   */
  private Contract createContract(ResultSet rs) {
    try {
      Long id = rs.getLong("id");
      String jobType = rs.getString("job_type");
      String adress = rs.getString("adress");
      String payment = rs.getString("payment");
      String description = rs.getString("description");
      String statusOrder = rs.getString("status_order");
      double range = rs.getDouble("range");
      String customerId = rs.getString("customer_id");
      String workerId = rs.getString("worker_id");
      Double maxPayment = rs.getDouble("max_Payment");
      Customer customer = customerImpl.findCustomerbyID(String.valueOf(customerId));

      if (workerId == null) {

        return new Contract(id, JobList.valueOf(jobType), adress, Payment.valueOf(payment), description,
            StatusOrder.valueOf(statusOrder), range, customer, maxPayment);
      }

      Worker worker = workerImpl.findWorkersbyID(String.valueOf(workerId));
      return new Contract(id, JobList.valueOf(jobType), adress, Payment.valueOf(payment), description,
          StatusOrder.valueOf(statusOrder), range, customer, worker, maxPayment);
      // return dataFactory.createWorker(id, name, location, password, email, status,
      // range, jobType, statusOrder,minPayment, rating, verification);
    } catch (SQLException e) {
      throw new IllegalArgumentException("Error" + e);
    }

  }

  /**
   * Counts the total number of contracts present in the database.
   *
   * @return The total number of contracts.
   */
  @Override
  public long countContracts() {
    List<Object> result = jdbcTemplate.query(
        "SELECT COUNT(ID) FROM CONTRACT",
        (rs, rowNum) -> {
          long count = rs.getInt(1);
          return count;
        });
    return result.size() > 0 ? (long) (result.get(0)) : 0;
  }

  /**
   * Retrieves all contracts associated with a given customer ID.
   *
   * @param id The customer ID to search for.
   * @return A list of contracts for the specified customer or null if no
   *         contracts are found.
   */
  @Override
  public List<Contract> getContractByCustomerId(String id) {

    List<Contract> result = jdbcTemplate.query(
        "SELECT * FROM CONTRACT WHERE customer_id = ?",
        ps -> {
          ps.setString(1, id);
        },
        (rs, rowNum) -> createContract(rs));

    if (!result.isEmpty()) {
      return result;
    }

    return null;

  }

  /**
   * Retrieves all contracts associated with a given worker ID.
   *
   * @param id The worker ID to search for.
   * @return A list of contracts for the specified worker or null if no contracts
   *         are found.
   */
  @Override
  public List<Contract> getContractByWorkerId(String id) {
    List<Contract> result = jdbcTemplate.query(
        "SELECT * FROM CONTRACT WHERE worker_id = ?",
        ps -> {
          ps.setString(1, id);
        },
        (rs, rowNum) -> createContract(rs));

    if (!result.isEmpty()) {
      return result;
    }

    return null;

  }

  /**
   * Updates the worker ID for a specific contract.
   *
   * @param contractId The ID of the contract to update.
   * @param workerId   The new worker ID to assign to the contract.
   * @return true if the update was successful, false otherwise.
   */
  @Override
  public Boolean updateWorkerId(long contractId, String workerId) {
    if (contractId < 0 || workerId == null) {
      return false;
    }
    int result = jdbcTemplate.update(
        "Update contract SET worker_id=? where id= ? ",
        ps -> {
          ps.setString(1, workerId);
          ps.setLong(2, contractId);
        });

    if (result > 0) {
      return true;
    } else {
      return false;
    }

  }

  @Override
  public Boolean updateOrderStatus(Long contractId, String statusOrder) {
    if (contractId == null || statusOrder == null) {
      throw new IllegalArgumentException("Id or Status not given");
    }

    Contract con = getContract(contractId);
    System.out.println(Status.AVAILABLE == con.getWorker().getStatus() );
    System.out.println(StatusOrder.FINISHED ==  con.getWorker().getStatusOrder() );
    System.out.println(StatusOrder.FINISHED == con.getCustomer().getStatusOrder());
    System.out.println(statusOrder);
    if(Status.AVAILABLE == con.getWorker().getStatus() && StatusOrder.FINISHED ==  con.getWorker().getStatusOrder() &&  StatusOrder.FINISHED == con.getCustomer().getStatusOrder()){
      System.out.println("bin drin");
        int row = jdbcTemplate.update(
        "UPDATE Contract SET status_order = ? WHERE id = ?",
        ps -> {
          ps.setString(1, StatusOrder.valueOf(statusOrder).name());
          ps.setLong(2, contractId);
        });

    if (row > 0) {
      return true;
    } else {
      return false;
    } 
    }

    return false;
  }

  @Override
  public String getStatusFromContract(Long contractId) {
    if (contractId < 0) {
      throw new IllegalArgumentException("Id can not be negative");
    }
    List<String> statusList = jdbcTemplate.query(
        "SELECT status_order FROM Contract WHERE ID = ?",
        ps -> {
          ps.setLong(1, contractId);
        },
        (rs, rowNum) -> rs.getString("status_order"));

    if (statusList.isEmpty()) {
      return null;
    } else {
      return statusList.get(0);
    }
  }

  @Override
  public void findNextBestWorker(ContractDTO contract) {
    if (!contract.getWorkerId().startsWith("W")) {
      throw new IllegalArgumentException("Wrong ID");
    }
    Map<Worker, Double> best = algo.getBestWorkersforTheJob(contract);
    
    if (best == null || best.size() < 2) {
      throw new Error("Not another Worker exists or available.");
    }
    boolean nextWorker = true;

    for (Worker worker : best.keySet()) {
      if (nextWorker) {
        contract.setWorkerId(worker.getId());
        Contract con = createContract(contract);
        Customer foundCustomer = custo.findCustomerbyID(contract.getCustomerId());
        String token = tokenService.createToken(con.getId(), worker.getId(), TokenType.CONTRACT);
        String link = "https://localhost:3000/contract?token=" + token;
        try {
          mail.sendHtmlMessage(worker.getEmail(), "Jobangebot erhalten",
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
                  "Unter diesem <a href='" + link
                  + "'>Link</a> können Sie die Anfrage bestätigen. Sie haben 5 Minuten Zeit die Anfrage anzunehmen.<br>"
                  +
                  "Bei Fragen oder für weitere Informationen stehen wir Ihnen gerne zur Verfügung.<br><br>" +
                  "Mit freundlichen Grüßen,<br>" +
                  "Ihr SFAE-Team" +
                  "</body></html>");
        } catch (Exception e) {
          throw new Error("Message Error");
        }

        if (worker.getId().equals(contract.getWorkerId())) {
          nextWorker = true;
        }
      }

    }

    if (!nextWorker) {
      throw new Error("Contract_not_accepted");
    }

  }

}
