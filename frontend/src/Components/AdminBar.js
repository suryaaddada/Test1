import { useEffect, useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"

export const AdminBar=()=>{
    const[user,setUser]=useState({}); 
    const navigate=useNavigate();
    useEffect(()=>{
        const fetchData=async()=>{
            const id=new URLSearchParams(window.location.search).get('id');
            const data=await fetch(`https://localhost:7288/api/User/GetUserById/${id}`);
            const response=await data.json();
            setUser(response);

        }

        fetchData();
    },[]); 
    const handleLogout=()=>{
       
        sessionStorage.removeItem("Login");
        navigate('/login');
        window.location.reload();
    }
    return(
        <>
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
  <div className="container-fluid">
    <p className="navbar-brand" >LMS System</p>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarColor01">
      <ul className="navbar-nav me-auto">
       
      <li className="nav-item">
        <Link className="nav-link active" to={`getuser?id=${user.id}`}>Profile</Link>   
        </li>
        <li className="nav-item">
        <Link className="nav-link active" to={`viewBook`}>Book Details</Link>   
        </li>
        {/* <li className="nav-item">
        <Link className="nav-link active" to={`addbook`}>Add Book</Link>   
        </li> 
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Separated link</a>
          </div>
    </li> */}
      </ul>
      <form className="d-flex">
      
        <Link className="nav-link active" to={`changePass?id=${user.id}`} style={{color:'white'}}>Change Password</Link>   
       
        <button className="btn btn-secondary my-2 my-sm-0" onClick={handleLogout}>LogOut</button>
      </form>
    </div>
  </div>
  
</nav>
<Outlet/>
        </>
    )
}