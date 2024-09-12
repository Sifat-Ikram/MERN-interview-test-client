import { Link } from "react-router-dom";
import useDrawing from "./components/hooks/useDrawing";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";

const App = () => {
  const [drawings, refetch] = useDrawing();
  console.log(drawings);

  const handleDelete = (drawing) => {
    Swal.fire({
      title: "Are you sure you want to delete this drawing?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:4321/drawings/${drawing._id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "drawing Deleted!",
                text: "This drawing has been deleted.",
                icon: "success",
              });
              refetch();
            }
          })
          .catch((error) => {
            console.log(error.message);
            Swal.fire({
              title: "Error",
              text: "An error occurred while deleting the item.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <header className="bg-blue-600 text-white py-4 px-6">
          <h1 className="text-3xl font-bold text-center">All Drawings</h1>
        </header>
        <main className="p-6">
          <ul className="space-y-4">
            {drawings.map((drawing) => (
              <li
                key={drawing._id}
                className="hover:text-blue-700 cursor-pointer bg-white p-4 shadow rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center px-10">
                  <Link
                    to={`/drawings/${drawing._id}`}
                    className="text-2xl font-semibold"
                  >
                    {drawing.name}
                  </Link>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    onClick={() => handleDelete(drawing)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
      <Link to={"/addDrawing"} className="flex justify-center mt-10">
        <button className="btn btn-primary w-full max-w-4xl mx-auto">
          Add Drawing
        </button>
      </Link>
    </div>
  );
};

export default App;
