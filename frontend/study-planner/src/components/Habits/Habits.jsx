import "react";
import PropTypes from "prop-types";
import { MdCreate, MdDelete } from "react-icons/md";

const Habits = ({
  name,

  progress,
  goal,
  color,

  onEditHabit,
  onDeleteHabit,
}) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg relative group">
      <div className="flex gap-4 mt-2 overflow-x-auto">
        <div className="flex flex-col items-center rounded-lg relative group hover:bg-gray-200 shadow-xl transition-all ease-in-out">
          <button
            onClick={onEditHabit}
            className="absolute top-0 left-0 mt-1 ml-1 text-gray-500 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <MdCreate />
          </button>
          <button
            onClick={onDeleteHabit}
            className="absolute top-0 right-0 mt-1 mr-1 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <MdDelete />
          </button>
          <div
            className="w-16 h-16 flex items-center justify-center text-lg font-bold border-4 rounded-full "
            style={{ borderColor: color }}
          >
            {progress}/{goal}
          </div>
          <span className="text-sm mt-1">{name}</span>
        </div>
      </div>
    </div>
  );
};

Habits.propTypes = {
  name: PropTypes.string.isRequired,
  repeat: PropTypes.string,
  progress: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  color: PropTypes.string,
  notify: PropTypes.bool,
  onEditHabit: PropTypes.func.isRequired,
  onDeleteHabit: PropTypes.func.isRequired,
  onToggleHabit: PropTypes.func,
};

export default Habits;
