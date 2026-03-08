export const exportSleepDataCSV = (sleepEntries) => {
  if (!sleepEntries || sleepEntries.length === 0) return;

  const headers = [
    "Date",
    "Sleep Hours",
    "Stress Level",
    "Activity Level",
    "Mood",
    "Status",
  ];

  const rows = sleepEntries.map((entry) => [
    new Date(entry.date).toLocaleDateString(),
    entry.sleepHours,
    entry.stressLevel,
    entry.activityLevel,
    entry.mood,
    entry.status,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "sleep-data.csv";
  link.click();

  URL.revokeObjectURL(url);
};