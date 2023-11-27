// const subjects = [{ code: "CMSC 100" }, { code: "CMSC 23" }];
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [greeting, setGreeting] = useState("");
    
    useEffect(function () {
        fetch("http://localhost:3001/get-subjects")
            .then(response => response.json())
            .then(body => { setSubjects(body) });
        
        fetch("http://localhost:3001/greet-by-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: "Monina" })
        })
            .then(response => response.text())
            .then(body => { setGreeting(body) });
    }, []);

    return (
        <>
            <ol>
                {
                    subjects.map((subject, i) =>
                        <li key={i}>
                        <Link to={`/subjects/${subject.code}`}>
                        {subject.code}
                        </Link>
                        </li>
                    )
                }
            </ol>
            <div>{ greeting }</div>
        </>
    )
}