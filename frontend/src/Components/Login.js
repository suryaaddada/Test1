import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Login=()=>{
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[errors,setErrors]=useState({}); 
    const[islogged,setIsLogged]=useState(false);
    const[id,setId]=useState();
    const navigate=useNavigate();

useEffect(()=>{
    let timer=setTimeout(() => {
        setErrors({});
    }, 3000); 
    return ()=>clearTimeout(timer);
},[errors])
    const handleReset=()=>{
        setPassword('');
        setEmail('');
    }

    useEffect(()=>{
     setIsLogged(sessionStorage.getItem("Login"));
        console.log('login',islogged);
    },[]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        var isvalid=await validate();
        if(isvalid)
        {
            let data={email,password};
            try{
                const response=await fetch(`https://localhost:7288/api/User/Verify`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(data),
                }); 
                console.log("ok");
                const reply =await response.json();
                setId(reply.id);
                sessionStorage.setItem('token',reply.token);
                sessionStorage.setItem('role','admin');
                console.log("after",reply.id)
                sessionStorage.setItem("Login",true);
                setIsLogged(true);
                navigate(`admin?id=${reply.id}`)
                handleReset();
                
            }catch(error)
            {
                console.error("Error in Login catch");
                Swal.fire({
                    title:"Login Failed. Try again",
                    icon:'error',
                    timer:1000,
                })
            }
        }
    }
    const validate=async()=>{
        const errors={};
    
        if(!email.trim())
        {
            errors.email="Email can't be Empty";
            setErrors(errors);
            return false;
        }else if(!/\S+@\S+\.\S/.test(email))
        {
            errors.email="Email must be in Correct Format";
            setErrors(errors);
            return false;
        }  
    
       
    
        if(!password.trim())
        {
            errors.password="Password Can't be Empty";
            setErrors(errors);
            return false;
        }else if(password.length<7)
        {
            errors.password="Password must contains atleast 8 characters";
            setErrors(errors);
            return false;
        }else if(!/^(?=.*[A-Z])(?=.*[@#&])(?=.*[a-z])(?=.*[\d]).+$/.test(password))
        {
            errors.password="Password must contains one Upper Case,Lower Case,Digits,Special Symbols(@#&)";
            setErrors(errors);
            return false;
        }
    
        
        return true;
    } 
    
    return(
        <>
        {!islogged && 
        <div className="card">
            <div className="=card-body">
                <form onSubmit={handleSubmit} style={{padding:'120px',margin:'50px'}}>
                    <h1>Login Page</h1>
                <div style={{margin:'50px'}}>
                     <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" className="form-control"/>
                    {errors.email &&<div className="text-danger" >{errors.email}</div>}
                </div>
                <div style={{margin:'50px'}}>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" className="form-control"/>
                    {errors.password &&<div className="text-danger" >{errors.password}</div>}
                </div>
                <div>
                    <input type="submit" value="Login" className="btn btn-primary" />
                    <input type="reset" onClick={handleReset}  className="btn btn-danger" />
                </div>
                <p>New User? <a href="/">Register</a> here</p>
                </form> 
               
            </div>
        </div>
}
<Outlet/>
        </>
    )
}