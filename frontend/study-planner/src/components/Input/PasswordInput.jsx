import  { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    return (
        <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
            <input 
                value={value}
                onChange={onChange}
                type={isShowPassword ? "text" : "password"}
                placeholder={placeholder || "Password"}
                className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
            />
            <button 
                type="button" 
                onClick={toggleShowPassword}
                className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
            >
                {/* {isShowPassword ? "Hide" : "Show"} */}
            </button>

            {isShowPassword ? <FaEye
            size={22}
            className="text-blue-600 cursor-pointer"
            onClick={() => toggleShowPassword()}
            /> : <FaEyeSlash
            size={22}
            className="text-grey cursor-pointer"
            onClick={() => toggleShowPassword()}
            />}
        </div>
    );
};
PasswordInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default PasswordInput;
