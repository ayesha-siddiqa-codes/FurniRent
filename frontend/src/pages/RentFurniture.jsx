import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// Local furniture images
import studyTable from "../assets/study-table.jpg";
import kingBed from "../assets/king-bed.jpg";
import officeChair from "../assets/office-chair.jpg";
import sofa from "../assets/sofa.jpg";
import diningTable from "../assets/dining-table.jpg";

// Furniture image mapping
const furnitureImages = {
  "Study Table": studyTable,
  "King Bed": kingBed,
  "Office Chair": officeChair,
  Sofa: sofa,
  "Dining Table": diningTable,
};

function RentFurniture() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [furniture, setFurniture] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [rentalDays, setRentalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // GET FURNITURE DETAILS
  // ==========================================

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        setError("");

        const response = await api.get(`/furniture/${id}`);

        console.log("Furniture response:", response.data);
        console.log("Furniture data:", response.data.data);
        console.log(
          "Available:",
          response.data.data.available
        );

        setFurniture(response.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load furniture details."
        );
      }
    };

    fetchFurniture();
  }, [id]);

  // ==========================================
  // GET LOCAL FURNITURE IMAGE
  // ==========================================

  const getFurnitureImage = () => {
    if (!furniture) {
      return sofa;
    }

    // First check database image
    if (furniture.image) {
      if (
        furniture.image.startsWith("http://") ||
        furniture.image.startsWith("https://")
      ) {
        return furniture.image;
      }
    }

    // Otherwise use local image based on furniture name
    return (
      furnitureImages[furniture.name] ||
      sofa
    );
  };

  // ==========================================
  // CALCULATE RENTAL DAYS AND TOTAL
  // ==========================================

  useEffect(() => {
    if (!startDate || !endDate || !furniture) {
      setRentalDays(0);
      setTotalAmount(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days =
      difference / (1000 * 60 * 60 * 24);

    if (days > 0) {
      setRentalDays(days);

      setTotalAmount(
        days * furniture.pricePerDay
      );
    } else {
      setRentalDays(0);
      setTotalAmount(0);
    }
  }, [startDate, endDate, furniture]);

  // ==========================================
  // RENT FURNITURE
  // ==========================================

  const handleRent = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!furniture.available) {
      setError(
        "This furniture is currently not available."
      );
      return;
    }

    if (!startDate || !endDate) {
      setError(
        "Please select both dates."
      );
      return;
    }

    if (rentalDays <= 0) {
      setError(
        "End date must be after the start date."
      );
      return;
    }

    if (
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      setError(
        "Please enter your complete delivery address."
      );
      return;
    }

    if (
      !/^\d{6}$/.test(
        deliveryAddress.pincode
      )
    ) {
      setError(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    try {
      const response = await api.post(
        "/rentals",
        {
          furniture: id,
          startDate: startDate,
          endDate: endDate,
          deliveryAddress:
            deliveryAddress,
        }
      );

      setMessage(
        response.data.message ||
          "Rental successful!"
      );

      setTimeout(() => {
        navigate("/my-rentals");
      }, 1000);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Rental failed. Please try again."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!furniture && !error) {
    return (
      <div className="rental-page">
        <div className="rental-loading">
          <h2>
            Loading furniture...
          </h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !furniture) {
    return (
      <div className="rental-page">
        <div className="rental-error">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="rental-page">

      <div className="rental-container">

        {/* =====================================
            LEFT SIDE - PRODUCT
        ===================================== */}

        <div className="rental-product">

          <img
            src={getFurnitureImage()}
            alt={furniture.name}
            className="rental-image"
            onError={(e) => {
              e.currentTarget.src = sofa;
            }}
          />

          <div className="rental-product-info">

            <p className="rental-label">
              YOUR SELECTION
            </p>

            <h1>
              {furniture.name}
            </h1>

            <p className="rental-description">
              {furniture.description}
            </p>

            <p className="rental-category">
              <strong>
                Category:
              </strong>{" "}
              {furniture.category}
            </p>

            <div className="rental-price">
              ₹{furniture.pricePerDay}
              <span>
                {" "}
                / day
              </span>
            </div>

            <div
              className={
                furniture.available
                  ? "rental-status available"
                  : "rental-status unavailable"
              }
            >
              <span className="status-dot"></span>

              {furniture.available
                ? "Available for Rental"
                : "Currently Not Available"}
            </div>

          </div>

        </div>

        {/* =====================================
            RIGHT SIDE - RENTAL FORM
        ===================================== */}

        <div className="rental-form-card">

          <p className="rental-form-label">
            RENT THIS FURNITURE
          </p>

          <h2>
            Choose Your Rental Dates
          </h2>

          <form onSubmit={handleRent}>

            {/* START DATE */}

            <div className="rental-form-group">

              <label>
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                required
              />

            </div>

            {/* END DATE */}

            <div className="rental-form-group">

              <label>
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                min={
                  startDate ||
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                required
              />

            </div>

            {/* STREET ADDRESS */}

            <div className="rental-form-group">

              <label>
                Street Address
              </label>

              <input
                type="text"
                placeholder="Enter your street address"
                value={
                  deliveryAddress.street
                }
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    street:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            {/* CITY */}

            <div className="rental-form-group">

              <label>
                City
              </label>

              <input
                type="text"
                placeholder="Enter your city"
                value={
                  deliveryAddress.city
                }
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    city:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            {/* STATE */}

            <div className="rental-form-group">

              <label>
                State
              </label>

              <input
                type="text"
                placeholder="Enter your state"
                value={
                  deliveryAddress.state
                }
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    state:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            {/* PIN CODE */}

            <div className="rental-form-group">

              <label>
                PIN Code
              </label>

              <input
                type="text"
                placeholder="Enter 6-digit PIN code"
                value={
                  deliveryAddress.pincode
                }
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    pincode:
                      e.target.value,
                  })
                }
                maxLength="6"
                inputMode="numeric"
                required
              />

            </div>

            {/* =================================
                RENTAL SUMMARY
            ================================= */}

            <div className="rental-summary">

              <div className="summary-row">

                <span>
                  Rental Days
                </span>

                <strong>
                  {rentalDays}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Price / Day
                </span>

                <strong>
                  ₹{furniture.pricePerDay}
                </strong>

              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

            </div>

            {/* ERROR MESSAGE */}

            {error && (
              <div className="rental-message error-message">
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}

            {message && (
              <div className="rental-message success-message">
                {message}
              </div>
            )}

            {/* CONFIRM RENTAL BUTTON */}

            <button
              type="submit"
              className="rent-confirm-button"
              disabled={
                !furniture.available
              }
            >
              {furniture.available
                ? "Confirm Rental"
                : "Not Available"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default RentFurniture;