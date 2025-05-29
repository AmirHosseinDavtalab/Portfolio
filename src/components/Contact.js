import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser"; // ایمپورت کردن کتابخانه EmailJS
import {
  Linkedin,
  Github,
  Twitter,
  Send,
  Mail as LucideMail,
  Paperclip,
  Loader2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const commonIconProps = {
  size: 22,
  strokeWidth: 1.75,
};

const socialLinks = [
  {
    IconComponent: Linkedin,
    href: "https://linkedin.com/in/yourprofile",
    title: "LinkedIn",
    hoverColorClass: "group-hover:stroke-blue-500",
    hoverBgClass: "hover:bg-blue-500",
  },
  {
    IconComponent: Github,
    href: "https://github.com/yourusername",
    title: "GitHub",
    hoverColorClass: "group-hover:stroke-slate-300",
    hoverBgClass: "hover:bg-slate-700",
  },
  {
    IconComponent: Twitter,
    href: "https://twitter.com/yourusername",
    title: "Twitter",
    hoverColorClass: "group-hover:stroke-sky-400",
    hoverBgClass: "hover:bg-sky-400",
  },
  {
    IconComponent: Send,
    href: "https://t.me/yourusername",
    title: "Telegram",
    hoverColorClass: "group-hover:stroke-blue-400",
    hoverBgClass: "hover:bg-blue-400",
  },
  {
    IconComponent: LucideMail,
    href: "mailto:amirhossindavtalab@gmail.com",
    title: "Email",
    hoverColorClass: "group-hover:stroke-red-400",
    hoverBgClass: "hover:bg-red-400",
  },
];

const Contact = () => {
  const sectionRef = useRef(null);
  const formCardRef = useRef(null);
  const formRef = useRef(null); // Ref برای خود تگ form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "", // "success" or "error"
    message: "",
  });

  // مقادیر EmailJS خود را در اینجا قرار دهید
  // بهتر است این مقادیر را در متغیرهای محیطی (environment variables) ذخیره کنید
  const EMAILJS_SERVICE_ID = "service_zxf6098"; // <- SERVICE_ID خود را اینجا قرار دهید
  const EMAILJS_TEMPLATE_ID = "template_iwru55v"; // <- TEMPLATE_ID خود را اینجا قرار دهید
  const EMAILJS_PUBLIC_KEY = "_Sbx2MCeoqSlj3Kp3"; // <- PUBLIC_KEY (یا User ID قدیمی) خود را اینجا قرار دهید

  useGSAP(
    () => {
      if (!sectionRef.current || !formCardRef.current) {
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
      tl.fromTo(
        formCardRef.current,
        { opacity: 0, y: 100, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      )
        .from(
          ".form-element",
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          ".social-icon-item",
          {
            opacity: 0,
            y: 20,
            scale: 0.5,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
    },
    { scope: sectionRef, dependencies: [] }
  );

  const handleSubmit = (e) => {
    e.preventDefault(); // جلوگیری از ارسال پیش‌فرض فرم
    if (isSubmitting) return;

    // بررسی اینکه آیا مقادیر EmailJS تنظیم شده‌اند
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY ||
        EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" || // بررسی مقادیر پیش‌فرض
        EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
        EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      setSubmitStatus({
        type: "error",
        message: "EmailJS configuration is missing. Please set up your Service ID, Template ID, and Public Key.",
      });
      console.error("EmailJS configuration is missing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    // ارسال فرم با استفاده از EmailJS
    // formRef.current به تگ <form> اشاره می‌کند
    emailjs
      .sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current, // خود المان فرم را پاس می‌دهیم
        EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log("EmailJS Success:", result.text);
          setSubmitStatus({
            type: "success",
            message: "Your message has been sent successfully! I'll get back to you soon.",
          });
          formRef.current?.reset(); // ریست کردن فیلدهای فرم
        },
        (error) => {
          console.error("EmailJS Error:", error.text);
          setSubmitStatus({
            type: "error",
            message: `Oops! Something went wrong: ${error.text}. Please try again later.`,
          });
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10061c] via-[#1a0b33] to-[#231042] py-20 px-4 relative overflow-hidden"
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/10 animate-pulse"
          style={{
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 150 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            filter: `blur(${Math.random() * 5 + 3}px)`,
          }}
        ></div>
      ))}
      <div
        ref={formCardRef}
        className="relative z-10 mx-auto w-full max-w-xl lg:max-w-2xl p-6 sm:p-8 md:p-10 rounded-3xl bg-slate-900/60 border border-purple-500/40 shadow-2xl shadow-purple-900/50 backdrop-blur-xl"
        style={{ opacity: 0 }}
      >
        <div className="form-element text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
            Have a project in mind, a question, or just want to say hello? Drop me a line!
          </p>
        </div>
        {/* اضافه کردن ref={formRef} به تگ form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div className="form-element grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="text"
              name="name" // نام فیلد باید با متغیر در الگوی EmailJS مطابقت داشته باشد (مثلاً {{name}})
              placeholder="Your Name"
              required
              className="flex-1 p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 shadow-md focus:shadow-purple-500/30"
            />
            <input
              type="email"
              name="email" // نام فیلد باید با متغیر در الگوی EmailJS مطابقت داشته باشد (مثلاً {{email}})
              placeholder="Your Email"
              required
              className="flex-1 p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 shadow-md focus:shadow-purple-500/30"
            />
          </div>
          <div className="form-element">
            <textarea
              name="message" // نام فیلد باید با متغیر در الگوی EmailJS مطابقت داشته باشد (مثلاً {{message}})
              placeholder="Your Message..."
              required
              rows={5}
              className="w-full p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 shadow-md focus:shadow-purple-500/30 min-h-[140px]"
            ></textarea>
          </div>
          <div className="form-element">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-pink-500/50 disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg"
            >
              {isSubmitting ? (
                <><Loader2 {...commonIconProps} className="animate-spin" /> Sending...</>
              ) : (
                <>Send Message <Paperclip {...commonIconProps} size={18} className="-rotate-45" /></>
              )}
            </button>
          </div>
        </form>
        {submitStatus.message && (
          <div
            className={`form-element mt-5 p-3 rounded-lg text-sm text-center ${
              submitStatus.type === "success"
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
