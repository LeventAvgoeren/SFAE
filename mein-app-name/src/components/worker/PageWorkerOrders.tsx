import {useState, useEffect} from 'react';
import LoadingIndicator from '../LoadingIndicator';

export function PageWorkerOrders() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <LoadingIndicator />;
    }
    return( 
        <div>PageWorkerOrders</div>
    )
}