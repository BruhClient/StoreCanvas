import OnboardingTour from "@/components/OnboardingTour";
import AdditionalFields from "./_components/AdditionalFields";

const fieldSteps = [
  {
    target: ".create-field-button", // ✅ match your real button class
    content: "Click here to create a new field option.",
    disableBeacon: true,
  },
  {
    target: ".field-feed",
    content: "This is your field feed, where all fields are displayed.",
    disableBeacon: true,
  },
];
const AdditionalFieldPage = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-center space-y-2">
        <div className="text-xl font-bold">User Fields 📝</div>
        <div className="text-muted-foreground font-serif text-sm">
          Get to know your customers more by adding custom inputs and fields
        </div>
      </div>

      <AdditionalFields />
      <OnboardingTour steps={fieldSteps} id="fields" />
    </div>
  );
};

export default AdditionalFieldPage;
