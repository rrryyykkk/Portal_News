const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full px-4">
      <progress className="progress progress-primary w-full max-w-md mb-4"></progress>
      <p className="text-lg text-[var(--primary-color)] text-center">
        {message}
      </p>
    </div>
  );
};

export default Loading;
