import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TechnicianJob from "./pages/TechnicianJob";
import TechQuiz from "./pages/TechQuiz";
import InterviewGuide from "./pages/InterviewGuide";
import Onboarding from "./pages/Onboarding";
import CareerFitQuiz from "./pages/CareerFitQuiz";
import AdminDashboard from "./pages/AdminDashboard";

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
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
