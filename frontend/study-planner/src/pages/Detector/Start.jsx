import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Navbar/Nav";
import UniversalNavbar from "../../components/Navbar/UniversalNavbar";
import bgImage from "../../assets/images/adhd.jpg";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";

function Start() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const handleStart = () => {
    navigate("/detector/questions");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, []);
  {/* Task to do 
      - Add description about the quiz from https://add.org/wp-content/uploads/2015/03/adhd-questionnaire-ASRS111.pdf or search more 
      - Add description about the scoring system 
        Score (0–18)	Interpretation
            0–4	Low likelihood / Unlikely ADHD
            5–8	Mild indication / Monitor symptoms
            9–12	Moderate likelihood / Possible ADHD
            13–15	High likelihood / Strong signs of ADHD
            16–18	Very high likelihood / Clinical attention recommended
      - Need to add this part 
          "This is a screening suggestion, not a diagnosis. A licensed professional should always evaluate further."
  */}
  return (
    <>
    <div>
    <UniversalNavbar userInfo={userInfo} pageTitle="ADHD Detector" />
    </div>
    <div className="fixed inset-0 flex flex-col font-montserrat overflow-y-auto">
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      <div className="relative z-10 flex flex-1 w-full">
        {/* Side Navigation */}
        <div className="w-20 z-10">
          <Nav />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 ">
          <div className=" w-full h-auto flex flex-col justify-center bg-white/90 rounded-3xl shadow-xl text-left p-10 mt-20 mb-10">
            <div>
            <b>Welcome!</b> This questionnaire is based on the <b>Adult ADHD Self-Report Scale (ASRS v1.1)</b> developed by the World Health Organization (WHO) and leading ADHD researchers. 
              It contains <b>18 questions</b> designed to help screen for signs of <b>Attention-Deficit/Hyperactivity Disorder (ADHD)</b> in adults. 
              These questions reflect common experiences and behaviors associated with ADHD. Your responses can help you understand whether your symptoms may align with those of ADHD.
            </div>
            <br/>
            <p><b>⚠️ Important Note</b></p>
            <p>This is a screening tool, not a diagnosis. A licensed mental health professional should always be consulted for a full evaluation and diagnosis.</p>
            <br/>
            <p><b>How Scoring Works</b></p>
            <p>Your total score will range from <b>0 to 18</b>, where higher scores suggest more frequent symptoms of ADHD.</p>
            <table class="table-auto">
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
            <br/>
            <p className="text-xl font-bold text-gray-800 mb-6">
              Click the button below to start your ADHD self-check.
            </p>
            <div className="flex justify-center mt-0">
              <button
                onClick={handleStart}
                className="px-6 py-3 w-auto h-auto bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-900 shadow-md">
                Start Detector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Start;