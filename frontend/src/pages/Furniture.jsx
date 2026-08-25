import { useEffect, useState } from "react";
import api from "../services/api";
import FurnitureCard from "../components/FurnitureCard";

function Furniture() {
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const response = await api.get("/furniture");
        setFurniture(response.data.data);
      } catch (error) {
        setError("Failed to load furniture.");
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();
  }, []);

  if (loading) {
    return <h2>Loading furniture...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <main className="section">

      <div className="section-title">
  <span className="collection-label">OUR COLLECTION</span>
  <h1>Furniture You'll Love</h1>
  <p>
    Discover furniture that fits your style, space and lifestyle.
  </p>
</div>

      {furniture.length === 0 ? (
        <p>No furniture available.</p>
      ) : (
        <div className="furniture-grid">
          {furniture.map((item) => (
            <FurnitureCard
              key={item._id}
              furniture={item}
            />
          ))}
        </div>
      )}

    </main>
  );
}

export default Furniture;