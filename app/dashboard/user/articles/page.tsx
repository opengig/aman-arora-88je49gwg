"use client";
import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import api from "@/lib/api";

interface Article {
  id: number;
  title: string;
  content: string;
}

interface Bookmark {
  id: number;
  articleId: number;
}

const ArticlesPage: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchKeyword = searchParams?.get("search") || "";

  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState<string>(searchKeyword);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/articles", {
          params: { search },
        });
        setArticles(res.data?.data);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchBookmarkedArticles = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/bookmarks`);
        setBookmarkedArticles(res.data?.data);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    fetchBookmarkedArticles();
  }, [search]);

  const bookmarkArticle = async (articleId: number) => {
    try {
      const res = await api.post("/api/bookmarks", {
        userId: session?.user?.id,
        articleId,
      });
      if (res.data?.success) {
        toast.success("Article bookmarked successfully!");
        setBookmarkedArticles((prev) => [...prev, res.data?.data]);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const removeBookmark = async (bookmarkId: number) => {
    try {
      const res = await api.delete(`/api/bookmarks/${bookmarkId}`);
      if (res.data?.success) {
        toast.success("Bookmark removed successfully!");
        setBookmarkedArticles((prev) =>
          prev.filter((bookmark) => bookmark.id !== bookmarkId)
        );
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const isBookmarked = (articleId: number) => {
    return bookmarkedArticles.some(
      (bookmark) => bookmark.articleId === articleId
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Educational Articles</h2>
      <div className="mb-6">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>
      {loading ? (
        <LoaderCircleIcon className="w-12 h-12 animate-spin mx-auto" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => (
            <Card key={article?.id}>
              <CardHeader>
                <CardTitle>{article?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{article?.content.substring(0, 100)}...</p>
                <Button
                  className="mt-4"
                  onClick={() =>
                    isBookmarked(article?.id)
                      ? removeBookmark(
                          bookmarkedArticles.find(
                            (bookmark) => bookmark.articleId === article?.id
                          )?.id ?? 0
                        )
                      : bookmarkArticle(article?.id)
                  }
                >
                  {isBookmarked(article?.id) ? "Remove Bookmark" : "Bookmark"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;