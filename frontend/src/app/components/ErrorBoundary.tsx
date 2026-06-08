import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { appPaths } from "../data/paths";

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "An unexpected error occurred.";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data;
    errorDetails = `Status: ${error.status}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-red-900 text-center mb-2">
            Oops! Something went wrong.
          </h1>
          <p className="text-red-700 text-center text-lg max-w-md">
            We hit a snag while trying to load this page. Don't worry, it's not you, it's us.
          </p>
        </div>

        <div className="p-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8 overflow-x-auto">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Error Details</h2>
            <p className="text-[#333333] font-mono text-sm mb-4 font-semibold">{errorMessage}</p>
            {errorDetails && (
              <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">
                {errorDetails}
              </pre>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              to={appPaths.home}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}