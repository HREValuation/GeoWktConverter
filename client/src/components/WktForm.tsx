import { useState } from "react";
import { convertToWkt, type CoordinateFormat } from "@/lib/utils/wkt";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type WktFormProps = {
  onConvertResult: (result: string, error: string | null) => void;
  onClear: () => void;
};

type ConversionMode = "POINT" | "MULTIPOINT" | "LINESTRING" | "POLYGON";

export default function WktForm({ onConvertResult, onClear }: WktFormProps) {
  const [coordinates, setCoordinates] = useState("");
  const [conversionMode, setConversionMode] = useState<ConversionMode>("POINT");
  const [coordError, setCoordError] = useState<string | null>(null);
  const [coordinateFormat, setCoordinateFormat] = useState<CoordinateFormat>("LAT_LONG"); // 預設為緯度,經度格式 (Google Maps 兼容)

  const handleToggleFormat = () => {
    setCoordinateFormat(prev => prev === "LAT_LONG" ? "LONG_LAT" : "LAT_LONG");
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setCoordError(null);

    if (!coordinates.trim()) {
      setCoordError("請輸入座標");
      onConvertResult("", null);
      return;
    }

    try {
      const result = convertToWkt(coordinates, conversionMode, coordinateFormat);
      onConvertResult(result, null);
    } catch (error) {
      if (error instanceof Error) {
        setCoordError(error.message);
        onConvertResult("", null);
      }
    }
  };

  const handleClear = () => {
    setCoordinates("");
    setCoordError(null);
    onClear();
  };

  // 取得座標格式說明文字
  const getFormatExample = () => {
    if (coordinateFormat === "LAT_LONG") {
      return "25.037571 121.557846";
    } else {
      return "121.557846 25.037571";
    }
  };

  // 取得座標格式提示文字
  const getFormatHelpText = () => {
    if (coordinateFormat === "LAT_LONG") {
      return "支援多種格式：緯度 經度（例如：25.037571 121.557846）或緯度,經度（例如：25.037571,121.557846）";
    } else {
      return "支援多種格式：經度 緯度（例如：121.557846 25.037571）或經度,緯度（例如：121.557846,25.037571）";
    }
  };

  const getFormatTooltipText = () => {
    if (coordinateFormat === "LAT_LONG") {
      return "多點輸入格式：\n1. 用逗號分隔多個點：25.037571 121.557846, 25.040000 121.560000\n2. 用換行分隔多個點：\n25.037571 121.557846\n25.040000 121.560000\n3. 經緯度之間可用空格或逗號：25.037571,121.557846";
    } else {
      return "多點輸入格式：\n1. 用逗號分隔多個點：121.557846 25.037571, 121.560000 25.040000\n2. 用換行分隔多個點：\n121.557846 25.037571\n121.560000 25.040000\n3. 經緯度之間可用空格或逗號：121.557846,25.037571";
    }
  };

  return (
    <form className="p-6 space-y-6" onSubmit={handleConvert}>
      {/* 座標格式切換 */}
      <div className="flex items-center justify-between space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div>
          <Label htmlFor="format-toggle" className="font-medium text-gray-700 dark:text-gray-300">
            座標格式
          </Label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {coordinateFormat === "LAT_LONG" ? "目前：緯度,經度（Google Maps 格式）" : "目前：經度,緯度（國土測繪格式）"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">經度,緯度</span>
          <Switch 
            id="format-toggle" 
            checked={coordinateFormat === "LAT_LONG"}
            onCheckedChange={handleToggleFormat}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">緯度,經度</span>
        </div>
      </div>

      {/* 座標輸入 */}
      <div className="space-y-2">
        <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          地理座標
        </label>
        <div className="relative">
          <Textarea
            id="coordinates"
            className="block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            rows={4}
            placeholder={`輸入座標，可以用逗號或換行分隔多個點：
方式1：${getFormatExample()}, ${getFormatExample()}
方式2：
${getFormatExample()}
${getFormatExample()}`}
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
                  <p>{getFormatTooltipText()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-start">
          <i className="fa-solid fa-info-circle mt-0.5 mr-1"></i>
          <span>{getFormatHelpText()}</span>
        </div>
        {coordError && (
          <div className="text-xs text-red-500">
            <i className="fa-solid fa-triangle-exclamation mr-1"></i>
            <span>{coordError}</span>
          </div>
        )}
      </div>

      {/* 轉換模式 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          轉換模式
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
                <p className="font-medium">單點 (POINT)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">每個座標作為單獨的 POINT</p>
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
                <p className="font-medium">多點 (MULTIPOINT)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">所有座標作為一個 MULTIPOINT</p>
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
                <p className="font-medium">線段 (LINESTRING)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">所有點連成一條線</p>
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
                <p className="font-medium">多邊形 (POLYGON)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">封閉區域（首尾點必須相同）</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* 動作按鈕 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          className="flex-1 rounded-md bg-blue-550 px-4 py-2.5 font-medium text-white dark:text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center"
        >
          <i className="fa-solid fa-arrows-rotate mr-2"></i>
          轉換成 WKT
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="flex-1 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2.5 font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 flex items-center justify-center"
          onClick={handleClear}
        >
          <i className="fa-solid fa-xmark mr-2"></i>
          清除全部
        </Button>
      </div>
    </form>
  );
}
