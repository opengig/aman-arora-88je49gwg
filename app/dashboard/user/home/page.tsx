"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from 'lucide-react';

const HomePage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>({});
  const [trends, setTrends] = useState<any[]>([]);
  const [goals, setGoals] = useState<any>({});

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch semen metrics
        const metricsResponse = await api.get(`/api/users/${session?.user?.id}/semenMetrics`);
        if (metricsResponse?.data?.success) {
          setMetrics(metricsResponse?.data?.data);
        }

        // Fetch semen trends
        const trendsResponse = await api.get(`/api/users/${session?.user?.id}/semenTrends`);
        if (trendsResponse?.data?.success) {
          setTrends(trendsResponse?.data?.data);
        }

        // Fetch personalized goals
        const goalsResponse = await api.get(`/api/users/${session?.user?.id}/personalizedGoals`);
        if (goalsResponse?.data?.success) {
          setGoals(goalsResponse?.data?.data);
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto grid gap-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Card className="p-4 bg-background">
              <CardHeader>
                <CardDescription className="text-sm font-medium">Volume</CardDescription>
                <CardTitle className="text-2xl">{metrics?.volume ?? "N/A"}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="p-4 bg-background">
              <CardHeader>
                <CardDescription className="text-sm font-medium">Motility</CardDescription>
                <CardTitle className="text-2xl">{metrics?.motility ?? "N/A"}%</CardTitle>
              </CardHeader>
            </Card>
            <Card className="p-4 bg-background">
              <CardHeader>
                <CardDescription className="text-sm font-medium">Morphology</CardDescription>
                <CardTitle className="text-2xl">{metrics?.morphology ?? "N/A"}%</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="flex flex-row items-center border-b bg-muted p-4">
                <CardTitle>Semen Health Trends</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="volume" stroke="#009688" />
                    <Line type="monotone" dataKey="motility" stroke="#4CAF50" />
                    <Line type="monotone" dataKey="morphology" stroke="#000000" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="p-4 bg-background">
              <CardHeader>
                <CardTitle>Personalized Health Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>{goals?.goal1 ?? "Loading goal 1..."}</div>
                <div>{goals?.goal2 ?? "Loading goal 2..."}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;