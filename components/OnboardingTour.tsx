"use client";

import { useEffect, useState } from "react";
import Joyride, { Step, CallBackProps } from "react-joyride";
import { CustomTooltip } from "./CustomToolTip";

interface OnboardingTourProps {
  id: string;
  steps: Step[];
  run?: boolean;
  delay?: number;
  onFinish?: (data: CallBackProps) => void;
}

export default function OnboardingTour({
  id,
  steps,
  run: initialRun = true,
  delay = 100,
  onFinish,
}: OnboardingTourProps) {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`onboarding-${id}`);
    if (!initialRun || hasSeenTour) return;

    const interval = setInterval(() => {
      const allTargetsExist = steps.every((step) =>
        document.querySelector(step.target as string)
      );
      if (allTargetsExist) {
        setRun(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [id, initialRun, steps]);

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      tooltipComponent={CustomTooltip}
      styles={{ options: { primaryColor: "#3b82f6", zIndex: 10000 } }}
      callback={(data) => {
        if (data.status === "finished" || data.status === "skipped") {
          localStorage.setItem(`onboarding-${id}`, "true");
          setRun(false);
          onFinish?.(data);
        }
      }}
    />
  );
}
