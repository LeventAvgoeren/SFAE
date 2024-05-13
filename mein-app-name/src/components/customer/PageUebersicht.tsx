import { useParams } from "react-router-dom"
import { getContractByCustomerId, getWorkerByName, getWorkerbyID} from "../../backend/api"
import { useEffect, useState } from "react"
import { ContractResource, CustomerResource, WorkerResource } from "../../Resources"

export function PageUebersicht(){
  const params=useParams()
  let customerId=params.customerId!

  const[job,setJob]=useState("");
  const[contract,setContract]=useState<ContractResource[]>([]);
  const[workerId,setWorkerId]=useState("");
  const[worker,setWorker]=useState<WorkerResource>(null!);
  const[noContracts,setNoContracts]=useState(false)

  useEffect(()=>{

    async function getCustomer() {
      try{
        let contract=await getContractByCustomerId(customerId)
        setContract(contract)
      }
      catch(error){
        console.log("Fehler:"+error)
      }
    }
    getCustomer()
  },[])

if(noContracts){
  return <p> Sie haben keine Orders bis jetzt</p>
}


  return (
    <>
    {contract?.map((contracts)=>
    <div>
      <p>Addresse:{contracts.adress}</p>
      <p>Description:{contracts.description}</p>
      <p>Job typ:{contracts.jobType}</p>
      <p>Payment:{contracts.payment}</p>
      <p>Range:{contracts.range}</p>
      <p>workerId:{contracts.workerId}</p>
      <p>-----------------------------------------</p>
    </div>
    
    
    )}


    </>

  )
}