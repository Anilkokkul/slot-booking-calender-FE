import React from "react";
import { GiConfirmed } from "react-icons/gi";
import { CiCalendarDate } from "react-icons/ci";
import { IoEarth } from "react-icons/io5";
import { SlCamrecorder } from "react-icons/sl";
import { useParams } from "react-router-dom";
import { BsPerson } from "react-icons/bs";

function Booked() {
  const { time } = useParams();
  const dateTime = new Date(time);
  //   console.log(dateTime);
  const options = {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDateTime = dateTime.toLocaleString(undefined, options);
  return (
    <div className="col-11 mx-auto mt-5 col-sm-10 col-md-8 col-lg-6 border p-md-4 p-3    rounded-3 bg-light main ">
      <div className=" mt-3 ">
        <div className=" text-center">
          <img className="pic w-25" src="/pic.jpg" alt="pic" />
          <h2 className="booked mt-3 ">
            <GiConfirmed />
            You are scheduled
          </h2>
          <p className=" mt-2">
            A calendar invitation has been sent to your email address.
          </p>
        </div>
        <div className="col-md-8 mx-auto border p-2 p-md-3 rounded-2 col-10">
          <div className=" fw-bold fs-2">Discovery Call</div>
          <h4 className=" fw-bold m-0 details ">
            <BsPerson />
            Anil Kokkul
          </h4>
          <div className="details">
            <CiCalendarDate />
            <p className=" fw-bold">{formattedDateTime}</p>
          </div>
          <div className="details">
            <IoEarth />
            <p>India Standard Time</p>
          </div>
          <div className="details">
            <SlCamrecorder />
            <p>Web conferencing details provided upon confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booked;
