
import { useEffect, useState } from "react" 
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "react-oauth-google";
import jwt_decode, { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


export const Register=()=>{
const[name,setName]=useState('');
const[password,setPassword]=useState('');
const[email,setEmail]=useState('');
const[gender,setGender]=useState('');
const[mobile,setMobile]=useState('');
const[isadmin,setIsAdmin]=useState(true);
const[errors,setErrors]=useState({}); 
const navigate=useNavigate();





const handleReset=()=>{
    setName('');
    setMobile('')
    setGender('')
    setPassword('');
    setEmail('');
}

const handleSubmit=async(e)=>{
    e.preventDefault();

    var isvalid=await validate();
    try{
        if(isvalid)
        {
        let data={name,email,password,gender,mobile,isadmin};

        const send=await fetch('https://localhost:7288/api/User/AddUser',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data),
        }) 
        console.log("before response",send);

        
        
        Swal.fire({
            title:'Registration successful',
            icon:"success",
        })
        handleReset();
       

        }
    }catch(error)
    {
        console.log("Error in adding catch");
        Swal.fire({
            title:'Registration Failed',
            icon:"error",
        })
    }
}
const validate=async()=>{
    const errors={};

    if(!name.trim())
    {
        errors.name="Name can't be Empty";
        setErrors(errors);
        return false;
    }else if(!/^[A-Z a-z \S].+$/.test(name))
    {
        errors.name="Name must be Alphabets only";
        setErrors(errors);
        return false;
    } 

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

    if(!mobile.trim())
    {
        errors.mobile="Mobile can't be Empty";
        setErrors(errors);
        return false;
    }else if(!/^[789]\d{9}/.test(mobile))
    {
        errors.mobile="Mobile must contains 10 characters and starts with 7,8,9";
        setErrors(errors);
        return false;
    }  
    if(!gender.trim())
    {
        errors.gender="Gender can't be Empty";
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

const handleClick=()=>{
toast.success("Ok Fine");
} 

const handleSuccess=async(r)=>{ 
   
    try{
        const token=r.credential;
        console.log(token);
        const gdata=await jwtDecode(token);
        console.log(gdata);
        console.log(gdata.email);
        console.log(gdata.name);
        

        var check=await fetch(`https://localhost:7288/api/User/EmailEXists/${gdata.email}`);

        var checkResponse=await check.json();
        console.log(checkResponse.result);
        if(!checkResponse.result)
        {

            let data={name:gdata.name,email:gdata.email,password:"Google@123",gender:" ",mobile:0,isadmin};

            const send=await fetch('https://localhost:7288/api/User/AddUser',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    
                },
                body:JSON.stringify(data),
            })   
            sessionStorage.setItem('token1',token);
            let sendResponse=await send.json();
            console.log(sendResponse);
            sessionStorage.setItem("Login",true);
            navigate(`/login/admin?id=${sendResponse.id}`);

        }
        else{
            sessionStorage.setItem('token',token);
            sessionStorage.setItem("Login",true);
            navigate(`/login/admin?id=${checkResponse.id}`);
            
        }

    }catch(error)
    {
        console.error('Error handling',error);
    }
}
const handleError=(error)=>{
    console.error('Auth Failed',error);
}
    return(
        <>

        <center>
            <ToastContainer/>
            <div className="card">
                <div className="card-body">
                    
                    <form  onSubmit={handleSubmit} style={{backgroundColor:'lightgreen'}}>
                    <h2>Registration Page</h2>
                        <div  style={{margin:'50px'}}>
                            <input type="text" value={name}  onChange={(e)=>setName(e.target.value)} placeholder="Enter Name" className="form-control"/>
                            {errors.name &&<div className="text-danger" >{errors.name}</div>}
                        </div>
                        <div style={{margin:'50px'}}>
                            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" className="form-control"/>
                            {errors.email &&<div className="text-danger" >{errors.email}</div>}
                        </div>
                        <div style={{margin:'50px'}}>
                            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" className="form-control"/>
                            {errors.password &&<div className="text-danger" >{errors.password}</div>}
                        </div>
                        <div style={{margin:'50px'}}>
                            <input type="text" value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Enter Mobile" className="form-control"/>
                            {errors.mobile &&<div className="text-danger" >{errors.mobile}</div>}
                        </div>
                        <div style={{margin:'50px'}}>
                            <select className="form-select" value={gender} onChange={(e)=>setGender(e.target.value)}>
                                <option value=" ">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender &&<div className="text-danger" >{errors.gender}</div>}
                        </div > 
                        <input type="submit" value="Register" className="btn btn-primary" /> 
                        <input type="reset" onClick={handleReset}  className="btn btn-danger" /> 
                         <GoogleOAuthProvider 
                         clientId="485947985520-2929tagfo657ogj3ghljgq3e51rle2em.apps.googleusercontent.com">
                            <GoogleLogin 
                             text="continue-with" 
                            onSuccess={resp=>handleSuccess(resp)}
                            onError={()=>handleError()} 
                            useOneTap />
                         </GoogleOAuthProvider>
 
                    </form>
                    <p>Already A User? <a href="/login">Login</a> here</p>
                </div>
            </div>
            <button onClick={()=>handleClick()}>Click Me</button>
        </center>
        </>
    )
}