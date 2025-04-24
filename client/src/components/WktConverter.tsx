import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import WktForm from "./WktForm";
import ResultDisplay from "./ResultDisplay";
import ExampleSection from "./ExampleSection";

export default function WktConverter() {
  const [wktResult, setWktResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClearAll = () => {
    setWktResult("");
    setError(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-medium mb-2">Coordinate to WKT Converter</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform geographic coordinates into Well-Known Text format
          </p>
          
          {/* Theme Toggle */}
          <div className="mt-4 inline-flex">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
          <WktForm 
            onConvertResult={(result, errorMsg) => {
              setWktResult(result);
              setError(errorMsg);
            }} 
            onClear={handleClearAll}
          />
          
          <ResultDisplay 
            result={wktResult} 
            error={error}
          />
        </main>
        
        {/* Example Section */}
        <ExampleSection />
        
        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 pb-8">
          <p>© {new Date().getFullYear()} Coordinate to WKT Converter | <span className="text-blue-550">Utility Tool</span></p>
        </footer>
      </div>
    </div>
  );
}
