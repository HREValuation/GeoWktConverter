import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ExampleSection() {
  const examples = [
    {
      title: "Single Point (POINT)",
      input: "120.436610 24.046724",
      output: "POINT (120.436610 24.046724)"
    },
    {
      title: "Multiple Points (MULTIPOINT)",
      input: "120.436610 24.046724, 120.438000 24.048000",
      output: "MULTIPOINT ((120.436610 24.046724), (120.438000 24.048000))"
    },
    {
      title: "Line String (LINESTRING)",
      input: "120.436610 24.046724, 120.438000 24.048000, 120.440000 24.047000",
      output: "LINESTRING (120.436610 24.046724, 120.438000 24.048000, 120.440000 24.047000)"
    },
    {
      title: "Polygon (POLYGON)",
      input: "120.436610 24.046724, 120.438000 24.048000, 120.440000 24.047000, 120.436610 24.046724",
      output: "POLYGON ((120.436610 24.046724, 120.438000 24.048000, 120.440000 24.047000, 120.436610 24.046724))"
    }
  ];

  return (
    <Card className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-4">Examples</h2>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{example.title}</h3>
              <div className="mt-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm">
                <p className="font-mono">Input: {example.input}</p>
                <p className="font-mono mt-2">Output: {example.output}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
