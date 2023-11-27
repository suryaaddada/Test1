import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {IoMdArrowBack} from "react-icons/io"

export const ViewBook=()=>{

    const[title,setTitle]=useState('');
    const[author,setAuthor]=useState('');
    const[genre,setGenre]=useState('');
    const[isbn,setIsbn]=useState();
    const[publishdate,setDate]=useState('');
    const[errors,setErrors]=useState({});
    const[bookId,setid]=useState(); 
    const navigate=useNavigate();

    useEffect(()=>{
       const fetchBook=async()=>{
            const id=new URLSearchParams(window.location.search).get('id');
            const data=await fetch(`https://localhost:7288/api/Book/GetBookById/${id}`,{
                headers:{
                    Authorization:`Bearer ${sessionStorage.getItem("token")}`,
                }
            })

            const response=await data.json();
            console.log(response);
            setid(response.bookId);
            setTitle(response.title);
            setAuthor(response.author);
            setGenre(response.genre);
            setIsbn(response.isbn);
            setDate(response.publishDate);
        }
        fetchBook();
    },[])
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const valid=await validate(); 

        if(valid)
        {
            var data={title,author,genre,publishdate,isbn};
            try{
                console.log("check");
                const response=await fetch(`https://localhost:7288/api/Book/UpdateBook/${bookId}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                        Authorization:`Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body:JSON.stringify(data),
                }) 
                console.log("check2");

                const reply=await response.json(); 
                console.log(reply);
                if (reply.bookId) {
                    console.log("Updated");
                    Swal.fire({
                        title:"Book Updated Successfully",
                        icon:'success'

                    })

                } else {
                    console.log("Failed to Update");
                    Swal.fire({
                        title:"Book Update Failed",
                        icon:'error'

                    })
                }


            }catch(error)
            {
                console.log("Error in adding Book Catch");
                Swal.fire({
                    title:"Book Update Failed",
                    icon:'error'

                })
            }
        }
        

    } 
    const validate=async()=>{
        const errors={};
    
        if(!title?.trim())
        {
            errors.title="Title can't be Empty";
            setErrors(errors);
            return false;
        }
    
        if(!author?.trim())
        {
            errors.author="Author can't be Empty";
            setErrors(errors);
            return false;
        }
    
       
    
        if(!genre?.trim())
        {
            errors.genre="Genre Can't be Empty";
            setErrors(errors);
            return false;
        }
        if(!isbn )
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

        if(!publishdate?.trim())
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
    
    const handleDelete = async () => {
        const confirmation = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        });
    
        if (confirmation.isConfirmed) {
          try {
            const response = await fetch(`https://localhost:7288/api/Book/DeleteBook/${bookId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization:`Bearer ${sessionStorage.getItem("token")}`,
              },
            });
      
            
            if (response.ok) {
             
              Swal.fire('Deleted!', 'Your Book has been deleted.', 'success');
              
              navigate(-1);
            } else {
              Swal.fire('Error!', 'Failed to delete the book.', 'error');
            }
          } catch (error) {
            console.error('Error deleting book:', error);
            Swal.fire('Error!', 'An error occurred while deleting the book.', 'error');
          }
        }
      };
      
    return(
        <>
        
        <div className="card"> 
        <p onClick={()=>navigate(-1)} style={{textAlign:'left',fontSize:'25px'}}><IoMdArrowBack/></p>
            <div className="card-body">
                <form   onSubmit={handleSubmit} style={{padding:'100px',marginTop:'50px'}}>
                <div>
                            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter Book Title" className="form-control"/>
                            {errors.title &&<div className="text-danger" >{errors.title}</div>}
                        </div>
                        <div>
                            <input type="text" value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Enter Author Name" className="form-control"/>
                            {errors.author &&<div className="text-danger" >{errors.author}</div>}
                        </div>
                        <div>
                            <input type="text" value={genre} onChange={(e)=>setGenre(e.target.value)} placeholder="Enter Genre" className="form-control"/>
                            {errors.genre &&<div className="text-danger" >{errors.genre}</div>}
                        </div>
                        <div>
                            <input type="text" value={isbn} onChange={(e)=>setIsbn(e.target.value)} placeholder="Enter ISBN" className="form-control"/>
                            {errors.isbn &&<div className="text-danger" >{errors.isbn}</div>}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <label >Publish Date:</label>
                            <input type="date" value={publishdate?.split('T')[0]} onChange={(e)=>setDate(e.target.value)} placeholder="Enter Publish Date" className="form-control"/>
                            {errors.date &&<div className="text-danger" >{errors.date}</div>}
                        </div>
                        <input type="submit" value="Update" className="btn btn-primary" /> 
                        <button type="button"   className="btn btn-danger"  onClick={handleDelete}>Delete</button>
                </form>
            </div>
        </div>

        </>
    )
}