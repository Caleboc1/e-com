import { HelpPageShell, HelpSection } from "@/components/store/help-page-shell";

export default function ContactPage() {
  return (
    <HelpPageShell
      tag="Contact Us"
      title="We are happy to help."
      intro="For order support, sizing help, stock enquiries, collaborations, or press, reach out and the SAIIA team will get back to you as soon as possible."
    >
      <HelpSection title="Customer Care">
        <p>Email: hello@saiiaclothing.com</p>
        <p>Phone: +2349062926265</p>
        <p>Hours: Monday to Friday, 9:00 AM to 5:00 PM WAT</p>
      </HelpSection>

      <HelpSection title="Order Support">
        <p>
          Include your order number, full name, and the email used at checkout when reaching out about delivery,
          payment confirmation, or exchange requests.
        </p>
        <p>We aim to respond to all order-related messages within 1 business day.</p>
      </HelpSection>

      <HelpSection title="Studio & Partnerships">
        <p>
          For wholesale, wardrobe pulls, collaborations, and press enquiries, contact the studio team at
          partnerships@saiia.store.
        </p>
        <p>Based in Lagos, Nigeria.</p>
      </HelpSection>
    </HelpPageShell>
  );
}
