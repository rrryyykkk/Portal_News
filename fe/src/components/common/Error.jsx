// src/components/common/ErrorScreen.jsx
const Error = ({ message = "Something went wrong." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <svg
        className="w-16 h-16 text-error mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="text-lg text-error">{message}</p>
    </div>
  );
};

export default Error;
