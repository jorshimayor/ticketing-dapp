"use client";

import React, { useState } from "react";

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const uploadAttendees = async () => {
    if (!file) {
      setMessage({
        type: "error",
        text: "Please select a CSV file to upload.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-attendees", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Successfully uploaded ${result.count} attendees.`,
        });
        setFile(null);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to upload attendees.",
        });
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred during upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Panel</h1>

        <div className="mb-4">
          <label htmlFor="csv-upload" className="block text-gray-700 mb-2">
            Upload Attendees CSV
          </label>
          <input
            type="file"
            id="csv-upload"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={uploadAttendees}
          disabled={loading || !file}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading || !file
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition duration-200`}
        >
          {loading ? "Uploading..." : "Upload Attendees"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </main>
  );
}
