import OpenAI from "openai";
import { useEffect } from "react";

const openai = new OpenAI({
    organization: "org-6HzkErmtvGPi1Ge4CZ5DtCgP",
    apiKey: "sk-28-zbmxqsnwmXQJnxcIm5mvT3BlbkFJj19uBF9WphIcqWohqo6F",
    dangerouslyAllowBrowser: true
});

export default function ImprintPage() {
   
    useEffect( () => {
        
    }, []);
 
    return (
        <div>
            <h1>Imprint Page</h1>
        </div>
    );  

}