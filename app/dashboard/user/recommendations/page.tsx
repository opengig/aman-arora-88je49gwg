"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircleIcon, Plus } from "lucide-react";
import { DateTimePicker } from "@/components/ui/date-picker";

const RecommendationsPage: React.FC = () => {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newReminder, setNewReminder] = useState({
    type: "",
    message: "",
    frequency: "",
    reminderDate: new Date(),
  });

  useEffect(() => {
    if (!session) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/users/${session?.user?.id}/recommendations`);
        setRecommendations(res?.data?.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchReminders = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/users/${session?.user?.id}/reminders`);
        setReminders(res?.data?.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    fetchReminders();
  }, [session]);

  const createReminder = async () => {
    try {
      const response = await api.post(`/api/users/${session?.user?.id}/reminders`, newReminder);
      if (response?.data?.success) {
        toast.success("Reminder created successfully!");
        setReminders([...reminders, response?.data?.data]);
        setNewReminder({
          type: "",
          message: "",
          frequency: "",
          reminderDate: new Date(),
        });
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Personalized Health Recommendations</h2>
      <div className="space-y-6">
        {loading ? (
          <LoaderCircleIcon className="animate-spin mx-auto" size={24} />
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations?.map((rec: any) => (
                  <p key={rec?.id}>{rec?.insight}</p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                {reminders?.map((reminder: any) => (
                  <div key={reminder?.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="text-lg">{reminder?.message}</p>
                      <p className="text-sm text-gray-500">Frequency: {reminder?.frequency}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Reminder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminderType">Type</Label>
                    <Input
                      id="reminderType"
                      value={newReminder?.type}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewReminder({ ...newReminder, type: e?.target?.value })}
                      placeholder="Enter reminder type"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderMessage">Message</Label>
                    <Input
                      id="reminderMessage"
                      value={newReminder?.message}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewReminder({ ...newReminder, message: e?.target?.value })}
                      placeholder="Enter reminder message"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderFrequency">Frequency</Label>
                    <Select
                      value={newReminder?.frequency}
                      onValueChange={(value: string) => setNewReminder({ ...newReminder, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Reminder Date</Label>
                    <DateTimePicker
                      date={newReminder?.reminderDate}
                      setDate={(date: Date | undefined) => setNewReminder({ ...newReminder, reminderDate: date || new Date() })}
                    />
                  </div>

                  <Button className="w-full" onClick={createReminder}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;