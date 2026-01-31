"use client";

import { getContactData } from "@/lib/contact";
import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";

type ContactData = {
  companyName: string;
  address: string;
  phone1?: string; // ✅ Added
  phone2?: string; // ✅ Added
  whatsapp: string;
  email1?: string;
  email2?: string;
  mapLat: number;
  mapLng: number;
};

export default function ContactPage() {
  const [contact, setContact] = useState<ContactData | null>(null);

  useEffect(() => {
    getContactData().then(setContact);
  }, []);

  if (!contact) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading contact details...
      </div>
    );
  }

  const mapSrc = `https://www.google.com/maps?q=${contact.mapLat},${contact.mapLng}&z=15&output=embed`;
  const whatsappNumber = contact.whatsapp.replace(/\D/g, "");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name =
      (document.getElementById("whatsapp-name") as HTMLInputElement)?.value ||
      "Customer";

    const phone =
      (document.getElementById("whatsapp-phone") as HTMLInputElement)?.value ||
      "";

    const message =
      (document.getElementById("whatsapp-message") as HTMLTextAreaElement)
        ?.value || "";

    let fullMessage = `Hi ${contact.companyName}, I am ${name}`;
    if (phone) fullMessage += ` (${phone})`;
    if (message) fullMessage += `. ${message}`;

    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const subject = (form.elements.namedItem("subject") as HTMLInputElement)
      .value;
    const from = (form.elements.namedItem("from") as HTMLInputElement).value;
    const body = (form.elements.namedItem("body") as HTMLTextAreaElement).value;

    const emailSubject = encodeURIComponent(subject || "Website Inquiry");
    const emailBody = encodeURIComponent(`From: ${from}\n\n${body}`);

    const mailtoUrl = `mailto:${contact.email1}?bcc=${contact.email2 || ""}&subject=${emailSubject}&body=${emailBody}`;

    window.location.href = mailtoUrl;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>

      {/* CONTACT INFO - 4 GRID CARDS */}
      <div className=" max-w-9xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {contact.companyName}
        </h2>

        <p className="text-lg text-gray-600 leading-relaxed px-4">
          {contact.address}
        </p>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 px-4">
          {/* PHONE 1 - PRIMARY */}
          <a
            href={`tel:${contact.phone1}`}
            className="group flex flex-col items-center p-6 rounded-xl border hover:bg-gray-50 transition-all min-h-[100px] justify-center"
          >
            <span className="text-3xl mb-3">📞</span>
            <span className="font-semibold">{contact.phone1}</span>
            <span className="text-sm text-gray-500">Primary</span>
          </a>
          {/* PHONE 2 - SECONDARY */}
          {contact.phone2 && (
            <a
              href={`tel:${contact.phone2}`}
              className="group flex flex-col items-center p-6 rounded-xl border hover:bg-gray-50 transition-all min-h-[100px] justify-center"
            >
              <span className="text-3xl mb-3">☎️</span>
              <span className="font-semibold">{contact.phone2}</span>
              <span className="text-sm text-gray-500">Secondary</span>
            </a>
          )}
          {/* WHATSAPP */}

          <a
            href={`https://wa.me/${whatsappNumber}`}
            className="group flex flex-col items-center p-6 rounded-xl border border-green-200 bg-green-50/50 hover:bg-green-50 transition-all min-h-[100px] justify-center"
          >
            <BsWhatsapp className="text-3xl mb-3 text-green-500" />
            <span className="font-semibold">Whatsapp</span>
            <span className="text-sm text-green-700 font-medium">Chat Now</span>
          </a>
          {/* EMAIL 1 - PRIMARY */}
          <a
            href={`mailto:${contact.email1}?bcc=${contact.email2 || ""}`}
            className="group flex flex-col items-center p-6 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-all min-h-[100px] justify-center"
          >
            <span className="text-3xl mb-3">✉️</span>
            <span className="font-semibold text-xs break-all">
              {contact.email1}
            </span>
            <span className="font-semibold text-xs break-all">
              {contact.email2}
            </span>
            <span className="text-sm text-blue-700 font-medium">Email Us</span>
          </a>
        </div>
      </div>

      {/* MAP */}
      <div className="w-full border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl h-[600px]">
        <iframe
          src={mapSrc}
          width="100%"
          height="600"
          loading="lazy"
          className="w-full h-full"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* FORMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EMAIL FORM - SENDS TO BOTH */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-8 text-gray-900">
            Send us an Email{" "}
            <span className="text-sm text-gray-500"></span>
          </h3>
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="email"
              name="from"
              placeholder="Your Email"
              required
              className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              name="body"
              rows={6}
              placeholder="Your message..."
              required
              className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Send Email →
            </button>
          </form>
        </div>

        {/* WHATSAPP FORM */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-8 text-green-800">
            Send WhatsApp Message
          </h3>

          <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
            <input
              id="whatsapp-name"
              placeholder="Your Name"
              className="w-full border border-green-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-green-500"
            />
            <input
              id="whatsapp-phone"
              placeholder="Your Phone Number"
              className="w-full border border-green-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-green-500"
            />
            <textarea
              id="whatsapp-message"
              rows={6}
              placeholder={`Hi ${contact.companyName},
I am interested in your products.
Please share more details.`}
              className="w-full border border-green-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
            >
              Send WhatsApp Message →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
