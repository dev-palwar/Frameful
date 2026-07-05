import { Routes, Route } from "react-router";
import {
  LandingPage,
  StudioPage,
  RecordingPage,
  PrivacyPage,
  ComingSoonExtPage,
} from "@/pages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/record" element={<RecordingPage />} />
      <Route path="/studio" element={<StudioPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/coming-soon-ext" element={<ComingSoonExtPage />} />
    </Routes>
  );
}
