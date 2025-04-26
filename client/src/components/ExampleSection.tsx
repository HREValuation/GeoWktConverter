import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ExampleSection() {
  const examples = [
    {
      title: "單點 (POINT)",
      input: "121.557846 25.037571",
      output: "POINT (121.557846 25.037571)"
    },
    {
      title: "多點 (MULTIPOINT)",
      input: "121.557846 25.037571, 121.560000 25.040000",
      output: "MULTIPOINT ((121.557846 25.037571), (121.560000 25.040000))"
    },
    {
      title: "線段 (LINESTRING)",
      input: "121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000",
      output: "LINESTRING (121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000)"
    },
    {
      title: "多邊形 (POLYGON)",
      input: "121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000, 121.557846 25.037571",
      output: "POLYGON ((121.557846 25.037571, 121.560000 25.040000, 121.562000 25.038000, 121.557846 25.037571))"
    }
  ];

  return (
    <Card className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-4">範例</h2>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{example.title}</h3>
              <div className="mt-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm">
                <p className="font-mono">輸入: {example.input}</p>
                <p className="font-mono mt-2">輸出: {example.output}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
