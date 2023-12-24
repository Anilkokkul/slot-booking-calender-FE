import { useEffect, useRef, useState } from "react";
import { instance } from "../App";
import { useNavigate } from "react-router-dom";
import { errorToast, toastSuccess } from "./toastify/toasts";

// Function to load script and append in DOM tree.
const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log("razorpay loaded successfully");
      resolve(true);
    };
    script.onerror = () => {
      console.log("error in loading razorpay");
      resolve(false);
    };
    document.body.appendChild(script);
  });

const RenderRazorpay = ({ orderId, formData, id, keyId }) => {
  const paymentId = useRef(null);
  const paymentMethod = useRef(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  // To load razorpay checkout modal script.
  const displayRazorpay = async (options) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      console.log("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // All information is loaded in options which we will discuss later.
    const rzp1 = new window.Razorpay(options);

    // If you want to retrieve the chosen payment method.
    rzp1.on("payment.submit", (response) => {
      paymentMethod.current = response.method;
    });

    // To get payment id in case of failed transaction.
    rzp1.on("payment.failed", (response) => {
      paymentId.current = response.error.metadata.payment_id;
      setPaymentStatus("failed");
    });

    // to open razorpay checkout modal.
    rzp1.open();
  };

  // informing server about payment
  const handlePayment = async (status, orderDetails = {}) => {
    await instance
      .post(`/payment`, {
        status,
        orderDetails,
      })
      .then((data) => {
        console.log(data.response);
      })
      .catch((data) => {
        console.log(data.data);
      });
    setPaymentStatus(status);
  };
  const options = {
    key: keyId,
    name: "Anil Kokkul",
    order_id: orderId,
    handler: (response) => {
    //   console.log("Payment succeeded");

      paymentId.current = response.razorpay_payment_id;

      handlePayment("succeeded", {
        orderId,
        paymentId,
      });
    },
    modal: {
      confirm_close: true,
      ondismiss: async (reason) => {
        // Handle payment cancellation, timeout, or failure
        // console.log("Payment cancelled or failed");
        handlePayment("failed", { reason });
      },
    },
    retry: {
      enabled: false,
    },
    timeout: 900,
    theme: {
      color: "",
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (paymentStatus === "succeeded") {
          const response = await instance.put(`/slot/booking/${id}`, {
            ...formData,
          });
          const time = response.data.slotBooked.startTime;
          toastSuccess(response.data.message);
          navigate(`/invitee/${time}`);
        } else if (paymentStatus === "failed") {
          navigate("/failure");
        } else if (paymentStatus === "failed") {
          alert("Your payment is in processing");
        }
      } catch (error) {
        errorToast(error.response.data.message);
      }
    };

    fetchData();
  }, [paymentStatus, id, formData, navigate]);

  useEffect(() => {
    displayRazorpay(options);
  }, []);

  return null;
};

export default RenderRazorpay;
