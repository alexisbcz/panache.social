import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "./_components/change-password-form";
import { DeleteAccountForm } from "./_components/delete-account-form";
import { UpdateProfileForm } from "./_components/update-profile-form";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/log-in");
  }

  const userAccounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, session.user.id));

  const providerId = userAccounts[0]?.providerId || "credential";

  return (
    <div className="container max-w-2xl py-4 px-6">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        {providerId === "credential" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your username and email address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateProfileForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeleteAccountForm />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm">{session.user.name}</p>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm">{session.user.email}</p>
                  <label className="text-sm font-medium text-muted-foreground">
                    Provider
                  </label>
                  <p className="text-sm capitalize">
                    {providerId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
