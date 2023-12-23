import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import SlotList from "../components/SlotList";
import { MdAccessTime } from "react-icons/md";
import { SlCamrecorder } from "react-icons/sl";
import { instance } from "../App";
import Calendar from "react-calendar";

function Main() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSlots, setShowSlots] = useState(false);
  const [slots, setSlots] = useState([]);
  // console.log(slots);

  useEffect(() => {
    instance
      .get("/slots")
      .then((data) => {
        // console.log(data.data.Slots);
        setSlots(data.data.Slots);
      })
      .catch((data) => {
        console.log(data);
      });
  }, [selectedDate]);

  const filteredSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.startTime).toLocaleDateString();
    const selectedDateString = selectedDate.toLocaleDateString();
    return slotDate === selectedDateString && slot.available === true;
  });

  const onChange = (date) => {
    setSelectedDate(date);
    setShowSlots(true);
  };
  const isWeekend = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      return isWeekend(date) ? "weekend-tile" : "weekday-tile";
    }
    return "";
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      return isWeekend(date);
    }
    return false;
  };

  return (
    <div className="App">
      <h1 className="text-center my-2">Slot Booking Calender</h1>
      <div className=" main mt-3 col-xl-9 col-sm-12 col-md-11 col-lg-10 flex-lg-row flex-column mx-auto d-flex gap-4 justify-content-center align-content-center border rounded-4 p-5 h-75">
        <div className=" p-3 col-lg-4 border rounded main">
          <img
            src="/pic.jpg"
            alt="pic"
            className=" w-25 object-fit-cover pic  overflow-hidden my-3"
          />
          <h4 className=" fw-bold m-0">Anil Kokkul</h4>
          <div className=" fw-bold fs-2">Discovery Call</div>
          <div className=" details">
            <MdAccessTime />
            <p className=" m-0">45 min</p>
          </div>
          <div className="details">
            <SlCamrecorder />
            <p>Web conferencing details provided upon confirmation.</p>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <div className=" text-center">
            <h4 className=" border-bottom">Select Date & Time</h4>
            <div>
              <Calendar
                onChange={onChange}
                value={selectedDate}
                minDate={new Date()}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                className="reactCalender rounded-3 overflow-hidden p-2 "
              />
            </div>
          </div>
          <div
            className={`slot-container ${
              showSlots ? "show-slots" : "hide-slots"
            } `}
          >
            {showSlots && (
              <div className="text-center">
                <h2>Available Slots</h2>
                <SlotList
                  selectedDate={selectedDate}
                  filteredSlots={filteredSlots}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
