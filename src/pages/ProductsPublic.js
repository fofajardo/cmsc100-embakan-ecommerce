// const subjects = [{ code: "CMSC 100" }, { code: "CMSC 23" }];
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductsPublic() {
    const [subjects, setSubjects] = useState([]);
    const [greeting, setGreeting] = useState("");
    
    useEffect(function () {

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