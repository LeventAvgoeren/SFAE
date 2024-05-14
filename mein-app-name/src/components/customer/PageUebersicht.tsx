import { useParams } from "react-router-dom";
import { getContractByCustomerId } from "../../backend/api";
import { useEffect, useState } from "react";
import { ContractResource } from "../../Resources";
import React from 'react';

export function PageUebersicht() {
  const params = useParams();
  const customerId = params.customerId!;

  const [contract, setContract] = useState<ContractResource[]>([]);
  const [noContracts, setNoContracts] = useState(false);

  useEffect(() => {
    async function getCustomer() {
      try {
        let contracts = await getContractByCustomerId(customerId);
        if (contracts.length === 0) {
          setNoContracts(true);
        } else {
          setContract(contracts);
        }
      } catch (error) {
        console.log("Fehler:" + error);
      }
    }
    getCustomer();
  }, []);

  if (noContracts) {
    return <p>Sie haben keine Aufträge bis jetzt</p>;
  }

  return (
    <>

      <div>
        <table className="table align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Adresse</th>
              <th>Beschreibung</th>
              <th>Job Typ</th>
              <th>Payment</th>
              <th>Range</th>
              <th>Worker ID</th>
            </tr>
          </thead>
          <tbody>
            {contract.map((contract, index) => (
              <tr key={index}>
                <td className="blue">{contract.adress}</td>
                <td className="green">{contract.description}</td>
                <td className="red">{contract.jobType}</td>
                <td className="orange">{contract.payment}</td>
                <td className="purple">{contract.range}</td>
                <td className="gray">{contract.workerId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

