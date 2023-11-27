import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const ViewBookDetails = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const[search,setSearch]=useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://localhost:7288/api/Book/Get All Books",{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${sessionStorage.getItem("token")}`,
          },
          
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
          setFilteredBooks(data)
        } else {
          console.error("Error fetching books else:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching books catch:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleRowClick = (bookId) => {
   
    console.log(bookId);
    navigate(`../editbook?id=${bookId}`);
  };

  const format = (date) => {
    var d = new Date(date);
    return d.toLocaleDateString();
  };

  const handleSearch = (e) => {
    const inputValue = e.target.value.trim().toLowerCase();
    setSearch(inputValue);
  
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(inputValue)||
        book.author.toLowerCase().includes(inputValue)||
        book.genre.toLowerCase().includes(inputValue)
      
    );
  
    setFilteredBooks(filteredBooks);
  };
  
  

  return (
    <>
      <div style={{ paddingTop: "20px", textAlign: "left" }} className="input-group">
        <button onClick={() => navigate('../addbook')} className="btn btn-success">Add Book</button> 
        <input type='search' className="form-control" onInput={(e)=>handleSearch(e)} value={search} placeholder="Search"/>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Publish Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.bookId} onClick={() => handleRowClick(book.bookId)}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{format(book.publishDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};


