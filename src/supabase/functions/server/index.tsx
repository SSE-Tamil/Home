import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-233aa38f/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint (Legacy - not used with OTP authentication)
// OTP authentication creates users automatically via Supabase Auth
app.post("/make-server-233aa38f/signup", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      console.log("Signup error: Missing required fields");
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Automatically confirm the user's email since an email server hasn't been configured.
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message || "Failed to create account" }, 400);
    }

    console.log(`User created successfully: ${email}`);
    return c.json({ success: true, user: data.user });

  } catch (error) {
    console.log("Error during signup:", error);
    return c.json({ error: "Failed to create account", details: String(error) }, 500);
  }
});

// Create feedback post
app.post("/make-server-233aa38f/feedback", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      console.log("Feedback creation error: No access token provided");
      return c.json({ error: "Unauthorized - No access token" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.log("Feedback creation auth error:", authError);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    // Check last post time (15-day restriction)
    const lastPostKey = `user:lastpost:${user.id}`;
    const lastPostTime = await kv.get(lastPostKey);
    
    if (lastPostTime) {
      const daysSinceLastPost = (Date.now() - parseInt(lastPostTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPost < 15) {
        const daysRemaining = Math.ceil(15 - daysSinceLastPost);
        console.log(`User ${user.id} attempted to post too soon. Days remaining: ${daysRemaining}`);
        return c.json({ 
          error: "Post restriction", 
          message: `You can post again in ${daysRemaining} days`,
          daysRemaining 
        }, 403);
      }
    }

    // Get feedback data
    const body = await c.req.json();
    const { courseCode, facultyName, facultyMobile, courseName, internalMarks, reason, rating } = body;

    if (!courseCode || !facultyName || !facultyMobile || !courseName || internalMarks === undefined || !reason || !rating) {
      console.log("Feedback creation error: Missing required fields");
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create feedback object with user email
    const feedback = {
      id: `feedback:${Date.now()}:${user.id}`,
      courseCode,
      facultyName,
      facultyMobile,
      courseName,
      internalMarks: parseInt(internalMarks),
      reason,
      rating: parseInt(rating),
      userEmail: user.email,
      userName: user.email.split('@')[0], // Use email prefix as username
      createdAt: Date.now(),
    };

    // Save feedback
    await kv.set(feedback.id, JSON.stringify(feedback));

    // Update last post time
    await kv.set(lastPostKey, Date.now().toString());

    console.log(`Feedback created successfully by user ${user.id}`);
    return c.json({ success: true, feedback });

  } catch (error) {
    console.log("Error creating feedback:", error);
    return c.json({ error: "Failed to create feedback", details: String(error) }, 500);
  }
});

// Get all feedback posts
app.get("/make-server-233aa38f/feedback", async (c) => {
  try {
    // Get all feedback posts
    const feedbackValues = await kv.getByPrefix('feedback:');
    const feedbackPosts = feedbackValues
      .map(value => JSON.parse(value))
      .sort((a, b) => b.createdAt - a.createdAt);

    return c.json({ success: true, feedback: feedbackPosts });

  } catch (error) {
    console.log("Error fetching feedback:", error);
    return c.json({ error: "Failed to fetch feedback", details: String(error) }, 500);
  }
});

// Check if user can post
app.get("/make-server-233aa38f/can-post", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    // Check last post time
    const lastPostKey = `user:lastpost:${user.id}`;
    const lastPostTime = await kv.get(lastPostKey);
    
    if (!lastPostTime) {
      return c.json({ canPost: true, daysRemaining: 0 });
    }

    const daysSinceLastPost = (Date.now() - parseInt(lastPostTime)) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastPost < 15) {
      const daysRemaining = Math.ceil(15 - daysSinceLastPost);
      return c.json({ canPost: false, daysRemaining });
    }

    return c.json({ canPost: true, daysRemaining: 0 });

  } catch (error) {
    console.log("Error checking post eligibility:", error);
    return c.json({ error: "Failed to check eligibility", details: String(error) }, 500);
  }
});

// Search feedback by faculty name or course name
app.get("/make-server-233aa38f/search-feedback", async (c) => {
  try {
    const query = c.req.query('query');
    
    if (!query || query.trim() === '') {
      return c.json({ results: [] });
    }

    // Get all feedback posts
    const feedbackValues = await kv.getByPrefix('feedback:');
    const allFeedback = feedbackValues.map(value => JSON.parse(value));
    
    // Normalize search query (lowercase for case-insensitive search)
    const searchQuery = query.toLowerCase().trim();
    
    // Filter feedback based on faculty name, course name, or course code
    const results = allFeedback.filter(feedback => {
      const facultyName = (feedback.facultyName || '').toLowerCase();
      const courseName = (feedback.courseName || '').toLowerCase();
      const courseCode = (feedback.courseCode || '').toLowerCase();
      
      return facultyName.includes(searchQuery) || 
             courseName.includes(searchQuery) || 
             courseCode.includes(searchQuery);
    });
    
    // Sort by creation date (newest first)
    results.sort((a, b) => b.createdAt - a.createdAt);
    
    // Transform to match the frontend expected format with user email
    const transformedResults = results.map(feedback => ({
      id: feedback.id,
      userId: feedback.userEmail,
      userName: feedback.userName || feedback.userEmail?.split('@')[0] || 'Student',
      userEmail: feedback.userEmail,
      courseCode: feedback.courseCode,
      courseName: feedback.courseName,
      facultyName: feedback.facultyName,
      facultyMobile: feedback.facultyMobile,
      internalMarks: feedback.internalMarks,
      feedback: feedback.reason,
      rating: feedback.rating,
      createdAt: new Date(feedback.createdAt).toISOString(),
    }));
    
    console.log(`Search query: "${query}" - Found ${transformedResults.length} results`);
    return c.json({ success: true, results: transformedResults });

  } catch (error) {
    console.log("Error searching feedback:", error);
    return c.json({ error: "Failed to search feedback", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);