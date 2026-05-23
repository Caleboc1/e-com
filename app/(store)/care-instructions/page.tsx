import { HelpPageShell, HelpSection } from "@/components/store/help-page-shell";

export default function CareInstructionsPage() {
  return (
    <HelpPageShell
      tag="Care Instructions"
      title="Made to soften beautifully with time."
      intro="SAIIA pieces are designed around natural fibres and hand-finished details. Good care keeps the fit, feel, and colour at their best for longer."
    >
      <HelpSection title="Everyday Care">
        <p>Wash gently in cold water with mild detergent.</p>
        <p>Avoid harsh bleach, aggressive wringing, and high heat.</p>
        <p>Air-dry in shade to help preserve colour and fibre texture.</p>
      </HelpSection>

      <HelpSection title="Linen & Cotton Pieces">
        <p>Steam or press on low to medium heat while the fabric is slightly damp.</p>
        <p>Store on a hanger or fold neatly in a cool, dry space.</p>
        <p>Natural creasing is part of the character of linen and soft cotton garments.</p>
      </HelpSection>

      <HelpSection title="Adire Prints">
        <p>Hand-dyed Adire pieces should be washed separately for the first few wears.</p>
        <p>Do not soak for long periods.</p>
        <p>Turn garments inside out before washing to help protect the surface finish of the print.</p>
      </HelpSection>
    </HelpPageShell>
  );
}
