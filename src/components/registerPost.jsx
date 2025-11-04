import React, { useEffect, useState } from "react";

export const registerPost = ({ onNewRegister }) => {


    async function postJSON(data) {
        try {
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log("Success:", result);
            onNewRegister();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const [titulo, setTitulo] = useState('');
    const [author, setAuthor] = useState('');

    const changeTitulo = ({ target }) => {
        setTitulo(target.value);
    }

    const changeAuthor = ({ target }) => {
        setAuthor(target.value);
    }


    const registro = async (e) => {
        e.preventDefault();
        if(titulo.trim()===''||author.trim()==='')return;
        await postJSON({ title: titulo, author });
    }

    return (
        <>
           
           <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"/>

            
            
        </>
        

    )
}

export default registerPost;
