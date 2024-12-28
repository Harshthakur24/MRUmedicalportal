"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  parentName: z.string().min(2, "Parent name is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  disease: z.string().min(1, "Disease specification is required"),
  doctorName: z.string().min(1, "Doctor's name is required"),
  doctorAddress: z.string().min(1, "Doctor's address is required"),
  dateFrom: z.string().min(1, "Start date is required"),
  dateTo: z.string().min(1, "End date is required"),
  workingDays: z.number().min(0),
  needsT1Reexam: z.boolean(),
  t1Subjects: z.string().optional(),
  needsT2Reexam: z.boolean(),
  t2Subjects: z.string().optional(),
  studentContact: z.string().min(10, "Valid contact number required"),
  parentContact: z.string().min(10, "Valid parent contact number required"),
  files: z.object({
    medicalCertificate: z.any(),
    opdIpdSlip: z.any(),
    dischargeSlip: z.any(),
    otherDocuments: z.any().optional(),
  }),
});

export default function SubmitReport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentName: "",
      rollNumber: "",
      class: "",
      section: "",
      disease: "",
      doctorName: "",
      doctorAddress: "",
      dateFrom: "",
      dateTo: "",
      workingDays: 0,
      needsT1Reexam: false,
      t1Subjects: "",
      needsT2Reexam: false,
      t2Subjects: "",
      studentContact: "",
      parentContact: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Then create the report
      const reportResponse = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: values.parentName,
          class: values.class,
          section: values.section,
          disease: values.disease,
          doctorName: values.doctorName,
          doctorAddress: values.doctorAddress,
          dateFrom: values.dateFrom,
          dateTo: values.dateTo,
          workingDays: values.workingDays,
          t1Reexam: values.needsT1Reexam,
          t1Subjects: values.t1Subjects,
          t2Reexam: values.needsT2Reexam,
          t2Subjects: values.t2Subjects,
          studentContact: values.studentContact,
          parentContact: values.parentContact,
          medicalCertificate: "placeholder-url", // Replace with actual file upload
          opdIpdSlip: null,
          dischargeSlip: null,
          otherReports: [],
        }),
      });

      const report = await reportResponse.json();

      if (!reportResponse.ok) throw new Error(report.error);

      toast({
        title: "Success",
        description: "Your report has been submitted successfully",
      });

      form.reset();
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Medical Report Submission & Request for Re-Exams</h1>
            <p className="mt-2 text-gray-600">
              To be filled by student within 3 days of Re-joining
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Student</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>S/o or D/o</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="2K22CSUN01098" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Input placeholder="CSE-5A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <FormControl>
                        <Input placeholder="A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disease"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disease</FormLabel>
                      <FormControl>
                        <Input placeholder="Diabetes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor&apos;s Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctorAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor&apos;s Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="needsT1Reexam"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Needs T1 Re-exam</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="t1Subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T1 Subjects</FormLabel>
                      <FormControl>
                        <Input placeholder="Subjects" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="needsT2Reexam"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Needs T2 Re-exam</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="t2Subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T2 Subjects</FormLabel>
                      <FormControl>
                        <Input placeholder="Subjects" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold">Required Documents</h3>

                  <FormField
                    control={form.control}
                    name="files.medicalCertificate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical cum Fitness Certificate</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}