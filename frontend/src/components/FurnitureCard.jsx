import { Link } from "react-router-dom";

import diningTable from "../assets/dining-table.jpg";
import kingBed from "../assets/king-bed.jpg";
import officeChair from "../assets/office-chair.jpg";
import sofa from "../assets/sofa.jpg";
import studyTable from "../assets/study-table.jpg";

const furnitureImages = {
  "Dining Table": diningTable,
  "King Bed": kingBed,
  "Office Chair": officeChair,
  Sofa: sofa,
  "Study Table": studyTable,
};

const FurnitureCard = ({ furniture }) => {
  const image =
    furnitureImages[furniture.name] || sofa;

  return (
    <div className="furniture-card">

      <img
        src={image}
        alt={furniture.name}
      />

      <div className="furniture-card-content">

        <h3>{furniture.name}</h3>

        <p>{furniture.description}</p>

        <p>
          <strong>Category:</strong> {furniture.category}
        </p>

        <p className="price">
          ₹{furniture.pricePerDay} / day
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {furniture.available
            ? "Available"
            : "Not Available"}
        </p>

        <Link to={`/rent/${furniture._id}`}>
          <button
            className="btn btn-primary"
            disabled={!furniture.available}
          >
            {furniture.available
              ? "Rent Now"
              : "Not Available"}
          </button>
        </Link>

      </div>
    </div>
  );
};

export default FurnitureCard;