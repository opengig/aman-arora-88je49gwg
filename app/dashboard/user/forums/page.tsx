"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios, { isAxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, LoaderCircleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Thread {
  id: string;
  title: string;
  createdAt: string;
}

const ForumPage: React.FC = () => {
  const { data: session } = useSession();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/forums");
        setThreads(response?.data?.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const createThread = async () => {
    if (!newThreadTitle.trim()) {
      toast.error("Thread title is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/forums", {
        title: newThreadTitle,
        userId: session?.user?.id,
      });

      if (response?.data?.success) {
        toast.success("Forum thread created successfully!");
        setThreads((prevThreads) => [...prevThreads, response?.data?.data]);
        setNewThreadTitle("");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Anonymous Forums</h2>

      <Card>
        <CardHeader>
          <CardTitle>Create New Thread</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="thread-title">Thread Title</Label>
            <Input
              id="thread-title"
              value={newThreadTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewThreadTitle(e.target.value)}
              placeholder="Enter thread title"
            />
          </div>
          <Button
            type="button"
            onClick={createThread}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <LoaderCircleIcon className="animate-spin w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create Thread
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Forum Threads</h3>
        {loading ? (
          <LoaderCircleIcon className="animate-spin w-8 h-8" />
        ) : (
          threads?.map((thread) => (
            <Card key={thread?.id} className="border p-4">
              <CardContent>
                <h4 className="text-lg font-medium">{thread?.title}</h4>
                <p className="text-gray-500">
                  Created At: {new Date(thread?.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumPage;