import { useEffect, useState } from "react"
import {AiFillEye,AiFillEyeInvisible} from "react-icons/ai";
import Swal from "sweetalert2";

export const ChangePassword=()=>{
    const[user,setUser]=useState();
    const[password,setPassword]=useState();
    const[showPassword,setShowPassword]=useState();
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const id = new URLSearchParams(window.location.search).get('id');
            const data = await fetch(`https://localhost:7288/api/User/GetUserById/${id}`);
            const response = await data.json();
            setUser(response);
            setPassword(response.password);
            console.log('p', password);
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
    
        fetchUser();
      }, []);
      const handleUpdate=async()=>{
        const isApproved=await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update it!'
          }); 
          if(isApproved.isConfirmed)
          {
            let data={...user,password};
            const response = await fetch(`https://localhost:7288/api/User/UpdateData/${user.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });

              if(response.ok)
              {
                Swal.fire(
                    'Updated!',
                    'Your password has been updated.',
                    'success'
                  )
              }
              else {
                
                Swal.fire('Error!', 'Failed to delete the book.', 'error');
              }
          }


      }
    return(
        <>
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <div className="input-group">
                    <input type={showPassword?'text':'password'}  value={password} onChange={(e)=>setPassword(e.target.value)} className='form-control'  />
                    <button onClick={()=>setShowPassword(!showPassword)}>
                        {
                            showPassword?(<AiFillEye/>):(<AiFillEyeInvisible/>)
                        }
                    </button>
                    </div>
                    <br/>
                    <div>
                        <button className="btn btn-secondary" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}