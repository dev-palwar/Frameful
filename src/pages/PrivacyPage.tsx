import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Typography } from "@/design-system/Typography";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {}
      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-4 px-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <Typography variant="label" as="span">
              Back to Cutline
            </Typography>
          </button>
        </div>
      </div>

      {}
      <div className="mx-auto max-w-3xl px-6 py-16">
        {}
        <div className="mb-12">
          <Typography variant="overline" className="text-primary mb-3 block">
            Legal
          </Typography>
          <Typography variant="h1" as="h1" className="text-foreground">
            Privacy Policy
          </Typography>
          <Typography variant="body-sm" className="mt-3 text-muted-foreground">
            Last updated: February 2026
          </Typography>
        </div>

        {}
        <div className="mb-12 rounded-md border border-primary/25 bg-primary/5 p-6">
          <Typography variant="overline" className="text-primary mb-1 block">
            The short version
          </Typography>
          <Typography variant="body" className="text-foreground">
            Cutline runs entirely in your browser. We do not collect, store, or
            transmit your recordings, screen data, or any personal information.
            Your videos never leave your device.
          </Typography>
        </div>

        {}
        <div className="space-y-10">
          <Section title="1. What Cutline does">
            Cutline is a client-side web application. When you record your
            screen, the video stream is captured and processed entirely inside
            your browser using standard Web APIs (
            <code className="rounded-sm bg-muted px-1 py-0.5 type-code text-foreground">
              MediaRecorder
            </code>
            ,{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 type-code text-foreground">
              Canvas
            </code>
            ). No data is sent to any server at any point.
          </Section>

          <Section title="2. Data we collect">
            <strong className="font-semibold text-foreground">None.</strong> We
            do not transmit or store any data on our servers, including:
            <ul className="mt-3 mb-4 list-inside list-disc space-y-1.5 pl-2">
              <li>Screen recordings or video content</li>
              <li>Identifiers such as names, emails, or IP addresses</li>
              <li>Usage analytics or telemetry</li>
              <li>Cookies (we set none)</li>
            </ul>
            <div className="mt-4">
              <strong className="font-semibold text-foreground">Note regarding the Cutline Extension:</strong> The browser extension captures click coordinates during active recording sessions purely to pass them locally to your Cutline Studio tab for the auto-zoom feature. These coordinates are processed in memory and never leave your device.
            </div>
          </Section>

          <Section title="3. Waitlist emails">
            If you choose to join our waitlist, you voluntarily provide your
            email address. This email is used solely to notify you about new
            Cutline features. We will never sell, share, or use it for any other
            purpose. You can ask to be removed at any time by emailing us.
          </Section>

          <Section title="4. Third-party services">
            Cutline loads fonts from Google Fonts via a standard{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 type-code text-foreground">
              link
            </code>{" "}
            tag, which may cause your browser to make a request to Google's
            servers. This is the only external network request the page makes.
            Please refer to Google's Privacy Policy for details on how they
            handle font-serving requests.
          </Section>

          <Section title="5. Local storage">
            Cutline does not use{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 type-code text-foreground">
              localStorage
            </code>
            ,{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 type-code text-foreground">
              sessionStorage
            </code>
            , or IndexedDB to persist any data between sessions. Recordings
            exist only in memory and are discarded when you close or navigate
            away from the tab.
          </Section>

          <Section title="6. Children's privacy">
            Cutline is not directed at children under 13 and we do not knowingly
            collect information from anyone under 13.
          </Section>

          <Section title="7. Changes to this policy">
            We may update this policy as Cutline evolves. Any changes will be
            reflected here with an updated date at the top. We encourage you to
            review this page periodically.
          </Section>

          <Section title="8. Contact">
            Questions about this policy? Reach out at{" "}
            <a
              href="mailto:devpalwar06@gmail.com"
              className="text-primary font-medium transition-colors hover:text-primary/80"
            >
              mail
            </a>
            .
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Typography variant="h4" as="h2" className="mb-3 text-foreground">
        {title}
      </Typography>
      <Typography
        variant="body-sm"
        className="text-muted-foreground leading-relaxed"
      >
        {children}
      </Typography>
    </div>
  );
}
