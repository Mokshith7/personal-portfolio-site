import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { createCalendarEvent, getAvailableSlots } from "./calendarClient";

const MEETING_PRICE_CENTS = 5000;
const MEETING_DURATION_MINUTES = 30;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.blogs.list.path, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const blogs = await storage.getBlogs(search, category);
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.get(api.blogs.get.path, async (req, res) => {
    try {
      const slug = String(req.params.slug);
      const blog = await storage.getBlogBySlug(slug);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  app.get(api.bookReviews.list.path, async (req, res) => {
    try {
      const search = (req.query.search as string) || undefined;
      const reviews = await storage.getBookReviews(search);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book reviews" });
    }
  });

  app.get(api.bookReviews.get.path, async (req, res) => {
    try {
      const slug = String(req.params.slug);
      const review = await storage.getBookReviewBySlug(slug);
      if (!review) {
        return res.status(404).json({ message: "Book review not found" });
      }
      res.json(review);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book review" });
    }
  });

  app.get('/api/stripe/publishable-key', async (_req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to get Stripe key" });
    }
  });

  app.get('/api/meeting/slots', async (req, res) => {
    try {
      const dateStr = req.query.date as string;
      if (!dateStr) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      const slots = await getAvailableSlots(date);
      res.json({ slots, duration: MEETING_DURATION_MINUTES, priceInCents: MEETING_PRICE_CENTS });
    } catch (err: any) {
      console.error('Error fetching slots:', err);
      res.status(500).json({ message: err.message || "Failed to fetch available slots" });
    }
  });

  app.post('/api/meeting/checkout', async (req, res) => {
    try {
      const { email, name, date, time, topic } = req.body;

      if (!email || !name || !date || !time) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const stripe = await getUncachableStripeClient();
      
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + MEETING_DURATION_MINUTES * 60 * 1000);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${MEETING_DURATION_MINUTES}-Minute Meeting`,
              description: `Meeting with ${name} on ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`,
            },
            unit_amount: MEETING_PRICE_CENTS,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/booking?cancelled=true`,
        customer_email: email,
        metadata: {
          email,
          name,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          topic: topic || 'Meeting',
        },
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error('Checkout error:', err);
      res.status(500).json({ message: err.message || "Failed to create checkout session" });
    }
  });

  app.post('/api/meeting/confirm', async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: "Payment not completed" });
      }

      const metadata = session.metadata!;
      const startTime = new Date(metadata.startTime);
      const endTime = new Date(metadata.endTime);

      const event = await createCalendarEvent(
        `Meeting with ${metadata.name}`,
        `Topic: ${metadata.topic}\nBooked by: ${metadata.name} (${metadata.email})`,
        startTime,
        endTime,
        metadata.email
      );

      res.json({ 
        success: true, 
        eventId: event.id,
        meetLink: event.hangoutLink,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
    } catch (err: any) {
      console.error('Confirm error:', err);
      res.status(500).json({ message: err.message || "Failed to confirm meeting" });
    }
  });

  return httpServer;
}
