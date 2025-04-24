import React, { useState, useEffect } from "react";
import Questions from "../../components/Detector/ADHDquestions";
import AIResponse from "../../components/Detector/AI";
import { useNavigate } from "react-router-dom";
import UniversalNavbar from "../../components/Navbar/UniversalNavbar";
import Nav from "../../components/Navbar/Nav";
import axiosInstance from "../../utils/axiosInstance";

function Detector() {
  let score = 0;
  const [showExample, setExample] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

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

  const handleExampleClick = () => setExample(!showExample);
  const handlePrevClick = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setExample(false);
    }
  };

  const handleNextClick = () => {
    if (currentQuestion < Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setExample(false);
    }
  };

  const handleSliderChange = (event) => {
    const value = event.target.value;
    const questionId = Questions[currentQuestion].id;
    setScores((prevScores) => ({ ...prevScores, [questionId]: value }));
  };

  const handleResultClick = () => {
    const isIncomplete = !Questions.every((q) => scores[q.id] !== undefined);
    if (isIncomplete) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }
    const finalScore = calculateScore();
    setResult(finalScore);
    navigate("/detector/questions/results", { state: { score: finalScore } });
  };

  const calculateScore = () => {
    for (let i = 0; i < Questions.length; i++) {
      if (Questions[i].positiveAnswer.includes(parseInt(scores[Questions[i].id]))) {
        score += 1;
      }
    }
    console.log(`Score: ${score}`);
    return score;
  };

  return (
    <div className="fixed inset-0 flex flex-col font-montserrat overflow-y-auto">
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <UniversalNavbar userInfo={userInfo} pageTitle="ADHD Detector" />

      <div className="relative z-10 flex flex-1 w-full">
        <div className="w-20 z-10">
          <Nav />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8 mt-12">
          <div className="relative bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-4xl">
            <div className="w-full bg-gray-300 rounded-full h-2 mb-6">
              <div
                className="bg-slate-800 h-2 rounded-full"
                style={{ width: `${((currentQuestion + 1) / Questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="question-block">
              <div className="flex items-start justify-between">
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  {currentQuestion + 1}. {Questions[currentQuestion].question}
                </p>
                <button
                  className="text-sm text-slate-800 hover:underline font-medium ml-4"
                  onClick={handleExampleClick}
                >
                  {showExample ? "Hide Example" : "Show Example"}
                </button>
              </div>

              {showExample && (
                <div className="bg-slate-100 p-4 rounded-md mb-4 text-sm text-gray-700 border border-slate-200">
                  <AIResponse prompt={Questions[currentQuestion].question} />
                </div>
              )}

              <div className="mt-6">
                <div className="flex flex-col space-y-2">
                  {["Never", "Rarely", "Sometimes", "Often", "Very Often"].map((label, index) => (
                    <label key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`question-${Questions[currentQuestion].id}`}
                        value={index}
                        checked={parseInt(scores[Questions[currentQuestion].id]) === index}
                        onChange={(e) => handleSliderChange({ target: { value: e.target.value } })}
                        className="form-radio text-slate-800"
                      />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-10">
                <button
                  onClick={handlePrevClick}
                  disabled={currentQuestion === 0}
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 shadow-sm"
                >
                  Previous
                </button>

                {currentQuestion === Questions.length - 1 ? (
                  <div className="relative group">
                    <button
                      onClick={handleResultClick}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md"
                    >
                      See Result
                    </button>

                    {showTooltip && (
                      <div className="absolute w-auto h-auto -top-12 left-1/2 -translate-x-1/2 bg-red-700 text-white text-sm px-3 py-1 rounded shadow-lg z-20">
                        You have missing questions. Please go back and answer them.
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleNextClick}
                    className="px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 shadow-md"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detector;
