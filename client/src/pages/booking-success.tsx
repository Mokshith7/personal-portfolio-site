import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, ExternalLink, Loader2, XCircle } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface ConfirmResponse {
  success: boolean;
  eventId: string;
  meetLink?: string;
  startTime: string;
  endTime: string;
}

export default function BookingSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  const confirmMutation = useMutation({
    mutationFn: async (sessionId: string): Promise<ConfirmResponse> => {
      const response = await apiRequest('POST', '/api/meeting/confirm', { sessionId });
      return response.json();
    },
  });

  useEffect(() => {
    if (sessionId && !confirmMutation.data && !confirmMutation.isPending && !confirmMutation.error) {
      confirmMutation.mutate(sessionId);
    }
  }, [sessionId]);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!sessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="font-serif text-xl font-semibold mb-2">Invalid Session</h2>
            <p className="text-muted-foreground mb-4">
              No booking session found. Please try scheduling again.
            </p>
            <Link href="/booking">
              <Button data-testid="button-try-again">Schedule a Meeting</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (confirmMutation.isPending) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <h2 className="font-serif text-xl font-semibold mb-2">Confirming Your Booking...</h2>
            <p className="text-muted-foreground">
              Setting up your meeting and sending calendar invites.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (confirmMutation.error) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="font-serif text-xl font-semibold mb-2">Booking Error</h2>
            <p className="text-muted-foreground mb-4">
              {confirmMutation.error.message || "There was an error confirming your booking. Please contact support."}
            </p>
            <Link href="/about">
              <Button variant="outline" data-testid="button-back-about">Go to About</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (confirmMutation.data) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <CardTitle className="font-serif text-2xl">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Meeting Time</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {formatDateTime(confirmMutation.data.startTime)}
              </p>
            </div>

            {confirmMutation.data.meetLink && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Join Meeting:</p>
                <a
                  href={confirmMutation.data.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                  data-testid="link-meet"
                >
                  <ExternalLink className="h-4 w-4" />
                  Google Meet Link
                </a>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              A calendar invite has been sent to your email. See you at the meeting!
            </p>

            <Link href="/">
              <Button className="w-full" data-testid="button-back-home">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
