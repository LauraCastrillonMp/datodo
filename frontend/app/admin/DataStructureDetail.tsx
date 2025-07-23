"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { toast } from "@/lib/toast";
import ContentForm from "./ContentForm";
import QuizForm from "./QuizForm";

export default function DataStructureDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const [dataStructure, setDataStructure] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("content");
  const [editingContent, setEditingContent] = useState<any | null>(null);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Debug log for fetched content
  useEffect(() => {
    if (!loading) {
      console.log("Fetched content:", content);
    }
  }, [content, loading]);

  const fetchDetails = async () => {
    setLoading(true);
    const { data: ds } = await apiClient.getDataStructure(id);
    setDataStructure(ds);
    const { data: contentData } = await apiClient.getDataStructureContent(id);
    setContent(Array.isArray(contentData) ? contentData : []);
    const { data: quizzesData } = await apiClient.getQuizzes(id);
    setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
    setLoading(false);
  };

  // Content CRUD
  const handleEditContent = (content: any) => setEditingContent(content);
  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    const { error } = await apiClient.deleteContent(id, contentId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Content deleted");
      fetchDetails();
    }
  };
  const handleCreateContent = async (values: any) => {
    const { error } = await apiClient.createContent(id, values);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Content created");
      setShowCreateContent(false);
      fetchDetails();
    }
  };
  const handleUpdateContent = async (contentId: number, values: any) => {
    const { error } = await apiClient.updateContent(id, contentId, values);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Content updated");
      setEditingContent(null);
      fetchDetails();
    }
  };

  // Quiz CRUD
  const handleEditQuiz = (quiz: any) => setEditingQuiz(quiz);
  const handleDeleteQuiz = async (quizId: number) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    const { error } = await apiClient.deleteQuiz(id, quizId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Quiz deleted");
      fetchDetails();
    }
  };
  const handleCreateQuiz = async (values: any) => {
    const { error } = await apiClient.createQuiz(id, values);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Quiz created");
      setShowCreateQuiz(false);
      fetchDetails();
    }
  };
  const handleUpdateQuiz = async (quizId: number, values: any) => {
    const { error } = await apiClient.updateQuiz(id, quizId, values);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Quiz updated");
      setEditingQuiz(null);
      fetchDetails();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!dataStructure) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">Back</Button>
      <Card>
        <CardHeader>
          <CardTitle>{dataStructure.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-muted-foreground">{dataStructure.description}</div>
          <div className="mb-2">Difficulty: {dataStructure.difficulty}</div>
        </CardContent>
      </Card>
      <Tabs defaultValue="content" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          {/* Create/Edit Content Form (if present in UI) */}
          {showCreateContent && (
            <ContentForm
              onSubmit={handleCreateContent}
              onCancel={() => setShowCreateContent(false)}
            />
          )}
          {editingContent && (
            <ContentForm
              initial={editingContent}
              onSubmit={(values) => handleUpdateContent(editingContent.id, values)}
              onCancel={() => setEditingContent(null)}
            />
          )}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Content</CardTitle>
              <Button onClick={() => setShowCreateContent(true)}>Create</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>No content found.</TableCell>
                      </TableRow>
                    ) : (
                      content.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell>{c.name || c.nombre}</TableCell>
                          <TableCell>{c.contentType || c.content_type}</TableCell>
                          <TableCell>{c.format || c.formato}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditContent(c)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteContent(c.id)} className="ml-2">Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quizzes">
          {/* Create/Edit Quiz Form (if present in UI) */}
          {showCreateQuiz && (
            <QuizForm
              onSubmit={handleCreateQuiz}
              onCancel={() => setShowCreateQuiz(false)}
            />
          )}
          {editingQuiz && (
            <QuizForm
              initial={editingQuiz}
              onSubmit={(values) => handleUpdateQuiz(editingQuiz.id, values)}
              onCancel={() => setEditingQuiz(null)}
            />
          )}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quizzes</CardTitle>
              <Button onClick={() => setShowCreateQuiz(true)}>Create</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>No quizzes found.</TableCell>
                      </TableRow>
                    ) : (
                      quizzes.map((q) => (
                        <TableRow key={q.id}>
                          <TableCell>{q.id}</TableCell>
                          <TableCell>{q.title}</TableCell>
                          <TableCell>{q.difficulty}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditQuiz(q)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteQuiz(q.id)} className="ml-2">Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 