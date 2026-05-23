import { HelpPageShell, HelpSection } from "@/components/store/help-page-shell";

export default function ShippingReturnsPage() {
  return (
    <HelpPageShell
      tag="Shipping & Returns"
      title="Clear delivery and return guidance."
      intro="Every order is packed from Lagos with care. Delivery timelines vary by destination, but the process should always feel straightforward."
    >
      <HelpSection title="Shipping">
        <p>Orders within Nigeria are typically delivered within 3 to 5 working days after payment confirmation.</p>
        <p>International delivery timelines depend on destination and courier processing.</p>
        <p>Shipping costs are calculated at checkout based on destination and package weight.</p>
      </HelpSection>

      <HelpSection title="Returns & Exchanges">
        <p>Returns are accepted within 14 days of delivery for unworn items in original condition with tags attached.</p>
        <p>Exchange requests are subject to stock availability.</p>
        <p>Sale items, custom pieces, and worn garments are not eligible for return.</p>
      </HelpSection>

      <HelpSection title="How To Start A Return">
        <p>Email hello@saiia.store with your order number and reason for return.</p>
        <p>Once approved, return instructions will be shared by the team.</p>
        <p>Original shipping charges are non-refundable unless the item arrived damaged or incorrect.</p>
      </HelpSection>
    </HelpPageShell>
  );
}
