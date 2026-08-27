export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  rating: number;
  content: string;
  author: string;
  date: string;
  verified: boolean;
}

export interface OfferCountdownDuration {
  days: number;
  hours: number;
  minutes: number;
}

export interface ProductConfig {
  productName: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  offerCountdownDuration?: OfferCountdownDuration;
  offerCountdownDays?: number;
  offerCountdownHours?: number;
  offerCountdownMinutes?: number;
  offerCountdownStartedAt?: number;
  offerCountdownDurationSeconds?: number;
  images: {
    hero: string;
    lifestyle: string;
    box: string;
    benefits?: string;
  };
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
  warrantyText: string;
  shippingText: string;
  codAvailable: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  faqs: FAQItem[];
  reviews: ReviewItem[];
}

export const productData: ProductConfig = {
  productName: "PulseCare Rechargeable Wrist BP Monitor",
  tagline: "Know Your Numbers. Anytime. Anywhere.",
  description: "A compact rechargeable wrist blood-pressure monitor designed to make everyday BP checks simple, convenient, and voice-guided.",
  price: 1499,
  compareAtPrice: 2999,
  offerCountdownDuration: { days: 2, hours: 5, minutes: 45 },
  offerCountdownDays: 2,
  offerCountdownHours: 5,
  offerCountdownMinutes: 45,
  offerCountdownStartedAt: 1787826192315, // A fixed starting point or we'll compute it dynamically on startup
  offerCountdownDurationSeconds: (2 * 24 * 3600) + (5 * 3600) + (45 * 60),
  images: {
    hero: "/images/hero.png",
    lifestyle: "/images/lifestyle.png",
    box: "/images/box.png",
    benefits: "/images/lifestyle.png"
  },
  features: [
    {
      title: "One-Touch Operation",
      description: "Start a measurement with a simple press. Fully automatic.",
      icon: "touch_app"
    },
    {
      title: "Voice Guidance",
      description: "Hear the measurement results clearly, perfect for elderly users.",
      icon: "volume_up"
    },
    {
      title: "USB Rechargeable",
      description: "Convenient charging instead of repeatedly replacing disposable batteries.",
      icon: "battery_charging_full"
    },
    {
      title: "Large LED Display",
      description: "Clear, high-contrast digital information for easy reading.",
      icon: "screenshot"
    },
    {
      title: "BP & Pulse Monitoring",
      description: "Track both systolic/diastolic blood pressure and pulse rate simultaneously.",
      icon: "favorite"
    },
    {
      title: "Compact & Portable",
      description: "Easy to carry at home, in the office, or while travelling.",
      icon: "flight"
    }
  ],
  specifications: [
    { label: "Measurement Site", value: "Wrist" },
    { label: "Cuff Circumference", value: "13.5cm - 21.5cm" },
    { label: "Measurement Method", value: "Oscillometric System" },
    { label: "Charging Port", value: "USB Type-C" },
    { label: "Display", value: "LED Digital Display" },
    { label: "Voice Announcement", value: "English / Hindi support" }
  ],
  warrantyText: "1-Year Brand Replacement Warranty",
  shippingText: "Free Pan-India Delivery",
  codAvailable: true,
  stockStatus: "in_stock",
  faqs: [
    {
      question: "Is the monitor rechargeable?",
      answer: "Yes, the PulseCare monitor comes with a built-in rechargeable lithium-ion battery. You can charge it using the included USB Type-C cable, eliminating the need to buy disposable batteries."
    },
    {
      question: "How does the voice guidance work?",
      answer: "When a measurement starts, the monitor guides you to stay still. After the measurement, it reads out your systolic and diastolic blood pressure readings, and your heart rate. You can also turn this feature off if you prefer silent measurements."
    },
    {
      question: "Is it fully automatic?",
      answer: "Absolutely. With just a single button press, the wrist cuff will automatically inflate, measure, and deflate, presenting your readings on the LED display within seconds."
    },
    {
      question: "Can I use it every day?",
      answer: "Yes, it is designed for daily home and travel monitoring. Tracking your numbers at the same time every day provides valuable trends."
    },
    {
      question: "What comes in the box?",
      answer: "Your package includes: 1x PulseCare Wrist BP Monitor (with built-in cuff), 1x USB-C Charging Cable, 1x Premium Carrying Case, and 1x Detailed User Manual."
    },
    {
      question: "How do I charge it?",
      answer: "Connect the provided USB Type-C cable to the charging port on the side of the device. Plug the other end into any standard 5V USB wall adapter (like your phone charger) or computer port."
    },
    {
      question: "Is Cash on Delivery available?",
      answer: "Yes, Cash on Delivery (COD) is available for all orders across India, with no extra COD fees."
    },
    {
      question: "What is the warranty?",
      answer: "It includes a 1-Year brand replacement warranty covering any manufacturing defects. Customer support details are provided inside the box."
    },
    {
      question: "Is this a medical diagnostic device?",
      answer: "This device is intended for personal blood-pressure monitoring and is not a substitute for professional medical advice, diagnosis, or treatment. Consult a physician for interpreting your readings."
    }
  ],
  reviews: [
    {
      rating: 5,
      content: "I bought this for my elderly parents. The large digital display is incredibly clear, but the voice announcement is the real game-changer. It guides them through the reading and calls out the result so they don't have to strain their eyes. Highly recommended for seniors.",
      author: "Ramesh Krishnan",
      date: "August 12, 2026",
      verified: true
    },
    {
      rating: 5,
      content: "Very compact and portable! It fits easily into my bag when traveling. I love that it is rechargeable via USB-C so I don't have to keep buying AAA batteries. The readings are consistent and fast.",
      author: "Priya Sharma",
      date: "August 10, 2026",
      verified: true
    },
    {
      rating: 5,
      content: "Excellent build quality and very straightforward operation. Charged it once when it arrived, and after two weeks of daily use, the battery is still going strong. The carrying case it comes with is a nice premium touch.",
      author: "Amit Verma",
      date: "August 05, 2026",
      verified: true
    }
  ]
};
