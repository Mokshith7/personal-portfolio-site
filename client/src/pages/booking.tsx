import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, Loader2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface TimeSlot {
  start: string;
  end: string;
}

interface SlotsResponse {
  slots: TimeSlot[];
  duration: number;
  priceInCents: number;
}

export default function Booking() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
  });

  const urlParams = new URLSearchParams(window.location.search);
  const wasCancelled = urlParams.get('cancelled') === 'true';

  const slotsQuery = useQuery<SlotsResponse>({
    queryKey: ['/api/meeting/slots', selectedDate?.toISOString()],
    enabled: !!selectedDate,
  });

  const checkoutMutation = useMutation({
    mutationFn: async (data: { email: string; name: string; date: string; time: string; topic: string }) => {
      const response = await apiRequest('POST', '/api/meeting/checkout', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    const slotStart = new Date(selectedSlot.start);
    const date = selectedDate.toISOString().split('T')[0];
    const time = slotStart.toISOString().split('T')[1].substring(0, 5);

    checkoutMutation.mutate({
      email: formData.email,
      name: formData.name,
      date,
      time,
      topic: formData.topic,
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const price = slotsQuery.data?.priceInCents ? (slotsQuery.data.priceInCents / 100).toFixed(2) : '50.00';
  const duration = slotsQuery.data?.duration || 30;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/about">
        <Button variant="ghost" className="mb-6" data-testid="button-back-about">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to About
        </Button>
      </Link>

      <h1 className="font-serif text-3xl font-bold mb-2 text-center" data-testid="text-booking-heading">
        Schedule a Meeting
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        Book a {duration}-minute video call for ${price}
      </p>

      {wasCancelled && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-4">
            <p className="text-destructive">Payment was cancelled. Please try again.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Select Date & Time
            </CardTitle>
            <CardDescription>Choose an available slot</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || date.getDay() === 0 || date.getDay() === 6;
              }}
              className="rounded-md border"
              data-testid="calendar-date-picker"
            />

            {selectedDate && (
              <div className="mt-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available Times
                </h3>
                
                {slotsQuery.isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}

                {slotsQuery.error && (
                  <p className="text-destructive text-sm">Failed to load available times</p>
                )}

                {slotsQuery.data && slotsQuery.data.slots.length === 0 && (
                  <p className="text-muted-foreground text-sm">No available slots on this date</p>
                )}

                {slotsQuery.data && slotsQuery.data.slots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {slotsQuery.data.slots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedSlot?.start === slot.start ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                        data-testid={`button-slot-${index}`}
                      >
                        {formatTime(slot.start)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Your Details</CardTitle>
            <CardDescription>Tell me about yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">What would you like to discuss?</Label>
                <Textarea
                  id="topic"
                  placeholder="Brief description of the meeting topic..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="resize-none"
                  data-testid="input-topic"
                />
              </div>

              {selectedDate && selectedSlot && (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">Selected Time:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {' at '}
                    {formatTime(selectedSlot.start)}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedDate || !selectedSlot || checkoutMutation.isPending}
                data-testid="button-proceed-payment"
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Proceed to Payment - $${price}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
