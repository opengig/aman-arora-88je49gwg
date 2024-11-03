"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon, Plus } from "lucide-react";

const QnAPage: React.FC = () => {
  const { data: session } = useSession();
  const [threads, setThreads] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [postingThread, setPostingThread] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoadingThreads(true);
      try {
        const response = await axios.get("/api/forums");
        setThreads(response?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingThreads(false);
      }
    };

    const fetchSessions = async () => {
      setLoadingSessions(true);
      try {
        const response = await axios.get("/api/qna/sessions");
        setSessions(response?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchThreads();
    fetchSessions();
  }, []);

  const createThread = async () => {
    if (!newThreadTitle.trim()) {
      toast.error("Thread title is required");
      return;
    }
    setPostingThread(true);
    try {
      const response = await axios.post("/api/forums", {
        title: newThreadTitle,
        userId: session?.user?.id,
      });
      if (response?.data?.success) {
        toast.success("Forum thread created successfully!");
        setThreads((prev) => [...prev, response?.data?.data]);
        setNewThreadTitle("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create thread");
    } finally {
      setPostingThread(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Expert Q&A Sessions</h2>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Q&A Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSessions ? (
            <LoaderCircleIcon className="animate-spin w-6 h-6" />
          ) : sessions?.length === 0 ? (
            <p>No upcoming sessions available.</p>
          ) : (
            sessions?.map((session: any) => (
              <div key={session?.id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{session?.title}</h3>
                <p>Scheduled for: {new Date(session?.scheduledDate).toLocaleString()}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forum Threads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-thread">Post a New Thread</Label>
            <Input
              value={newThreadTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewThreadTitle(e.target.value)}
              placeholder="Enter thread title"
              id="new-thread"
            />
            <Button onClick={createThread} disabled={postingThread}>
              {postingThread ? (
                <LoaderCircleIcon className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Post Thread
            </Button>
          </div>

          {loadingThreads ? (
            <LoaderCircleIcon className="animate-spin w-6 h-6" />
          ) : threads?.length === 0 ? (
            <p>No threads available.</p>
          ) : (
            threads?.map((thread: any) => (
              <div key={thread?.id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{thread?.title}</h3>
                <p>Created on: {new Date(thread?.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QnAPage;