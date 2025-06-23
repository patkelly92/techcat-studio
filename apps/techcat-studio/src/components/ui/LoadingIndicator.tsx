const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
        role="status"
        aria-label="loading"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingIndicator;
