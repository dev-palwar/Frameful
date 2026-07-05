import { ArrowLeft, Monitor } from "lucide-react";
import { useNavigate } from "react-router";
import { Typography } from "@/design-system/Typography";

const NoVideo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-chart-4/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md text-center">
        {}
        <div className="w-20 h-20 rounded-xl border border-border bg-muted flex items-center justify-center">
          <Monitor className="w-9 h-9 text-primary" />
        </div>

        {}
        <div>
          <Typography variant="h2" as="h2" className="text-foreground mb-2">
            No recording found
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground">
            Looks like you haven't recorded anything yet, or the page was
            refreshed. Recordings are not persisted across reloads.
          </Typography>
        </div>

        {}
        <button
          id="go-back-btn"
          onClick={() => navigate("/record")}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-gradient text-primary-foreground type-label cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Record Something
        </button>
      </div>
    </div>
  );
};

export default NoVideo;
