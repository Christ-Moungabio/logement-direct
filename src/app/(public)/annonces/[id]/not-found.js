import { ListingUnavailable } from "@/features/annonces/components/listing-unavailable";

export default function ListingNotFound() {
  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6">
      <ListingUnavailable />
    </div>
  );
}
