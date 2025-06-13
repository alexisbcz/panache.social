"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { checkUsernameAvailability } from "../actions";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email("Please enter a valid email address"),
});

export function UpdateProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsLoading(true);

      // Only include fields that have changed
      const updateData: Record<string, string> = {};
      if (values.name !== session?.user?.name) {
        // Check username availability if it's being changed
        const { isAvailable } = await checkUsernameAvailability(
          values.name,
          session?.user?.id || ""
        );

        if (!isAvailable) {
          toast({
            title: "Error",
            description: "This username is already taken. Please choose another one.",
            variant: "destructive",
          });
          return;
        }
        updateData.name = values.name;
      }
      if (values.email !== session?.user?.email) {
        updateData.email = values.email;
      }

      // If nothing has changed, show a message and return
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "No changes",
          description: "No changes were made to your profile.",
        });
        return;
      }

      const { error } = await authClient.updateUser(updateData);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      form.reset({
        name: values.name,
        email: values.email,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter new username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter new email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating profile..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
} 