import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid institutional email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-32 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Lock className="w-8 h-8 mx-auto text-secondary mb-4 opacity-80" />
            <h1 className="text-2xl font-display text-primary">Investor Portal</h1>
            <p className="text-sm text-muted-foreground mt-2">Secure access for Limited Partners</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary/70">Email Address</label>
              <input 
                {...form.register("email")}
                className="w-full bg-white border border-border p-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                placeholder="name@institution.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary/70">Password</label>
              <input 
                {...form.register("password")}
                type="password"
                className="w-full bg-white border border-border p-3 text-sm focus:outline-none focus:border-secondary transition-colors"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Enter Secure Portal"}
            </button>
            
            <p className="text-center text-xs text-muted-foreground mt-6">
              Restricted access. Unauthorized attempts are monitored and logged.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
