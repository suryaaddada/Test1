import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const GetUser = () => {
  const [user, setUser] = useState();
  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [gender, setGender] = useState();
  const [isClicked, setIsClicked] = useState(true);
  const [errors, setErrors] = useState({});
  const [id, setid] = useState();
  const [isadmin, setIsAdmin] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    var isvalid = await validate();
    try {
      if (isvalid) {
        let data = { ...user, name, gender, mobile };

        const response = await fetch(`https://localhost:7288/api/User/UpdateData/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        console.log(response);

        if (response.ok) {
          setIsClicked(true);
          Swal.fire({
            title: "Updated Successfully",
            icon: 'success',
            timer: 1000,
          });
        } else {
          Swal.fire({
            title: "Update Failed",
            icon: 'error',
          });
        }
      }
    } catch (error) {
      console.log("Error in updating data:", error);
      Swal.fire({
        title: "Update Failed",
        icon: 'error',
      });
    }
  };

  const validate = async () => {
    const errors = {};

    if (!name?.trim()) {
      errors.name = "Name can't be Empty";
      setErrors(errors);
      return false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = "Name must be Alphabets only";
      setErrors(errors);
      return false;
    }

    if (mobile == null) {
      errors.mobile = "Mobile can't be Empty";
      setErrors(errors);
      return false;
    } else if (!/^[789]\d{9}$/.test(mobile)) {
      errors.mobile = "Mobile must contain 10 characters and start with 7, 8, 9";
      setErrors(errors);
      return false;
    }

    if (!gender?.trim()) {
      errors.gender = "Gender can't be Empty";
      setErrors(errors);
      return false;
    }
    return true;
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setErrors({});
    }, 3000);
    return () => clearTimeout(timer);
  }, [errors]);

  useEffect(() => {
    const fetchData = async () => {
      const id = new URLSearchParams(window.location.search).get('id');
      const data = await fetch(`https://localhost:7288/api/User/GetUserById/${id}`);
      const response = await data.json();
      console.log(response);
      setUser(response);
      setName(response.name);
      setGender(response.gender);
      setMobile(response.mobile);
      setid(response.id);
      setPassword(response.password);
      setEmail(response.email);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          {isClicked ? (
            <div className="container mt-4">
              <center>
                
                  <div >
                    <span className="text-center fw-bold">Name:</span>
                    <span className=" text-center">{name}</span>
                    
                  </div>
                  <div >
                    <span className="col-md-3 text-center fw-bold">Mobile:</span>
                    <span className="col-md-9 text-center">{mobile}</span>
                  </div>
                  <div >
                    <span className="col-md-3 text-center fw-bold">Gender:</span>
                    <span className="col-md-9 text-center">{gender}</span>
                  </div>
                  <div className="row">
                    <div className="col-md-12 text-center">
                      <button onClick={() => setIsClicked(false)} className="btn btn-warning">
                        Edit
                      </button>
                    </div>
                  </div>
                
              </center>
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmit}>
                <div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="form-control" />
                  {errors.name && <div className="text-danger">{errors.name}</div>}
                </div>

                <div>
                  <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter Mobile" className="form-control" />
                  {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                </div>
                <div>
                  <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value=" ">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <div className="text-danger">{errors.gender}</div>}
                </div>
                <br />
                <input type="submit" value="Update" className="btn btn-warning" />
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
