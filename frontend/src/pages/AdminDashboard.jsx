import { useEffect, useState } from "react";

import studyTable from "../assets/study-table.jpg";
import kingBed from "../assets/king-bed.jpg";
import officeChair from "../assets/office-chair.jpg";
import sofa from "../assets/sofa.jpg";
import diningTable from "../assets/dining-table.jpg";

import api from "../services/api";

function AdminDashboard() {
  const [rentals, setRentals] = useState([]);
  const [furniture, setFurniture] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  // Rental controls
  const [rentalFilter, setRentalFilter] = useState("all");
  const [rentalSort, setRentalSort] = useState("newest");
  const [rentalPage, setRentalPage] = useState(1);

  const rentalsPerPage = 6;

  const emptyFurniture = {
    name: "",
    description: "",
    category: "",
    pricePerDay: "",
    image: "",
    available: true,
  };

  const [newFurniture, setNewFurniture] =
    useState(emptyFurniture);

  // =========================================================
  // FETCH RENTALS
  // =========================================================

  const fetchRentals = async () => {
    try {
      const response = await api.get("/rentals");

      setRentals(response.data.data || []);
      setError("");
    } catch (err) {
      console.error("Failed to load rentals:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load rentals."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH FURNITURE
  // =========================================================

  const fetchFurniture = async () => {
    try {
      const response = await api.get("/furniture");

      setFurniture(response.data.data || []);
    } catch (err) {
      console.error(
        "Failed to load furniture:",
        err
      );
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    fetchRentals();
    fetchFurniture();
  }, []);

  // =========================================================
  // UPDATE RENTAL
  // =========================================================

  const updateRental = async (id, action) => {
    try {
      await api.put(`/rentals/${id}/${action}`);

      const successMessages = {
        approve: "Rental approved successfully",
        complete: "Rental completed successfully",
        "admin-cancel":
          "Rental cancelled successfully",
      };

      alert(
        successMessages[action] ||
          "Rental updated successfully"
      );

      fetchRentals();
    } catch (err) {
      console.error(
        "Failed to update rental:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update rental."
      );
    }
  };

  // =========================================================
  // ADD FURNITURE
  // =========================================================

  const addFurniture = async (e) => {
    e.preventDefault();

    try {
      await api.post("/furniture", {
        ...newFurniture,
        pricePerDay: Number(
          newFurniture.pricePerDay
        ),
      });

      alert("Furniture added successfully");

      setNewFurniture({
        ...emptyFurniture,
      });

      fetchFurniture();
    } catch (err) {
      console.error(
        "Failed to add furniture:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to add furniture."
      );
    }
  };

  // =========================================================
  // DELETE FURNITURE
  // =========================================================

  const deleteFurniture = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this furniture?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/furniture/${id}`);

      alert("Furniture deleted successfully");

      fetchFurniture();
    } catch (err) {
      console.error(
        "Failed to delete furniture:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete furniture."
      );
    }
  };

  // =========================================================
  // START EDITING
  // =========================================================

  const startEditing = (item) => {
    setEditingId(item._id);

    setNewFurniture({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      pricePerDay: item.pricePerDay || "",
      image: item.image || "",
      available: item.available ?? true,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // UPDATE FURNITURE
  // =========================================================

  const updateFurniture = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/furniture/${editingId}`, {
        ...newFurniture,
        pricePerDay: Number(
          newFurniture.pricePerDay
        ),
      });

      alert("Furniture updated successfully");

      setEditingId(null);

      setNewFurniture({
        ...emptyFurniture,
      });

      fetchFurniture();
    } catch (err) {
      console.error(
        "Failed to update furniture:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update furniture."
      );
    }
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const cancelEdit = () => {
    setEditingId(null);

    setNewFurniture({
      ...emptyFurniture,
    });
  };

  // =========================================================
  // GET FURNITURE IMAGE
  // =========================================================

  const getImageUrl = (item) => {
    const furnitureName =
      item?.name?.toLowerCase().trim() || "";

    // Study Table
    if (
      furnitureName.includes("study") &&
      furnitureName.includes("table")
    ) {
      return studyTable;
    }

    // King Bed
    if (
      furnitureName.includes("king") &&
      furnitureName.includes("bed")
    ) {
      return kingBed;
    }

    // Office Chair
    if (
      furnitureName.includes("office") &&
      furnitureName.includes("chair")
    ) {
      return officeChair;
    }

    // Sofa
    if (furnitureName.includes("sofa")) {
      return sofa;
    }

    // Dining Table
    if (
      furnitureName.includes("dining") &&
      furnitureName.includes("table")
    ) {
      return diningTable;
    }

    // Database image fallback
    if (item?.image) {
      if (
        item.image.startsWith("http://") ||
        item.image.startsWith("https://")
      ) {
        return item.image;
      }

      return `/${item.image.replace(/^\/+/, "")}`;
    }

    return "";
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalFurniture = furniture.length;

  const totalRentals = rentals.length;

  const pendingRentals = rentals.filter(
    (rental) => rental.status === "pending"
  ).length;

  const approvedRentals = rentals.filter(
    (rental) => rental.status === "approved"
  ).length;

  const completedRentals = rentals.filter(
    (rental) => rental.status === "completed"
  ).length;

  const cancelledRentals = rentals.filter(
    (rental) => rental.status === "cancelled"
  ).length;

  // =========================================================
  // FILTER RENTALS
  // =========================================================

  const filteredRentals =
    rentalFilter === "all"
      ? [...rentals]
      : rentals.filter(
          (rental) =>
            rental.status === rentalFilter
        );

  // =========================================================
  // SORT RENTALS
  // =========================================================

  const sortedRentals = [...filteredRentals].sort(
    (a, b) => {
      const dateA = new Date(
        a.createdAt || a.startDate || 0
      );

      const dateB = new Date(
        b.createdAt || b.startDate || 0
      );

      if (rentalSort === "newest") {
        return dateB - dateA;
      }

      if (rentalSort === "oldest") {
        return dateA - dateB;
      }

      return 0;
    }
  );

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalRentalPages = Math.ceil(
    sortedRentals.length / rentalsPerPage
  );

  const startIndex =
    (rentalPage - 1) * rentalsPerPage;

  const endIndex =
    startIndex + rentalsPerPage;

  const paginatedRentals =
    sortedRentals.slice(
      startIndex,
      endIndex
    );

  // =========================================================
  // CHANGE RENTAL FILTER
  // =========================================================

  const handleRentalFilterChange = (
    filter
  ) => {
    setRentalFilter(filter);
    setRentalPage(1);
  };

  // =========================================================
  // CHANGE RENTAL SORT
  // =========================================================

  const handleRentalSortChange = (
    sort
  ) => {
    setRentalSort(sort);
    setRentalPage(1);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="admin-loading-page">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="admin-error-page">
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button
          onClick={() => {
            setLoading(true);
            fetchRentals();
            fetchFurniture();
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="admin-page">

      {/* =====================================================
          ADMIN HEADER
      ===================================================== */}

      <section className="admin-header">
        <div>
          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>Admin Dashboard</h1>

          <p className="admin-description">
            Manage your furniture, rental orders
            and inventory from one place.
          </p>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <span>Total Furniture</span>

          <strong>
            {totalFurniture}
          </strong>

          <small>
            Furniture items
          </small>
        </div>

        <div className="admin-stat-card">
          <span>Total Rentals</span>

          <strong>
            {totalRentals}
          </strong>

          <small>
            Rental orders
          </small>
        </div>

        <div className="admin-stat-card">
          <span>Pending Rentals</span>

          <strong>
            {pendingRentals}
          </strong>

          <small>
            Awaiting approval
          </small>
        </div>

        <div className="admin-stat-card">
          <span>Approved Rentals</span>

          <strong>
            {approvedRentals}
          </strong>

          <small>
            Currently approved
          </small>
        </div>

        <div className="admin-stat-card">
          <span>Completed Rentals</span>

          <strong>
            {completedRentals}
          </strong>

          <small>
            Successfully completed
          </small>
        </div>

        <div className="admin-stat-card">
          <span>Cancelled Rentals</span>

          <strong>
            {cancelledRentals}
          </strong>

          <small>
            Cancelled orders
          </small>
        </div>

      </section>

      {/* =====================================================
          ADD / EDIT FURNITURE
      ===================================================== */}

      <section className="admin-form-section">

        <div className="admin-section-heading">

          <p>
            {editingId
              ? "UPDATE INVENTORY"
              : "INVENTORY"}
          </p>

          <h2>
            {editingId
              ? "Edit Furniture"
              : "Add Furniture"}
          </h2>

          <span>
            {editingId
              ? "Update the furniture details below."
              : "Add a new furniture item to your collection."}
          </span>

        </div>

        <form
          className="admin-form"
          onSubmit={
            editingId
              ? updateFurniture
              : addFurniture
          }
        >

          <div className="admin-form-grid">

            <div className="admin-form-group">

              <label>
                Furniture Name
              </label>

              <input
                type="text"
                placeholder="Modern Sofa"
                value={newFurniture.name}
                onChange={(e) =>
                  setNewFurniture({
                    ...newFurniture,
                    name: e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="admin-form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                placeholder="Living Room"
                value={newFurniture.category}
                onChange={(e) =>
                  setNewFurniture({
                    ...newFurniture,
                    category: e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="admin-form-group">

              <label>
                Price Per Day
              </label>

              <input
                type="number"
                min="0"
                placeholder="500"
                value={newFurniture.pricePerDay}
                onChange={(e) =>
                  setNewFurniture({
                    ...newFurniture,
                    pricePerDay:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="admin-form-group">

              <label>
                Image Path
              </label>

              <input
                type="text"
                placeholder="images/sofa.jpg"
                value={newFurniture.image}
                onChange={(e) =>
                  setNewFurniture({
                    ...newFurniture,
                    image: e.target.value,
                  })
                }
              />

            </div>

          </div>

          <div className="admin-form-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="Describe the furniture..."
              value={newFurniture.description}
              onChange={(e) =>
                setNewFurniture({
                  ...newFurniture,
                  description:
                    e.target.value,
                })
              }
              required
            />

          </div>

          <div className="admin-form-bottom">

            <label className="availability-checkbox">

              <input
                type="checkbox"
                checked={
                  newFurniture.available
                }
                onChange={(e) =>
                  setNewFurniture({
                    ...newFurniture,
                    available:
                      e.target.checked,
                  })
                }
              />

              <span>
                Available for rental
              </span>

            </label>

            <div className="admin-form-buttons">

              <button
                type="submit"
                className="admin-primary-button"
              >
                {editingId
                  ? "Update Furniture"
                  : "Add Furniture"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </div>

        </form>

      </section>

      {/* =====================================================
          FURNITURE COLLECTION
      ===================================================== */}

      <section className="admin-content-section">

        <div className="admin-section-heading">

          <p>
            YOUR COLLECTION
          </p>

          <h2>
            Furniture
          </h2>

          <span>
            Manage all furniture available
            on your rental platform.
          </span>

        </div>

        {furniture.length === 0 ? (

          <div className="admin-empty">

            <h3>
              No furniture found
            </h3>

            <p>
              Add your first furniture item
              using the form above.
            </p>

          </div>

        ) : (

          <div className="admin-furniture-grid">

            {furniture.map((item) => {

              const imageUrl =
                getImageUrl(item);

              return (

                <article
                  className="admin-furniture-card"
                  key={item._id}
                >

                  <div className="admin-furniture-image">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          console.error(
                            "Image failed:",
                            imageUrl
                          );

                          e.currentTarget.style.display =
                            "none";

                          const parent =
                            e.currentTarget
                              .parentElement;

                          if (parent) {
                            parent.innerHTML =
                              '<div class="admin-image-placeholder">Image unavailable</div>';
                          }
                        }}
                      />

                    ) : (

                      <div className="admin-image-placeholder">
                        No Image
                      </div>

                    )}

                  </div>

                  <div className="admin-furniture-info">

                    <p className="admin-category">
                      {item.category}
                    </p>

                    <h3>
                      {item.name}
                    </h3>

                    <p className="admin-item-description">
                      {item.description}
                    </p>

                    <div className="admin-card-bottom">

                      <div>

                        <span>
                          PRICE / DAY
                        </span>

                        <strong>
                          ₹{item.pricePerDay}
                        </strong>

                      </div>

                      <span
                        className={`admin-availability ${
                          item.available
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        {item.available
                          ? "Available"
                          : "Not Available"}
                      </span>

                    </div>

                    <div className="admin-card-actions">

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          startEditing(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          deleteFurniture(
                            item._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>

      {/* =====================================================
          RENTAL ORDERS
      ===================================================== */}

      <section className="admin-orders-section">

        <div className="admin-section-heading">

          <p>
            RENTAL MANAGEMENT
          </p>

          <h2>
            Rental Orders
          </h2>

          <span>
            Review and manage customer rental
            requests.
          </span>

        </div>

        {/* ===================================================
            FILTER + SORT CONTROLS
        =================================================== */}

        <div className="rental-controls">

          <div className="rental-order-filters">

            <button
              type="button"
              className={
                rentalFilter === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleRentalFilterChange(
                  "all"
                )
              }
            >
              All
            </button>

            <button
              type="button"
              className={
                rentalFilter === "pending"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleRentalFilterChange(
                  "pending"
                )
              }
            >
              Pending
            </button>

            <button
              type="button"
              className={
                rentalFilter === "approved"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleRentalFilterChange(
                  "approved"
                )
              }
            >
              Approved
            </button>

            <button
              type="button"
              className={
                rentalFilter === "completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleRentalFilterChange(
                  "completed"
                )
              }
            >
              Completed
            </button>

            <button
              type="button"
              className={
                rentalFilter === "cancelled"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleRentalFilterChange(
                  "cancelled"
                )
              }
            >
              Cancelled
            </button>

          </div>

          {/* SORT */}

          <div className="rental-sort">

            <label>
              Sort by:
            </label>

            <select
              value={rentalSort}
              onChange={(e) =>
                handleRentalSortChange(
                  e.target.value
                )
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>
            </select>

          </div>

        </div>

        {/* ===================================================
            RENTAL COUNT
        =================================================== */}

        {sortedRentals.length > 0 && (

          <div className="rental-results-info">

            Showing{" "}
            {startIndex + 1}
            {" - "}
            {Math.min(
              endIndex,
              sortedRentals.length
            )}
            {" of "}
            {sortedRentals.length}
            {" rentals"}

          </div>

        )}

        {/* ===================================================
            FILTERED RENTALS
        =================================================== */}

        {sortedRentals.length === 0 ? (

          <div className="admin-empty">

            <h3>
              No{" "}
              {rentalFilter === "all"
                ? ""
                : rentalFilter}{" "}
              rentals found
            </h3>

            <p>
              There are no rental orders
              in this category.
            </p>

          </div>

        ) : (

          <>

            <div className="admin-orders-grid">

              {paginatedRentals.map(
                (rental) => (

                  <article
                    className="admin-order-card"
                    key={rental._id}
                  >

                    {/* ORDER TOP */}

                    <div className="admin-order-top">

                      <div>

                        <p className="admin-category">
                          FURNITURE
                        </p>

                        <h3>
                          {rental.furniture
                            ?.name ||
                            "Furniture"}
                        </h3>

                      </div>

                      <span
                        className={`admin-order-status status-${rental.status}`}
                      >
                        {rental.status}
                      </span>

                    </div>

                    {/* ORDER DETAILS */}

                    <div className="admin-order-details">

                      <div>

                        <span>
                          CUSTOMER
                        </span>

                        <strong>
                          {rental.user
                            ?.name ||
                            "Unknown"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          EMAIL
                        </span>

                        <strong>
                          {rental.user
                            ?.email ||
                            "N/A"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          START DATE
                        </span>

                        <strong>
                          {rental.startDate
                            ? new Date(
                                rental.startDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          END DATE
                        </span>

                        <strong>
                          {rental.endDate
                            ? new Date(
                                rental.endDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </strong>

                      </div>

                      {/* DELIVERY ADDRESS */}

                      <div className="delivery-address">

                        <span>
                          DELIVERY ADDRESS
                        </span>

                        <strong>

                          {rental.deliveryAddress ? (
                            <>
                              {rental
                                .deliveryAddress
                                .street}
                              ,{" "}

                              {rental
                                .deliveryAddress
                                .city}
                              ,{" "}

                              {rental
                                .deliveryAddress
                                .state}{" "}

                              -{" "}

                              {rental
                                .deliveryAddress
                                .pincode}
                            </>
                          ) : (
                            "N/A"
                          )}

                        </strong>

                      </div>

                    </div>

                    {/* ORDER BOTTOM */}

                    <div className="admin-order-bottom">

                      <div>

                        <span>
                          TOTAL AMOUNT
                        </span>

                        <strong>
                          ₹{rental.totalAmount}
                        </strong>

                      </div>

                      {/* RENTAL ACTIONS */}

                      <div className="admin-order-actions">

                        {/* PENDING */}

                        {rental.status ===
                          "pending" && (
                          <>
                            <button
                              type="button"
                              className="approve-button"
                              onClick={() =>
                                updateRental(
                                  rental._id,
                                  "approve"
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              className="cancel-button"
                              onClick={() =>
                                updateRental(
                                  rental._id,
                                  "admin-cancel"
                                )
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {/* APPROVED */}

                        {rental.status ===
                          "approved" && (
                          <>
                            <button
                              type="button"
                              className="approve-button"
                              onClick={() =>
                                updateRental(
                                  rental._id,
                                  "complete"
                                )
                              }
                            >
                              Complete
                            </button>

                            <button
                              type="button"
                              className="cancel-button"
                              onClick={() =>
                                updateRental(
                                  rental._id,
                                  "admin-cancel"
                                )
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {/* COMPLETED */}

                        {rental.status ===
                          "completed" && (
                          <span className="order-final-message">
                            Rental Completed
                          </span>
                        )}

                        {/* CANCELLED */}

                        {rental.status ===
                          "cancelled" && (
                          <span className="order-final-message">
                            Rental Cancelled
                          </span>
                        )}

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalRentalPages > 1 && (

              <div className="rental-pagination">

                <button
                  type="button"
                  disabled={rentalPage === 1}
                  onClick={() =>
                    setRentalPage(
                      (previous) =>
                        previous - 1
                    )
                  }
                >
                  Previous
                </button>

                <div className="pagination-pages">

                  {Array.from(
                    {
                      length:
                        totalRentalPages,
                    },
                    (_, index) => {
                      const page =
                        index + 1;

                      return (
                        <button
                          key={page}
                          type="button"
                          className={
                            rentalPage === page
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setRentalPage(
                              page
                            )
                          }
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                </div>

                <button
                  type="button"
                  disabled={
                    rentalPage ===
                    totalRentalPages
                  }
                  onClick={() =>
                    setRentalPage(
                      (previous) =>
                        previous + 1
                    )
                  }
                >
                  Next
                </button>

              </div>

            )}

          </>

        )}

      </section>

    </main>
  );
}

export default AdminDashboard;