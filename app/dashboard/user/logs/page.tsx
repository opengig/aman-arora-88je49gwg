"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { LoaderCircleIcon } from "lucide-react";

// Zod schema for semen analysis and habit logging
const semenAnalysisSchema = z.object({
  volume: z
    .string()
    .min(1, "Volume is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  motility: z
    .string()
    .min(1, "Motility is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, "Must be between 0 and 100"),
  morphology: z
    .string()
    .min(1, "Morphology is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, "Must be between 0 and 100"),
});

const habitSchema = z.object({
  diet: z.string().min(1, "Diet is required"),
  sleepPattern: z.string().min(1, "Sleep pattern is required"),
  lifestyleChanges: z.string().min(1, "Lifestyle changes are required"),
});

type SemenAnalysisFormData = z.infer<typeof semenAnalysisSchema>;
type HabitFormData = z.infer<typeof habitSchema>;

const LogFormPage: React.FC = () => {
  const { data: session } = useSession();
  const {
    register: registerSemenAnalysis,
    handleSubmit: handleSemenAnalysisSubmit,
    formState: { errors: semenAnalysisErrors, isSubmitting: isSemenAnalysisSubmitting },
  } = useForm<SemenAnalysisFormData>({
    resolver: zodResolver(semenAnalysisSchema),
  });

  const {
    register: registerHabit,
    handleSubmit: handleHabitSubmit,
    formState: { errors: habitErrors, isSubmitting: isHabitSubmitting },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
  });

  const onSubmitSemenAnalysis = async (data: SemenAnalysisFormData) => {
    try {
      const payload = {
        volume: Number(data.volume),
        motility: Number(data.motility),
        morphology: Number(data.morphology),
      };

      const response = await api.post(`/api/users/${session?.user?.id}/semenAnalyses`, payload);

      if (response?.data?.success) {
        toast.success("Semen analysis report logged successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const onSubmitHabit = async (data: HabitFormData) => {
    try {
      const payload = {
        diet: data.diet,
        sleepPattern: data.sleepPattern,
        lifestyleChanges: data.lifestyleChanges,
      };

      const response = await api.post(`/api/users/${session?.user?.id}/habits`, payload);

      if (response?.data?.success) {
        toast.success("Habit logged successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Log Semen Analysis & Habits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <form onSubmit={handleSemenAnalysisSubmit(onSubmitSemenAnalysis)}>
            <CardHeader>
              <CardTitle>Semen Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="volume">Volume (ml)</Label>
                <Input
                  {...registerSemenAnalysis("volume")}
                  placeholder="Enter volume"
                />
                {semenAnalysisErrors?.volume && (
                  <p className="text-red-500 text-sm">
                    {semenAnalysisErrors.volume.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motility">Motility (%)</Label>
                <Input
                  {...registerSemenAnalysis("motility")}
                  placeholder="Enter motility"
                />
                {semenAnalysisErrors?.motility && (
                  <p className="text-red-500 text-sm">
                    {semenAnalysisErrors.motility.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="morphology">Morphology (%)</Label>
                <Input
                  {...registerSemenAnalysis("morphology")}
                  placeholder="Enter morphology"
                />
                {semenAnalysisErrors?.morphology && (
                  <p className="text-red-500 text-sm">
                    {semenAnalysisErrors.morphology.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isSemenAnalysisSubmitting}>
                {isSemenAnalysisSubmitting ? (
                  <>
                    <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                    Logging...
                  </>
                ) : (
                  "Log Semen Analysis"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <form onSubmit={handleHabitSubmit(onSubmitHabit)}>
            <CardHeader>
              <CardTitle>Log Habits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="diet">Diet</Label>
                <Textarea
                  {...registerHabit("diet")}
                  placeholder="Describe your diet"
                />
                {habitErrors?.diet && (
                  <p className="text-red-500 text-sm">{habitErrors.diet.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sleepPattern">Sleep Pattern</Label>
                <Textarea
                  {...registerHabit("sleepPattern")}
                  placeholder="Describe your sleep pattern"
                />
                {habitErrors?.sleepPattern && (
                  <p className="text-red-500 text-sm">{habitErrors.sleepPattern.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lifestyleChanges">Lifestyle Changes</Label>
                <Textarea
                  {...registerHabit("lifestyleChanges")}
                  placeholder="Describe any lifestyle changes"
                />
                {habitErrors?.lifestyleChanges && (
                  <p className="text-red-500 text-sm">{habitErrors.lifestyleChanges.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isHabitSubmitting}>
                {isHabitSubmitting ? (
                  <>
                    <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                    Logging...
                  </>
                ) : (
                  "Log Habits"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LogFormPage;