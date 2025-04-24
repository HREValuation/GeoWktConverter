import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ResultDisplayProps = {
  result: string;
  error: string | null;
};

export default function ResultDisplay({ result, error }: ResultDisplayProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (!result) return;

    navigator.clipboard
      .writeText(result)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "WKT result has been copied to your clipboard.",
          variant: "default",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the text to clipboard.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">WKT Result</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-sm px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
          onClick={handleCopy}
          disabled={!result}
        >
          <i className="fa-regular fa-copy mr-1.5"></i>
          Copy
        </Button>
      </div>

      <div className="relative">
        <Textarea
          id="wktResult"
          className="block w-full rounded-md border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white p-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 font-mono text-sm"
          rows={4}
          placeholder="WKT output will appear here"
          readOnly
          value={result}
        />

        {error && (
          <div className="mt-2 text-xs text-red-500">
            <i className="fa-solid fa-triangle-exclamation mr-1"></i>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
