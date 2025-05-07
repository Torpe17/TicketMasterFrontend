import {useEffect} from "react";

const Unauthorized = () => {

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {

    }

    return <h1>Unauthorized</h1>
}

export default Unauthorized;