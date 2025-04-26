import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ExampleSection() {
  const [showLatLong, setShowLatLong] = useState(true);
  
  const latLongExamples = [
    {
      title: "單點 (POINT)",
      input: "25.037571 121.557846",
      output: "POINT (121.557846 25.037571)"
    },
    {
      title: "多點 (MULTIPOINT) - 用換行分隔",
      input: "25.037571 121.557846\n25.040000 121.560000",
      output: "MULTIPOINT ((121.557846 25.037571), (121.560000 25.040000))"
    },
    {
      title: "線段 (LINESTRING) - 用逗號分隔",
      input: "25.037571,121.557846, 25.040000,121.560000, 25.038000,121.562000",
      output: "LINESTRING (121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000)"
    },
    {
      title: "多邊形 (POLYGON) - 經緯度用逗號分隔",
      input: "25.037571,121.557846, 25.040000,121.560000, 25.038000,121.562000, 25.037571,121.557846",
      output: "POLYGON ((121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000, 121.557846 25.037571))"
    }
  ];
  
  const longLatExamples = [
    {
      title: "單點 (POINT)",
      input: "121.557846 25.037571",
      output: "POINT (121.557846 25.037571)"
    },
    {
      title: "多點 (MULTIPOINT) - 用換行分隔",
      input: "121.557846 25.037571\n121.560000 25.040000",
      output: "MULTIPOINT ((121.557846 25.037571), (121.560000 25.040000))"
    },
    {
      title: "線段 (LINESTRING) - 用逗號分隔",
      input: "121.557846,25.037571, 121.560000,25.040000, 121.562000,25.038000",
      output: "LINESTRING (121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000)"
    },
    {
      title: "多邊形 (POLYGON) - 經緯度用逗號分隔",
      input: "121.557846,25.037571, 121.560000,25.040000, 121.562000,25.038000, 121.557846,25.037571",
      output: "POLYGON ((121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000, 121.557846 25.037571))"
    }
  ];
  
  const examples = showLatLong ? latLongExamples : longLatExamples;

  return (
    <Card className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">範例</h2>
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <button 
              className={`px-2 py-1 rounded-md ${showLatLong ? 'bg-blue-100 dark:bg-blue-900/30 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setShowLatLong(true)}
            >
              緯度,經度（Google Maps）
            </button>
            <button 
              className={`px-2 py-1 rounded-md ${!showLatLong ? 'bg-blue-100 dark:bg-blue-900/30 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setShowLatLong(false)}
            >
              經度,緯度（國土測繪）
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{example.title}</h3>
              <div className="mt-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm">
                <div className="font-mono whitespace-pre-wrap">輸入: {example.input}</div>
                <div className="font-mono whitespace-pre-wrap mt-2">輸出: {example.output}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
