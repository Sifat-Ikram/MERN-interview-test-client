import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const DrawingList = () => {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4321/drawings")
      .then((response) => setDrawings(response.data))
      .catch((error) => console.error(error));
  }, []);

 

  return (
    <div>
      <h1>All Drawings</h1>
      <ul>
        {drawings.map((drawing) => (
          <li key={drawing._id}>
            <div className="flex justify-between items-center px-10">
              <Link to={`/drawings/${drawing._id}`}>{drawing.title}</Link>
              <button
                onClick={() => handleClick(drawing)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                <MdDelete />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrawingList;
