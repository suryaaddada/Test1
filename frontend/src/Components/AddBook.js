import { useEffect, useState } from "react"
import {  useNavigate } from "react-router-dom"
import Swal from "sweetalert2";

export const AddBook=()=>{
    const navigate=useNavigate();
    const[title,setTitle]=useState('');
    const[author,setAuthor]=useState('');
    const[Genre,setGenre]=useState('');
    const[isbn,setIsbn]=useState('');
    const[publishdate,setDate]=useState('');
    const[errors,setErrors]=useState({});

    const handleReset=()=>{
        setTitle('');
        setAuthor('');
        setDate('');
        setGenre('');
        setIsbn('');
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const valid=await validate(); 

        if(valid)
        {
            var data={title,author,Genre,publishdate,isbn};
            try{
                console.log("check");
                const response=await fetch(`https://localhost:7288/api/Book/AddBook`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(data),
                }) 
                console.log("check2");

                const reply=await response.json(); 
                console.log(reply);
                if (reply.bookId) {
                    console.log("Added");
                    Swal.fire({
                        title:"Book Added Successfully",
                        icon:'success'

                    })

                } else {
                    console.log("Failed to Add");
                    Swal.fire({
                        title:"Book Added Failed",
                        icon:'error'

                    })
                }


            }catch(error)
            {
                console.log("Error in adding Book Catch");
                Swal.fire({
                    title:"Book Added Failed",
                    icon:'error'

                })
            }
        }
        

    }
    const validate=async()=>{
        const errors={};
    
        if(!title.trim())
        {
            errors.title="Title can't be Empty";
            setErrors(errors);
            return false;
        }
    
        if(!author.trim())
        {
            errors.author="Author can't be Empty";
            setErrors(errors);
            return false;
        }
    
       
    
        if(!Genre.trim())
        {
            errors.Genre="Genre Can't be Empty";
            setErrors(errors);
            return false;
        }
        if(!isbn.trim())
        {
            errors.isbn="ISBN can't be Empty";
            setErrors(errors);
            return false;
        }else if(!/^[\d]+$/.test(isbn))
        {
            errors.isbn="ISBN must be Digits";
            setErrors(errors);
            return false;
        }

        if(!publishdate.trim())
        {
            errors.date="Publish Date can't be Empty";
            setErrors(errors);
            return false;
         }
         else if(new Date(publishdate) > Date.now())
         {
             errors.date = "Publish Date can't be Future Date";
             setErrors(errors);
             return false;
         }
         
        return true;
    } 
    useEffect(()=>{
        let timer=setTimeout(() => {
            setErrors({});
        }, 3000); 
        return ()=>clearTimeout(timer);
    },[errors])

    return(
        <>
        <div className="card">
            <div className="card-body">
            <form  onSubmit={handleSubmit} style={{padding:'100px',marginTop:'50px'}}>
                <h1>Book Registration</h1>
                        <div>
                            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter Book Title" className="form-control"/>
                            {errors.title &&<div className="text-danger" >{errors.title}</div>}
                        </div>
                        <div>
                            <input type="text" value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Enter Author Name" className="form-control"/>
                            {errors.author &&<div className="text-danger" >{errors.author}</div>}
                        </div>
                        <div>
                            <input type="text" value={Genre} onChange={(e)=>setGenre(e.target.value)} placeholder="Enter Genre" className="form-control"/>
                            {errors.Genre &&<div className="text-danger" >{errors.Genre}</div>}
                        </div>
                        <div>
                            <input type="text" value={isbn} onChange={(e)=>setIsbn(e.target.value)} placeholder="Enter ISBN" className="form-control"/>
                            {errors.isbn &&<div className="text-danger" >{errors.isbn}</div>}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <label >Publish Date:</label>
                            <input type="date" value={publishdate} onChange={(e)=>setDate(e.target.value)} placeholder="Enter Publish Date" className="form-control"/>
                            {errors.date &&<div className="text-danger" >{errors.date}</div>}
                        </div>
                        
                        <input type="submit" value="Add" className="btn btn-primary" /> 
                        <input type="reset" onClick={handleReset}  className="btn btn-danger" />  


                    </form>
            </div>


        </div>

        </>
    )
}