import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { Navbar } from "@/components/Navbar";

export default function StoreLayout({ children }) {
  return (
    <CartProvider>
      <SearchProvider>
        <Navbar />
        {children}
      </SearchProvider>
    </CartProvider>
  );
}