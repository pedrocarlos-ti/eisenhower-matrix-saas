import React from 'react';

const Testimonials: React.FC = () => {
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

  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by productivity enthusiasts
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Don't just take our word for it — hear from our users who have transformed their productivity.
          </p>
        </div>
        
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-2xl bg-gray-50 p-8 shadow-sm ring-1 ring-gray-200">
                <div className="flex gap-x-4 items-center mb-6">
                  <img 
                    className="h-12 w-12 rounded-full bg-gray-100 object-cover"
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-7">
                  "{testimonial.content}"
                </blockquote>
                <div className="mt-6 flex items-center gap-x-1 text-indigo-600">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
