import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // console.log(supabase);
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase.from("smoothies").select();

      if (error) {
        setFetchError("가져오기 불가");
        setSmoothies(null);
        console.log(error);
      }
      if (data) {
        setSmoothies(data);
        setFetchError(null);
      }
    };

    fetchSmoothies();
  }, []);

  console.log(smoothies);

  return (
    <div className="page home">
      <h2>Home</h2>
      {smoothies && (
        <div className="page home">
          {smoothies.map((item) => (
            <div key={item.id}>
              <h2>{item.title}</h2>
              <button>
                <Link to={"/" + item.id}>편집</Link>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
