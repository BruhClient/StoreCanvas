import AdditionalFields from "./_components/AdditionalFields";

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
    </div>
  );
};

export default AdditionalFieldPage;
