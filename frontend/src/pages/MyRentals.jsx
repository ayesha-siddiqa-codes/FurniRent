import { useEffect, useState } from "react";

import studyTable from "../assets/study-table.jpg";
import kingBed from "../assets/king-bed.jpg";
import officeChair from "../assets/office-chair.jpg";
import sofa from "../assets/sofa.jpg";
import diningTable from "../assets/dining-table.jpg";

import api from "../services/api";

function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // GET IMAGE FOR FURNITURE
  // --------------------------------
  const getFurnitureImage = (furniture) => {
    // First use image from database if available
    if (furniture?.image) {
      return furniture.image;
    }

    const furnitureName = furniture?.name
      ?.trim()
      ?.toLowerCase();

    const imageMap = {
      "study table": studyTable,
      "king bed": kingBed,
      "office chair": officeChair,
      sofa: sofa,
      "dining table": diningTable,
    };

    return imageMap[furnitureName] || studyTable;
  };

  // --------------------------------
  // FETCH RENTALS
  // --------------------------------
  const fetchRentals = async () => {
    try {
      setError("");

      const response = await api.get("/rentals/my");

      console.log("My rentals:", response.data);

      setRentals(response.data.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load rentals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  // --------------------------------
  // CANCEL RENTAL
  // --------------------------------
  const cancelRental = async (rentalId) => {
    try {
      await api.put(`/rentals/${rentalId}/cancel`);

      alert("Rental cancelled successfully");

      fetchRentals();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to cancel rental"
      );
    }
  };

  // --------------------------------
  // LOADING
  // --------------------------------
  if (loading) {
    return (
      <div className="my-rentals-page">
        <div className="my-rentals-loading">
          <h2>Loading your rentals...</h2>
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------
  if (error) {
    return (
      <div className="my-rentals-page">
        <div className="my-rentals-error">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  // --------------------------------
  // PAGE
  // --------------------------------
  return (
    <div className="my-rentals-page">

      {/* HEADER */}
      <div className="my-rentals-header">

        <p className="my-rentals-label">
          YOUR RENTALS
        </p>

        <h1>Rental History</h1>

        <p>
          View and manage all your furniture rentals
          in one place.
        </p>

      </div>

      {/* NO RENTALS */}
      {rentals.length === 0 ? (
        <div className="no-rentals">

          <h2>No Rentals Yet</h2>

          <p>
            You haven't rented any furniture yet.
            Explore our collection and find something
            you love.
          </p>

        </div>
      ) : (

        /* RENTALS GRID */
        <div className="rentals-grid">

          {rentals.map((rental) => {

            const furniture = rental.furniture;

            const imageUrl = getFurnitureImage(
              furniture
            );

            return (
              <div
                className="rental-history-card"
                key={rental._id}
              >

                {/* IMAGE */}
                <div className="rental-history-image-wrapper">

                  <img
                    src={imageUrl}
                    alt={furniture?.name || "Furniture"}
                    className="rental-history-image"
                    onError={(e) => {
                      e.currentTarget.src = studyTable;
                    }}
                  />

                </div>

                {/* CONTENT */}
                <div className="rental-history-content">

                  {/* TOP */}
                  <div className="rental-history-top">

                    <div>

                      <p className="rental-history-label">
                        RENTAL
                      </p>

                      <h2>
                        {furniture?.name ||
                          "Furniture"}
                      </h2>

                    </div>

                    <span
                      className={`rental-status-badge ${rental.status}`}
                    >
                      {rental.status}
                    </span>

                  </div>

                  {/* CATEGORY */}
                  <p className="rental-history-category">
                    {furniture?.category ||
                      "Furniture"}
                  </p>

                  {/* DATES */}
                  <div className="rental-dates">

                    <div className="rental-date">

                      <span>
                        START DATE
                      </span>

                      <strong>
                        {new Date(
                          rental.startDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    <div className="rental-date">

                      <span>
                        END DATE
                      </span>

                      <strong>
                        {new Date(
                          rental.endDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </strong>

                    </div>
                    

                  </div>
                  {/* DELIVERY ADDRESS */}
<div className="rental-delivery-address">

  <span>DELIVERY ADDRESS</span>

  {rental.deliveryAddress ? (
    <strong>
      {rental.deliveryAddress.street},{" "}
      {rental.deliveryAddress.city},{" "}
      {rental.deliveryAddress.state} -{" "}
      {rental.deliveryAddress.pincode}
    </strong>
  ) : (
    <strong>N/A</strong>
  )}

</div>

                  {/* TOTAL */}
                  <div className="rental-history-total">

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹{rental.totalAmount}
                    </strong>

                  </div>

                  {/* CANCEL */}
                  {rental.status === "pending" && (

                    <button
                      className="cancel-rental-button"
                      onClick={() =>
                        cancelRental(
                          rental._id
                        )
                      }
                    >
                      Cancel Rental
                    </button>

                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default MyRentals;