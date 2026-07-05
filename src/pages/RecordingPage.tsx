import { useRecorder } from "@/hooks/useRecorder";
import { Circle, Square, Monitor, Clock, Sparkles, Upload } from "lucide-react";
import { Typography } from "@/design-system/Typography";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function RecordingPage() {
  const {
    recordingState,
    elapsedTime,
    startRecording,
    stopRecording,
    setUploadedVideo,
  } = useRecorder();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedVideo(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-chart-4/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full">
        {}
        <div className="w-full border border-border bg-card p-8">
          {}
          {recordingState !== "recording" && (
            <div className="flex flex-col items-center gap-6">
              {}
              <div className="w-full aspect-video border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-default">
                <div className="w-16 h-16 bg-muted border border-border flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <Typography
                    variant="body-sm"
                    className="text-foreground font-medium"
                  >
                    Ready to record
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground mt-1 block"
                  >
                    Screen, window, or tab
                  </Typography>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                {}
                <button
                  id="start-recording-btn"
                  onClick={startRecording}
                  className="w-full py-4 bg-brand-gradient text-primary-foreground cursor-pointer animate-gradient-shift flex items-center justify-center gap-2.5"
                  style={{ backgroundSize: "200% 200%" }}
                >
                  <Circle className="w-4 h-4 fill-current" />
                  <Typography variant="label" as="span">
                    Start Recording
                  </Typography>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-wider">
                    or
                  </span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                {}
                <label
                  htmlFor="video-upload"
                  className="w-full py-4 border border-border bg-muted/30 text-foreground cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-center gap-2.5"
                >
                  <Upload className="w-4 h-4" />
                  <Typography variant="label" as="span">
                    Upload Video
                  </Typography>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {}
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <Typography variant="caption">HD Quality</Typography>
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-chart-4" />
                  <Typography variant="caption">No time limit</Typography>
                </span>
              </div>
            </div>
          )}

          {}
          {recordingState === "recording" && (
            <div className="flex flex-col items-center gap-6">
              {}
              <div className="w-full aspect-video bg-destructive/5 border border-destructive/20 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-destructive/30 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-destructive animate-pulse" />
                  </div>
                  {}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-destructive/50 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
                <div className="text-center">
                  <Typography
                    variant="body-sm"
                    className="text-destructive font-medium"
                  >
                    Recording in progress
                  </Typography>
                  <Typography
                    variant="code"
                    as="p"
                    className="text-foreground mt-1 tabular-nums text-3xl"
                  >
                    {formatTime(elapsedTime)}
                  </Typography>
                </div>
              </div>

              {}
              <button
                id="stop-recording-btn"
                onClick={stopRecording}
                className="w-full py-4 bg-destructive text-white cursor-pointer hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2.5"
              >
                <Square className="w-4 h-4 fill-current" />
                <Typography variant="label" as="span">
                  Stop Recording
                </Typography>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
