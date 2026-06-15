"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: msg }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully! We will email you back shortly.");
        setName("");
        setEmail("");
        setMsg("");
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen space-y-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground">Get in touch with our support desk 24 hours a day.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Card className="border-border shadow-md p-6">
          <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
            <Phone className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm">Call Support</h3>
          <p className="text-xs text-muted-foreground mt-1">+880 0000 00000</p>
        </Card>

        <Card className="border-border shadow-md p-6">
          <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm">Email Address</h3>
          <p className="text-xs text-muted-foreground mt-1">support@menu.com</p>
        </Card>

        <Card className="border-border shadow-md p-6">
          <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm">Sylhet Office</h3>
          <p className="text-xs text-muted-foreground mt-1">Zindabazar, Sylhet, Bangladesh</p>
        </Card>
      </div>

      <Card className="border-border shadow-md max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
          <CardDescription>We typically reply to custom emails within 2 hours.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="text-xs font-semibold mb-1 block">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-background border border-border p-2 rounded-md text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-background border border-border p-2 rounded-md text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Message</label>
              <textarea
                required
                className="w-full bg-background border border-border p-2 rounded-md text-sm min-h-[120px]"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
