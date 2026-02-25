"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { getVenues } from "@/lib/actions/venues";
import { handleServerActionResult } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SPORT_TYPES, type EventFormData, type EventWithVenues, type Venue } from "@/lib/types";
import { Button } from "@/components/ui/button";

const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  sport_type: z.string().min(1, "Sport type is required"),
  date_time: z.string().min(1, "Date and time is required"),
  description: z.string().optional(),
  venue_ids: z.array(z.string()),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: EventWithVenues;
  venues: Venue[];
}

export function EventForm({ event, venues }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!event;

  // Format date for input (datetime-local format)
  const formatDateTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    // Convert to local timezone and format as YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name || "",
      sport_type: event?.sport_type || "",
      date_time: event ? formatDateTimeForInput(event.date_time) : "",
      description: event?.description || "",
      venue_ids: event?.venues.map((v) => v.id) || [],
    },
  });

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      // Convert datetime-local format to ISO string
      const dateTimeISO = new Date(data.date_time).toISOString();

      const eventData: EventFormData = {
        name: data.name,
        sport_type: data.sport_type,
        date_time: dateTimeISO,
        description: data.description,
        venue_ids: data.venue_ids,
      };

      const result = isEditing
        ? await updateEvent(event.id, eventData)
        : await createEvent(eventData);

      handleServerActionResult(result, {
        successTitle: isEditing ? "Event updated!" : "Event created!",
        successDescription: isEditing
          ? "The event has been updated successfully"
          : "The event has been created successfully",
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="rounded-lg p-4">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Event" : "Create Event"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the event details below"
            : "Fill in the details to create a new sports event"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Championship Game" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sport_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPORT_TYPES.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Event description (optional)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue_ids"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Venues</FormLabel>
                    <FormDescription>
                      Select one or more venues for this event
                    </FormDescription>
                  </div>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto border rounded-md p-4">
                    {venues.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No venues available. Please create venues first.
                      </p>
                    ) : (
                      venues.map((venue) => (
                        <FormField
                          key={venue.id}
                          control={form.control}
                          name="venue_ids"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={venue.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(venue.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, venue.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== venue.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  <div>
                                    <div className="font-medium">{venue.name}</div>
                                    {venue.address && (
                                      <div className="text-sm text-gray-500">
                                        {venue.address}
                                      </div>
                                    )}
                                    {venue.capacity && (
                                      <div className="text-sm text-gray-500">
                                        Capacity: {venue.capacity.toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <LoadingButton
                type="submit"
                className="flex-1"
                loading={isLoading}
                loadingText={isEditing ? "Updating..." : "Creating..."}
              >
                {isEditing ? "Update Event" : "Create Event"}
              </LoadingButton>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
