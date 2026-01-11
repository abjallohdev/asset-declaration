"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { adminService, SystemSettings } from "@/services/admin.service"
import { Loader2 } from "lucide-react"

const settingsSchema = z.object({
  siteName: z.string().min(2, "Site name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      email: "",
      maintenanceMode: false,
      allowRegistration: true,
    },
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await adminService.getSettings()
        form.reset(settings)
      } catch (error) {
        toast.error("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [form])

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await adminService.saveSettings(data)
      toast.success("Settings saved successfully")
    } catch (error) {
      toast.error("Failed to save settings")
    }
  }

  if (loading) {
      return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="text-lg font-medium">System Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage global application configurations.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>General Configuration</CardTitle>
                  <CardDescription>
                    Basic settings for the ADS Portal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Asset Declaration System" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name displayed in the browser tab and emails.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input placeholder="support@ads.gov" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email address for system notifications and support.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>
                    Manage system availability and registration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Public Registration
                          </FormLabel>
                          <FormDescription>
                            If disabled, only admins can create new user accounts.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base text-red-600 dark:text-red-400">
                            Maintenance Mode
                          </FormLabel>
                          <FormDescription className="text-red-600/80 dark:text-red-400/80">
                            Disables access for all non-admin users. Use with caution.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
      </div>
    </div>
  )
}

import { Separator } from "@/components/ui/separator"
