import Nav from "../../components/Navbar/Nav";
import React from "react";
import { useLocation } from "react-router-dom";
import UniversalNavbar from "../../components/Navbar/UniversalNavbar";
import { useState } from "react";


function Results() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const { score } = location.state || {};
  console.log(`Score from Results: ${score}`);

  const getInterpretation = (score) => {
    if (score <= 4) return "Low likelihood / Unlikely ADHD";
    if (score <= 8) return "Mild indication / Monitor symptoms";
    if (score <= 12) return "Moderate likelihood / Possible ADHD";
    if (score <= 15) return "High likelihood / Strong signs of ADHD";
    return "Very high likelihood / Clinical attention recommended";
  };

  return (
    <div className="fixed inset-0 flex flex-col font-montserrat overflow-y-auto">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-1 w-full">
        {/* Sidebar */}
        <div className="w-20 z-10">
          <Nav />
        </div>
        {/* Universal Navbar on top */}
        <UniversalNavbar userInfo={userInfo} pageTitle="ADHD Detector" />

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full h-auto flex flex-col justify-center bg-white/90 rounded-3xl shadow-xl text-left p-10 mt-20 mb-10">
            <h1 className="text-3xl font-bold text-center mb-6">ADHD Detector Results</h1>
            <p className="text-center text-lg mb-4">
              Your score is: <b>{score}</b>
            </p>
            <p className="text-center text-lg mb-4 font-semibold">
              Interpretation: {getInterpretation(score)}
            </p>

            <table className="table-auto mx-auto mt-6 mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Score Range</th>
                  <th className="px-4 py-2">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">0–4</td>
                  <td className="px-4 py-2">Low likelihood / Unlikely ADHD</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">5–8</td>
                  <td className="px-4 py-2">Mild indication / Monitor symptoms</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">9–12</td>
                  <td className="px-4 py-2">Moderate likelihood / Possible ADHD</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">13–15</td>
                  <td className="px-4 py-2">High likelihood / Strong signs of ADHD</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">16–18</td>
                  <td className="px-4 py-2">Very high likelihood / Clinical attention recommended</td>
                </tr>
              </tbody>
            </table>

            <div className="text-center text-sm text-gray-700 mt-4">
              <p><b>⚠️ Note:</b> This is a screening suggestion, not a diagnosis.</p>
              <br/>
              <p>A licensed mental health professional should always be consulted for a full evaluation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
