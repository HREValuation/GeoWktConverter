import { useState } from "react";
import { convertToWkt } from "@/lib/utils/wkt";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type WktFormProps = {
  onConvertResult: (result: string, error: string | null) => void;
  onClear: () => void;
};

type ConversionMode = "POINT" | "MULTIPOINT" | "LINESTRING" | "POLYGON";

export default function WktForm({ onConvertResult, onClear }: WktFormProps) {
  const [coordinates, setCoordinates] = useState("");
  const [conversionMode, setConversionMode] = useState<ConversionMode>("POINT");
  const [coordError, setCoordError] = useState<string | null>(null);

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setCoordError(null);

    if (!coordinates.trim()) {
      setCoordError("Please enter coordinates");
      onConvertResult("", null);
      return;
    }

    try {
      const result = convertToWkt(coordinates, conversionMode);
      onConvertResult(result, null);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid coordinate format")) {
          setCoordError(error.message);
          onConvertResult("", null);
        } else {
          onConvertResult("", error.message);
        }
      }
    }
  };

  const handleClear = () => {
    setCoordinates("");
    setCoordError(null);
    onClear();
  };

  return (
    <form className="p-6 space-y-6" onSubmit={handleConvert}>
      {/* Coordinate Input */}
      <div className="space-y-2">
        <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Geographic Coordinates
        </label>
        <div className="relative">
          <Textarea
            id="coordinates"
            className="block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            rows={3}
            placeholder="Enter coordinates as 'longitude latitude' pairs separated by commas:
e.g. 120.436610 24.046724, 120.438000 24.048000"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
          />
          <div className="absolute right-2 top-2 text-xs text-gray-500 dark:text-gray-400">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="hover:text-blue-500 p-1">
                    <i className="fa-solid fa-circle-question"></i>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Format: longitude latitude (e.g., 120.436610 24.046724)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-start">
          <i className="fa-solid fa-info-circle mt-0.5 mr-1"></i>
          <span>Use format: longitude latitude (e.g., 120.436610 24.046724)</span>
        </div>
        {coordError && (
          <div className="text-xs text-red-500">
            <i className="fa-solid fa-triangle-exclamation mr-1"></i>
            <span>{coordError}</span>
          </div>
        )}
      </div>

      {/* Conversion Mode */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Conversion Mode
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* POINT */}
          <div className="relative">
            <input
              type="radio"
              id="point"
              name="conversionMode"
              value="POINT"
              className="peer absolute opacity-0"
              checked={conversionMode === "POINT"}
              onChange={() => setConversionMode("POINT")}
            />
            <label
              htmlFor="point"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer transition-colors duration-200
                peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:ring-1 peer-checked:ring-blue-500"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 dark:border-gray-500 mr-3 flex-shrink-0
                peer-checked:border-blue-500 peer-checked:bg-blue-500">
                <div className={`w-3 h-3 rounded-full bg-white ${conversionMode === "POINT" ? "block" : "hidden"}`}></div>
              </div>
              <div>
                <p className="font-medium">Single Point (POINT)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Each coordinate as separate POINT</p>
              </div>
            </label>
          </div>

          {/* MULTIPOINT */}
          <div className="relative">
            <input
              type="radio"
              id="multipoint"
              name="conversionMode"
              value="MULTIPOINT"
              className="peer absolute opacity-0"
              checked={conversionMode === "MULTIPOINT"}
              onChange={() => setConversionMode("MULTIPOINT")}
            />
            <label
              htmlFor="multipoint"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer transition-colors duration-200
                peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:ring-1 peer-checked:ring-blue-500"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 dark:border-gray-500 mr-3 flex-shrink-0
                peer-checked:border-blue-500 peer-checked:bg-blue-500">
                <div className={`w-3 h-3 rounded-full bg-white ${conversionMode === "MULTIPOINT" ? "block" : "hidden"}`}></div>
              </div>
              <div>
                <p className="font-medium">Multiple Points (MULTIPOINT)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">All coordinates as one MULTIPOINT</p>
              </div>
            </label>
          </div>

          {/* LINESTRING */}
          <div className="relative">
            <input
              type="radio"
              id="linestring"
              name="conversionMode"
              value="LINESTRING"
              className="peer absolute opacity-0"
              checked={conversionMode === "LINESTRING"}
              onChange={() => setConversionMode("LINESTRING")}
            />
            <label
              htmlFor="linestring"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer transition-colors duration-200
                peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:ring-1 peer-checked:ring-blue-500"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 dark:border-gray-500 mr-3 flex-shrink-0
                peer-checked:border-blue-500 peer-checked:bg-blue-500">
                <div className={`w-3 h-3 rounded-full bg-white ${conversionMode === "LINESTRING" ? "block" : "hidden"}`}></div>
              </div>
              <div>
                <p className="font-medium">Line String (LINESTRING)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Connected line through all points</p>
              </div>
            </label>
          </div>

          {/* POLYGON */}
          <div className="relative">
            <input
              type="radio"
              id="polygon"
              name="conversionMode"
              value="POLYGON"
              className="peer absolute opacity-0"
              checked={conversionMode === "POLYGON"}
              onChange={() => setConversionMode("POLYGON")}
            />
            <label
              htmlFor="polygon"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer transition-colors duration-200
                peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:ring-1 peer-checked:ring-blue-500"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 dark:border-gray-500 mr-3 flex-shrink-0
                peer-checked:border-blue-500 peer-checked:bg-blue-500">
                <div className={`w-3 h-3 rounded-full bg-white ${conversionMode === "POLYGON" ? "block" : "hidden"}`}></div>
              </div>
              <div>
                <p className="font-medium">Polygon (POLYGON)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Closed area (first/last points must match)</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          className="flex-1 rounded-md bg-blue-550 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center"
        >
          <i className="fa-solid fa-arrows-rotate mr-2"></i>
          Convert to WKT
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="flex-1 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2.5 font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 flex items-center justify-center"
          onClick={handleClear}
        >
          <i className="fa-solid fa-xmark mr-2"></i>
          Clear All
        </Button>
      </div>
    </form>
  );
}
