import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Home = lazy(() => import("./pages/Home"));
const TechnicianJob = lazy(() => import("./pages/TechnicianJob"));
const TechQuiz = lazy(() => import("./pages/TechQuiz"));
const InterviewGuide = lazy(() => import("./pages/InterviewGuide"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const CareerFitQuiz = lazy(() => import("./pages/CareerFitQuiz"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs/technician" component={TechnicianJob} />
      <Route path="/screening/tech-quiz" component={TechQuiz} />
      <Route path="/interview-guide" component={InterviewGuide} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/career-fit-quiz" component={CareerFitQuiz} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("embed")) {
      document.body.classList.add("embedded");
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={null}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
