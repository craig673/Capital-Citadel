import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import WhoWeAre from "@/pages/WhoWeAre";
import Process from "@/pages/Process";
import Team from "@/pages/Team";
import Insights from "@/pages/Insights";
import InsightsCommentary from "@/pages/insights/Commentary";
import InsightsVideos from "@/pages/insights/Videos";
import InsightsCurated from "@/pages/insights/Curated";
import InsightsAiRevolution from "@/pages/insights/AiRevolution";
import AuthLogin from "@/pages/auth/Login";
import AuthRequestAccess from "@/pages/auth/RequestAccess";
import AuthForgotPassword from "@/pages/auth/ForgotPassword";
import AuthResetPassword from "@/pages/auth/ResetPassword";
import AdminApprovals from "@/pages/admin/Approvals";
import Dashboard from "@/pages/Dashboard";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Philosophy from "@/pages/Philosophy";
import AboutWhatWeDo from "@/pages/about/WhatWeDo";
import AboutOurValues from "@/pages/about/OurValues";
import AboutLeadership from "@/pages/about/Leadership";
import AboutLocations from "@/pages/about/Locations";
import AboutCareers from "@/pages/about/Careers";
import Letters from "@/pages/Letters";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
    <ScrollToTop />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/who-we-are" component={WhoWeAre} />
      <Route path="/process" component={Process} />
      <Route path="/team" component={Team} />
      <Route path="/insights" component={Insights} />
      <Route path="/insights/commentary" component={InsightsCommentary} />
      <Route path="/insights/videos" component={InsightsVideos} />
      <Route path="/insights/ai-revolution" component={InsightsAiRevolution} />
      <Route path="/insights/curated" component={InsightsCurated} />
      <Route path="/auth/login" component={AuthLogin} />
      <Route path="/auth/request-access" component={AuthRequestAccess} />
      <Route path="/auth/forgot-password" component={AuthForgotPassword} />
      <Route path="/auth/reset-password" component={AuthResetPassword} />
      <Route path="/admin/approvals" component={AdminApprovals} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/letters" component={Letters} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/philosophy" component={Philosophy} />
      <Route path="/about/what-we-do" component={AboutWhatWeDo} />
      <Route path="/about/values" component={AboutOurValues} />
      <Route path="/about/leadership" component={AboutLeadership} />
      <Route path="/about/locations" component={AboutLocations} />
      <Route path="/about/careers" component={AboutCareers} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
