import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ListingUnavailable from "../../../src/features/annonces/components/ListingUnavailable";

export default function ListingNotFound() {
  return (
    <>
      <Header />
      <main className="container">
        <ListingUnavailable />
      </main>
      <Footer />
    </>
  );
}
