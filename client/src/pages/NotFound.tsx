import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="font-xtradex font-extrabold text-7xl">Not Found</h1>
      <Link to="/" className="mt-10 text-lg text-primary">
        Navigate to Home ?{" "}
        <span className="text-blue-700  hover:underline">Click Here</span>
      </Link>
    </div>
  );
};

export default NotFound;
