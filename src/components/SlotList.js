import React from "react";
import { useNavigate } from "react-router-dom";

function SlotList({ filteredSlots, loading }) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className=" d-flex justify-content-center align-content-center">
      {loading ? (
        <div className=" text-center text-info fs-5">
          Checking available slots for the day
        </div>
      ) : (
        <ul>
          {filteredSlots.length > 0 ? (
            <ul className="list-group">
              {filteredSlots.map((slot) => (
                <li
                  key={slot._id}
                  className="btn border mb-2 sloth "
                  id="sloth"
                  onClick={() => handleClick(slot._id)}
                >
                  {new Date(slot.startTime).toLocaleTimeString(undefined, {
                    timeZone: "UTC",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}{" "}
                  -<span> </span>
                  {new Date(slot.endTime).toLocaleTimeString("UTC", {
                    timeZone: "UTC",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </li>
              ))}
            </ul>
          ) : (
            <p>No available slots for the selected day</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default SlotList;
