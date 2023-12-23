import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdAccessTime } from "react-icons/md";
import { SlCamrecorder } from "react-icons/sl";
import { IoEarth } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import { CiCalendarDate } from "react-icons/ci";
import { instance } from "../App";
import { errorToast, toastSuccess } from "./toastify/toasts";

const Form = () => {
  const navigate = useNavigate();
  const [slot, setSlot] = useState({});
  const { id } = useParams();
  const dateTime = new Date(slot.startTime);
  const options = {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  useEffect(() => {
    instance
      .get("/slots")
      .then((data) => {
        const slot = data.data.Slots.filter((slot) => {
          return slot._id === id;
        });
        setSlot(slot[0]);
      })
      .catch((data) => {
        console.log(data);
      });
  }, [id]);

  const formattedDateTime = dateTime.toLocaleString(undefined, options);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNumber: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Invalid Mobile Number number")
        .required("Mobile Number number is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      instance
        .put(`/slot/booking/${id}`, { ...values, available: false })
        .then((data) => {
          const time = data.data.slotBooked.startTime;
          toastSuccess(data.data.message);
          navigate(`/invitee/${time}`);
        })
        .catch((data) => {
          errorToast(data.response.data.message);
        });
      resetForm();
    },
  });

  return (
    <>
      <div className="mt-5 d-flex justify-content-center align-content-center flex-md-row flex-column form-group col-md-8 col-11 mx-auto border rounded-4 overflow-hidden">
        <div className="slotbook p-sm-4 p-3 px-md-4 px-sm-5 col-lg-6">
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
          <div className="details">
            <CiCalendarDate />
            <p>{formattedDateTime}</p>
          </div>
          <div className="details">
            <IoEarth />
            <p>India Standard Time</p>
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="col-md-6 col-md-6 bg-light p-sm-4 p-3 px-md-4 px-sm-5"
        >
          <h1 className="text-center mt-3">Enter your Details</h1>
          <div className="mt-3">
            <label htmlFor="name" className="mb-1">
              Name:
            </label>
            <input
              className="form-control"
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger">{formik.errors.name}</div>
            )}
          </div>

          <div className="mt-3">
            <label htmlFor="email">Email:</label>
            <input
              className="form-control"
              type="text"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </div>

          <div className="mt-3">
            <label htmlFor="mobileNumber">mobileNumber:</label>
            <input
              className="form-control"
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobileNumber}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <div className="text-danger">{formik.errors.mobileNumber}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Schedule Event
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
