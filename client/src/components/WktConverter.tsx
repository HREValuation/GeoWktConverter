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
        {/* 頁頭 */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-medium mb-2">座標轉 WKT 工具</h1>
          <p className="text-gray-600 dark:text-gray-400">
            將地理座標轉換為 Well-Known Text 格式
          </p>
          
          {/* 主題切換 */}
          <div className="mt-4 inline-flex">
            <ThemeToggle />
          </div>
        </header>

        {/* 主要內容 */}
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
        
        {/* 範例部分 */}
        <ExampleSection />
        
        {/* 頁尾 */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 pb-8">
          <p>© {new Date().getFullYear()} 座標轉 WKT 工具 | <span className="text-blue-550">實用工具</span></p>
        </footer>
      </div>
    </div>
  );
}
