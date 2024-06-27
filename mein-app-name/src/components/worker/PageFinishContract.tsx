import { useParams } from "react-router-dom";

export function PageFinishContract() {

    const { workerId } = useParams<{ workerId?: string }>();
    


    return (
        <div>Test</div>
    )

}  
export default PageFinishContract;