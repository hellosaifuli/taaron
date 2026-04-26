import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-8 flex flex-col">
        <span className="mb-4 text-xs uppercase tracking-widest text-[#9E9690] font-medium">
          Taaron
        </span>
        <h1
          className="mb-4 text-4xl md:text-5xl font-display font-medium leading-tight transition-all"
          style={{
            fontFamily: "var(--font-display)",
            color: "#111111",
          }}
        >
          {product.title}
        </h1>
        <div className="mb-1 flex items-baseline gap-2">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
          <span className="text-xs text-[#9E9690] tracking-wide uppercase">
            BDT
          </span>
        </div>
      </div>

      <div className="mb-8">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
      </div>

      {product.descriptionHtml ? (
        <Prose
          className="mb-8 text-sm leading-relaxed text-[#5C5652]"
          html={product.descriptionHtml}
        />
      ) : null}

      <div className="mb-8">
        <AddToCart product={product} />
      </div>
    </>
  );
}
