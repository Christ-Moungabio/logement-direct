import Header from "../../components/Header";

export default function AuthGroupLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
