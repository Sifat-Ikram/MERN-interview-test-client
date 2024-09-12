import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useDrawing = () => {

    const { refetch, data: drawings = [] } = useQuery({
        queryKey: ['drawing'],
        queryFn: async () => {
            const res = await axios("http://localhost:4321/drawings");
            return res.data;
        }

    })
    return [drawings, refetch];
};

export default useDrawing;