import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "The Eisenhower Matrix app has completely transformed how I manage my workload. I'm now able to focus on what truly matters and have increased my productivity by at least 30%.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "/avatars/avatar-1.jpg"
  },
  {
    content: "As a project manager, I need to juggle multiple priorities. This tool has made it incredibly easy to visualize and organize tasks based on urgency and importance.",
    author: "Michael Chen",
    role: "Senior Project Manager",
    avatar: "/avatars/avatar-2.jpg"
  },
  {
    content: "The Pro version's team collaboration feature has been a game-changer for our startup. We can now align on priorities and make sure everyone is working on the right things.",
    author: "Emma Rodriguez",
    role: "Startup Founder",
    avatar: "/avatars/avatar-3.jpg"
  },
  {
    content: "I've tried dozens of productivity tools, but this is the first one that actually helped me implement the Eisenhower method effectively. Worth every penny of the Pro subscription.",
    author: "David Kim",
    role: "Freelance Developer",
    avatar: "/avatars/avatar-4.jpg"
  },
  {
    content: "The analytics feature in the Pro plan gives me invaluable insights into how I spend my time. I've been able to identify and eliminate productivity bottlenecks.",
    author: "Priya Patel",
    role: "Operations Manager",
    avatar: "/avatars/avatar-5.jpg"
  },
  {
    content: "As someone with ADHD, this tool has been life-changing. The visual matrix helps me stay focused and prioritize effectively. I recommend it to all my clients.",
    author: "James Wilson",
    role: "Executive Coach",
    avatar: "/avatars/avatar-6.jpg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="relative isolate bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by productivity enthusiasts
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                  <blockquote className="text-gray-900">
                    <p>{`“${testimonial.content}”`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.avatar} alt="" />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </figcaption>
                  <div className="mt-6 flex items-center gap-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
