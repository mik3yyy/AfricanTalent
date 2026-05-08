import { LandingPage } from "./landing-page";

export default function HomePage() {
  // Auth check done in middleware — just render landing for unauthenticated users
  return <LandingPage />;
}
