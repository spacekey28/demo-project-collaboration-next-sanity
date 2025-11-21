import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { ContactForm } from "@/components/marketing/contact-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with us. We&apos;d love to hear from you.",
});

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <Section
          title="Get in Touch"
          description="Have a question or want to learn more? Send us a message and we'll get back to you soon."
        >
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-xl font-semibold">
                  Contact Information
                </h3>
                <p className="text-muted-foreground mb-6">
                  Reach out to us through any of the following channels.
                  We&apos;re here to help!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <Mail className="text-primary size-5" />
                  </div>
                  <div>
                    <div className="mb-1 font-semibold">Email</div>
                    <a
                      href="mailto:hello@flowspace.com"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      hello@flowspace.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <Phone className="text-primary size-5" />
                  </div>
                  <div>
                    <div className="mb-1 font-semibold">Phone</div>
                    <a
                      href="tel:+1234567890"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <MapPin className="text-primary size-5" />
                  </div>
                  <div>
                    <div className="mb-1 font-semibold">Office</div>
                    <p className="text-muted-foreground text-sm">
                      123 Innovation Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
