"use client";
import React from "react";

const DailyDiet = ({ dietDetails }) => {
  console.log(dietDetails);
  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      {dietDetails.map((item, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-lg font-bold mb-2">{item.time}</h2>
          {item.food.length > 0 ? (
            <ul>
              {item.food.map((foodItem, foodIndex) => (
                <li key={foodIndex} className="mb-2">
                  {foodItem}
                </li>
              ))}
            </ul>
          ) : (
            <p>No food items for this time</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailyDiet;
