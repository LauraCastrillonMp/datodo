"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const difficulties = [
  { label: "Principiante", value: "principiante" },
  { label: "Intermedio", value: "intermedio" },
  { label: "Avanzado", value: "avanzado" },
];

export default function DataStructureForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: { title?: string; description?: string; difficulty?: string };
  onSubmit: (values: { title: string; description: string; difficulty: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty || "principiante");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ title, description, difficulty });
    setLoading(false);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{initial ? "Edit Data Structure" : "Create Data Structure"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required minLength={3} maxLength={100} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} required minLength={10} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Difficulty</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              required
            >
              {difficulties.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initial ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 