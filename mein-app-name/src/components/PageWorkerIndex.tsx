import { WorkerResource } from "../Resources"

export function PageWorkerIndex(props : {worker : WorkerResource}) {
    
    const worker = props.worker

    return (
        <h1>Willkommen {worker.name}</h1>

    )
}