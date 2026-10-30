
"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    setStatus("");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS environment variables");
      setStatus("Email service configuration is missing.");
      return;
    }

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone || "Not provided",
          message: data.details,
        },
        { publicKey }
      );

      console.log("EmailJS success:", response);
      setStatus("Message sent successfully!");
      reset();
    } catch (error) {
      console.error("EmailJS failed:", error);
      setStatus(
        `Failed to send message: ${error?.text || error?.message || "Unknown error"
        }`
      );
    }
  };

  const onInvalid = (formErrors) => {
    console.error("Form validation failed:", formErrors);
    setStatus("Please complete the required fields.");
  };

  const inputStyles =
    "outline-none border-0 p-0 mx-2 focus:ring-0 " +
    "placeholder:text-center placeholder:text-lg " +
    "border-b border-gray focus:border-gray bg-transparent";

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="mt-12 text-base xs:text-lg sm:text-xl font-medium leading-relaxed font-in"
    >
      Hello! My name is{" "}
      <input
        type="text"
        placeholder="your name"
        autoComplete="name"
        {...register("name", {
          required: "Name is required",
          maxLength: 80,
        })}
        className={inputStyles}
      />

      {errors.name && (
        <p className="text-red-500 text-sm">
          {errors.name.message}
        </p>
      )}

      and I want to discuss a potential project. You can email me at{" "}
      <input
        type="email"
        placeholder="your@email"
        autoComplete="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        })}
        className={inputStyles}
      />

      {errors.email && (
        <p className="text-red-500 text-sm">
          {errors.email.message}
        </p>
      )}

      or reach out to me on{" "}
      <input
        type="tel"
        placeholder="your phone"
        autoComplete="tel"
        {...register("phone")}
        className={inputStyles}
      />

      Here are some details about my project:
      <br />

      <textarea
        {...register("details", {
          required: "Project details are required",
        })}
        placeholder="My project is about..."
        rows={3}
        className="w-full outline-none border-0 p-0 mx-0 focus:ring-0 placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />

      {errors.details && (
        <p className="text-red-500 text-sm">
          {errors.details.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 font-medium inline-block capitalize text-lg sm:text-xl py-2 sm:py-3 px-6 sm:px-8 border-2 border-solid border-dark dark:border-light rounded cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Request"}
      </button>

      {status && (
        <p role="status" className="mt-4 text-base">
          {status}
        </p>
      )}
    </form>
  );
}
