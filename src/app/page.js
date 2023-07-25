"use client";
import React, { useState, useEffect } from "react";
import DailyDiet from "./dietOverview";
import axios from "axios";

const DietPlanner = () => {
  const initialFormData = {
    user: "",
    dietaryPreference: "",
    healthGoal: "",
    numDays: 1,
    allergies: [],
    budgetConstraint: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [generatedDiet, setGeneratedDiet] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dayData, setDayData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleNextDay = async () => {
    setLoading(true);
    setCurrentDay((prevDay) => Math.min(formData.numDays, prevDay + 1));

    try {
      const response = await axios.post(
        `http://217.18.63.178:3000/getDay/${currentDay + 1}`,
        formData
      );
      setDayData(response.data.diet);
    } catch (error) {
      console.error("Error fetching daily diet:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data from local storage if available
    const savedData = JSON.parse(localStorage.getItem("dietPlannerData"));
    if (savedData) {
      setFormData(savedData);
    }

    // Fetch initial diet overview
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Save data to local storage
    localStorage.setItem("dietPlannerData", JSON.stringify(formData));

    // Send data to the server to generate the diet overview
    try {
      const response = await axios.post(
        "http://217.18.63.178:3000/getOverview",
        formData
      );
      setGeneratedDiet(response.data.overview);
      setCurrentDay(1);
    } catch (error) {
      console.error("Error generating diet overview:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    setCurrentDay((prevDay) => Math.max(1, prevDay - 1));
  };

  const fetchDietOverview = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://217.18.63.178:3000/getOverview",
        formData
      );
      setGeneratedDiet(response.data.overview);
      setCurrentDay(1);
    } catch (error) {
      console.error("Error generating diet overview:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">HealthBuddy Diet Planner</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="user" className="block font-bold mb-2">
            User Name:
          </label>
          <input
            type="text"
            id="user"
            name="user"
            value={formData.user}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dietaryPreference" className="block font-bold mb-2">
            Dietary Preference:
          </label>
          <input
            type="text"
            id="dietaryPreference"
            name="dietaryPreference"
            value={formData.dietaryPreference}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="healthGoal" className="block font-bold mb-2">
            Health Goal:
          </label>
          <input
            type="text"
            id="healthGoal"
            name="healthGoal"
            value={formData.healthGoal}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numDays" className="block font-bold mb-2">
            Number of Days:
          </label>
          <input
            type="number"
            id="numDays"
            name="numDays"
            value={formData.numDays}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="allergies" className="block font-bold mb-2">
            Allergies (separated by commas):
          </label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            value={formData.allergies.join(", ")}
            onChange={(e) => {
              const allergies = e.target.value.split(", ");
              setFormData((prevFormData) => ({
                ...prevFormData,
                allergies,
              }));
            }}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="budgetConstraint" className="block font-bold mb-2">
            Budget Constraint:
          </label>
          <input
            type="number"
            id="budgetConstraint"
            name="budgetConstraint"
            value={formData.budgetConstraint}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Generate Diet Plan
        </button>
      </form>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-75 bg-gray-300">
          <div className="text-lg font-bold">Generating Diet Plan...</div>
        </div>
      )}
      {generatedDiet && (
        <div className="border rounded p-4">{generatedDiet}</div>
      )}

      {dayData && <DailyDiet dietDetails={dayData}></DailyDiet>}
      <div className="mt-4">
        <button
          onClick={handlePreviousDay}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
          disabled={currentDay === 1}
        >
          Previous Day
        </button>
        <button
          onClick={handleNextDay}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={currentDay === formData.numDays}
        >
          Next Day
        </button>
      </div>
    </div>
  );
};

export default DietPlanner;
